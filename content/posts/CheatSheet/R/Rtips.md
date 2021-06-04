---
Title: R
Date: 2016-10-12 21:52
Modified: 2018-01-13 10:02
Category: 小抄速查
Tags: R
Slug: R
Authors: JT Guo
Summary: R的常用命令
---
# R的常用命令

## 字符串操作

### 替换sub, gsub, chart

```R
chartr("Ab","aB",text)
```

### 查找grep, grepl

* 向量操作
* grep返回index
* grepl返回TRUE/FALSE

## R动态变量

```r
#动态生成变量，并赋值
assign(x, value)
```

## 显示颜色

```R
library(scales)
show_col(pal_d3("category10")(10)[c(1:6,8)])
```

## Reduce

```R
# 依次合并
geno <- Reduce(function(x, y, ...) merge(x, y, ...), geno)
```

## kmeans cluster

```R
#要是没有这个包的话，首先需要安装一下
#install.packages("factoextra")
#载入包
library(factoextra)
# 载入数据
data("USArrests") 
# 数据进行标准化
df <- scale(USArrests) 
# 查看数据的前五行
head(df, n = 5)
               Murder   Assault   UrbanPop         Rape
Alabama    1.24256408 0.7828393 -0.5209066 -0.003416473
Alaska     0.50786248 1.1068225 -1.2117642  2.484202941
Arizona    0.07163341 1.4788032  0.9989801  1.042878388
Arkansas   0.23234938 0.2308680 -1.0735927 -0.184916602
California 0.27826823 1.2628144  1.7589234  2.067820292
#确定最佳聚类数目
fviz_nbclust(df, kmeans, method = "wss") + geom_vline(xintercept = 4, linetype = 2)
```
