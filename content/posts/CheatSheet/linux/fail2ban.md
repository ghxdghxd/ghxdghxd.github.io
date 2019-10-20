---
Title: 预防SSH服务器暴力破解
Date: 2017/3/5 11:19:47
Modified: 2017/3/5 11:19:47
Category: 小抄速查
Tags: fail2ban, linux
Slug: fail2ban
Authors: JT Guo
Summary: fail2ban 防御 SSH 服务器的暴力破解攻击
---
# 原因

前两天，以及更早的一段时间内，很多人抱怨，远程登录服务器时经常断线，严重到秒退。
起初，以为是SSH配置问题，浪费大量时间对SSH检查，重装，配置...
然后，查看/var/log/secure登录日志，发现多个IP的进攻，
所以，安装fail2ban防御
以下，抄自网络...

# fail2ban 防御 SSH 服务器的暴力破解攻击

对于SSH服务的常见的攻击就是暴力破解攻击——远程攻击者通过不同的密码来无限次地进行登录尝试。当然SSH可以设置使用非密码验证验证方式来对抗这种攻击，例如[公钥验证](http://xmodulo.com/how-to-force-ssh-login-via-public-key-authentication.html)或者[双重验证](http://linux.cn/article-3725-1.html)。将不同的验证方法的优劣处先放在一边，如果我们必须使用密码验证方式怎么办？你是如何保护你的SSH 服务器免遭暴力破解攻击的呢？

[fail2ban](http://www.fail2ban.org/) 是 Linux上的一个著名的入侵保护的开源框架，它会监控多个系统的日志文件（例如：/var/log/auth.log 或者/var/log/secure）并根据检测到的任何可疑的行为自动触发不同的防御动作。事实上，fail2ban 在防御对SSH服务器的暴力密码破解上非常有用。

* 源码包安装

```shell
git clone https://github.com/fail2ban/fail2ban.git
cd fail2ban
python setup.py install

# cp files/debian-initd /etc/init.d/fail2ban
# update-rc.d fail2ban defaults

cp files/redhat-initd /etc/init.d/fail2ban
# 设置fail2ban服务为自启动服务
chkconfig fail2ban on
#启动fail2ban服务
service fail2ban start
```

* centos7 yum安装

```shell
yum install fail2ban
systemctl enable fail2ban
```

## 为SSH服务器配置Fail2ban

编辑其配置文件 /etc/fail2ban/jail.conf。
在配置文件的“[DEFAULT]”区，你可以在此定义所有受监控的服务的默认参数，另外在特定服务的配置部分，你可以为每个服务（例如SSH，Apache等）设置特定的配置来覆盖默认的参数配置。
**使用firewall，则banaction = firewallcmd-ipset**
在针对服务的监狱区（在[DEFAULT]区后面的地方），你需要定义一个[sshd]区，这里用来定义SSH相关的监狱配置。真正的禁止IP地址的操作是通过iptables完成的。

[sshd]：名称，可以随便填写
filter：规则名称，必须填写位于filter.d目录里面的规则，sshd是fail2ban内置规则
port：对应的端口
action：采取的行动
logpath：需要监视的日志路径

下面是一个包含“sshd”监狱配置的/etc/fail2ban/jail.conf的文件样例。当然根据你的需要，你也可以指定其他的应用监狱。

```sh
$ sudo vi /etc/fail2ban/jail.local
1. [DEFAULT]
2. # 以空格分隔的列表，可以是 IP 地址、CIDR 前缀或者 DNS 主机名
3. # 用于指定哪些地址可以忽略 fail2ban 防御
4. ignoreip = 127.0.0.1 172.31.0.0/24 10.10.0.0/24 192.168.0.0/24
5.
6. bantime = 86400 # 客户端主机被禁止的时长（秒）
7.
8. maxretry = 5   # 客户端主机被禁止前允许失败的次数
9.
10. findtime = 600 # 查找失败次数的时长（秒）
11. mta = sendmail
12. # 屏蔽IP所使用的方法，下面使用firewalld屏蔽端口
13. # 这里banaction必须用firewallcmd-ipset,这是fiewalll支持的关键，如果是用Iptables请不要这样填写
14. banaction = firewallcmd-ipset
15. action = %(action_mwl)s
16.
17. [sshd]
18. enabled = true
19. filter = sshd
20. action = iptables[name=SSH, port=ssh, protocol=tcp]
21. sendmail-whois[name=SSH, dest=your@email.com, sender=fail2ban@email.com]
22. # Debian 系的发行版
23. logpath = /var/log/auth.log
24. # Red Hat 系的发行版
25. logpath = /var/log/secure
26. # ssh 服务的最大尝试次数
27. maxretry = 3
```

根据上述配置，fail2ban会自动禁止在最近10分钟内有超过3次访问尝试失败的任意IP地址。一旦被禁，这个IP地址将会在24小时内一直被禁止访问 SSH
服务。这个事件也会通过sendemail发送邮件通知。
一旦配置文件准备就绪，按照以下方式重启fail2ban服务。

```shell
sudo service fail2ban restart       # Debian, Ubuntu 或 CentOS/RHEL 6
sudo systemctl restart fail2ban     # Fedora 或 CentOS/RHEL 7
```

为了验证fail2ban成功运行，使用参数'ping'来运行fail2ban-client 命令。
如果fail2ban服务正常运行，你可以看到“pong（嘭）”作为响应。

```shell
sudo fail2ban-client ping
#Server replied: pong
```

## 测试 fail2ban 保护SSH免遭暴力破解攻击

为了测试fail2ban是否能正常工作，尝试通过使用错误的密码来用SSH连接到服务器模拟一个暴力破解攻击。与此同时，监控
/var/log/fail2ban.log，该文件记录在fail2ban中发生的任何敏感事件。

```shell
sudo tail -f /var/log/fail2ban.log
```

根据上述的日志文件，Fail2ban通过检测IP地址的多次失败登录尝试，禁止了一个IP地址192.168.1.8。

### 检查fail2ban状态并解禁被锁住的IP地址

由于fail2ban的“ssh-iptables”监狱使用iptables来阻塞问题IP地址，你可以通过以下方式来检测当前iptables来验证禁止规则。

```text
1. $ sudo iptables --list -n

1. Chain INPUT (policy ACCEPT)
2. target     prot opt source               destination
3. fail2ban-SSH  tcp  --  0.0.0.0/0            0.0.0.0/0           tcp dpt:22
4.  
5. Chain FORWARD (policy ACCEPT)
6. target     prot opt source               destination
7.  
8. Chain OUTPUT (policy ACCEPT)
9. target     prot opt source               destination
10.  
11. Chain fail2ban-SSH (1 references)
12. target     prot opt source               destination
13. DROP       all  --  192.168.1.8          0.0.0.0/0
14. RETURN     all  --  0.0.0.0/0            0.0.0.0/0
```

如果你想要从fail2ban中解锁某个IP地址，你可以使用iptables命令：

```shell
sudo iptables -D fail2ban-SSH -s 192.168.1.8 -j DROP
```

当然你可以使用上述的iptables命令手动地检验和管理fail2ban的IP阻塞列表，但实际上有一个适当的方法就是使用fail2ban-
client命令行工具。这个命令不仅允许你对"ssh-iptables"监狱进行管理，同时也是一个标准的命令行接口，可以管理其他类型的fail2ban监狱。

为了检验fail2ban状态（会显示出当前活动的监狱列表）：

```shell
sudo fail2ban-client status
```

为了检验一个特定监狱的状态（例如ssh-iptables):

```shell
sudo fail2ban-client status ssh-iptables
```

上面的命令会显示出被禁止IP地址列表。

为了解锁特定的IP地址：

```shell
sudo fail2ban-client set ssh-iptables unbanip 192.168.1.8
```

注意，如果你停止了Fail2ban 服务，那么所有的IP地址都会被解锁。当你重启 Fail2ban，它会从/etc/log/secure(或
/var/log/auth.log)中找到异常的IP地址列表，如果这些异常地址的发生时间仍然在禁止时间内，那么Fail2ban会重新将这些IP地址禁止。

## 设置 Fail2ban 自动启动

一旦你成功地测试了fail2ban之后，最后一个步骤就是在你的服务器上让其在开机时自动启动。在基于Debian的发行版中，fail2ban已经默认让自动启动生效。在基于Red-
Hat的发行版中，按照下面的方式让自动启动生效。

```shell
sudo chkconfig fail2ban on          # 在 CentOS/RHEL 6
sudo systemctl enable fail2ban      # 在 Fedora 或 CentOS/RHEL 7
