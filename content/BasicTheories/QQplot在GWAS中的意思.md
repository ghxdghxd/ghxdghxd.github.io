Q-Q plot 即Quantile-Quantile Plot。它在各类研究中经常用到，主要是直观的表示观测值与预测值之间的差异。

在SPSS中很容做，Analysis - Descriptive statistics - Q-Qplot。

Q-Q plot主要是用来估计数量性状观测值与预测值之间的差异。一般我们所取得的数量性状数据都为正态分布数据。在GWAS研究中Q-Q
plot的X和Y轴主要是代表各个SNP的-lg P values。预测的线是一条从原点发出的45°角的虚线。实际观测值则是标的实心点。

Q-Q plot主要要点：

预测的虚线为什么是45°出来的呢？因为预测的线实际是通过在QQ图中第一象限作图得出。理论上一个点A在该图上的位置应该是A预测值=A实际值，转化为坐标就是A（x，y）x=y。所以预测的线是一条从原点发出的45°线。

观测值的点的坐标是怎么得出来的。同样设点A的坐标是（x，y）x为预测值，y为实际观测值。查了一下R 中qq plot的算法是这样的

```r
pvals <- read.table("DGI_chr3_pvals.txt", header=T)

observed <- sort(pvals$PVAL)
lobs <- -(log10(observed))

expected <- c(1:length(observed))
lexp <- -(log10(expected / (length(expected)+1)))
```
具体解释是这样的，先把P值从小到大排序。lobs代表纵坐标，lexp代表横坐标，纵坐标就是观测P值的-
log10，而横坐标则根据P值数目而定。比如，当只有3个P值 P1=0.0001 P2=0.001
P3=0.01，那么在这个P值组中，length(observed)=3，对于P1=0.0001 expected=1
lexp=-log10（1/3+1），对于P2=0.001 expected=2 lexp=-log10（2/3+1）， P3=0.01
expected=3 lexp=-log10（3/3+1）。。。。。依此类推。

如果出现了偏离的情况说明实际值跟预测值有偏差，在GWAS研究中，那个SNP点出现了较大的偏离，则认为这个SNP位点的观测值的偏离是由这个SNP突变所产生的遗传作用造成的
