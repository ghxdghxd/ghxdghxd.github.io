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
ssh node1
mount admin:/public /public

# OR

clusconf -yd mount admin:/public /public
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
firewall-cmd --zone=public --list-ports     #查看public的端口
# 10/tcp
firewall-cmd --zone=public --add-port=22/tcp --permanent        #添加端口
firewall-cmd --zone=public --remove-port=22/tcp --permanent     #删除端口
# success
firewall-cmd --zone=public --add-port=100-500/tcp --permanent   #批量开放端口
firewall-cmd --zone=public --query-port=22/tcp  #查看端口是否生效
# yes
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

## SSH配置

### 更改SSH端口

```shell
vi /etc/ssh/sshd_config
Port22      # 去除注释
Port 200    # 并添加新端口
# PermitRootLogin no  #禁止root

# 防火墙打开新端口
firewall-cmd --zone=public --add-port=22/tcp --permanent
firewall-cmd --zone=public --add-port=200/tcp --permanent
firewall-cmd --reload #重新加载
systemctl restart sshd.service
# 测试修改端口以后的ssh连接，重新注释掉Port 22
```

* 更改22端口，则clusconf -au user无法同步到节点，因为其默认为22端口，需要在节点/etc/ssh/ssh_config添加，不同IP监听不同端口

```shell
ListenAddress 外网IP:修改端口
ListenAddress 内网IP:22
```

### 禁用root登录，配置root在指定IP登录

* 注意禁止root登录后，一定开放内网登录，否则clusconf -au user无法同步到节点

首先去掉`PermitRootLogin yes`注释，改为`PermitRootLogin no`，
然后在/etc/ssh/sshd_config*最后的Match模块*处添加如下参数（*配置文件中参数的位置一定不要更改顺序，否则sshd服务无法启动*）

```text
Match Address 10.1.1.0/24,
    PermitRootLogin yes
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

存储分为两部分, 采用不同挂载方式，需按下面的顺序挂载

* data2-4为multipath路径: admin挂载后通过nfs共享出去（100M/s)
* data0-1,5为162的nfs共享：各nodes可直接挂载(100M/s)

### 首先admin挂载multipath分区与162的nfs分区

* multipath

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
```

* 162的nfs

```shell
tee /public/tool/mount_nfs.sh <<-'EOF'
mount -o nfsvers=3 10.1.1.1:/export/data0 /share/data0
mount -o nfsvers=3 10.1.1.1:/export/data1 /share/data1
mount -o nfsvers=3 10.1.1.1:/export/data5 /share/data5
EOF

bash /public/tool/mount_nfs.sh
```

### 然后admin添加nfs共享路径

> **data0,1,5不要共享，否则在nodes上无法访问/share**
> /etc/exports

```shell
/public *(rw,async,insecure,no_root_squash,no_subtree_check)
/share  *(rw,async,insecure,no_root_squash,no_subtree_check)
/share/swap *(rw,async,insecure,no_root_squash,no_subtree_check)
#/share/data0    *(rw,fsid=1,async,insecure,no_root_squash,no_subtree_check)
#/share/data1    *(rw,fsid=2,async,insecure,no_root_squash,no_subtree_check)
/share/data2    *(rw,async,insecure,no_root_squash,no_subtree_check)
/share/data3    *(rw,async,insecure,no_root_squash,no_subtree_check)
/share/data4    *(rw,async,insecure,no_root_squash,no_subtree_check)
#/share/data5    *(rw,fsid=3,async,insecure,no_root_squash,no_subtree_check)

exportfs -avr # 重新共享所有目录
```

### 最后各nodes挂载nfs

```shell
clusconf -yd "mount admin:/share /share;bash /public/tool/mount_nfs.sh"
```

## clussoft

> /etc/profile.d/clussoft-env.sh

```text
export CLUSSOFT_HOME=/public/tool/clussoft-2.4
export PATH=$CLUSSOFT_HOME:$PATH
```

```shel
clussoft -d /public/software    #安装目录
clussoft -p nodelist            #节点列表
```

所有软件均安装到/public/software，添加modulefile到/public/software/modules

```text
#%Module1.0
module-whatis   "software..."

conflict apps

set             APPS_HOME                /public/software/apps/R/3.6.1

setenv          APPS_ROOT               /public/software/apps/R/3.6.1
prepend-path    PATH                    ${APPS_HOME}/bin
```
