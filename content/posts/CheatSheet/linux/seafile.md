---
Title: Seafile
Date: 2019-07-31 10:20
Modified: 2019-07-31 19:30
Category: linux
Tags: seafile
Slug: seafile
Authors: JT Guo
Summary: seafile
---

# 首先

查看 8082端口有没有开

```sh
service iptables status
```

# 备份与恢复

```sh
# backup
mysqldump -h 127.0.0.1 -uroot -p[root_passwd] --opt ccnet-db > ~jintao/ccnet-db.sql.`date +"%Y-%m-%d-%H-%M-%S"`
mysqldump -h 127.0.0.1 -uroot -p[root_passwd] --opt seafile-db > ~jintao/seafile-db.sql.`date +"%Y-%m-%d-%H-%M-%S"`
mysqldump -h 127.0.0.1 -uroot -p[root_passwd] --opt seahub-db > ~jintao/seahub-db.sql.`date +"%Y-%m-%d-%H-%M-%S"`

# recovery
mysql -uroot -p[root_passwd] ccnet-db < ccnet-db.sql.2013-10-19-16-00-05
mysql -uroot -p[root_passwd] seafile-db < seafile-db.sql.2013-10-19-16-00-20
mysql -uroot -p[root_passwd] seahub-db < seahub-db.sql.2013-10-19-16-01-05
```

# gunicorn.conf

```text
bind = "0.0.0.0:8000"
```
