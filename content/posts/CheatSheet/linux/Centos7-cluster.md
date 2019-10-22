---
Title: Centos7 cluster
Date: 2019-10-18 16:10:16
Modified: 2019-10-19 13:07:02
Category: 小抄速查
Tags: linux, centos, shell, hpc, clusconf,
Slug: centos7-cluster
Authors: JT Guo
Summary: 曙光集群安装与配置
---

# 集群扩容后, 安装曙光管理系统

## 配置IP

```shell
vi /etc/sysconfig/network-scripts/ifcfg-em1
service network restart
```

## 每个节点手动挂载/public

```shell
mount admin:/public /public
```

## clussoft安装软件

> /public/tool/clussoft-2.4
配置文件在/public/tool/clussoft-2.4/misc

```shell
./clussoft -i htop-gnu-2.1.0
```

## Centos7登陆就会创建一个叫做perl5的目录

只需要将/etc/profile.d/perl-homedir.sh文件中的PERL_HOMEDIR=1改为PERL_HOMEDIR=0即可。
原因是perl会默认为每个用户加载local::lib，如果你不需要则无需加载。而用户登陆时会执行/etc/profile文件，此文件又会执行/etc/profile.d/*.sh

## epel是社区强烈打造的免费开源发行软件包版本库

yum install epel-release -y

## Centos7 防火墙升级为firewall

### firewalld关于zone的操作

> 配置区域/etc/firewalld/zones/

```shell
firewall-cmd --get-zones     #查看是所有zone
# block dmz drop external home internal public trusted work
firewall-cmd --get-default-zone      #查看默认zone
# public
firewall-cmd --set-default-zone=work     #将默认的zone修改为work
# success
firewall-cmd --get-zone-of-interface=em1    # 查看网卡em1的zone
# no zone
firewall-cmd --zone=public --add-interface=em1 --permanent # 给网卡em1增加zone
# success
firewall-cmd --zone=trusted --change-interface=em2 # 修改指定网卡的zone, 防止影响torque的通信（无法调度任务），所以设置直接信任内网网卡
# success
firewall-cmd --get-active-zones  #查看系统中所有网卡所在的zone
# public
#   interfaces: em1
# trusted
#   interfaces: em2
firewall-cmd --reload #重新加载
```

### firewalld关于service的操作

```shell
firewall-cmd --get-service          # 查看所有的service
firewall-cmd --list-service         # 查看当前zone下的service
firewall-cmd --zone=public --list-service   # 查看指定zone下的service
firewall-cmd --zone=public --add-service=http    # 把http服务临时添加到public的zone下
firewall-cmd --zone=public --add-service=http --permanent # 把http服务永久添加到public的zone下
```

## Centos7 更改SSH端口, 禁止root登录

```shell
vi /etc/ssh/sshd_config
Port22      # 去除注释
Port 200    # 并添加新端口
PermitRootLogin no  #禁止root

# 防火墙打开新端口
firewall-cmd --zone=public --add-port=22/tcp --permanent
firewall-cmd --zone=public --add-port=200/tcp --permanent
firewall-cmd --reload #重新加载
systemctl restart sshd.service
# 测试修改端口以后的ssh连接，重新注释掉Port 22
```

## [使用 fail2ban 防御 SSH 服务器的暴力破解攻击](fail2ban)

```shell
git clone https://github.com/fail2ban/fail2ban.git
cd fail2ban
python setup.py install

cp files/redhat-initd /etc/init.d/fail2ban
# 设置fail2ban服务为自启动服务
chkconfig fail2ban on
#启动fail2ban服务
service fail2ban start
```

```text
touch /etc/fail2ban/jail.d/jail.local
vi /etc/fail2ban/jail.d/jail.local

[DEFAULT]
bantime = 24h # 客户端主机被禁止的时长（24h）
maxretry = 5   # 客户端主机被禁止前允许失败的次数
findtime = 10m # 查找失败次数的时长（秒）

# 屏蔽IP所使用的方法，下面使用firewalld屏蔽端口
# 这里banaction必须用firewallcmd-ipset,这是fiewalll支持的关键，如果是用Iptables请不要这样填写
# /etc/fail2ban/action.d/firewallcmd-ipset.conf
banaction = firewallcmd-ipset
banaction_allports = firewallcmd-allports

[sshd]
enabled = true
#/etc/fail2ban/filter.d/sshd.conf
filter = sshd
port = ssh
logpath = /var/log/secure
```

## 挂载存储服务

### 添加nfs共享路径

> /etc/exports

```shell
/public *(rw,async,insecure,no_root_squash,no_subtree_check)
/share  *(rw,async,insecure,no_root_squash,no_subtree_check)
/share/swap *(rw,async,insecure,no_root_squash,no_subtree_check)
/share/data0    *(rw,fsid=1,async,insecure,no_root_squash,no_subtree_check)
/share/data1    *(rw,fsid=2,async,insecure,no_root_squash,no_subtree_check)
/share/data2    *(rw,async,insecure,no_root_squash,no_subtree_check)
/share/data3    *(rw,async,insecure,no_root_squash,no_subtree_check)
/share/data4    *(rw,async,insecure,no_root_squash,no_subtree_check)
/share/data5    *(rw,fsid=3,async,insecure,no_root_squash,no_subtree_check)

exportfs -r # 重新共享所有目录
```

### 挂载分区

```shell
mount /dev/sdc1 /share/swap     # raid0硬盘

# nas存储
service iscsi restart
systemctl start multipathd.service

iscsiadm -m node
iscsiadm -m discovery -t st -p 10.1.1.100:3260
iscsiadm -m discovery -t st -p 10.1.1.101:3260
iscsiadm -m discovery -t st -p 10.1.1.102:3260
iscsiadm -m discovery -t st -p 10.1.1.103:3260

/sbin/mpathconf --enable # 生成配置文件/etc/multipath.conf, DM multipath kernel driver not loaded
multipath -ll # 查看路径
multipath -v2 # 自动更新路径（当/dev/mapper没有链接，可以更新路径试试）
service multipathd restart #重启确认/dev/mapper下有硬盘连接
# 挂载
mount /dev/mapper/mpatha1 /share/data2
mount /dev/mapper/mpathb1 /share/data3
mount /dev/mapper/mpathc1 /share/data4

sshfs -o allow_other -o transform_symlinks -o reconnect -o follow_symlinks -o gid=100 -o umask=022 $IP:/share/data0 /share/data0
sshfs -o allow_other -o transform_symlinks -o reconnect -o follow_symlinks -o gid=100 -o umask=022 $IP:/share/data1 /share/data1
sshfs -o allow_other -o transform_symlinks -o reconnect -o follow_symlinks -o gid=100 -o umask=022 $IP:/share/data5 /share/data5

clusconf -yd "mount admin:/share /share"
```

## 安装R-3.6.1
