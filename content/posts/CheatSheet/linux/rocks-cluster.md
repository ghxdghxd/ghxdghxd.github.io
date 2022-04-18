---
Title: 集群管理笔记
Date: 2014-12-04 16:10:16
Modified: 2018-03-09 22:07:02
Category: 小抄速查
Tags: linux, centos, shell, hpc, rocks cluster, manage
Slug: rocks-cluster
Authors: JT Guo
Summary: 常用的linux服务器管理
---
# 电源配置

|插座|1孔|2孔|3孔|4孔|5孔|6孔|7孔|8孔|
|---|---|---|---|---|---|---|---|---|
|4号|1上|1下|2下|4上|2上|3下|3上|插座3号|
|3号|||8下|8上|7下|7上|大右|大左|
|2号|4下|显|交下|5下|交上|5上|
|1号|插座2号|小右|6左|外下|管上|6右|管下|小左|

# 常用操作

## 查看服务器型号、序列号

```shell
dmidecode|grep "System Information" -A9|egrep "Manufacturer|Product|Serial"
```

## 查看内存的插槽数,已经使用多少插槽.每条内存多大

```shell
dmidecode|grep -A5 "Memory Device"|grep Size|grep -v Range
```

## 查看内存的频率

```shell
dmidecode|grep -A16 "Memory Device"|grep 'Speed'
```

## 清理内存

```shell
echo 1 > /proc/sys/vm/drop_caches
```

## [登录显示信息](terminal-announcement)

## 添加外挂硬盘

```shell
mount /dev/sdc1 /extra          #158
mount /dev/sdb1 /export/swap/   #162
```

## [CPU信息](cpuinfo)

## GPU计算卡

### 查看GPU型号

```sh
sudo lspci | grep NVIDIA
```

### 安装驱动

```sh
wget http://cn.download.nvidia.com/tesla/410.79/NVIDIA-Linux-x86_64-410.79.run
chmod a+x NVIDIA-Linux-x86_64-410.79.run
```

## [磁盘阵列简介](raid)

## 系统配置(CPU + GPU + raid)

```sh
lsblk
/opt/MegaRAID/MegaCli/MegaCli64 -cfgdsply -aALL

两块raid卡
H700
H800小存储
162 为 raid10
```

+ 配置列表
  + commput0
    + [2.10GHz] \* 4 \* 8核/CPU \* 2线程/核 = 64
    + 1T \* 6块 >>> 3T(raid10), 485M boot + 1.9T root + 781G /export/swap
    + sda1, sda3, sdb1
  + compute1-4
    + [2.60GHz] \* 4 \* 6核/CPU \* 2线程/核 = 48
    + TeslaK20Xm GPU ，cuda核心数 2688， 内存6G
    + /state/partition1 每个计算节点的私有空间
  + compute5
    + [2.60GHz] \* 4 \* 6核/CPU \* 2线程/核 = 48
    + /state/partition1 每个计算节点的私有空间
  + compute6
    + [2.20GHz] \* 4 \* 6核/CPU \* 2线程/核 = 48
    + /state/partition1 每个计算节点的私有空间
  + compute7-8
    + [2.30GHz] \* 4 \* 8核/CPU \* 2线程/核 = 64
    + /state/partition1 每个计算节点的私有空间
  + 数据线(raid5)
    + 3T \* 3块 >>> 6T, sdd1(export)
    + 4T \* 6块 >>> 18T, sdc1(data0), sdc2(data1)
    + 8T \* 3块 >>> 15T, sde1(data5)
  + 网线(raid5)
    + 4T \* 5块 >>> 16T, /dev/mapper/mpathep1
    + 4T \* 5块 >>> 16T, /dev/mapper/mpathfp1
    + 8T \* 5块 >>> 30T, /dev/mapper/mpathhp1

## rocks常用命令

### 删除节点

```sh
rocks remove host compute-0-6
rocks sync config
```

### 所有节点运行

```sh
rocks run host "hostname"
```

### 同步配制

```sh
rocks sync config
```

### 要先重启管理节点然后计算机节点,否则导致数据不同步

```sh
rocks run host "/etc/init.d/pbs_mom restart"
```

### 添加用户**无法qusb要在/etc/group 添加用户**

```shell
useradd -g group name
#/etc/passwd name:x:xxx:xxx::/export/home/casual:/bin/bash
passwd name
rocks sync users
#可更改/export/home/name 为
#/home/name : /etc/passwd name:x:xxx:xxx::/home/casual:/bin/bash

#如果要修改用户名（未测试过）
usermod -l newName oldName
mv /export/home/newName /export/home/oldName
usermod -d /export/home/newName -m newName
rocks sync users
```

### 如果ssh compute 需要输入密码

```sh
rm -rf ~/.ssh #然后 退出登录 再登陆 会自动生成新密钥
```

### 节点进入单用户模式

在倒计时5秒时，按任意键出现下图，
**选择如图，按e进入编辑, 最后加上１,回车,按b,root进入系统**
![图1](images/manager1.png){:style="height:30%; width:30%;"}
![图2](images/manager2.png){:style="height:30%; width:30%;"}
![图3](images/manager3.jpg){:style="height:30%; width:30%;"}

### 重装节点

```sh
#重装所有节点
rocks run host '/boot/kickstart/cluster-kickstart'

#计算节点网络启动重新安装系统
rocks set host pxeboot compute-0-1 action=install
#计算节点网络启动直接进入系统，这个可在集群断电之后子节点重启直接进入grub的情况下使用
rocks set host pxeboot compute-0-1 action=os

# **重装节点**
rocks set host boot compute-0-1 action=install
ssh compute-0-1 "shutdown -r now"

ssh compute-0-6 /boot/kickstart/cluster-kickstart
# 登录节点后，运行如下
/boot/kickstart/cluster-kickstart-pxe
```

### 提交任务后，无运行时间,且qdel: Server could not connect to MOM

由于节点pbs_mom没运行
解决办法是进入节点后kill pbs_mom重新运行pbs_mom

## qmgr

```shell
qmgr -c "print server" # 输出server的属性
qmgr -c "set server query_other_jobs = true" # qstat可以查看所有用户
qmgr -c "set server auto_node_np = True" # 自动更新节点线程数
```

## Draining system to allow starving job to run (qstat -s)

队列中还有排队非常久的饥饿进程，为了更公平合理使用队列，所以将新提交的作业做置为排队状态以让出资源运行排队的饥饿作业

修改/opt/torque/spool/sched_priv/sched_config

before:
help_starving_jobs true ALL

after:
help_starving_jobs false ALL

```sh
/opt/torque/init.d/pbs_sched pbs_mom pbs_server
service pbs_server restart
```

## multipath与iscsi操作

+ 硬件连接及硬盘灯(绿), 可以插拔一下试试
+ ADMIN@10.1.1.120 supermicr, IMPI
+ 10.1.1.108 inforternd, 无SSL
+ 确定服务开启:

```sh
        service iscsi restart
```

+ 查看iscsi发现记录

```sh
        iscsiadm -m node
```

+ 发现iscsi存储：

```sh
        iscsiadm -m discovery -t st -p 10.1.1.100:3260
        iscsiadm -m discovery -t st -p 10.1.1.101:3260
        iscsiadm -m discovery -t st -p 10.1.1.102:3260
        iscsiadm -m discovery -t st -p 10.1.1.103:3260
```

+ multipath操作

```sh
        /sbin/mpathconf --enable # 生成配置文件/etc/multipath.conf, DM multipath kernel driver not loaded
        multipath -ll # 查看路径
        multipath -v2 # 自动更新路径（当/dev/mapper没有链接，可以更新路径试试）
        multipath -f mpathg # 删除路径
        service multipathd restart #重启确认/dev/mapper下有硬盘连接
        # 挂载
        mount /dev/mapper/mpathep1 /export/data2
        mount /dev/mapper/mpathfp1 /export/data3
        mount /dev/mapper/mpathhp1 /export/data4
```

+ 挂载fstab

```sh
        /dev/sdb1 /export/swap ext4 defaults 1 1
        /dev/sdc1 /export/data0 ext4 defaults 1 1
        /dev/sdc2 /export/data1 ext4 defaults 1 1
        /dev/sde1 /export/data5 ext4 defaults 1 1
        /dev/mapper/mpathhp1 /export/data4 xfs defaults,_netdev 0 0
        /dev/mapper/mpathep1 /export/data2 xfs defaults,_netdev 0 0
        /dev/mapper/mpathfp1 /export/data3 xfs defaults,_netdev 0 0
```

+ autofs自动挂载

    autofs一般与ldap、nfs协作实现远程home目录。

  + 确认/export/*,一般重启服务
  
  ```shell
        service autofs restart
  ```

  + /etc/auto.master

  ```text
        /share /etc/auto.share --timeout=1200
        /home /etc/auto.home  --timeout=1200
  ```

  + /etc/auto.share 如果要增加新存储，需要添加，如swap
  
  ```text
        apps -nfsvers=3 -soft,intr,timeo=9999  xmu.local:/export/&
        #bio  -nfsvers=3 -soft,intr,timeo=9999  xmu:/export/&
        data0 -nfsvers=3 -soft,intr,timeo=9999 xmu.local:/export/&
        data1 -nfsvers=3 -soft,intr,timeo=9999 xmu.local:/export/&
        data2 -nfsvers=3 -soft,intr,timeo=9999 xmu.local:/export/&
        data3 -nfsvers=3 -soft,intr,timeo=9999 xmu.local:/export/&
        data4 -nfsvers=3 -soft,intr,timeo=9999 xmu.local:/export/&
        data5 -nfsvers=3 -soft,intr,timeo=9999 xmu.local:/export/&
        swap -nfsvers=3 -soft,intr,timeo=9999 xmu.local:/export/&
  ```

  + /etc/exportfs 如果要增加新存储，需要添加，如swap

  ```text
        /export 10.1.1.1(rw,async,no_root_squash) 10.1.1.0/255.255.255.0(rw,async)
        /export/data0 10.1.1.1(rw,async,no_root_squash) 10.1.1.0/255.255.255.0(rw,async)
        /export/data1 10.1.1.1(rw,async,no_root_squash) 10.1.1.0/255.255.255.0(rw,async)
        /export/data2 10.1.1.1(rw,async,no_root_squash) 10.1.1.0/255.255.255.0(rw,async)
        /export/data3 10.1.1.1(rw,async,no_root_squash) 10.1.1.0/255.255.255.0(rw,async)
        /export/data4 10.1.1.1(rw,async,no_root_squash) 10.1.1.0/255.255.255.0(rw,async)
        /export/data5 10.1.1.1(rw,async,no_root_squash) 10.1.1.0/255.255.255.0(rw,async)
        /export/swap 10.1.1.1(rw,async,no_root_squash) 10.1.1.0/255.255.255.0(rw,async)
  ```

+ 修复分区(未完)

```shell
        exportfs -rv #重新扫描/etc/exports
        exportfs -u /export/data2       #umount分区
        xfs_check /dev/mapper/mpathep1;echo $? #显示0表示已umount
```

## qsub

1.指定运行节点

```shell
qsub -l nodes=1:n3:ppn=40
qusb -l nodes=1:n1:ppn=+1:n2
```

2.重新运行任务

```sh
        qrerun
```

3.lib

```shell
for i in `seq 1 8`;
do
sudo scp /etc/profile.d/set.sh compute-0-$i:/etc/profile.d/set.sh
done
rm /usr/lib64/libstdc++.so.6
ln -s /share/apps/gcc-5.3.0/lib64/libstdc++.so.6.0.21 libstdc++.so.6
strings /usr/lib/libstdc++.so.6 | grep
```

## showq

出现错误：
ERROR:    cannot send request to server xmu.cn:42559 (server may not be running)
ERROR:    cannot request service (status)

```shell
cp /opt/maui/sbin/maui /etc/init.d
/etc/init.d/maui start
```

# CentOS 6.5 升级内核

```shell
rpm --import https://www.elrepo.org/RPM-GPG-KEY-elrepo.org
rpm -Uvh http://www.elrepo.org/elrepo-release-6-8.el6.elrepo.noarch.rpm
yum elrepo源有 ml（mainline 为最新版本的内核）和 lt（长期支持的内核）两种内核，这里我们选择 lt 内核
yum --enablerepo=elrepo-kernel -y install kernel-lt （kernel-ml）

引导文件修改（grub.conf）
将 default 设置为 0 ，default=0
vim /etc/grub.conf
```

![图4](images/manager4.png){:height="50%" width="50%"}

# [使用 fail2ban 防御 SSH 服务器的暴力破解攻击](fail2ban)

# install glibc

```sh
conda install -c asmeurer glibc
```

## /lib64/libc.so.6软链接

当libc.so.6被升级或被删除后，ls, mv等命令无法使用, 现在如下错误：

```sh
/bin/ls: error while loading shared libraries: libc.so.6: cannot open shared object file: No such file or directory
```

通过使用LD_PRELOAD解决，方法如下：

```sh
先删除连接 ：
# cd /lib64
# LD_PRELOAD=/lib64/libc-2.3.6.so.bak rm libc.so.6
建立新连接 ：
# LD_PRELOAD=/lib64/libc-2.3.6.so.bak ln -s /lib64/libc-2.3.6.so.bak libc.so.6
```

## screen

切换用户后，screen出现如下提示：Cannot open your terminal '/dev/pts/38' - please check

```sh
script /dev/null #更新 tty，再执行screen
```

## tensorflow

```sh
/share/apps/glibc.2.17/lib/ld-linux-x86-64.so.2 --library-path /share/apps/glibc.2.17/lib/lib:$LD_LIBRARY_PATH /share/apps/anaconda3/bin/python
```

## 检查EDAC错误的方法

grep "[0-9]" /sys/devices/system/edac/mc/mc*/csrow*/ch*_ce_count

如果数值为0 表示正常 其他表示异常

## 端口

```sh
netstat -tunlp
```

## PBS日志

> /opt/torque/spool
> /opt/gridview/pbs/dispatcher

## 计算节点无法获取管理节点配置 /etc/auto.home等

```sh
# 在计算节点运行
411get -a-ll
# 出现错误
Error: Could not get file 'http://10.1.1.1:372/411.d//': 400 Bad

# 在/etc/httpd/conf/httpd.conf添加
# HttpProtocolOptions Unsafe
service httpd restart
```

# 出现结构需要清理 (structure needs cleaning)

```text
1)首先df -t 查看出错的挂载点对应的文件系统和文件系统类型
2)然后umount这个文件系统
比如:umount /dev/sda1 
3)然后根据文件系统类型不同操作不同 
比如ext4:
fsck.ext4 /dev/sda1
或者xfs:
xfs_repair /dev/sda1
4)最后重启reboot
```
