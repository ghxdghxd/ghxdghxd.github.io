---
Title: ubuntu常用配置
Date: 2014-11-13 10:20
Modified: 2017-12-28 8:05
Category: 小抄速查
Tags: ubuntu, linux, R
Slug: ubuntu-install
Authors: JT Guo
Summary: ubuntu常用安装与配置
---
# config ubuntu

## upgrade

```sh
sudo apt update & sudo apt upgrade
```

## disable wayland

```sh
gedit /etc/gdm3/custom.conf
# WaylandEnable=false
```

## nvidia

固定内核与nvidia版本
> https://developer.download.nvidia.cn/compute/cuda/repos

```sh
apt install linux-image-5.4.0-67-generic
apt install linux-modules-nvidia-450-5.4.0-67-generic
apt install nvidia-driver-450 nvidia-dkms-450 nvidia-kernel-common-450 nvidia-kernel-source-450 nvidia-utils-450 xserver-xorg-video-nvidia-450 libnvidia-common-450 libnvidia-gl-450

# 切换显卡
prime-select intel
prime-select nvidia

#删除旧内核
dpkg --purge linux-image-xx.xx.x-xx-generic
#锁定内核版本
#关闭内核的自动更新，锁定内核版本
sudo apt-mark hold linux-image-generic linux-headers-generic
#解锁，启用自动更新
sudo apt-mark unhold linux-image-generic linux-headers-generic
```

## chrome

```sh
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt -fy install ./google-chrome-stable_current_amd64.deb
```

## git

```sh
sudo apt install git
git config --global user.name "user name"
git config --global user.email user@email.com
```

## guake

```sh
sudo apt install python-dbus-dev
sudo apt install libutempter-dev
sudo apt-get install automake libgconf2-dev python-glade2 libtool python-keybinder
git clone https://github.com/Guake/guake.git
cd guake
sudo ./dev.sh --install
```

## gnome-tweak-tool

```sh
sudo apt install gnome-tweak-tool
# https://extensions.gnome.org/extension/307/dash-to-dock/
```

## wbpy

```sh
sudo apt-get purge ibus
sudo apt-get autoremove

sudo apt install fcitx-table-wbpy
im-config -s fcitx
sudo cp /usr/share/fcitx/xdg/autostart/fcitx-autostart.desktop /etc/xdg/autostart/
```

## 坚果云

```sh
https://www.jianguoyun.com/s/downloads/linux#build_from_src

# 针对64位系统：nutstore_linux_dist_x64.tar.gz
wget https://www.jianguoyun.com/static/exe/installer/nutstore_linux_dist_x64.tar.gz -O /tmp/nutstore_bin.tar.gz
# 解压缩二进制组件包
mkdir -p ~/.nutstore/dist && tar zxf /tmp/nutstore_bin.tar.gz -C ~/.nutstore/dist
#安装坚果云菜单和图标
~/.nutstore/dist/bin/install_core.sh

# can't import g
sudo ln -s /usr/lib/python3/dist-packages/gi/_gi.cpython-{36m,37m}-x86_64-linux-gnu.so
sed -i 's/env //g' ~/.nutstore/dist/bin/nutstore-pydaemon.py
# can't import appindicator
```

## seafile

```sh
#For Ubuntu 20.04
sudo bash -c "echo 'deb [arch=amd64 signed-by=/usr/share/keyrings/seafile-keyring.asc] https://linux-clients.seafile.com/seafile-deb/focal/ stable main' > /etc/apt/sources.list.d/seafile.list"
sudo apt update
sudo apt install -y seafile-gui
```

## zsh

```sh
sudo apt install zsh
sh -c "$(wget -O- https://raw.githubusercontent.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
apt install autojump
chsh -s `which zsh`
sudo shutdown -r 0
```

## change PATH language

```sh
export LANG=en_US
xdg-user-dirs-gtk-update

export LANG=zh_CN
```

## exFat

```sh
sudo apt install exfat-fuse

sudo apt install sshfs
```

## anaconda

```sh
wget https://repo.continuum.io/archive/Anaconda3-4.3.1-Linux-x86_64.sh
bash Anaconda3-4.3.1-Linux-x86_64.sh|sh
```

## synergy

```sh
sudo apt-get -fy install ./synergy-v1.8.8-stable-c30301e-Linux-x86_64.deb
```

## ModuleNotFoundError

+ No module named 'Xlib'

```sh
pip install python3_xlib
```

+ No module named 'xdg'

```sh
pip install pyxdg
```

# [install R](R-and-Rstudio)
