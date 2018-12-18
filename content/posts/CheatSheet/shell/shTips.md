---
Title: shell
Date: 2016-10-12 21:52
Modified: 2018-05-28 11:30
Category: 小抄速查
Tags: shell
Slug: shell
Authors: JT Guo
Summary: shell的常用命令
---
# 常用命令

```sh
0表示标准输入
1表示标准输出
2表示标准错误输出
> 默认为标准输出重定向，与 1> 相同
2>&1 意思是把 标准错误输出 重定向到 标准输出.
&>file 意思是把 标准输出 和 标准错误输出 都重定向到文件file中
```

## [awk](awk)

## sed

```sh
sed -n '/A/,/B/p'  匹配A的行与匹配B的行之间的内容
sed -n '2p,4,5p' 输出2 4,5 行
sed "s/$a/$b/g" 变量替换
```

## grep

```sh
cat file  | grep '[:space:]*#'匹配空格
grep -P '\t' 匹配制表符
grep -E "abc|123" myfile -n 两个关键词
```

## ln

```sh
ln -s 源文件 目标文件
```

## paste

```sh
paste -s -d '\t'  多行合并成一行
```

## tr

```sh
tr -s ' ' 多个空格变一个
```

## sort

```sh
sort -V 按染色体排序 1，2，3，，，，X，Y
```

## unzip

```sh
unzip -l zipfile   查看list
unzip -p zipfile "*/getfile" |less   查看指定文件
unzip -d outdir    指定输出目录
```

## gzip

```sh
gzip -t/--test 检测gz文件是否有错误
```

## find

按大小
find . -size +50M

find 按文件修改时间查找文件

----(+n)---------|------------(n)--------------|---------(-n)----
   (n+1)*24H前   |    (n+1)*24H ~ n*24H之间  |  n*24H以内

-ctime -n    查找距现在 n*24H 内修改过的文件
-ctime n    查找距现在 n*24H 前, (n+1)*24H 内修改过的文件
-ctime +n    查找距现在 (n+1)*24H 前修改过的文件

[a|c|m]min    [最后访问|最后状态修改|最后内容修改]min
[a|c|m]time    [最后访问|最后状态修改|最后内容修改]time

linux 文件的几种时间 (以 find 为例):
atime 最后一次访问时间, 如 ls, more 等, 但 chmod, chown, ls, stat 等不会修改些时间, 使用 ls -utl 可以按此时间顺序查看;
ctime 最后一次状态修改时间, 如 chmod, chown 等状态时间改变但修改时间不会改变, 使用 stat file 可以查看;
mtime 最后一次内容修改时间, 如 vi 保存后等, 修改时间发生改变的话, atime 和 ctime 也相应跟着发生改变.

注意: linux 里是不会记录文件的创建时间的, 除非这个文件自创建以来没有发生改变, 那么它的创建时间就是它的最后一次修改时间.

*ls -lt    ./  按修改时间顺序查看
*ls -lut ./ 按访问时间顺序查看

[acm]time  计量单位是天，即24H
[acm]min    计量单位是分钟
find ./ -mtime 0  #查找一天内修改的文件
find ./ -mtime -2 #查找2天内修改的文件，多了一个减号
find ./ -mmin  -10  #查找距离现在10分钟内修改的文件

## 计算 expr

```sh
expr 1 + 1
expr
```

## 查看网速sar

```sh
sar -n DEV 1 100
```

## sudo !!命令

没有特定输入sudo命令而运行，将给出没有权限的错误。那么，你不需要重写整个命令，仅仅输入'!!'就可以抓取最后的命令。

## Ctrl+x+e命令

这个命令对于管理员和开发者非常有用。为了使每天的任务自动化，管理员需要通过输入vi、vim、nano等打开编辑器。

仅仅从命令行快速的敲击“Ctrl-x-e”，就可以在编辑器中开始工作了。

## nl命令

“nl命令”添加文件的行数。

## shuf n1

随机从一个文件或文件夹中选择行/文件/文件夹。首先使用ls命令来显示文件夹的内容。

## 数组

```shell
array=(`cat test.txt|cut -f 1`)
${array[@]} # 数组全部
${#array[@]} # 数组长度
${array[0]} # 数组元素 0 1 2
```