# docker install mysql

```sh
sudo docker pull mysql
sudo docker run -p 3306:3306 --name mysql \
    -v /public/tool/docker-mysql/conf:/etc/mysql/conf.d \
    -v /public/tool/docker-mysql/logs:/logs \
    -v /public/tool/docker-mysql/data:/var/lib/mysql \
    -e MYSQL_ROOT_PASSWORD=123456 -d mysql

#进入容器
docker exec -it mysql bash

#登录mysql
mysql -h localhost -u root -p
ALTER USER 'root'@'localhost' IDENTIFIED BY '123456';

#添加远程登录用户
CREATE USER 'user'@'%' IDENTIFIED WITH mysql_native_password BY '123456';
GRANT ALL PRIVILEGES ON *.* TO 'user'@'%';

mysql -h IP -p3306 -u user -p123456
```
