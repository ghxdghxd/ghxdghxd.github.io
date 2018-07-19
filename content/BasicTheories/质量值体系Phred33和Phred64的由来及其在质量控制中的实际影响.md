---
Title: 质量值体系
Date: 2017-1-05 16:04
Modified: 2017-1-05 16:04
Category: 理论基础
Tags: fastq, QC, phred
Slug: phred
Authors: JT Guo
Summary: 质量值体系 Phred33 和 Phred 64
---
# 质量值体系

相比之前培训时所学的质控内容, (我拿到的) 流程中还多了一步 `phred33to64`, 也就是把 .fastq 格式的数据从 Phred33
质量值体系转换为 Phred64 质量体系, 于是先补充学习了下质量值体系:

首先要从质量值说起, 测序仪器下机数据的 fastq 文件中, 每条序列都对应了相同长度的质量值, 反映出每个碱基的准确性和可靠性, (现在主流用的)
计算公式为:

Q = -10log10p

而这个 p 值就是 Phred 计算出来的, 表示一个碱基被识别错误的可能性, Phred 一开始是一个软件 (或者说计算方法),
对测序仪器识别到的荧光强度 (三代的不了解) 进行评估, 针对不同仪器有不同的标准表, 然后根据表中荧光强度的范围和分辨率分析得出碱基的 p 值,
由于比较可靠, 逐渐被各大公司采纳 (以上脑补翻译自 [Phred quality
score](https://en.wikipedia.org/wiki/Phred_quality_score) 和 [Phred base
calling](https://en.wikipedia.org/wiki/Phred_base_calling))

反正, Q 值为 10 就表示这个碱基有 90% 的概率是正确的, 20 就是 99%, 40 就是 4 个 9, 很好记, 相信大家也都很熟悉

但是这时候问题就来了, 因为一个碱基对应一个质量值, 可 Q 值可以是一位数也可以是两位数, 连在一起的话就分不出哪个对应哪个碱基
(比如某两个碱基的质量值序列为 123 , 则可能为 1|23 或 12 | 3, 当然这是个极端的例子), 此外也浪费存储空间, 因为一个数字只有 10
种可能性, 却要占去一个字符位, 而一个字节有 8 位, 理论上已经可以代表 256 种状态, 这还没换算一个字符要占多少字节,
因此就会把碱基质量值转换为相应的 ASCII 码, 这是计算机中最基本的一套字符体系, 用来把常用符号 (共 127 个) 转为二进制以便于机器使用,
ASCII 码表见 [ASCII code chart](http://binf.snipcademy.com/binf/img/lessons/dna-file-formats/ascii.svg), 这样一个字符就可以搞定了, 很方便很省事

但是这时候问题又来了, 最理想的情况当然是直接把质量值作为序号找出对应的那个 ASCII 码, 比如质量值为 40 就换成十进制 40 对应的 ASCII
码,可惜质量值根据测序仪公司的标准不同, 范围也各不相同, 基本都包括了 0 至 40 的区间, 甚至还可能是负值, 这就没法愉快地玩耍了, 而且人家
ASCII 码表也不配合, 0 到 31 对应的都是些控制字符 (比如回车, 退格), 根本不适合打印和保存, 可打印的都得从 32 号排起 (参见[ASCII printable code
chart](https://en.wikipedia.org/wiki/ASCII#ASCII_printable_code_chart)),
所以各家测序仪器公司就把质量值再加上某个固定值作为 ASCII 码转换成了可打印字符从而保存在 FASTQ 文件中

可是问题还没有完, 这个固定值是多少好呢, 各家公司是竞争对手, 怎么可能你用什么我也用什么, 所以 Sanger 公司加了 33, 也就是质量值为 0
就转换成 ASCII 码 33, 查表可知为 `!`, 也即从可打印的字符开始 (排除了空格), 这就是现在所谓的 Phred33 体系, 当时的
Solexa (后来被 Illumina 收购) 公司就偏不用 33 (此处为个人脑补), 偏要加个 64, 这样质量值为 0 就用 `@` 表示, 后面从
1 开始的就依次对应了 ABCD, 于是就成了 Phred64 体系, 至于当时三巨头的另一家测序仪公司 454 Life Sciences (后被
Roche 收购) 就更绝, 人家从碱基开始就不用 ACTG 表示, 直接整了个 ColorSpace 体系出来, 根本不和你们玩, (话说 Color
Space 这玩意儿曾经把我狠狠地坑了好久), 当然后来大家也不跟 454 玩了, 最后他也就没得玩了

回到质量值体系, 这样就由 Sanger 公司和 Illumina 公司产生了 Phred33 体系和 Phred64 体系, 两家互相拗着,
这就辛苦了写生物信息分析软件的人, 两种质量体系都要考虑, 当然好一点的软件都是有参数接受体系类型的, 更好一点的软件就会自动判断体系类型进行对应转换

本来就这样结束的话也算是个圆满的故事了, 可是墨菲他老人家不高兴了 ([Murphy's
law](https://en.wikipedia.org/wiki/Murphy's_law)), 所以在 2011 年, Illumina
公司表示他们又要改成 Phred33 体系了 ([Upcoming changes in
CASAVA](http://seqanswers.com/forums/showthread.php?s=ba8c7dfba863815f637c0bf45882f14b&t=8895)),
真是大(wo)快(le)人(ge)心(qu)啊! 这么来回一折腾, 结果还是回到了最初的起点, 与老基友相拥而泣了, Phred33 一统江湖!
(当然实际上现在 Ilumina 的 Phred33 和最初 Sanger 的 Phred33 还是有点区别的, 详见后文)

扯了这么多, 发现写了半天才刚交代完故事背景, 剩下的部分就等有空再写了, 最后上点干货:

先是 wikipedia 上非常直观的示例, 可以看出各家公司各个版本的质量值体系

```sh
      SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....................................................
      ..........................XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX......................
      ...............................IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII......................
      .................................JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ......................
      LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL....................................................
      !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
      |                         |    |        |                              |                     |
     33                        59   64       73                            104                   126
      0........................26...31.......40                                
                               -5....0........9.............................40 
                                     0........9.............................40 
                                        3.....9.............................40 
      0.2......................26...31........41                              

     S - Sanger        Phred+33,  raw reads typically (0, 40)
     X - Solexa        Solexa+64, raw reads typically (-5, 40)
     I - Illumina 1.3+ Phred+64,  raw reads typically (0, 40)
     J - Illumina 1.5+ Phred+64,  raw reads typically (3, 40)
         with 0=unused, 1=unused, 2=Read Segment Quality Control Indicator (bold) 
         (Note: See discussion above).
     L - Illumina 1.8+ Phred+33,  raw reads typically (0, 41)

然后光看也没什么用啊, 就[有人写了个小函数](http://onetipperday.blogspot.com.br/2012/10/code-snip-
to-decide-phred-encoding-of.html), 用来分析 fastq 文件 (压缩或未压缩均可), 代码如下:
    fqtype () {
            less $1 | head -n 999 | awk '{if(NR%4==0) printf("%s",$0);}' \
            | od -A n -t u1 -v \
            | awk 'BEGIN{min=100;max=0;}\
            {for(i=1;i<=NF;i++) {if($i>max) max=$i; if($i<min) min=$i;}}END\
            {if(max<=74 && min<59) print "Phred+33"; \
            else if(max>73 && min>=64) print "Phred+64"; \
            else if(min>=59 && min<64 && max>73) print "Solexa+64"; \
            else print "Unknown score encoding"; \
            print "( " min ", " max, ")";}'
    }
```

写在 shell 配置文件里, `source` 然后 `fqtype <fastq_file>` 就行了, 这个代码有点老, 还没加 [35, 75]
的判断, 我又懒得重新改判断逻辑, 所以直接在最后加了个打印最小值最大值, 再跟上面的示例一比, 就基本确定是什么体系了

关于这两种体系对我们实际流程的影响和分析, 请听下回分解

转自：<http://not.farbox.com/post/phred_p1>

感觉写的很好理解，特此谢谢。
