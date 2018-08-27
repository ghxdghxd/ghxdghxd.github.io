---
Title: 登录终端信息
Date: 2014-12-04 16:20
Modified: 2016-03-09 22:07
Category: 系统管理
Tags: linux, terminal
Slug: terminal-announcement
Authors: JT Guo
Summary: 登录终端显示提示信息
---

# /etc/issue

在终端接口登录时候的提示字符,例如：

```sh
[root@linux ~] cat /etc/issue
CentOS release 5.6 (Final)
Kernel \r on an \m

issue内各代码说明：
\d  本地端时间的日期
\l  显示第几个终端接口
\m  显示硬件的等级
\n  显示主机的网络名称
\o  显示域名
\r  操作系统的版本
\t  显示本地端的时间
\s  操作系统的名称
\v  操作系统的版本
```

# /etc/motd

登录后的公告消息, 比如：系统将会在某个时间进行维护

```sh
[root@linux ~] vi /etc/motd
    Hello everyone,
    Our server will be maintained at
    please don't login at that time,thanks.
    那么当用户登录的时候，就会显示设置的内容了。
```
