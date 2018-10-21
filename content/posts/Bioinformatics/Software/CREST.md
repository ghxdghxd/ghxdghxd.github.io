---
Title: CREST的问题
Date: 2015-03-12 9:58
Modified: 2015-12-24 14:02
Category: 生物信息
Tags: CREST
Slug: CREST
Authors: JT Guo
Summary: CREST用来发现结构变异
---

运行CREST时，报错如下错误：
Couldn't connect to 192.168.81.177 9000
Connection refused
Sorry, the BLAT/iPCR server seems to be down.  Please try again later.
crest第一步从原始的bam结果中提取出soft-clipped reads，第二步用blat将截短的序列，重新比对回reference。 blat有两种模式，一种是单机版(Stand - alone Blat)，另一种是交互式的客户端/服务器模式(Client/Server Blat)，CREST使用了第二种模式。
这里报这个错误，是因为没有配置好服务器。
配置服务器命令：/share/backup/user/bin/blatSuite-34/gfServer start 192.168.81.177 9000 /path_to_2bit_file/hg19.fa.2bit & （后面的&将此命令放入后台执行）
程序输出Server ready for queries!的提示后，服务器可用。
服务器配置完成后，可以用/share/backup/bin/bin/blatSuite-34/gfClient测试可否连接上服务器。若能正常连接上，则crest可正常运行。