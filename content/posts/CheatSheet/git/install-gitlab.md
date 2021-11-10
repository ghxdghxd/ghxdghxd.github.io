---
Title: gitlab的安装与配置
Date: 2018-10-20 11:20
Modified: 2018-10-26 15:30
Category: 小抄速查
Tags: gitlab
Slug: gitlab
Authors: JT Guo
Summary: centos6 搭建私有git服务器
---

# 安装gitlab

```shell
docker run --detach \
# 设置主机名或域名
  --hostname "IP" \
# 添加配置，确保网页端git clone的地址显示正确,如
# ssh://git@IP:{git_port+2}/user/repo.git
# http://IP:{git_port}/user/repo.git
  --env GITLAB_OMNIBUS_CONFIG="external_url 'http://IP:port'; gitlab_rails['gitlab_shell_ssh_port'] = {git_port+2}; nginx['listen_port'] = 80;" \
# 端口映射；容器内的443,git_port,22端口分别映射到宿主机的444,git_port,git_port+2端口
  --publish 444:443 --publish {git_port}:{git_port} --publish {git_port+2}:22 \
# gitlab-ce 的镜像运行成为一个容器，这里是对容器的命名
  --name gitlab \
# 设置重启方式，always 代表一直开启，服务器开机后也会自动开启的
  --restart always \
# 将 gitlab 的配置文件目录映射到 /public/tool/gitlab/config 目录中
  --volume /public/tool/gitlab/config:/etc/gitlab \
# 将 gitlab 的log文件目录映射到 /public/tool/gitlab/logs 目录中
  --volume /public/tool/gitlab/logs:/var/log/gitlab \
# 将 gitlab 的数据文件目录映射到 /public/tool/gitlab/data 目录中
  --volume /public/tool/gitlab/data:/var/opt/gitlab \
# 需要运行的镜像
  gitlab/gitlab-ce:latest

# 查看日志
docker logs -f --tail 10 gitlab

docker start gitlab
# 关闭 gitlab
docker stop gitlab
# 重启 gitlab
docker restart gitlab


# 升级 gitlab
# 不同版本, 会导致无法启动，无法恢复备份（gitlab高版本与低版本备份不兼容）
# 升级顺序 https://docs.gitlab.com/ee/policy/maintenance.html#upgrade-recommendations
docker stop gitlab
docker rm gitlab
docker pull gitlab/gitlab-ce:latest

docker run --detach \
--hostname "IP" \
--env GITLAB_OMNIBUS_CONFIG="external_url 'http://IP:{git_port}'; gitlab_rails['gitlab_shell_ssh_port'] = {git_port+2};" \
--publish 443:443 --publish {git_port}:{git_port} --publish {git_port+2}:22 \
--name gitlab \
--restart always \
--volume /public/tool/gitlab/config:/etc/gitlab \
--volume /public/tool/gitlab/logs:/var/log/gitlab \
--volume /public/tool/gitlab/data:/var/opt/gitlab \
gitlab/gitlab-ce:latest

#备份
docker exec -t gitlab gitlab-rake gitlab:backup:create #数据保存在gitlab/data/backups

#备份数据拷贝到新的gitlab/data/backups下面，然后恢复
docker exec -t gitlab gitlab-rake gitlab:backup:restore RAILS_ENV=production
```

# docker-compose

```shell
version: "3"

services:
  web:
    image: 'gitlab/gitlab-ce:old'
    container_name: gitlab_test
    restart: always
    hostname: 'IP'
    environment:
        GITLAB_OMNIBUS_CONFIG: |
            external_url 'http://$IP:{$git_port}'
            gitlab_rails['gitlab_shell_ssh_port'] = {$git_port+2}
            # email setting
            gitlab_rails['smtp_enable'] = true
            gitlab_rails['smtp_address'] = "smtp.163.com"
            gitlab_rails['smtp_port'] = 465
            gitlab_rails['smtp_user_name'] = "email"
            gitlab_rails['smtp_password'] = "pwd"
            gitlab_rails['smtp_domain'] = "smtp.163.com"
            gitlab_rails['smtp_authentication'] = "login"
            gitlab_rails['smtp_enable_starttls_auto'] = true
            gitlab_rails['smtp_tls'] = true
            gitlab_rails['gitlab_email_from'] = "email"
            user["git_user_email"] = "email"
    ports:
        - '{$git_port}:{$git_port}'
        - '{$git_port+2}:22'
    volumes:
        - '/public/tool/docker-gitlab/config:/etc/gitlab'
        - '/public/tool/docker-gitlab/logs:/var/log/gitlab'
        - '/public/tool/docker-gitlab/data:/var/opt/gitlab'



gitlab-rails console
#进入控制台，然后发送测试邮件
# Notify.test_email({收件者邮箱地址},{邮件主题},{邮件内容}).deliver_now
Notify.test_email('email', 'Hello World', 'This is a message').deliver_now

# 升级 gitlab
# 不同版本, 会导致无法启动，无法恢复备份（gitlab高版本与低版本备份不兼容）
# 升级顺序 https://docs.gitlab.com/ee/policy/maintenance.html#upgrade-recommendations
# 依次修改 docker-compose.yaml 的镜像版本，每次仅升级一个次版本号：
docker-compose up -d --build

```

## 添加源到/etc/yum.repos.d/gitlab-ce.repo

```text
[gitlab-ce]
name=Gitlab CE Repository
baseurl=https://mirrors.tuna.tsinghua.edu.cn/gitlab-ce/yum/el6
gpgcheck=0
enabled=1
```

## yum安装

```sh
yum install gitlab-ce
```

# 配置gitlab

## 目录

```text
/etc/gitlab/ ## 放置配置文件
/opt/gitlab/ ## 主目录
/var/opt/gitlab/ ## 各个组件
/var/log/gitlab/ ## 放置日志文件
```

## 设置IP地址

### http配置

修改/etc/gitlab/gitlab.rb

```sh
#修改ip地址，**iptables 打开port**
external_url = 'http://xxx.xxx.xxx.xx:port'
```

修改完成后，如果打开 "http:\\/\\/IP" 无法访问gitlab，可能是80端口冲突
原因：Nginx默认使用了80端口。

**解决**：修改Apache的端口,

```sh
/etc/httpd/conf/httpd.conf，
Listen 8111
service httpd restart
```

### https配置

1. 使用自签名证书开启Https

    证书目录/etc/gitlab/ssl, openssl创建证书

2. 修改/etc/gitlab/gitlab.rb

```sh
#修改ip地址，**iptables 打开port**
external_url = 'https://xxx.xxx.xxx.xx'
# gitlab 网站https：
nginx['redirect_http_to_https'] = true
# gitlab ci 网站https：
ci_nginx['redirect_http_to_https'] = true

nginx['ssl_certificate'] = "/etc/gitlab/ssl/xxx.xxx.xxx.xx.crt"
nginx['ssl_certificate_key'] = "/etc/gitlab/ssl/xxx.xxx.xxx.xx.key"

sudo cp /etc/gitlab/ssl/*crt /etc/gitlab/trusted-certs
```

### 修改ssh端口

```text
gitlab_rails['gitlab_shell_ssh_port'] = 21386
```

## 修改gitlab存储目录

+ 默认存储位置在/var/opt/gitlab/git-data/repositories，修改/etc/gitlab/gitlab.rb

```text
git_data_dirs({
    "default" => {
      "path" => "/usr/data/gitlab"
     }
})
```

## 开启gitlab-pages

修改/etc/gitlab/gitlab.rb

```text
pages_external_url "https://gitlab"
gitlab_pages['enable'] = true

```

## gitlab占内存过多

```sh
#减少进程数,最小2
unicorn['worker_processes'] = 4
#减少数据库缓存,最大14GB，总内存 256M*5
postgresql['shared_buffers'] = "256M"
#减少数据库并发数,默认8
postgresql['max_worker_processes'] = 5
#减少sidekiq并发数
sidekiq['concurrency'] = 25

nginx['worker_processes'] = 5
```

# gitlab 的权限

||Guest|Reporter|Developer|Master|Owner|
|---|---|---|---|---|---|
|Create new issues| \*| \*| \*| \*| \*|
|Leave comments| \*| \*| \*| \*| \*|
|Pull the project code| | \*| \*| \*| \*|
|Download a project| | \*| \*| \*| \*|
|Create code snippets| | \*| \*| \*| \*|
|Create new merge requests| | | \*| \*| \*|
|Push changes to nonprotected branches| | | \*| \*| \*|
|Remove nonprotected branches| | | \*| \*| \*|
|Add tags| | | \*| \*| \*|
|Write a wiki| | | \*| \*| \*|
|Manage the issue tracker| | | \*| \*| \*|
|Add new team members| | | | \*| \*|
|Push changes to protected branches| | | | \*| \*|
|Manage the branch protection| | | | \*| \*|
|Manage Git tags| | | | \*| \*|
|Edit the project| | | | \*| \*|
|Add deploy keys to the project| | | | \*| \*|
|Configure the project hooks| | | | \*| \*|

/opt/gitlab/embedded/service/gitlab-rails/config/gitlab.yml

```sh
sudo gitlab-ctl start    # 启动所有 gitlab 组件；
sudo gitlab-ctl stop        # 停止所有 gitlab 组件；
sudo gitlab-ctl restart        # 重启所有 gitlab 组件；
sudo gitlab-ctl status        # 查看服务状态；
sudo vim /etc/gitlab/gitlab.rb        # 修改默认的配置文件；
gitlab-rake gitlab:check SANITIZE=true --trace    # 检查gitlab；
sudo gitlab-ctl tail        # 查看日志；
```
