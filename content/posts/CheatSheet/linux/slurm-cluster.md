# install and configure

cenntOS最小化安装；升级软件补丁，内核；关闭SELinux和防火墙。
Slurm专用账户（slurm）：Master端和Node端专用账户统一ID，建议ID号规划为200；
Slurm Master如需要支持GUI命令（sview）则需要安装GUI界面(Server with GUI)；

## centos 7.9 安装

```sh
wget https://mirrors.tuna.tsinghua.edu.cn/centos/7.9.2009/isos/x86_64/CentOS-7-x86_64-Minimal-2009.iso
```

### 定义节点名

```sh
#永久
hostnamectl --static set-hostname master    #10.1.1.1
hostnamectl --static set-hostname compute01    #10.1.1.254
hostnamectl --static set-hostname compute02    #10.1.1.253
hostnamectl --static set-hostname compute03    #10.1.1.252
hostnamectl --static set-hostname compute04    #10.1.1.251
hostnamectl --static set-hostname compute05    #10.1.1.250
hostnamectl --static set-hostname compute06    #10.1.1.249
hostnamectl --static set-hostname compute07    #10.1.1.248

# 修改管理节点/etc/hosts, 并scp致所有计算节点
# 重启管理节点网络
systemctl restart network
```

### 计算节点通过管理节点NAT上网

1. 管理节点配置

    ```sh
    #开启 firewalld
    systemctl start firewalld
    systemctl enable firewalld

    #修改配置文件 /etc/sysctl.conf
    echo net.ipv4.ip_forward = 1 >> /etc/sysctl.conf
    sysctl -p
    #开启地址伪装
    firewall-cmd --add-masquerade --permanent
    #重新加载firewall
    firewall-cmd --reload

    firewall-cmd --zone=trusted --change-interface=em2 # 修改指定网卡的zone, 防止影响torque的通信（无法调度任务），所以设置直接信任内网网卡
    firewall-cmd --reload
    ```

2. 计算节点配置

    ```sh
    vi /etc/sysconfig/network-scripts/ifcfg-eth1

    GATEWAY=10.1.1.1
    DNS1=与管理节点相同
    DNS2=与管理节点相同

    systemctl  restart network
    ```

### 安装EPEL源

```sh
yum install -y epel-release && yum makecache
```

### 管理节点存储

1. 挂载端 安装iSCSI和multipath

    ```sh
    yum install iscsi-initiator-utils -y
    systemctl restart iscsid
    systemctl enable iscsid     #开机启动

    yum install device-mapper-multipath  -y
    systemctl enable multipathd.service
    /sbin/mpathconf --enable # 生成配置文件/etc/multipath.conf, DM multipath kernel driver not loaded
    systemctl start multipathd.service
    ```

2. 查看iscsi发现记录

    ```sh
            iscsiadm -m node
    ```

3. 发现iscsi存储并登录：

    ```sh
            iscsiadm -m discovery -t st -p 10.1.1.100:3260
            iscsiadm -m discovery -t st -p 10.1.1.101:3260
            iscsiadm -m discovery -t st -p 10.1.1.102:3260
            iscsiadm -m discovery -t st -p 10.1.1.103:3260

            iscsiadm -m node --login
    ```

4. multipath操作

    ```sh
            /sbin/mpathconf --enable # 生成配置文件/etc/multipath.conf, DM multipath kernel driver not loaded
            multipath -ll # 查看路径
            multipath -v2 # 自动更新路径（当/dev/mapper没有链接，可以更新路径试试）
            multipath -f mpathg # 删除路径
            service multipathd restart #重启确认/dev/mapper下有硬盘连接
            # 挂载
            mount /dev/mapper/mpatha1 /export/data2
            mount /dev/mapper/mpathb1 /export/data3
            mount /dev/mapper/mpathc1 /export/data4
    ```

5. /etc/fstab

    ```text
    /dev/sdd1   /share          xfs     defaults    0 0
    /dev/sdc1   /share/data0    ext4    defaults    0 0
    /dev/sdc2   /share/data1    ext4    defaults    0 0
    /dev/sde1   /share/data5    ext4    defaults    0 0
    /dev/mapper/mpatha1    /share/data2   xfs     defaults,_netdev    0 0
    /dev/mapper/mpathb1    /share/data3   xfs   defaults,_netdev    0 0
    /dev/mapper/mpathc1    /share/data4   xfs   defaults,_netdev    0 0
    ```

## 管理节点安装 NIS

Network Information Services (NIS server) 最早应该是称为 Sun Yellow Pages (简称 yp) 一台服务器(管理节点)保存用户账户密码，所有服务器用户都保存在NIS服务器上

yp-tools ：提供 NIS 相关的查寻指令功能
ypbind ：提供 NIS Client 端的设定软件
ypserv ：提供 NIS Server 端的设定软件
rpcbind ：就是 RPC 一定需要的数据啊！

```sh
#集群节点执行命令

systemctl stop firewalld
systemctl disable firewalld

#集群节点关闭 selinux, /etc/selinux/config

    SELINUX=disabled

# 管理节点安装必备软件
yum -y install ypserv ypbind yp-tools

# 管理节点设置nis域名，执行命令
# 设置NIS网络名称
nisdomainname master.server
echo "NISDOMAIN=master.server" >> /etc/sysconfig/network
#增加开机自动加入NIS域
echo "nisdomainname master.server"  >>/etc/rc.local

#限制服务器IP
echo "10.1.1.1/254:*:*:none" >> /etc/ypserv.conf

#如果防火墙正在运行，固定nis服务端口，并开放端口：
echo "YPSERV_ARGS=\"-p 944\"" >> /etc/sysconfig/network
echo "YPXFRD_ARGS=\"-p 945\"" >> /etc/sysconfig/network
echo "YPPASSWDD_ARGS=\"--port 946\"" >> /etc/sysconfig/yppasswdd
systemctl restart rpcbind ypserv ypxfrd yppasswdd
firewall-cmd --add-service=rpc-bind --permanent
firewall-cmd --add-port=944/tcp --permanent
firewall-cmd --add-port=944/udp --permanent
firewall-cmd --add-port=945/tcp --permanent
firewall-cmd --add-port=945/udp --permanent
firewall-cmd --add-port=946/udp --permanent
firewall-cmd --reload

#master节点启动服务
systemctl restart rpcbind
systemctl restart ypserv
systemctl restart yppasswdd
#master节点设置为开机启动项
systemctl enable rpcbind
systemctl enable ypserv
systemctl enable yppasswdd
#利用 rpcinfo 来检查看看
rpcinfo -p localhost
rpcinfo -u localhost ypserv
#master节点执行创建库,并重启
/usr/lib64/yp/ypinit -m #再执行"ctrl+D"，再输入y
systemctl restart rpcbind
systemctl restart ypserv
systemctl restart yppasswdd

#创建用户
sudo adduser -g Group User1
#master节点更新NIS账户和资料库
make -C /var/yp

#NIS Client 客户端设置
#节点安装NIS
yum install -y rpcbind yp-tools ypbind
# NIS Client节点设置nis域名，执行命令
nisdomainname master.server
echo "NISDOMAIN=master.server" >> /etc/sysconfig/network
#增加开机自动加入NIS域
echo "nisdomainname master.server"  >>/etc/rc.local

scp root@10.1.1.254:/etc/nsswitch.conf /etc/nsswitch.conf
scp root@10.1.1.254:/etc/sysconfig/authconfig /etc/sysconfig/authconfig
scp root@10.1.1.254:/etc/pam.d/system-auth /etc/pam.d/system-auth
scp root@10.1.1.254:/etc/yp.conf /etc/yp.conf

# NIS Client节点配置文件
#cat /etc/nsswitch.conf
    passwd:     files sss nis
    shadow:     files sss nis
    group:      files sss nis
    hosts:      files nis dns myhostname

#cat /etc/sysconfig/authconfig
    USENIS=yes

#cat /etc/pam.d/system-auth, 添加nis
    password sufficient pam_unix.so sha512 shadow nis nullok try_first_pass use_authtok

#cat /etc/yp.conf
echo "domain master.server server master" >> /etc/yp.conf

#NIS Client节点启动服务
systemctl restart rpcbind
systemctl restart ypbind    #若 ypbind 启动失败的话，需要设置下 NIS 服务器上的防火墙（iptables 或 firewall-cmd）
#NIS Client节点开机启动
systemctl enable rpcbind
systemctl enable ypbind

#NIS Client节点yptest用来测试 server 端和 client 端能否正常通讯
#yptest
```

## 建立NFS文件系统共享服务器

1. 管理节点配置

    * 安装nfs

    ```sh
    yum -y install nfs-utils
    systemctl enable rpcbind
    systemctl enable nfs
    systemctl start rpcbind
    systemctl start nfs
    #查看端口
    rpcinfo -p localhost | grep nfsl
    # 开放
    firewall-cmd --add-service=nfs
    firewall-cmd --add-service=nfs --perment
    firewall-cmd --add-service=rpc-bind
    firewall-cmd --add-service=rpc-bind --perment
    firewall-cmd --add-service=mountd
    firewall-cmd --add-service=mountd --perment
    ```

    * 配置目录/etc/exports

    ```text
    # shareDir ip(rw,no_root_squash,no_all_squash,sync)
    # ip  192.168.0.0/24: 客户端 IP 范围，* 代表所有，即没有限制。
    # rw: 权限设置，可读可写。
    # sync: 同步共享目录。
    # no_root_squash: 可以使用 root 授权。
    # no_all_squash: 可以使用普通用户授权。

    /home 10.1.1.0/24(rw,async,no_root_squash)
    /share 10.1.1.0/24(rw,async,no_root_squash)
    /share/data0 10.1.1.0/24(rw,async,no_root_squash)
    /share/data1 10.1.1.0/24(rw,async,no_root_squash)
    /share/data2 10.1.1.0/24(rw,async,no_root_squash)
    /share/data3 10.1.1.0/24(rw,async,no_root_squash)
    /share/data4 10.1.1.0/24(rw,async,no_root_squash)
    /share/data5 10.1.1.0/24(rw,async,no_root_squash)
    ```

    ```sh
    showmount -e localhost #查看目录
    exportfs -rv #重新扫描/etc/exports
    ```

2. 计算节点配置

    ```sh
    yum -y install nfs-utils
    systemctl enable rpcbind
    systemctl restart rpcbind
    
    
    #自动挂载主节点的共享文件
    vi /etc/rc.local
        mount master:/home /home
        mount master:/share /share
    ```

## SSH免密登陆

```sh

```

## 安装配置munge

```sh
# 所有节点安装
yum install munge munge-libs munge-devel -y
# 生成munge.key
create-munge-key
# 分发到计算节点
for i in {1..7};do scp /etc/munge/munge.key compute0$i:/etc/munge;done
#每个节点授权,并启动munge服务
chown munge:munge /etc/munge/munge.key && chmod 0600 /etc/munge/munge.key
systemctl enable munge
systemctl start munge

# 验证
munge -n | ssh compute01 unmunge
```

## 安装slurm

```sh
yum install -y gcc rpm-build bzip2-devel zlib-devel perl-DBI perl-ExtUtils-MakeMaker pam-devel readline-devel mariadb-devel python3 gtk2 gtk2-devel

wget https://download.schedmd.com/slurm/slurm-21.08.2.tar.bz2
tar xvf slurm-21.08.2.tar.bz2

cd slurm-21.08.2
./configure
make -j10
make install -j10
cp etc/{slurmctld.service,slurmdbd.service,slurmd.service} /usr/lib/systemd/system
# https://slurm.schedmd.com/configurator.html, 在线配置
cp etc/slurm.conf.example /usr/local/etc/slurm.conf #配置文件https://www.ityww.cn/1470.html
cp etc/cgroup.conf.example /usr/local/etc/cgroup.conf #计算节点必需

#COMPUTE NODES
NodeName=compute0[1-5] CPUs=48 RealMemory=257747 Sockets=4 CoresPerSocket=6 ThreadsPerCore=2 State=UNKNsOWN
NodeName=compute0[6-7] CPUs=64 RealMemory=257747 Sockets=4 CoresPerSocket=8 ThreadsPerCore=2 State=UNKNOWN
PartitionName=CPU Nodes=ALL Default=YES MaxTime=INFINITE State=UP
    # 说明，上面的slurm.conf末尾NodeName配置中， Procs是该节点能使用的CPU数，
    # Sockets，CoresPerSocket和ThreadsPerCore可使用 lscpu查看配置（procs=sockets * corespersocket * threadpercore），
    # 内存自行根据机器设置。分区 PartitionName， Defult代表该机是否做运算，建议控制机设置NO不做运算，分区名自定义，不必叫 control、compute
# 添加GPU
# GresTypes=gpu
# NodeName=gupnode01 Gres=gpu:1 CPUs=56 RealMemory=256000 Socket=2 State=UNKNOWN

for i in {1..7};do scp /usr/local/etc/slurm.conf compute0$i:/usr/local/etc/;done

#开机启动, 主节点启动slurmctld、slurmd, 计算节点只需启动slurmd 即可
#控制器守护程序
systemctl enable slurmctld
#数据库守护程序:
systemctl enable slurmdbd
#计算节点守护程序:
systemctl enable slurmd
#立刻启动
systemctl start slurmctld
systemctl start slurmdbd
systemctl start slurmd

#如果sinfo -R出现Low RealMemory的问题,直接
scontrol update NodeName=compute0[2-3,5] State=idle
```

## 添加用户

```sh
useradd -g users new_user_name
make -C /var/yp
```

## 添加PATH

sudo提升权限后,找不到sinfo等命令,在/etc/profile.d中添加文件slurm-env.sh
    export SLURM_HOME=/usr/local/bin
    export PATH=$SLURM:$PATH

## 控制用户登陆节点

```sh
cd slurm-21.08.2/contribs/pam_slurm_adopt
make && make install
```

## 安装软件

```sh
# 所有节点
srun -p CPU -N 7 yum install $SOFTWARE

for i in {1..7};
do
srun -p CPU -w compute0$i yum install -y gcc-gfortran
done
```

### 安装environment-modules

```sh
srun -p CPU -N 7 yum install -y environment-modules
echo "source /usr/share/Modules/init/bash" >> /etc/profile
#自定义module目录
echo "/share/apps/modules" >> /usr/share/Modules/init/.modulespath
for i in {1..7};do scp /usr/share/Modules/init/.modulespath compute0$i:/usr/share/Modules/init/;done
```

所有软件均安装到/public/software，添加modulefile到/public/software/modules

```sh
add_module_PATH.sh R-4.1.1 /share/apps/R/R-4.1.1
#/share/apps/bin/add_module_PATH.sh
sudo cat <<EOF > /share/apps/modules/$1
#%Module1.0
module-whatis   "$1..."

conflict apps

set             APPS_HOME               $2

setenv          APPS_ROOT               $2
prepend-path    PATH                    $2/bin
prepend-path    LIBRARY_PATH            $2/lib
prepend-path    LD_LIBRARY_PATH         $2/lib
prepend-path    LD_INCLUDE_PATH         $2/include
prepend-path    MANPATH                 $2/share/man
INCLUDE
EOF
```

登录系统时，系统会默认载入module。编辑.bashrc

```sh
module add <module name>
```

### 安装gcc

```sh
yum install -y centos-release-scl
yum install devtoolset-9-gcc*
#使用gcc9
scl enable devtoolset-9 bash
```

### GPU计算卡

#### 查看GPU型号

```sh
sudo lspci | grep NVIDIA
# TeslaK20Xm GPU ，cuda核心数 2688， 内存6G, 算力3.5
```

#### 安装驱动

```sh
wget https://cn.download.nvidia.cn/tesla/440.118.02/NVIDIA-Linux-x86_64-440.118.02.run
chmod a+x NVIDIA-Linux-x86_64-440.118.02.run

#禁用nouveau
echo "blacklist nouveau" > /etc/modprobe.d/blacklist.conf
#重建initramfs image文件
mv /boot/initramfs-$(uname -r).img /boot/initramfs-$(uname -r).img.bak
dracut -v /boot/initramfs-$(uname -r).img $(uname -r)
#重启
reboot
#查看nouveau模块
lsmod | grep nouveau

# 先安装编译环境 gcc、kernel-devel、kernel-headers  （已经装过则不需要再次安装）
#"kernel-devel-uname-r == $(uname -r)"可以确保安装与当前运行内核版本一样的kernel-header
yum -y install kernel-devel "kernel-devel-uname-r == $(uname -r)" dkms

bash NVIDIA-Linux-x86_64-440.118.02.run

# 安装cuda
wget https://developer.download.nvidia.com/compute/cuda/11.4.2/local_installers/cuda-repo-rhel7-11-4-local-11.4.2_470.57.02-1.x86_64.rpm
sudo rpm -i cuda-repo-rhel7-11-4-local-11.4.2_470.57.02-1.x86_64.rpm
sudo yum clean all
sudo yum -y install nvidia-driver-latest-dkms cuda
sudo yum -y install cuda-drivers

cat <<EOF >/etc/profile.d/cuda-env.sh
export PATH="/usr/local/cuda-11/bin:\$PATH" 
export LD_LIBRARY_PATH="/usr/local/cuda-11/lib64:\$LD_LIBRARY_PATH"
EOF

# 安装cuDNN, https://developer.nvidia.com/rdp/cudnn-archive
wget https://developer.download.nvidia.cn/compute/machine-learning/cudnn/secure/8.2.2/11.4_07062021/cudnn-11.4-linux-x64-v8.2.2.26.tgz?AVCxPHLLL4iOOgO2pQob296tprlBGVz4MlVRNOk4CNfm26lzQxGMZ43f2ZEg9KS43sdmMsCpYJ0n0hrxeAlN8ZbibEs18VenrBsMBDbY1mITYww1wfWoUBf8M9zVMtwav4uRrqMZF3wV9-Ln7fQGr3NoQ3UZlWFMqZxObn1jdS5d24-rUDgc1fGB7mPX3cpjQsjWQSbxM5DCn8g

tar -xzvf cudnn-11.4-linux-x64-v8.2.2.26.tgz
cp cuda/include/cudnn* /usr/local/cuda-11/include/
cp cuda/lib64/libcudnn* /usr/local/cuda-11/lib64/
sudo chmod a+r /usr/local/cuda-11/include/cudnn.h /usr/local/cuda-11/lib64/libcudnn*


#K20算力太低,需要从源码安装pytorch
#https://github.com/pytorch/pytorch/#from-source
conda create -n pytorch python=3
source activate pytorch
conda install astunparse numpy ninja pyyaml mkl mkl-include setuptools cmake cffi typing_extensions future six requests dataclasses
conda install -c pytorch magma-cuda110

git clone --recursive https://github.com.cnpmjs.org/pytorch/pytorch.git
cd pytorch
# if you are updating an existing checkout
sed -i 's/github.com/github.com.cnpmjs.org/g' .gitmodules
git submodule sync
git submodule update --init --recursive
# github.com替换github.com.cnpmjs.org加速


#使用gcc9
scl enable devtoolset-9 bash
export CMAKE_PREFIX_PATH=${CONDA_PREFIX:-"$(dirname $(which conda))/../"}
python setup.py install
python setup.py develop

#cuda是否可用；
torch.cuda.is_available()
#返回gpu数量；
torch.cuda.device_count()
#返回gpu名字，设备索引默认从0开始；
torch.cuda.get_device_name(0)
#返回当前设备索引；
torch.cuda.current_device()
```

```sh
#!/bin/bash
#SBATCH --job-name=test               # 任务名
#SBATCH -w compute03                  # 申请节点名
#SBATCH --nodes 1                     # 申请使用一个节点
#SBATCH --ntasks 1                    # 申请使用一个CPU
#SBATCH --mem=1gb                     # 申请使用内存
#SBATCH --time=00:05:00               # 申请使用时间 时:分:秒
#SBATCH --output=test_%j.log          # 日志文件

pwd; hostname; date
sleep 10s
module load Java
echo `which java`
echo "Running plot script on a single CPU core"
```
