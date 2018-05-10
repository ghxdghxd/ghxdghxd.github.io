---
Title: archlinux安装与配置
Date: 2017-12-03 10:20
Modified: 2017-12-05 19:30
Category: linux
Tags: operation, interest
Slug: archlinux
Authors: JT Guo
Summary: archlinux的简单安装与配置
---
# archlinux安装

```shell
#u盘启动后
wifi-memu # 连接网络
mount /dev/sda1 /mnt
mkdir -p /mnt/home
mount /dev/sda2 /mnt/home
vi /ect/pacman.d/mirrorlist # 修改中国镜像源,如163.com
pacstrap -i /mnt base base-devel
genfstab -U /mnt >> /mnt/etc/fstab #生成挂载文件fstab
```

## archlinux 初步配置

```shell
arch-chroot /mnt /bin/bash #切换到archlinux
```

* 本地语言

```shell
vi /etc/locale.gen
    en_US.UTF-8 UTF-8
    zh_CN.UTF-8 UTF-8

locale-gen #生效
echo LANG=en_US.UTF-8 > /etc/locale.conf
```

<!--more-->

* 时区

```shell
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
或
tzselect #按提示选择时区

hwclock --systohc --utc #设置硬件时间
```

* grub引导系统

```shell
pacman -S grub efibootmgr # 支持grub和EFI，可只选grup
grub-install --target=i386-pc --recheck --debug /dev/sda
grup-mkconfig -o /boot/grub/grub.cfg
```

* 主机名

```shell
echo Garch >> /etc/hostname
```

* 网络配置

```shell
systemctl enable dhcpcd.service #有线
pacman -S iw wpa_supplicant dialog #无线
```

## archlinux 配置

```shell
#最小安装
pacman -S xorg-server # X桌面
pacman -S xf86-video-ati # 显卡驱动
pacman -S gnome gnome-tweak-tool
pacman -S ttf-ubuntu
# 可选

```