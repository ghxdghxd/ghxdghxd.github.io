---
Title: ATAC测序
Date: 2018/12/1 14:30:07
Modified: 2018/12/1 14:30:07
Category: 生物信息
Tags: ATAC
Slug: ATACseq
Authors: JT Guo
Summary: 简介ATAC的原理及分析方法
---
# 概念

## 染色质开放区域

1. 染色质分为常染色质和异染色质，常染色质折叠压缩程度低，处于伸展状态；异染色质折叠压缩程度高，处于聚缩状态。
2. 常染色质(“打开的染色质”)，称为开放染色质（open chromatin）
    + 染色质打开后，有足够的区域允许一些调控蛋白（比如转录因子和辅因子）与DNA结合; 如DNA复制、基因转录
    + 染色质的这种特性，叫做染色质的可接近性（chromatin accessibility）
    + 通过研究细胞特定状态下开放的染色质区域可以在 DNA 水平上了解其转录调控。
3. DNA转座，是一种把DNA序列从染色体的一个区域搬运到另外一个区域的现象，这一过程就由转座酶参与完成。
4. Tn5转座酶: "标签片段化工具"，Tn5转座体可将其衔接子负载整合到可接近的染色质区域，而空间位阻较不可接近的染色质使得转座不可能发生。
    + 特异性识别转座子两端反向重复的ME序列(Mosaic End)，形成转座复合体后随机的将转座子插入靶DNA中

# ATAC的原理

ATAC-seq是利用Tn5转座酶把将携带已知DNA序列标签的转座复合物，加入到细胞核中，再利用已知序列的标签进行PCR建库测序，来获得开放染色质区域。

## ATAC建库

> illumina建库试剂盒（TruePrepTM Index Kit V2）

1. Tn5转座子，切割开放染色质，在DNA两端添加如下序列，其中加粗斜体部分紧挨着文库的插入片段序列
    + Read1 5' ----> 3'
        TCGTCGGCAGCGTC**AGATGTGTATAAGAGACAG**
    + Read2 5' ----> 3'
        GTCTCGTGGGCTCGG**AGATGTGTATAAGAGACAG**

2. PCR扩增连接测序接头P5、P7, 以锚定在flowcell芯片上的接头,进行测序
    ![atac](/images/atac1.png){style="width: 60%;"}
    + P5
        AATGATACGGCGACCACCGAGATCTACAC-**i5**-TCGTCGGCAGCGTCAGATGTGTATAAGAGACAG
    + P7
        CAAGCAGAAGACGGCATACGAGAT-**i7**-GTCTCGTGGGCTCGGAGATGTGTATAAGAGACAG

3. 完整结构

![atac2](/images/atac2.png){style="width: 60%;"}

5’-AATGATACGGCGACCACCGAGATCTACAC-**i5**-TCGTCGGCAGCGTCAGATGTGTATAAGAGACAG-NNNNNN-CTGTCTCTTATACACATCTCCGAGCCCACGAGAC-**i7**-ATCTCGTATGCCGTCTTCTGCTTG-3’

**i5**, **i7**为8个碱基序列，**NNNNNN**: 目标区域序列

## ATAC分析

1. 去接头

```sh
cat NexteraPE-PE.fa
# >PrefixNX/1
# AGATGTGTATAAGAGACAG
# >PrefixNX/2
# AGATGTGTATAAGAGACAG
# >Trans1
# TCGTCGGCAGCGTCAGATGTGTATAAGAGACAG
# >Trans1_rc
# CTGTCTCTTATACACATCTGACGCTGCCGACGA
# >Trans2
# GTCTCGTGGGCTCGGAGATGTGTATAAGAGACAG
# >Trans2_rc
# CTGTCTCTTATACACATCTCCGAGCCCACGAGAC

skewer -f sanger -t 20 -m pe -x NexteraPE-PE.fa --quiet -o <sampleName> <R1.fastq.gz> <R2.fastq.gz>
```