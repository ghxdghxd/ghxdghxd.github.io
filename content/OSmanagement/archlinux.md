---
Title: archlinux安装与配置
Date: 2017-12-03 10:20
Modified: 2017-12-05 19:30
Category: 系统管理
Tags: operation, interest
Slug: archlinux
Authors: JT Guo
Summary: archlinux的简单安装与配置
---
# archlinux安装

```shell
# u盘启动后
# 连接网络
wifi-memu
mount /dev/sda1 /mnt
mkdir -p /mnt/home
mount /dev/sda2 /mnt/home
# 修改中国镜像源,如163.com
vi /ect/pacman.d/mirrorlist
pacstrap -i /mnt base base-devel
#生成挂载文件fstab
genfstab -U /mnt >> /mnt/etc/fstab
```

## archlinux 初步配置

```shell
#切换到archlinux
arch-chroot /mnt /bin/bash
```

* 本地语言

```shell
vi /etc/locale.gen
    en_US.UTF-8 UTF-8
    zh_CN.UTF-8 UTF-8

#生效
locale-gen
echo LANG=en_US.UTF-8 > /etc/locale.conf
```

<!--more-->

* 时区

```shell
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
# 或
# 按提示选择时区
tzselect
#设置硬件时间
hwclock --systohc --utc
```

* grub引导系统

```shell
# 支持grub和EFI，可只选grup
pacman -S grub efibootmgr
grub-install --target=i386-pc --recheck --debug /dev/sda
grup-mkconfig -o /boot/grub/grub.cfg
```

* 主机名

```shell
echo Garch >> /etc/hostname
```

* 网络配置

```shell
# 有线
systemctl enable dhcpcd.service
# 无线
pacman -S iw wpa_supplicant dialog
```

## archlinux 配置

```shell
# 最小安装
# X桌面
pacman -S xorg-server
# 显卡驱动
pacman -S xf86-video-ati
pacman -S gnome gnome-tweak-tool
pacman -S ttf-ubuntu
# 可选
```