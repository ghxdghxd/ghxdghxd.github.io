---
Title: 如何根据测序数据计算出数据量以及测序深度？
Date: 2014-12-04 16:35
Modified: 2016-02-29 20:40
Category: 理论基础
Tags: NGS
Slug: NGS-coverage
Authors: JT Guo
Summary: 根据测序数据(reads)统计数据量以及测序深度
---
1. 数据量大小

**单端测序** 数据量 = reads长度 * reads数
**双端测序** 数据量 = 单端reads长度 \* 单端reads个数 \* 2

注：**单位换算** 1个碱基=1bp 1kb=1024bp 1M=1024kb 1G=1024M

2.测序深度

测序深度 = 数据量大小 / 参考基因组大小

3.测序与物理覆盖度

在PE测序文库中

![coverage](images/coverage.png)