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

## 每个节点手动挂载/public, /share

+ 配置列表
  + admin
    + [2.10GHz] \* 4 \* 8核/CPU \* 2线程/核 = 64
    + 1T \* 4块 >>> 3T(raid5), 959 centos-root + 1.8T public
    + 1T \* 2块 >>> 1.9T(raid0) /share/swap

```shell
ssh node1
mount admin:/public /public
mount admin:/share/swap /share/swap

# OR

clusconf -yd mount admin:/public /public
clusconf -yd mount admin:/share/swap /share/swap
```

### --set-nfs

>/opt/gridview/clusconf/etc/nfs.cfg

```shell
各节点手动挂载, mount node1:/export/tmp1 /share/tmp1

## keyword NFSDIR list the path will be shared by nfs
## according the sequence:hostname(IP) path(Nfs Server) MountPoint(nfs client)
##         server      serverPath     serverOptions                  MountPoint      mountOption
#NFSDIR    node1       /public       *(rw,no_root_squash,no_subtree_check,async)      /public         "-o nfsvers=3" 
NFSDIR     node1       /export/tmp1  *(rw,no_root_squash,no_subtree_check,async)      /share/tmp1     "-o nfsvers=3"
#NFSDIR    node1       /public2      *(rw,no_root_squash,no_subtree_check,async)      /public2        "-o nfsvers=3"
#NFSDIR    inode40     /data2        *(rw,no_root_squash,no_subtree_check,async)      /data2          "-o nfsvers=3"
## list the nfs directory binded with /home by mount --bind /yourpath /home
#BINDHOME  /public/home
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
firewall-cmd --permanent --add-rich-rule='rule protocol value=icmp drop' #禁止ping
# success
firewall-cmd --get-active-zones  #查看系统中所有网卡所在的zone
# public
#   interfaces: em1
# trusted
#   interfaces: em2
firewall-cmd --reload #重新加载防火墙并保留状态信息
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

# /etc/multipath.conf 配置路径的规则
# 如果user_friendly_names yes,则配置:
# /etc/multipath/bindings

iscsiadm -m node
iscsiadm -m discovery -t st -p 10.1.1.100:3260
iscsiadm -m discovery -t st -p 10.1.1.101:3260
iscsiadm -m discovery -t st -p 10.1.1.102:3260
iscsiadm -m discovery -t st -p 10.1.1.103:3260

iscsiadm -m node --targetname "iqn.2002-10.com.infortrend:raid.uid317474.012" --portal 10.1.1.101 --login

lsscsi -ds #发现新增加的网络硬盘

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

* synology

```sh
#本地打开localhost:7070,访问synology群晖页面
ssh -CfNg -L 7070:10.1.1.104:5000 name@ip

iscsiadm -m discovery -t st -p 10.1.1.104:3260
iscsiadm -m discovery -t st -p 10.1.1.105:3260

iscsiadm -m session
iscsiadm -m node --targetname "iqn.2000-01.com.synology:rs2418.Target-1.d3339b73b7" --portal "10.1.1.104" --login
lsscsi -ds #发现新增加的网络硬盘

mount --uuid=e83e7403-99d5-4079-94c8-d2073a8ad661 /share/data6
UUID=e83e7403-99d5-4079-94c8-d2073a8ad661 /share/data6 xfs defaults,_netdev 0 0
```

添加端口转发,访问群晖

```sh
firewall-cmd --query-masquerade                                 # 检查是否允许伪装IP，返回no表示没开启，反之开启伪装IP
firewall-cmd --add-masquerade --permanent                       # 允许防火墙伪装IP, --permanent 永久生效

port=XXXXX
IP=10.1.1.104
firewall-cmd --zone=public --add-port=${port}/tcp --permanent      #添加端口, 永久生效

firewall-cmd --permanent --zone=public --add-forward-port=port=${port}:proto=tcp:toaddr=10.1.1.104:toport=5000

firewall-cmd --reload

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
/share/data6    *(rw,async,insecure,no_root_squash,no_subtree_check)

exportfs -avr # 重新共享所有目录
```

### 最后各nodes挂载nfs

```shell
clusconf -yd "mount admin:/public /public;mount admin:/share /share;bash /public/tool/mount_nfs.sh"
```

### 挂载nodes1上的nfs

```shell
# in node1
mount /dev/sdb1 /share1/tmp1

cat /etc/exports
# /export/tmp1 *(rw,no_root_squash,no_subtree_check,async)

# in head node
mount node1:/share1/tmp1 /share1/tmp1
for i in 2 3;
do
clusconf -n $i -yd "mount node1:/share1/tmp1 /share1/tmp1"
done
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

# 禁用 gridview 相关服务的自启动

```text
# 查看所有自启动服务
chkconfig --list
# 关闭 gridview_platform 服务自启
chkconfig gridview_platform off
```

# vncserver

```sh
yum install vnc-server
sudo cp /usr/lib/systemd/system/vncserver@.service /etc/systemd/system/vncserver@.service
firewall-cmd --zone=public --add-port=5901/tcp --permanent
firewall-cmd --reload
sudo systemctl daemon-reload
service vncserver start
```

# acl权限问题

## 开启acl权限

1. 修改mount选项：

    ```sh
    vi /etc/fstab
    # /dev/mapper/vg_server1-logs       /home         ext4    defaults,acl       0
    mount -o remount /home
    ```

2. 使用tune2fs修改文件系统信息：

> tune2fs开启acl后已是永久有效，无需再改fstab的mount选项：

```sh
tune2fs -o acl /dev/vda3           #修改文件系统自身信息来设置acl选项
tune2fs -o ^acl /dev/vda3          #取消acl选项
```

## 文件夹添加用户读写权限

```sh
getfacl bobdir/                    #查看权限
setfacl -m u:joe:rx bobdir/        #给某个用户设置权限
setfacl -m g:aclgp1:rx bobdir/     #给某个组设置权限
setfacl -x g:aclgp1 bobdir/        #取消某项权限 
```

## 免费证书

```sh
# 下载
wget -O - https://get.acme.sh |sh
# 注册
~/.acme.sh/acme.sh --register-account -m guojt-4451@163.com
# 生成证书
~/.acme.sh/acme.sh --issue -d xmbd.tk -d *.xmbd.tk --dns dns_dp
~/.acme.sh/acme.sh --issue -d xmbd.net.cn -d *.xmbd.net.cn --dns dns_dp
# 更新证书
~/.acme.sh/acme.sh --renew -d xmbd.tk -d *.xmbd.tk --dns dns_dp --force
```

## 清除 硬盘raid信息ddf_raid_member

```sh
适用lsblk命令可以查看当先系统下的磁盘相关信息及磁盘大小

删除对应磁盘下的分区
以删除sda 的sda1 sda2分区为例
进入：#parted /dev/sda
查看：（parted）p
删除：（parted）rm 1
（parted）rm 2


通常raid卡的信息会放在最后一个柱面即最后63个扇区
使用dd命令打印最后63个扇区到aaa中
dd if=/dev/sdb of=aaa bs=512 skip=$(( $(blockdev --getsz /dev/sdb) - 63 )) count=63
使用hexedit查看aaa
将这63个扇区置零, dd if=/dev/zero of=/dev/sdb bs=512 seek=$(( $(blockdev --getsz /dev/sdb) - 63 )) count=63
重新查看aaa, dd if=/dev/sdb of=aaa bs=512 skip=$(( $(blockdev --getsz /dev/sdb) - 63 )) count=63

# 有坏块
重建进行修复: mkfs.ext4 -S /dev/sdb1
重建完成后进行修复：fsck.ext4 -y /dev/sdb1
```
