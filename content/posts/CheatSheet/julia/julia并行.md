---
Title: julia 1.0 的并行计算
Date: 2018/12/29 12:56:05
Modified: 2018/12/30 12:56:05
Category: 小抄速查
Tags: julia, distributed
Slug: julia-distributed
Authors: JT Guo
Summary: julia 1.0 的并行实现及存在的问题
---

# julia的[并行](https://docs.juliacn.com/latest/manual/parallel-computing)

**julia的主进程`id`为 1(提供 Julia 交互环境的进程的 id 永远是1)**
julia中的并行进程，称为`worker`，
`julia -p 2`表示申请2个`workers`进行并行计算，那么

```julia
workers() # 查看所有workers的id，
#19-element Array{Int64,1}:
# 2
# 3
nworkers() # 查看workers的数目
# 2
nprocs() # 查看所有进程数目，nworkers + 主进程(id=1)
# 3
myid() # 当前workers的id
# 1
```

> julia的并行函数中，最好不要在println，可能会出现如下提示，并且主进程会被终止
> Warning: Forcibly interrupting busy workers

## map与pmap

### map串行

```julia

function run(x, dat)
    return(dat[x])
end

map(x -> run(x, dat), x_list)
```

### pmap并行,默认可能为1个物理CPU(如8线程)

```julia
@everywhere function run(x, dat)
    return(dat[x])
end

pmap(x -> run(x, dat), x_list)
```
