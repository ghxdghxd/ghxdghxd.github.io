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

sudo apt update & sudo apt upgrade

## chrome

```sh
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
sudo apt -fy install ./google-chrome-stable_current_amd64.deb
```

## git

sudo apt install git
git config --global user.name "user name"
git config --global user.email user@email.com

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

sudo apt install gnome-tweak-tool
sudo apt install gnome-shell-extension-dash-to-panel

## wbpy

sudo apt install fcitx-table-wbpy
im-config -s fcitx
sudo cp /usr/share/fcitx/xdg/autostart/fcitx-autostart.desktop /etc/xdg/autostart/

## zsh

```sh
sudo apt install zsh
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh
chsh -s `which zsh`
sudo shutdown -r 0
```

## change PATH language

export LANG=en_US
xdg-user-dirs-gtk-update

export LANG=zh_CN

## exFat

sudo apt instal exfat-fuse

sudo apt install sshfs

## anaconda

```sh
wget https://repo.continuum.io/archive/Anaconda3-4.3.1-Linux-x86_64.sh
bash Anaconda3-4.3.1-Linux-x86_64.sh|sh
```

## synergy

sudo apt-get -fy install ./synergy-v1.8.8-stable-c30301e-Linux-x86_64.deb

## sublime

sudo apt-get -fy install ./sublime-text_build-3126_amd64.deb

## atom

sudo apt-get -fy install ./atom-amd64.deb

## youdao-dict

```sh
sudo apt-get -fy install ./youdao-dict_1.1.0-0-deepin_amd64.deb
wget https://pypi.python.org/packages/48/9a/bcf41728a0a81b3d76e2a873296c2912300c653f9e6453c760a50bd2ef93/python-xlib-0.19.tar.bz2
```

## ModuleNotFoundError

+ No module named 'Xlib'
  pip install python3_xlib

+ No module named 'xdg'
  pip install pyxdg

## wechat

sudo snap install electronic-wechat

File failed to load: /extensions/MathZoom.js

# [install R](R-and-Rstudio)
