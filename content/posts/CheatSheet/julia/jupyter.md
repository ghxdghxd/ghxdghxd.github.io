---
Title: jupyter
Date: 2019-10-21 15:13:23
Modified: 2019/1/21 15:13:23
Category: 分类
Tags: 标签
Slug: 唯一ID
Authors: JT Guo
Summary: 简介
---
# jupyter 添加 kernel

## add julia

```julia
ENV["JUPYTER"]="PATH-To-julia"
Pkg.add("IJulia")
```

## add R

```r
install.packages("IRkernel")
IRkernel::installspec()
```
