---
Title: ggvis使用
Date: 2019/1/15 上午10:43:58
Modified: 2019/1/15 上午10:43:58
Category: 数据可视化
Tags: ggvis, R
Slug: ggvis
Authors: JT Guo
Summary: ggvis的简单使用
---

# ggvis

```R
mtcars %>% ggvis(~wt, ~mpg) %>% layer_points(size := 25, shape := "diamond", stroke := "red", fill := NA)

mtcars %>% ggvis(~wt, ~mpg, fill = ~factor(cyl)) %>% layer_points() %>% group_by(cyl) %>% layer_model_predictions(model = "lm") %>%
```

## 多个legend

```r
add_relative_scales() %>%
    add_legend("fill", title = "-log10(qvalue)",
               properties = legend_props(legend = list( x = scaled_value("x_rel", 1), y = scaled_value("y_rel", 0.7))))
```