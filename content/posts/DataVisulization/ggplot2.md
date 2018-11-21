---
Title: ggplot2应用与结构解析
Date: 2018/11/1 下午8:54:20
Modified: 2018/11/1 下午8:54:20
Category: 数据可视化
Tags: ggplot2, R
Slug: ggplot2
Authors: JT Guo
Summary: ggplot2的一般应用，文件结构解析，添加扩展功能
---

# tips

## 多层的图例

```R
scale_colour_manual(values = c("CHB" = '#E41A1C', "MXL" = "#377EB8", "CEU" = "#377EB8",
                    "ASW" = "#984EA3","YRI"="#FF7F00", "TCGA" = "gray"),
                    breaks = c("TCGA", "CEU", "CHB", "ASW", "MXL", "YRI"))
# values 增加多图例
# breaks 图例排序
```

## count

```R
y=..count..
```