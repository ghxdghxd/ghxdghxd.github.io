---
Title: libatk
Date: 2018/11/5 12:23:52
Modified: 2018/11/5 12:23:52
Category: 小抄速查
Tags: error, libatk
Slug: libatk
Authors: JT Guo
Summary: /usr/lib/x86_64-linux-gnu/libatk-1.0.so.0: undefined symbol: g_log_structured_standard
---

# /usr/lib/x86_64-linux-gnu/libatk-1.0.so.0: undefined symbol: g_log_structured_standard

## 来源

1. Rstudio visNetwork导出html动态图

## 解决

```sh
# ubuntu
apt install libatk1.0-dev

```
