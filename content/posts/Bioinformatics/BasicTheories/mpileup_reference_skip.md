---
Title: mpileup格式
Date: 2017-03-04 14:38
Modified: 2017-03-04 14:33
Category: 生物信息
Tags: samtools, mpileup
Slug: mpileup
Authors: JT Guo
Summary: samtools mpileup的格式
---

# mpileup

mpileup 结果中的 >, <; 代表reference skip, 基因组上没有的序列，  the reference position is
bridged by reference skip.

计算depth要减去reference skip数目
