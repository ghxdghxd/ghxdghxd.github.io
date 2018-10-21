---
Title: 分区挂载
Date: 2014-11-03 00:20
Modified: 2017-10-21 20:52
Category: 小抄速查
Tags: linux, mount
Slug: mount
Authors: JT Guo
Summary: mount挂载说明
---

# /etc/fstab

运维都知道的文件，若想把mount的disk和dir设置为每次开机自动加载，那么就要把相关信息写到这个文件中。当用”mount -a“命令自动mount的时候，也会去读这个文件。例如：

```sh
LABEL=/hadoop/9 /hadoop/9 ext3 defaults,noatime,nodiratime,noauto 0 2
LABEL=/hadoop/10 /hadoop/10 ext3 defaults,noatime,nodiratime,noauto 0 2
```

# /etc/mtab

这个文件主要是用mount命令的时候，系统根据实际mount的情况生成的数据，例如：

```sh
/dev/sdb1 /hadoop/9 ext3 rw,noatime,nodiratime 0 0
/dev/sdc1 /hadoop/10 ext3 rw,noatime,nodiratime 0 0
```

# /proc/mounts

这个文件是/proc/self/mounts的软链接，/proc下面的文件都是保存在内存中的，是内核自动生成的。所以/proc/mounts比/etc/mtab文件能更加真实的反映当前mount的情况

# 场景应用：

服务器中有一块盘因为有坏道，被umount了，通过"df -h"就查看不到这块盘的信息了。
或者你使用"chmod 000 /dir",把这块盘设为不能读不能写。
这时如果你管理了1000台服务器，你需要知道你的服务器中哪些盘是被umount了，你会怎么做？
这里分享一个SHELL脚本，可以给你提供思路：

```sh
function check_disks {
  for m in `awk '$3~/ext3/ {printf" %s ",$2}' /etc/fstab` ; do
    fsdev=""
    fsdev=`awk -v m=$m '$2==m {print $1}' /proc/mounts`;
    if [ -z "$fsdev" ] ; then
      msg_="$msg_ $m(u)"
    else
      msg_="$msg_`awk -v m=$m '$2==m { if ( $4 ~ /^ro,/ ) {printf"%s(ro)",$2 } ; }' /proc/mounts`"
    fi
  done
  if [ -z "$msg_" ] ; then
    echo "disks ok" ; exit 0
  else
    echo "$msg_" ; exit 2
  fi
}
```

脚本首先通过比较/etc/fstab和/proc/mounts中的不同之处，得到被umount的盘，然后再把ro(read only)的盘也分析出来。

# 挂载usb到指定位置

```sh
blkid usb #查看uuid
# 修改/etc/fstab
UUID=54A3-36E3 /home/aData exfat defaults,uid=1000,gid=1000,umask=022 0 0
```