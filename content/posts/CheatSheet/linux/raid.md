---
Title: 磁盘阵列
Date: 2016/11/6 18:29:36
Modified: 2017/5/2 23:45:22
Category: 小抄速查
Tags: raid
Slug: raid
Authors: JT Guo
Summary: 各种磁盘阵列的简介
---
# 磁盘阵列（Redundant Arrays of Independent Drives，RAID）

+ Raid0: 最少需要**2块**盘，没用冗余数据,不做备份，任何一块磁盘损坏都无法运行。n块磁盘（同类型）的阵列理论上读写速度是单块磁盘的n倍(实际达不到)，风险性也是单一n倍（实际更高），是磁盘阵列中存储性能最好的。适用于安全性不高，要求比较高性能的图形工作站或者个人站。**容量 = 每块硬盘容量 \* n**

+ Raid1：至少需要**2块**盘，磁盘数量是2的n倍，每一块磁盘要有对应的备份盘，利用率是50%，只要有一对磁盘没有损坏就可以正常使用。n组磁盘（2n块同类型磁盘）的阵列理论上读取速度是单块磁盘的n倍（实际达不到），风险性是单一磁盘的n分之一（实际更低）。换盘后需要长时间的镜像同步，不影响外界访问，但整个系统性能下降。磁盘控制器负载比较大。适用于安全性较高，且能较快恢复数据的场合。**容量 = 每块硬盘容量**

+ Raid10：至少需要**4块**盘，磁盘数量也是2的n倍。既有数据镜像备份，也能保证较高的读写速度。成本比较大。**容量 = 每块硬盘容量 \* n/2**

+ Raid3：至少需要**3块**盘（2块盘没有校验的意义）。将数据存放在n+1块盘上，有效空间是n块盘的总和，最后一块存储校验信息。数据被分割存储在n块盘上，任一数据盘出现问题，可由其他数据盘通过校正监测恢复数据（可以带伤工作），换数据盘需要重新恢复完整的校验容错信息。对阵列写入时会重写校验盘的内容，对校验盘的负载较大，读写速度相较于Raid0较慢，适用于读取多而写入少的应用环境，比如数据库和web服务器。使用容错算法和分块的大小决定了Raid3在通常情况下用于大文件且安全性要求较高的应用，比如视频编辑、硬盘播出机、大型数据库等。

+ Raid5：至少需要**3块**盘，读取速度接近Raid0，但是安全性更高。安全性上接近Raid1，但是磁盘的利用率更高。可以认为是Raid0和Raid1的一个折中方案。只允许有一块盘出错，可以通过另外多块盘来计算出故障盘的数据，故障之后必须尽快更换。比Raid0+1的磁盘利用率高，是目前比较常用的一种方案。**容量 = 每块硬盘容量 \* (n-1)**

```text
megacli -PDList -aALL | egrep 'Adapter|Enclosure Device ID|Coerced Size|Drive Temperature|PD Type|Slot|Inquiry|Predictive Failure|Firmware state'

#第一块raid卡的意思
Adapter #0
#这个参数很重要，设置raid要用到
Enclosure Device ID: 32
#服务器上的硬盘位
Slot Number: 0
#这块硬盘快坏了
Predictive Failure: 2
#硬盘接口类型
PD Type: SAS
#磁盘容量
Non Coerced Size: 558.411 GB [0x45cd2fb0 Sectors]
Coerced Size: 558.375 GB [0x45cc0000 Sectors]
#磁盘厂商
Inquiry Data: SEAGATE ST3600057SS     ES656SL46W4V
Drive Temperature :47C (116.60 F)
```

```sh
/opt/MegaRAID/MegaCli/MegaCli64 -LdPdInfo -aAll -NoLog|\
    grep -Ei '(^Virtual|^RAID Level|^PD type|^Raw Size|^Enclosure Device|^Slot|Predictive Failure Count|firmware|^Inquiry)' | \
    awk '{if($0~/^Virtual/||$0~/^RAID/){
            printf("\033[35m%s\033[0m\n",$0)
        }else if($0~/^Enclosure/){
            printf("\033[31m%s: %s\033[0m ",$1,$4)
        }else if($0~/^Slot/){
            printf("\033[31m%s\033[0m\n",$0)
        }else if($0~/^Other/||$0~/Firmware/||$0~/Inquiry/){
            printf("\033[33m%s\033[0m\n",$0)
        }else if($0~/^Raw/){
            printf("\033[33m%s%s\033[0m\n",$2,$3)
        }else{
            printf("\033[33m%s\033[0m\n",$0)
        }}'
```
