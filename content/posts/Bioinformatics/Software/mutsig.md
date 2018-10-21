---
Title: MutSigCV的问题
Date: 2015-04-28 16:47
Modified: 2016-09-23 10:30
Category: 生物信息
Tags: mutsig
Slug: MutSigCV
Authors: 
Summary: MutSigCV的简介
---
A tab-delimited report of significant mutations, listed in descending order from most significant to least significant.
The "nnei","x", and "X" values in the MutSig output analysis give insight into how the background mutation rate is calculated for a given gene.  nnei gives the number of neighboring genes that are pooled together to compute the background mutation rate for that gene; these genes are not necessarily adjacent on the genome, but rather they have nearby covariate values. x gives the number of mutated bases in these neighboring genes that are either silent or non-coding, while X gives the total number of bases related to these neighboring genes.

According to the original MutSigCV article, olfactory receptors (ORs) can show up as significant due to the heterogeneity in the mutational processes in cancer (authors' hypothesis)(Lawrence et al. "Mutational heterogeneity in cancer and the search for new cancer-associted genes", Nature, 2013). Certain genes, like ORs, can accumulate mutations faster than others, even if their biology is not potentially oncogenic. Therefore, assuming a uniform rate of background mutations/aberrations (GISTIC/JISTIC) is somewhat wrong, no?

肿瘤异质性的突变过程， 一些基因，如ORs，虽然对肿瘤没有功能影响，但因为能够迅速积累突变，而被鉴定出来。