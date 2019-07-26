---
Title: awk使用记录
Date: 2016/10/12 22:12
Modified: 2018/12/18 22:30:24
Category: 小抄速查
Tags: awk, shell, linux
Slug: awk
Authors: JT Guo
Summary: awk的常用命令
---
# awk日常用法

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
awk '!a[$1" "$2]++{print}' # 以第一列与第二列去重
awk 'a[$1" "$2]++{print}' # 以第一列与第二列去重，只显示重复行
```

## awk,getline,用于获得下一行

```sh
#输出奇数，
seq 10 | awk '{print $0;getline}'

#输出偶数
seq 10 | awk '{getline;print $0}'

#从第三行开始，每三行输出一次,如果后面没有足够的行，则输出最后一行
seq 10 | awk '{getline;getline;print $0}'
3
6
9
10

# 获得shell命令的结果
# 注: 如果cmd出错,则res为上一行的结果，因此前面添加**res=\"\"**
#     出现awk (Too many open files), 需要 **close(cmd)**

awk '{cmd="echo"$0; res="";
    cmd|getline res;
    print $res;
    close (cmd)}' file
```

## awk排序

* asort  是对数组的值进行排序，并且会丢掉原先键值
* asorti 是对数组的键值进行排序，生成<序号，键值>关联数组

```sh
awk '{a[$1]=$2}END{slen=asort(a,b);for(i=1;i<=slen;i++) print i"\t"a[i]"\t"b[i]}' test
```

asort对数组a的值进行排序，把排序后的下标存入新生成的数组b中，丢弃数组a下标值，再把数组a的长度赋值给变量slen

```sh
awk '{a[$1]=$2}END{slen=asorti(a,b);for(i=1;i<=slen;i++) print i"\t"b[i]"\t"a[b[i]]}' test
```

asorti对数组a的下标进行排序，并把排序后的下标存入新生成的数组b中，并把数组a的长度赋值给变量l

## awk传参

### 方法一

```sh
awk '{print a, b}' a=111 b=222 yourfile
```

注意, 变量位置要在 file 名之前, 否则就不能调用. 例如:

```sh
awk '{print a, b}' a=111 file1 b=222 file2
```

file1 不能调用 b=222.
还有, 于BEGIN{}中是不能调用这些的variable.
要用之后所讲的第二种方法才可解决.

### 方法二

对每一个变量加一个 `-v` 作传递

```sh
awk –v a=111 –v b=222 '{print a,b}' yourfile
```

### 方法三

对于**字符类型**，使用 双引号 + 单引号 + 变量

```sh
awk '{print "'"$LOGNAME"'"}' yourfile
```

但是,对于**浮点类型**，**使用方法会有出入**, 问题如下

**用三个变量`a, b, c`分别筛选`test`文本的3列**

```sh
a=0.25
b=0.1
c=0.05

cat test.txt
# 0.185260877381154	0.339233950224672	0.872786159229803
# 0.185260877381154	0.339233950224672	0.0257941397953021
# 0.185260877381154	0.339233950224672	0.43720505769949
# 0.185260877381154	0.339233950224672	1.94370007597298e-05
```

如果，用双引号 + 单引号 + 变量, 只筛选出一行

```sh
awk '$1<"'$a'" && $2>"'$b'" && $3<"'$c'" {OFS="\t";print $0}' test.txt
# 0.185260877381154	0.339233950224672	0.0257941397953021
```

如果，只用单引号 + 变量， 筛选出两行

```sh
awk '$1<'$a' && $2>'$b' && $3<'$c' {OFS="\t";print $0}' test.txt
# 0.185260877381154	0.339233950224672	0.0257941397953021
# 0.185260877381154	0.339233950224672	1.94370007597298e-05
```

很明显，单引号 + 变量 结果正确，用echo打印两行命令：

```sh
echo awk '$1<'$a' && $2>'$b' && $3<'$c' {OFS="\t";print $0}' test.txt
# awk $1<0.25 && $2>0.1 && $3<0.05 {OFS="	";print $0} test.txt

echo awk '$1<"'$a'" && $2>"'$b'" && $3<"'$c'" {OFS="\t";print $0}' test.txt
# awk $1<"0.25" && $2>"0.1" && $3<"0.05" {OFS="	";print $0} test.txt
```
