---
Title: docker安装与配置
Date: 2017-11-03 10:20
Modified: 2017-11-05 19:30
Category: 小抄速查
Tags: docker
Slug: docker
Authors: JT Guo
Summary: docker的简单安装与配置
---
# docker

## centos yum install docker

```shell
tee /etc/yum.repos.d/docker.repo <<-'EOF'
[dockerrepo]
name=Docker Repository
baseurl=https://yum.dockerproject.org/repo/main/centos/$releasever/
enabled=1
gpgcheck=1
gpgkey=https://yum.dockerproject.org/gpg
EOF

sed -i 's/other_args=\"\"/other_args=\"--graph=\/share\/apps\/docker\"/g' /etc/sysconfig/docker

for i in `seq 1 8`;
do
    sudo scp /etc/yum.repos.d/docker.repo compute-0-$i:/etc/yum.repos.d/docker.repo
done

rocks run host "yum install docker-engine"
rocks run host "sed -i 's/other_args=\"\"/other_args=\"--graph=\/share\/apps\/docker\"/g' /etc/sysconfig/docker"

```

<!--more-->

## 手动安装

```shell
# 手动安装centos6.5 一些需要安装
yum remove docker-engine
cd /share/apps/until/docker/
yum install ./lua-filesystem-1.4.2-1.el6.x86_64.rpm
yum install ./lxc-libs-1.0.11-1.el6.x86_64.rpm
yum install ./lua-lxc-1.0.11-1.el6.x86_64.rpm
yum install ./lua-alt-getopt-0.7.0-1.el6.noarch.rpm
yum install ./lxc-1.0.11-1.el6.x86_64.rpm
yum install ./docker-io-1.7.1-2.el6.x86_64.rpm
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
yum install device-mapper-event-libs
service docker restart
```

### 安装错误

```shell
# 下面错误：
/usr/bin/docker: relocation error: /usr/bin/docker: symbol dm_task_get_info_with_deferred_remove, version Base not defined in file libdevmapper.so.1.02 with link time reference
fix: $ sudo yum install device-mapper-event-libs
# 如果无法安装，重新更新
wget -O /etc/yum.repos.d/CentOS-Base.repo http://mirrors.aliyun.com/repo/Centos-6.repo
# 然后再安装
```

## docker应用

### 启动docker

    service docker start

### 添加用户

```shell
# 添加docker group：
sudo groupadd docker

# 将当前用户添加到docker组：
sudo gpasswd -a ${USER} docker

# 重启docker服务：
sudo service docker restart
# 开机启动
chkconfig docker on
```

### 修改镜像和容器的存放路径

```shell
# /etc/sysconfig/docker加入：
other_args="--graph=/data/docker"

# 停止Docker服务
service docker stop
# 备份数据到新的存放路径
cp -rf /var/lib/docker /data/
# 修改备份/var/lib/docker路径
mv /var/lib/docker{,.bak}
# 启动Docker服务
service docker start
# 测试Docker服务
docker info
```

### 用法

+ 查看镜像 docker images
+ 查找镜像 docker search
+ 查看容器 docker ps -a
+ 运行容器 docker run
+ 将宿主机的/var/data挂载到容器中的/data: docker run -tdi -v /var/data:/data centos

如果ls: cannot open directory '.': Permission denied
修改/etc/sysconfig/docker，OPTIONS去掉--selinux-enabled