---
Title: linux好用软件集
Date: 2015-02-03 10:20
Modified: 2018-07-05 19:30
Category: 小抄速查
Tags: linux, software
Slug: linux-soft
Authors: JT Guo
Summary: 自己用的linux软件以及遇到的问题整理
---
# 1. guake terminal

## 简介

guake terminal， 一个下拉式终端[这里下载](https://github.com/Guake/guake)

## 问题

1. Ctrl+D in the terminal does not close the tab anymore, but freezes the current tab

ubuntu上遇到此问题，解决办法是安装 libutempter0,参考[这里](https://github.com/Guake/guake/issues/1198)

# 2. anaconda

+ 简介

python 的管理工具

+ 问题

1.matplotlib中文显示参数设置

由于matplotlib库中没有中文字体。

将对应的字体[SimHei.tff](https://github.com/StellarCN/scp_zh/blob/master/fonts/SimHei.ttf)拷贝到
~/anaconda3/lib/python3.5/site-packages/matplotlib/mpl-data/fonts/ttf/

在 ~/anaconda3/lib/python3.5/site-packages/matplotlib/mpl-data/matplotlibrc 中，删除font.family和font.sans-serif两行前的#，并在font.sans-serif后添加SimHei
font.family          :sans-serif
font.sans-serif     : SimHei, DejaVu Serif（后面还有很多，略去）
axes.unicode_minus，将True改为False

删除~/.cache/matplotlib字体缓存
