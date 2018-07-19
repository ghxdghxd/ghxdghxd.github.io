---
Title: fedora常用配置
Date: 2014-11-13 10:20
Modified: 2018-1-27 10:27
Category: 系统管理
Tags: fedora, linux, R, install
Slug: fedora-install
Authors: JT Guo
Summary: fedora常用安装与配置
---
# config fedora

sudo rm -rf /opt
sudo dnf install yum-utils

* package-cleanup --oldkernels

## RPM Fusion Free/Nonfree源, FZUG源

```sh
version=27  
sudo dnf config-manager --add-repo=http://mirrors.aliyun.com/repo/fedora.repo  
sudo dnf install http://download1.rpmfusion.org/free/fedora/rpmfusion-free-release-$version.noarch.rpm -y  
sudo dnf install http://download1.rpmfusion.org/nonfree/fedora/rpmfusion-nonfree-release-$version.noarch.rpm -y  
sudo dnf install https://repo.fdzh.org/FZUG/free/$version/x86_64/noarch/fzug-release-$version-0.2.noarch.rpm -y  
sudo dnf makecache
```

## upgrade

sudo dnf check-update & sudo dnf upgrade  
sudo dnf install sqlite  

## disable Wayland

/etc/gdm/custom.conf  
WaylandEnable=false  

## chrome

```sh
wget https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm  
sudo dnf install ./google-chrome-stable_current_x86_64.rpm  
```

## git

sudo dnf install git  
git config --global user.name "ghxdghxd"  
git config --global user.email guojt-4451@163.com  

## guake

sudo dnf install guake  

## gnome-tweak-tool

sudo dnf install gnome-tweak-tool  
sudo dnf install chrome-gnome-shell  
dashtodocky  
Topicons plus  

## wbpy

sudo dnf install fcitx-table-chinese  
sudo dnf install fcitx-configtool  
sudo dnf install im-chooser  
im-chooser  

## zsh

```sh
sudo apt install zsh  
wget https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh -O - | zsh  
chsh -s /bin/zsh  
```

## change PATH language

export LANG=en_US  
xdg-user-dirs-gtk-update  
export LANG=zh_CN  
reboot  

## install ubuntu fonts

```sh
sudo dnf install ttmkfdir  
fontname=ubuntu-font-family-0.83  
wget http://font.ubuntu.com/download/$fontname.zip  
mkdir /tmp/$fontname  
unzip -j $fontname.zip -d /tmp/$fontname  
sudo mkdir /usr/share/fonts/ubuntu  
sudo mv /tmp/$fontname/*.ttf /usr/share/fonts/ubuntu  
rm -rf /tmp/$fontname  
cd /usr/share/fonts/ubuntu  
ttmkfdir > fonts.dir  
fc-cache -fv  
```

## exFat & sshfs

sudo dnf install exfat-utils  
sudo dnf install fuse-exfat  
sudo apt install sshfs  

## synergy

```sh
wget https://binaries.symless.com/v1.8.8/synergy-v1.8.8-stable-25a8cb2-Linux-x86_64.rpm  
sudo dnf install ./synergy-v1.8.8-stable-25a8cb2-Linux-x86_64.rpm  
```

## sublime text

```sh
sudo rpm -v --import https://download.sublimetext.com/sublimehq-rpm-pub.gpg  
sudo dnf config-manager --add-repo https://download.sublimetext.com/rpm/stable/x86_64/sublime-text.repo  
sudo dnf update  
sudo dnf install sublime-text  
```

## anaconda

```sh
wget https://repo.continuum.io/archive/Anaconda3-5.0.0.1-Linux-x86_64.sh  
bash Anaconda3-4.3.1-Linux-x86_64.sh|sh  
```

## zotero

```sh
wget https://download.zotero.org/client/release/5.0.23/https://download.zotero.org/client/release/5.0.23/Zotero-5.0.23_linux-x86_64.tar.bz2  
tar xvf Zotero-5.0.23_linux-x86_64.tar.bz2  
sudo mv Zotero_linux-x86_64/  

cp /share/apps/Zotero_linux-x86_64/zotero.desktop /usr/share/applications  

git clone https://github.com/jlegewie/zotfile.git  
cd zotfile  
make  
```

## wewechat

## thunderbird

sudo dnf install thunderbird-enigmail  

## atom

sudo dnf --assumeyes install make gcc gcc-c++ glibc-devel git-core libsecret-devel rpmdevtools libX11-devel libxkbfile-devel  
sudo dnf install ./atom.x86_64.rpm  

## wordpress

sudo dnf install -y php php-mysqlnd mysql mysql-server mysql-devel workpress  

sudo systemctl enable httpd.service mariadb.service  
sudo systemctl start httpd.service mariadb.service  

sudo mysqladmin -u root password  

vi /etc/httpd/conf.d/wordpress.conf  
Require local ======>  Require all granted  

sudo firewall-cmd --add-service=http --permanent  
sudo firewall-cmd --reload  

## ModuleNotFoundError: No module named 'Xlib'

pip install python3_xlib

## ModuleNotFoundError: No module named 'xdg'

pip install pyxdg  

File failed to load: /extensions/MathZoom.jsrs  

# install R

参考[这里](/R-and-Rstudio.html)