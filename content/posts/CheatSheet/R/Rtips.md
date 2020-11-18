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
