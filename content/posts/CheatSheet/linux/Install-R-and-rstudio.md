---
Title: R与Rstudio的安装过程（ubuntu）
Date: 2014-11-13 10:20
Modified: 2017-2-05 19:30
Category: 小抄速查
Tags: R, Rstudio
Slug: R-and-Rstudio
Authors: JT Guo
Summary: ubuntu安装R与Rstudio的过程
---
# install R

+ error

```bash
File failed to load: /extensions/MathZoom.js
export CFLAGS="-I/share/apps/R_depends/include"
export LDFLAGS="-L/share/apps/R_depends/lib"

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:/share/apps/R_depends/lib
```

<!--more-->

## before

```shell
apt-get build-dep r-base-core
```

## ./configure

```shell
./configure --prefix=/opt/R-3.3.1 --enable-R-shlib --with-libpng --with-jpeglib --with-libtiff --with-x --with-tcltk \
--with-blas --with-lapack # 提高矩阵速度
```

### 1. configure: error: No F77 compiler found

```shell
sudo apt-get install gfortran
```

### 2. configure: error: --with-readline

```shell
sudo apt-get install libreadline-dev
```

### 3. configure: error: --with-x=yes

```shell
sudo apt-get install libxt-dev
```

### 4. checking whether zlib support suffices

```shell
sudo apt-get install zlib1g-dev
```

### 5. checking whether bzip2 support suffices

```shell
wget <http://www.bzip.org/1.0.6/bzip2-1.0.6.tar.gz>
tar xvf bzip2-1.0.6.tar.gz
cd bzip2-1.0.6
sudo make install
# OR
make -f Makefile-libbz2_so
make clean
make -n install PREFIX=$R_depends
make install PREFIX=$R_depends
install bzip2-lib
```

### 6. configure: error: "liblzma

```shell
sudo apt-get install liblzma-dev
```

### 7. configure: error: pcre &gt;= 8.10

```shell
wget ftp://ftp.csx.cam.ac.uk/pub/software/programming/pcre/pcre-8.39.tar.gz
tar xvf pcre-8.39.tar.gz
cd pcre-8.39
./configure --enable-utf8 --prefix=$R_depends
make &amp; sudo make install
```

### 8. libcurl &gt;= 7.28.0 library and headers are required with support for https

```shell
wget https://www.openssl.org/source/openssl-1.1.0b.tar.gz
tar xvf openssl-1.1.0b.tar.gz
cd openssl-1.1.0b
./config
make &amp;  sudo make install
wget <https://curl.haxx.se/download/curl-7.50.3.tar.gz>
tar xvf curl-7.50.3.tar.gz
cd curl-7.50.3
./configure --with-ssl=/usr/local/ssl/
make &amp; sudo make install
```

### 9.configure: WARNING: you cannot build info or HTML versions of the R manuals

```shell
sudo apt-get install texinfo
```

### 10. configure: WARNING: you cannot build PDF versions of the R manuals, configure: WARNING: you cannot build PDF versions of vignettes and help pages

```shell
sudo apt-get install texlive
```

### 11. configure: WARNING: neither inconsolata.sty nor zi4.sty found: PDF vignettes and package manuals will not be rendered optimally

```shell
wget <http://mirrors.ctan.org/install/fonts/inconsolata.tds.zip>
sudo mv inconsolata.tds.zip /usr/share/texlive/texmf-dist/tex/latex
cd /usr/share/texlive/texmf-dist/tex/latex
unzip inconsolata.tds.zip
sudo mktexlsr
```

### 12. 本版本不支持png

```shell
sudo apt-get install libpng16-dev
sudo apt-get install libtiff5-dev
```

## make

### 1./usr/local/lib/libbz2.a: 无法添加符号: 错误的值

```shell
rm /usr/local/lib/libbz2.a
wget <http://zlib.net/zlib-1.2.8.tar.gz>
tar xvf zlib-1.2.8.tar.gz
cd zlib-1.2.8
CC='gcc -fPIC'
./configure; make test
sudo make install
```

### 2./usr/bin/ld: cannot find -lbz2 ;  collect2: error: ld returned 1 exit status

```shell
sudo apt-get install libbz2-dev
# 会用到
make CC='gcc -fPIC'
make install PREFIX=/software/packages
```

## make install

### 1.conftest.c:1:17: fatal error: jni.h

```shell
cd R-3.3.1/doc
wget <https://cran.r-project.org/doc/manuals/r-release/NEWS.pdf>
```

## install rstudio

```shell
sudo apt-get install libjpeg62-dev
sudo apt-get install libgstreamer0.10-0
sudo apt-get install libgstreamer-plugins-base0.10-0
export RSTUDIO_WHICH_R="/opt/R-3.3.1/bin/R" 添加到/etc/profile或~/.profile
```

### run R

### Error in grid.Call(L_textBounds, as.graphicsAnnot(xlabel),xlabel),x x, x$y, :无法载入X11字面为2,大小为20的字形-*-courier-%s-%s-*-*-%d-*-*-*-*-*-*-*

```shell
sudo apt-get install t1-xfree86-nonfree ttf-xfree86-nonfree ttf-xfree86-nonfree-syriac
sudo apt-get install xfonts-75dpi
sudo apt-get install xfonts-100dpi
sudo apt-get install mesa-utils
sudo apt-get install libxtst-dev
```

### using R

### 无法载入共享目标对象 stringi.so

```shell
install.packages(stringi)
```

### R install.packages returns "failed to create lock directory"

```shell
R CMD INSTALL --no-lock &lt;pkg&gt;
# OR
install.packages("Rcpp", dependencies=TRUE, INSTALL_opts = c('\--no-lock'))
```

### An irrecoverable exception occurred. R is aborting now ... ERROR: loading failed

```shell
R CMD INSTALL --no-test-load *packages*
```

### nlopt

```shell
./configure --enable-shared
make
make install
```

### semi-transparency is not supported on this device

```shell
sudo apt install libcairo2-dev
```

### configure: error: missing required header GL/gl.h, configure: error: missing required header GL/glu.h

```shell
sudo apt install mesa-common-dev
sudo apt install libglu1-mesa-dev
```

### install units based on udunits2

```shell
conda install udunits2
```

```R
install.packages(install.packages("units",
    configure.args="--with-udunits2-lib=/share/apps/anaconda3/lib --with-udunits2-include=/share/apps/anaconda3/include"))
```
