---
Title: Java parallelGCThreads的选择
Date: 2016-1-08 15:31:01
Modified: 2016-12-30 16:20:13
Category: 工具集
Tags: Java
Slug: Java-parallelGCThreads
Authors: JT Guo
Summary: Java parallelGCThreads的选择
---
# 1.含义

ParallelGCThreads，表示JVM在进行并行GC的时候，用于GC的线程数，-XX:ParallelGCThreads=43，表示配置GC线程数为43。

# 2.JVM相关接口

JVM中，关于ParallelGCThreads的计算代码如下：

```java
unsigned int VM_Version::calc_parallel_worker_threads() {
  unsigned int result;
  if (is_M_series()) {
    // for now, use same gc thread calculation for M-series as for niagara-plus
    // in future, we may want to tweak parameters for nof_parallel_worker_thread
    result = nof_parallel_worker_threads(5, 16, 8);
  } else if (is_niagara_plus()) {
    result = nof_parallel_worker_threads(5, 16, 8);
  } else {
    result = nof_parallel_worker_threads(5, 8, 8);
  }
  return result;
}
unsigned int Abstract_VM_Version::parallel_worker_threads() {
  if (!_parallel_worker_threads_initialized) {
    if (FLAG_IS_DEFAULT(ParallelGCThreads)) {
      _parallel_worker_threads = VM_Version::calc_parallel_worker_threads();
    } else {
      _parallel_worker_threads = ParallelGCThreads;
    }
    _parallel_worker_threads_initialized = true;
  }
  return _parallel_worker_threads;
}
unsigned int Abstract_VM_Version::calc_parallel_worker_threads() {
  return nof_parallel_worker_threads(5, 8, 8);
}
unsigned int Abstract_VM_Version::nof_parallel_worker_threads(
  unsigned int num,
  unsigned int den,
  unsigned int switch_pt) {
  if (FLAG_IS_DEFAULT(ParallelGCThreads)) {
    assert(ParallelGCThreads == 0, "Default ParallelGCThreads is not 0");
    // For very large machines, there are diminishing returns
    // for large numbers of worker threads.  Instead of
    // hogging the whole system, use a fraction of the workers for every
    // processor after the first 8.  For example, on a 72 cpu machine
    // and a chosen fraction of 5/8
    // use 8 + (72 - 8) * (5/8) == 48 worker threads.
    unsigned int ncpus = (unsigned int) os::active_processor_count();
    return (ncpus <= switch_pt) ?
      ncpus : (switch_pt + ((ncpus - switch_pt) * num) / den);
  } else {
    return ParallelGCThreads;
  }
}
```

# 3.计算方法

    上面列出了与ParallelGCThreads计算相关的几个核心接口，其中，最主要关注nof_parallel_worker_threads接口，该接口中给出了计算ParallelGCThreads值的具体算法，具体如下：

    ① 如果用户显示指定了ParallelGCThreads，则使用用户指定的值。

    ② 否则，需要根据实际的CPU所能够支持的线程数来计算ParallelGCThreads的值，计算方法见步骤③和步骤④。

    ③ 如果物理CPU所能够支持线程数小于8，则ParallelGCThreads的值为CPU所支持的线程数。这里的阀值为8，是因为JVM中调用nof_parallel_worker_threads接口所传入的switch_pt的值均为8。

    ④ 如果物理CPU所能够支持线程数大于8，则ParallelGCThreads的值为8加上一个调整值，调整值的计算方式为：物理CPU所支持的线程数减去8所得值的5/8或者5/16，JVM会根据实际的情况来选择具体是乘以5/8还是5/16。

    比如，在64线程的x86 CPU上，如果用户未指定ParallelGCThreads的值，则默认的计算方式为：ParallelGCThreads = 8 + (64 - 8) * (5/8) = 8 + 35 = 43。