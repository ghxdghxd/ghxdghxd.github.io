---
Title: pandas
Date: 2016-10-12 21:52
Modified: 2018-03-20 13:21
Category: 工具集
Tags: python, pandas
Slug: pandas
Authors: JT Guo
Summary: pandas的常用命令
---
# 常用

## read_csv

```python
 pd.read_csv(file, sep="\t", header=None) # 第一行不设为列名
 bed_df = pd.read_table(file, dtype='object', name=['chr', 'start', 'pos', 'ref', 'alt'])
 ```

## cat 合并

```python
Series(['a','b','c']).str.cat(['A','B','C'],sep=',')
```

## filter

    mat[mat.index.map(lambda x:x in list)]

## dataframe to list

    mat.drop_duplicates().values.tolist()

## merge dataframe

    pd.connect([mat1, mat2, mat3], axis=1)  #axis=1 cbind, asis=0 rbind

## insert

    mat.insert(0, 'date', date) # insert in 0 col

# pandas错误

> read_csv: C-engine CParserError: Error tokenizing data

When using read_csv like this:

```python
df = pd.read_pickle('faulty_row.pkl')
df.to_csv('faulty_row.csv', encoding='utf8', index=False)
df.read_csv('faulty_row.csv', encoding='utf8')
```

You get the following exception:

```shell
CParserError: Error tokenizing data. C error: Buffer overflow caught - possible malformed input file.
```

+ Solution 1

You can read the CSV using the python engine then no exception is thrown:

```python
df.read_csv('faulty_row.csv', encoding='utf8', engine='python')
```

+ Solution 2

If your second-to-last line includes an '\r' break.
You can open in universal-new-line mode to solve the error.

```python
pd.read_csv(open('test.csv','rU'), encoding='utf-8', engine='c')
```