---
Title: 集群管理笔记
Date: 2014-12-04 16:10:16
Modified: 2017-03-09 22:07:02
Category: 系统管理
Tags: linux, centos, shell, hpc, rocks cluster
Slug: linux-management
Authors: JT Guo
Summary: 常用的linux服务器管理
---
# 1 服务器管理记录

## 1.1 清理内存

echo 1 > /proc/sys/vm/drop_caches

## 1.2 [登录显示信息](terminal-announcement)

# 2 gate

mount /dev/sdc1 /extra

# 3 HPC

## 3.1 配置

### 3.1.1 概念

#### 3.1.1.1 物理CPU

实际Server中插槽上的CPU个数
物理cpu数量，可以数不重复的 physical id 有几个

#### 3.1.1.2 逻辑CPU

/proc/cpuinfo 用来存储cpu硬件信息， 信息内容分别列出了processor 0 –processor n 的规格。这里需要注意，n是逻辑cpu数
一般情况，我们认为一颗cpu可以有多核，加上intel的超线程技术(HT), 可以在逻辑上再分一倍数量的cpu core出来
逻辑CPU数量 = 物理cpu数量 × cpu cores x 2(如果支持并开启ht)
备注一下：Linux下top查看的CPU也是逻辑CPU个数

#### 3.1.1.3 CPU核数

一块CPU上面能处理数据的芯片组的数量、比如现在的i5 760,是双核心四线程的CPU、而 i5 2250 是四核心四线程的CPU
一般来说，物理CPU个数×每颗核数就应该等于逻辑CPU的个数，如果不相等的话，则表示服务器的CPU支持超线程技术
输入命令cat /proc/cpuinfo 查看物理CPU，physical id有几个；核数，cores有几个；逻辑CPU，processor有几个

#### 3.1.1.4 GPU

1-4节点有GPU，
TeslaK20Xm GPU ，cuda核心数 2688， 内存6G，

## 3.2 rocks cluster 管理

1.rocks run host "hostname" #所有节点运行
2.rocks sync config # 同步配制
3.**要先重启管理节点然后计算机节点,否则导致数据不同步**
    运行 rocks run host  "/etc/init.d/pbs_mom restart" 即可

4.添加用户**无法qusb要在/etc/group 添加用户**

```bash
useradd name
passwd name
usermod -g users name
rocks sync users # 可更改/export/home/name 为 /home/name
```

5.ssh compute-0-* 要输入密码

rm -rf ~/.ssh **然后 退出登录 再登陆 会自动生成新密钥**

6.进入单用户模式

在倒计时5秒时，按任意键出现下图，
**选择如图，按e进入编辑, 最后加上１,回车,按b,root进入系统**
![图1](images/manager1.png){:height="80%" width="80%"}

## 3.3 qmgr

```bash
qmgr -c "print server" # 输出server的属性
qmgr -c "set server query_other_jobs = true" # qstat可以查看所有用户
qmgr -c "set server auto_node_np = True" # 自动更新节点线程数
```