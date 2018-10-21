---
Title: FASTQ格式详解
Date: 2014-12-04 10:20
Modified: 2015-03-06 16:12
Category: 生物信息
Tags: fastq, format
Slug: fastq-format
Authors: JT Guo
Summary: Fastq的格式
---

**FASTQ**是基于文本的，保存生物序列（通常是核酸序列）和其测序质量信息的标准格式。
其序列以及质量信息都是使用一个ASCII字符标示，最初由Sanger开发，目的是将FASTA序列与质量数据放到一起，目前已经成为高通量测序结果的事实标准。

---

# FASTQ基本格式(reads)

* 每条reads包括4行：

1. 序列标识以及相关的描述信息，以‘@’开头；
2. 第二行是序列
3. 第三行以‘+’开头，后面是序列标示符、描述信息，或者什么也不加
4. 第四行，是质量信息，和第二行的序列相对应，每一个序列都有一个质量评分，根据评分体系的不同，每个字符的含义表示的数字也不相同。

```text
1 @SEQ_ID
2 GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT
3 \+
4 !''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>CCCCCCC65
```

## Fastq ID

illumina测序仪的ID行一般包含测序仪、运行编号、flowcell ID、lane ID、tile ID、横纵轴坐标、索引序列等等

> **@HWUSI-EAS100R:6:73:941:1973#0/1**

| HWUSI-EAS100R | the unique instrument name
|:------------:|---------------------------
|    6         | flowcell lane
|    73        | tile number within the flowcell lane
|    941       | ‘x’-coordinate of the cluster within the tile
|    1973      | ‘y’-coordinate of the cluster within the tile
|    \#0       | index number for a multiplexed sample (0 for no indexing)
|    /1        | the member of a pair, /1 or /2 _(paired-end or mate-pair reads only)

## 质量信息

1. 测序仪能够根据荧光信号的强弱, 给定一个碱基的错误概率(error probility, P)
2. 为方便记录, 节约磁盘空间, 把概率P转化为ASCII码([共127个字符]((http://binf.snipcademy.com/binf/img/lessons/dna-file-formats/ascii.svg)))代表质量分数Q
3. P越小,Q越大,质量越好

**最常用的Phred质量转换公式：**
$$Q=-10log_{10}P$$

* 质量分数Q与错误概率P的对应关系见下表：

质量分数(Q) | 错误概率(P)| 准确率
---|---|---
10 | 1 in 10 | 90 %
20 | 1 in 100 | 99 %
30 | 1 in 1000 | 99.9 %
40 | 1 in 10000 | 99.99 %
50 | 1 in 100000 | 99.999 %

**另外还有，Solexa标准：**
$$Q_{solexa-prior to v.1.3}=-10log_{10}\frac{P}{1-P}$$

* 对于每个碱基的质量编码标示，不同的软件采用不同的方案，目前统一用Phred33

![Q](../images/fasq-quality-score.png)

# fastq 质量检测工具

* [fastQC](/BioKits/fastqc)