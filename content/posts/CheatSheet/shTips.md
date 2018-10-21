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

## awk

```sh
$0~/aaa/表示0包括aaa
split (string, array, field separator)
split (string, array)  \--&gt;如果第三个参数没有提供，awk就默认使用当前FS值。
substr(s,p) 返回字符串s中从p开始的后缀部分
substr(s,p,n) 返回字符串s中从p开始长度为n的后缀部分
length函数返回整个记录中的字符数。
gsub(regular expression, subsitution string, target string);
index(a,b), r返回b中a的位置，没有返回0
for(i=1;i&lt;=length(a);i++)
```

### awk,getline,用于获得下一行

```sh
输出奇数，
seq 10 | awk '{print $0;getline}'
1
3
5
7
9
输出偶数
seq 10 | awk '{getline;print $0}'
2
4
6
8
10

输出三行,如果后面没有足够的行，则输出最后一行
seq 10 | awk '{getline;getline;print $0}'
3
6
9
10
```

## sed

```sh
sed -n '/A/,/B/p'  匹配A的行与匹配B的行之间的内容
sed -n '2p,4,5p' 输出2 4,5 行
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