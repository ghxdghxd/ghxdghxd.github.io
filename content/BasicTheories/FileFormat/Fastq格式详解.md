##### FASTQ是基于文本的，保存生物序列（通常是核酸序列）和其测序质量信息的标准格式。
其序列以及质量信息都是使用一个ASCII字符标示，最初由Sanger开发，目的是将FASTA序列与质量数据放到一起，目前已经成为高通量测序结果的事实标准。

---

# 格式说明

FASTQ文件中每个序列通常有四行：
1. 序列标识以及相关的描述信息，以‘@’开头；
2. 第二行是序列
3. 第三行以‘+’开头，后面是序列标示符、描述信息，或者什么也不加
4. 第四行，是质量信息，和第二行的序列相对应，每一个序列都有一个质量评分，根据评分体系的不同，每个字符的含义表示的数字也不相同。

例如：  
> @SEQ_ID  
  GATTTGGGGTTCAAAGCAGTATCGATCAAATAGTAAATCCATTTGTTCAACTCACAGTTT  
  \+  
  !''*((((***+))%%%++)(%%%%).1***-+*''))**55CCF>>>>>>CCCCCCC65

###  Illumina sequence identifiers

> **@HWUSI-EAS100R:6:73:941:1973#0/1**

HWUSI-EAS100R | the unique instrument name
:------------:|---------------------------
    6         | flowcell lane
    73        | tile number within the flowcell lane
    941       | ‘x’-coordinate of the cluster within the tile 
    1973      | ‘y’-coordinate of the cluster within the tile
    \#0       | index number for a multiplexed sample (0 for no indexing)
    /1        | the member of a pair, /1 or /2 _(paired-end or mate-pair reads only)

> **@EAS139:136:FC706VJ:2:2104:15343:197393 1:Y:18:ATCACG**

EAS139 | the unique instrument name  
:-----:|---  
   136 | the run id  
FC706VJ| the flowcell id  
   2   | flowcell lane  
  2104 | tile number within the flowcell lane  
 15343 | ‘x’-coordinate of the cluster within the tile  
197393 | ‘y’-coordinate of the cluster within the tile  
  1    | the member of a pair, 1 or 2 _(paired-end or mate-pair reads only)_  
  Y    | Y if the read fails filter (read is bad), N otherwise  
  18   | 0 when none of the control bits are on, otherwise it is an even number  
ATCACG | index sequence  

###  NCBI Sequence Read Archive
  
> @SRR001666.1 071112_SLXA-EAS1_s_7:5:1:817:345 length=36
  GGGTGATGGCCGCTGCCGATGGCGTCAAATCCCACC  
  +SRR001666.1 071112_SLXA-EAS1_s_7:5:1:817:345 length=36  
  IIIIIIIIIIIIIIIIIIIIIIIIIIIIII9IG9IC

## 关于质量编码格式

质量评分指的是一个碱基的错误概率的对数值。其最初在Phred拼接软件中定义与使用，其后在许多软件中得到使用。其质量得分与错误概率的对应关系见下表：
+ Phred quality scores are logarithmically linked to error probabilities Phred

Quality Score | Probability of incorrect base call | Base call accuracy  
---|---|---  
10 | 1 in 10 | 90 %  
20 | 1 in 100 | 99 %  
30 | 1 in 1000 | 99.9 %  
40 | 1 in 10000 | 99.99 %  
50 | 1 in 100000 | 99.999 %  
&nbsp;

$$Q=-10log_{10}P$$
> Q: Phred quality scores 
  P: base-calling error probabilities


除了Phred质量得分换算标准，还有就是Solexa标准：
$$Q_{solexa-prior to v.1.3}=-10log_{10}\frac{P}{1-P}$$

两种换算标准的比较：
![center](/assets/compare.png)
Relationship between Q and p using the Sanger (red) and Solexa (black)
equations (described above). The vertical dotted line indicates p = 0.05, or
equivalently, Q ≈ 13.


+ 对于每个碱基的质量编码标示，不同的软件采用不同的方案，目前有5种方案：
  * Sanger，Phred quality score，值的范围从0到92，对应的ASCII码从33到126，但是对于测序数据（raw read data）质量得分通常小于60，序列拼接或者mapping可能用到更大的分数。
  * Solexa/Illumina 1.0, Solexa/Illumina quality score，值的范围从-5到63，对应的ASCII码从59到126，对于测序数据，得分一般在-5到40之间；
  * Illumina 1.3+，[Phred quality scor](http://en.wikipedia.org/wiki/Phred_quality_score "Phred quality score" )e，值的范围从0到62对应的ASCII码从64到126，低于测序数据，得分在0到40之间；
  * Illumina 1.5+，Phred quality score，但是0到2作为另外的标示，详见http://solexaqa.sourceforge.net/questions.htm#illumina
  * Illumina 1.8+

下面是更为直观的表示：

``` SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS.....................................................
      ..........................XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX......................
      ...............................IIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIIII......................
      .................................**J**JJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJJ......................
      LLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLLL....................................................
      !"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\]^_`abcdefghijklmnopqrstuvwxyz{|}~
      |                         |    |        |                              |                     |
     33                        59   64       73                            104                   126
    
     S - Sanger        Phred+33,  raw reads typically (0, 40)
     X - Solexa        Solexa+64, raw reads typically (-5, 40)
     I - Illumina 1.3+ Phred+64,  raw reads typically (0, 40)
     J - Illumina 1.5+ Phred+64,  raw reads typically (3, 40)
        with 0=unused, 1=unused, 2=Read Segment Quality Control Indicator (bold)
        (Note: See discussion above).
     L - Illumina 1.8+ Phred+33,  raw reads typically (0, 41)

```
