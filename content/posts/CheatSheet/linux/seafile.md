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

# docker 安装 seafile

```shell
yum install docker-compose -y
wget https://download.seafile.com/d/320e8adf90fa43ad8fee/files/?p=/docker/docker-compose.yml

# 修改
MySQL root 用户的密码 (MYSQL_ROOT_PASSWORD and DB_ROOT_PASSWD)
持久化存储 MySQL 数据的 volumes 目录 (volumes)
/public/tool/seafile/seafile-mysql/db:/var/lib/mysql
持久化存储 Seafile 数据的 volumes 目录 (volumes)
/public/tool/seafile/seafile-data:/shared

# 开启webdav, seafile/seafile-data/seafile/conf/seafdav.confco
[WEBDAV]
enabled = true
port = 8080
fastcgi = true
share_name = /

ports:
    - "sea:80"   # 网页与客户端登录
    - "8082:8082" # 文件上传下载 ==> seahub_settings.py
    - "dav:8080"    # webdav

SEAFILE_SERVER_HOSTNAME=IP

docker-compose up -d

# 升级
docker-compose pull
docker-compose down
docker-compose up -d

# 清理缓存
docker exec 9bb836e6b5d1 /scripts/gc.sh
```

## 不显示头像

系统管理，设置，更改SERVICE_URL为"http://IP:port", 然后重启seafile

# 首先配置

>/public/tool/seafile/seafile-data/seafile/conf

## gunicorn.conf

```text
bind = "0.0.0.0:8000"
```

## seafdav.conf

授权第三方应用利用 WebDAV 协议访问团队的文件

```text
[WEBDAV]
enabled = true
port = 8080
fastcgi = true
share_name = /
```

## seafile.conf

```text
[quota]
# 单位为 GB
default = 2
```

## seahub_settings.py

```text
FILE_SERVER_ROOT = "http://IP:8082"
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
