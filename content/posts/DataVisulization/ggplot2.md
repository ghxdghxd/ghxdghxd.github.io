---
Title: ggplot2应用与结构解析
Date: 2018/11/1 20:54:20
Modified: 2018/11/1 20:54:20
Category: 数据可视化
Tags: ggplot2, R
Slug: ggplot2
Authors: JT Guo
Summary: ggplot2的一般应用，文件结构解析，添加扩展功能
---

* ggplot2的一般代码
* ggtable的结构解析
* ggplot2的扩展

# ggplot2一般应用

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

## ylim(-100, 120) 可以产生中空圆图

## geom_bar

* position = "stack"
* position = "dodge"
* position = "identity"

# ggtable结构解析

## ggplot2 格式转换 ggtable

```R
g <- ggplot_gtable(ggplot_build(p))
head(g)
## TableGrob (6 x 13) "layout": 6 grobs
##   z     cells       name                                   grob
## 1  3 (6-6,5-5) axis-t-1-1                         zeroGrob[NULL]
## 2  3 (6-6,9-9) axis-t-2-1                         zeroGrob[NULL]
## 3  4 (5-5,5-9)     xlab-t                         zeroGrob[NULL]
## 4  9 (4-4,5-9)   subtitle zeroGrob[plot.subtitle..zeroGrob.3885]
## 5 10 (3-3,5-9)      title    zeroGrob[plot.title..zeroGrob.3884]
## 6 12 (2-2,2-2)        tag      zeroGrob[plot.tag..zeroGrob.3886]
```

## grobs图形元素(graphical elements)

`g$grobs`是包括`length(g)`个图形元素，每个grob是gtable定义的表格布局，它们能够相互重叠/堆叠成

```R
head(g$grobs)
## [[1]]
## rect[plot.background..rect.3889]
## [[2]]
## gTree[panel-1.gTree.3594]
## [[3]]
## gTree[panel-3.gTree.3620]
## [[4]]
## gTree[panel-5.gTree.3646]
## [[5]]
## gTree[panel-7.gTree.3672]
## [[6]]
## gTree[panel-2.gTree.3607]
```

## layout图形元素位置的数据框, 保存每一个grob在图中的位置

* t, l, b, r 分别是上左下右, z是绘制顺序
* name格式(2-4不一定有)
  1. 图形的定义名称(panel, strip)
  2. 上下左右位置
  3. 从左到右顺序
  4. 从上向下顺序

```R
head(g$layout)
##     t l  b  r z clip       name
## 58  1 1 30 13 0   on background
## 1   8 5  8  5 1   on  panel-1-1
## 2  13 5 13  5 1   on  panel-2-1
## 3  18 5 18  5 1   on  panel-1-2
## 4  23 5 23  5 1   on  panel-2-2
## 5   8 9  8  9 1   on  panel-1-3
```

* widths, heights图形元素大小

# ggplot2的扩展