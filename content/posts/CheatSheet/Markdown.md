---
Title: markdown格式详解
Date: 2016-10-20 16:0
Modified: 2016-10-20 16:30
Category: 小抄速查
Tags: markdown
Slug: markdown
Authors: JT Guo
Summary: markdown格式详解
---
# 1 概述

[Wiki: Markdown](http://zh.wikipedia.org/wiki/Markdown "Wiki: Markdown")

Markdown 是一种轻量级标记语言，创始人为约翰·格鲁伯（John Gruber）。  
它使用易读易写的纯文本格式编写文档，然后转换成有效的 XHTML（或者 HTML）文档。  
这种语言吸收了很多在电子邮件中已有的纯文本标记的特性。  
”.md“ 和 ”.markdown“ 都是被普遍支持的扩展名，不过 ”.md“ 更加简单和方便。

## 为什么选择 Markdown

+ 它基于纯文本，方便修改和共享
+ 几乎可以在所有的文本编辑器中编写
+ 有众多编程语言的实现，以及应用的相关扩展
+ 在 [GitHub](https://github.com/) 等网站中有很好的应用
+ 很容易转换为 HTML 文档或其他格式
+ 适合用来编写文档、记录笔记、撰写文章

### 兼容 HTML

Markdown 完全兼容 HTML 语法，可以直接在 Markdown 文档中插入 HTML 内容：

```html
<table>
<tr>
<td>1</td>
<td>2</td>
</tr>
<tr>
<td>3</td>
<td>4</td>
</tr>
</table>
```

这段代码会变成下面的样子：

<table>
<tr>
<td>1</td>
<td>2</td>
</tr>
<tr>
<td>3</td>
<td>4</td>
</tr>
</table>

# 2 语法

## 2.1 标题

任何数量的"="和"-"|使用左边或两边对称"#"       |显示效果
:----------------|:-------------------------|:----------:
正副二级标题      | 标记1-6级标题              |
一级标题<br>======|# 一级标题 <s>#</s>         |<h1> 一级标题</h1>
二级标题<br>------|## 二级标题 <s>##</s>       |<h2> 二级标题</h2>
                 |### 三级标题 <s>###</s>     |<h3> 三级标题</h3>
                 |#### 四级标题 <s>####</s>   |<h4> 四级标题</h4>
                 |##### 五级标题 <s>#####</s> |<h5> 五级标题</h5>
                 |###### 六级标题 <s>#####</s>|<h6> 六级标题</h6>

## 2.2 段落与换行

+ 段落的前后必须是空行：
  + 空行指的是行内什么都没有，或者只有空白符（空格或制表符）
  + 相邻两行文本，如果中间没有空行会显示在一行中（换行符被转换为空格）
+ 如果需要在段落内加入换行（`<br>`）：
  + 可以在前一行的末尾加入至少两个空格, 然后换行写其它的文字
+ Markdown 中的多数区块都需要在两个空行之间

## 2.3 引用

### 2.3.1 引用内容

在段落或其他内容前使用 `>` 符号，就可以将这段内容标记为 '引用' 的内容（`<blockquote>`）：

```markdown
>引用内容
```

>引用内容

### 2.3.2 多行引用

```markdown
>多行引用
>可以在每行前加 `>`
```

>多行引用
>可以在每行前加 `>`

```markdown
>如果仅在第一行使用 `>`，
后面相邻的行即使省略 `>`，也会变成引用内容
```

>如果仅在第一行使用 `>`，
后面相邻的行即使省略 `>`，也会变成引用内容

```markdown
>如果引用内容需要换行，
>可以在行尾添加两个空格
>
>或者在引用内容中加一个空行
```

>如果引用内容需要换行，
>可以在行尾添加两个空格
>
>或者在引用内容中加一个空行

### 2.3.3 嵌套引用

```markdown
>也可以在引用中
>>使用嵌套的引用
```

>也可以在引用中
>>使用嵌套的引用

### 2.3.4 其他 Markdown

```markdown
>在引用中可以使用使用其他任何 *Markdown* 语法
```

>在引用中可以使用使用其他任何 *Markdown* 语法

## 2.4 列表

### 2.4.1 无序列表

```markdown
* 可以使用 `*` 作为标记
+ 也可以使用 `+`
- 或者 `-`
```

\* 可以使用 `*` 作为标记
\+ 也可以使用 `+`
\- 或者 `-`

### 2.4.2 有序列表

```markdown
1. 有序列表以数字和 `.` 开始；
3. 数字的序列并不会影响生成的列表序列；
4. 但仍然推荐按照自然顺序（1.2.3...）编写。
```

1.有序列表以数字和 `.` 开始；
3.数字的序列并不会影响生成的列表序列；
4.但仍然推荐按照自然顺序（1.2.3...）编写。

### 2.4.3 嵌套的列表

```markdown
1. 第一层
+ 1-1
+ 1-2
2. 无序列表和有序列表可以随意相互嵌套
1. 2-1
2. 2-2
```

1.第一层
+1-1
+1-2
2.无序列表和有序列表可以随意相互嵌套
1.2-1
2.2-2

### 语法和用法

1. 无序列表项的开始是：符号 空格；
2. 有序列表项的开始是：数字 `.` 空格；
3. 空格至少为一个，多个空格将被解析为一个；
4. 如果仅需要在行前显示数字和 `.`：

```markdown
05\. 可以使用：数字\. 来取消显示为列表
```

05\. 可以使用：数字\\. 来取消显示为列表

>`\*` 的语法专门用来显示 Markdown 语法中使用的特殊字符，参考 [字符转义](blackslash-escapes.md)

## 2.5 代码

### 2.5.1 代码块

可以使用缩进来插入代码块：

<html> // Tab开头
<title>Markdown</title>
</html> // 四个空格开头

代码块前后需要有至少一个空行，且每行代码前需要有至少一个 Tab 或四个空格；

### 2.5.2 行内代码

也可以通过 \`\`，插入行内代码（\` 是 `Tab` 键上边、数字 `1` 键左侧的那个按键）：

例如 `<title>Markdown</title>`

### 2.5.3 转换规则

代码块中的文本（包括 Markdown 语法）都会显示为原始内容，而特殊字符会被转换为 HTML [字符实体](https://zh.wikipedia.org/wiki/XML%E4%B8%8EHTML%E5%AD%97%E7%AC%A6%E5%AE%9E%E4%BD%93%E5%BC%95%E7%94%A8%E5%88%97%E8%A1%A8)。

## 2.6 分隔线

1\. 可以在一行中使用三个或更多的 `*`、`-` 或 `_` 来添加分隔线：

```markdown
***
------
___
```

***

------

___

2\. 多个字符之间可以有空格（空白符），但不能有其他字符：

```markdown
* * *
- - -
```

* * *

- - -

## 2.7 超链接

### 2.7.1 行内式

格式为 `[link text](URL 'title text')`。

① 普通链接：

```markdown
[Google](http://www.google.com/)
```

[Google](http://www.google.com/)

② 指向本地文件的链接：

```markdown
[icon.png](./images/icon.png)
```

[icon.png](./images/icon.png)

③ 包含 'title' 的链接:

```markdown
[Google](http://www.google.com/ "Google")
```

[Google](http://www.google.com/ "Google")

>title 使用 ' 或 " 都是可以的。

### 2.7.2 参考式

参考式链接的写法相当于行内式拆分成两部分，并通过一个 *识别符* 来连接两部分。参考式能尽量保持文章结构的简单，也方便统一管理 URL。

① 首先，定义链接：

```markdown
[Google][link]
```

[Google][link]

第二个方括号内为链接独有的 *识别符*，可以是字母、数字、空白或标点符号。识别符是 *不区分大小写* 的；

② 然后定义链接内容：

```markdown
[link]: http://www.google.com/ "Google"
```

[link]: http://www.google.com/ "Google"

其格式为：`[识别符]: URL 'title'`。

>其中，URL可以使用 <\> 包括起来，title 可以使用 ""、''、() 包括（考虑到兼容性，建议使用引号），title 部分也可以换行来写；

>链接内容的定义可以放在同一个文件的 *任意位置*；

③ 也可以省略 *识别符*，使用链接文本作为 *识别符*：

```markdown
[Google][]
[Google]: http://www.google.com/ "Google"
```

[Google][]
[Google]: http://www.google.com/ "Google"

>参考式相对于行内式有一个明显的优点，就是可以在多个不同的位置引用同一个 URL。

### 2.7.3 自动链接

使用 `<>` 包括的 URL 或邮箱地址会被自动转换为超链接：

```markdown
<http://www.google.com/>

<123@email.com>
```

<http://www.google.com/>

<123@email.com>

该方式适合行内较短的链接，会使用 URL 作为链接文字。邮箱地址会自动编码，以逃避抓取机器人。

## 2.8 图像

插入图片的语法和插入超链接的语法基本一致，只是在最前面多一个 `!`。也分为行内式和参考式两种。

### 2.8.1 行内式

```markdown
![GitHub](https://avatars2.githubusercontent.com/u/3265208?v=3&s=100 "GitHub,Social Coding")
```

![GitHub](https://avatars2.githubusercontent.com/u/3265208?v=3&s=100 "GitHub,Social Coding")

方括号中的部分是图片的替代文本，括号中的 'title' 部分和链接一样，是可选的。

### 2.8.2 参考式

```markdown
![GitHub][github]

[github]: https://avatars2.githubusercontent.com/u/3265208?v=3&s=100 "GitHub,Social Coding"
```

![GitHub][github]

[github]: https://avatars2.githubusercontent.com/u/3265208?v=3&s=100 "GitHub,Social Coding"

### 2.8.3 指定图片的显示大小

Markdown 不支持指定图片的显示大小，不过可以通过直接插入`<img />`标签来指定相关属性：

```html
<img src="https://avatars2.githubusercontent.com/u/3265208?v=3&s=100" alt="GitHub" title="GitHub,Social Coding" width="50" height="50" />
```

<img src="https://avatars2.githubusercontent.com/u/3265208?v=3&s=100" alt="GitHub" title="GitHub,Social Coding" width="50" height="50" />

## 2.9 强调

1\. 使用 `* *` 或 `_ _` 包括的文本会被转换为 `<em></em>` ，通常表现为斜体：

```markdown
这是用来 *演示* 的 _文本_
```

这是用来 *演示* 的 _文本_

2\. 使用 `** **` 或 `__ __` 包括的文本会被转换为 `<strong></strong>`，通常表现为加粗：

```markdown
这是用来 **演示** 的 __文本__
```

这是用来 **演示** 的 __文本__

3\. 用来包括文本的 `*` 或 `_` 内侧不能有空白，否则 `*` 和 `_` 将不会被转换（不同的实现会有不同的表现）：

```markdown
这是用来 * 演示* 的 _文本 _
```

这是用来 * 演示* 的 _文本 _

4\. 如果需要在文本中显示成对的 `*` 或 `_`，可以在符号前加入 `\` 即可：

```markdown
这是用来 \*演示\* 的 \_文本\_
```

这是用来 \*演示\* 的 \_文本\_

5\. `*`、`**`、`_` 和 `__` 都必须 *成对使用* 。

## 2.10 字符转义

反斜线（`\`）用于插入在 Markdown 语法中有特殊作用的字符。

```markdown
这是用来 *演示* 的 _文本_

这是用来 \*演示\* 的 \_文本\_
```

这是用来 *演示* 的 _文本_

这是用来 \*演示\* 的 \_文本\_

这些字符包括：

```
\
`
*
_
{}
[]
()
#
+
-
.
!
```