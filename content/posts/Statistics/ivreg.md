---
Title: ivreg工具变量回归
Date: 2018/11/12 13:14:43
Modified: 2018/11/12 13:14:43
Category: 统计建模
Tags: IV
Slug: ivreg
Authors: JT Guo
Summary: why are the R-squared negative in Two-stage least-squares (2SLS) estimates or instrumental variables (IV) estimates?
---

# 结果解释

```text
Call:
ivreg(formula = log(packs) ~ log(rprice) + log(rincome) | log(rincome) + 
tdiff + I(tax/cpi), data = CigarettesSW, subset = year == 
"1995")

Residuals:
   Min         1Q     Median         3Q        Max 
-0.6006931 -0.0862222 -0.0009999  0.1164699  0.3734227 

Coefficients:
         Estimate Std. Error z value Pr(>|z|)    
(Intercept)    9.8950     0.9288  10.654  < 2e-16 ***
log(rprice)   -1.2774     0.2417  -5.286 1.25e-07 ***
log(rincome)   0.2804     0.2458   1.141    0.254    

Diagnostic tests:
             df1 df2 statistic p-value    
Weak instruments   2  44   228.738  <2e-16 ***
Wu-Hausman         1  44     3.823  0.0569 .  
Sargan             1  NA     0.333  0.5641    
```

I'm interested in the interpretation of the diagnostic tests. Does this mean the instruments are weak or no? What does the Wu-Hausman mean, given that it is significant on 10% level? Sargan not being significant means what?

This presentation provides a decent overview with worked examples.

Weak instruments means that the instrument has a low correlation with the endogenous explanatory variable. This could result in a larger variance in the coefficient, and severe finite-sample bias. "The cure can be worse than the disease" (Bound, Jaeger, Baker, 1993/1995). See here for more details. From the help file for AER, it says it does an F-test on the first stage regression; I believe the null is that the instrument is weak. For the model you report, the null is rejected, so you can move forward with the assumption that the instrument is sufficiently strong.

Wu-Hausman tests that IV is just as consistent as OLS, and since OLS is more efficient, it would be preferable. The null here is that they are equally consistent; in this output, Wu-Hausman is significant at the p<0.1 level, so if you are OK with that confidence level, that would mean IV is consistent and OLS is not.

Sargan tests overidentification restrictions. The idea is that if you have more than one instrument per endogenous variable, the model is overidentified, and you have some excess information. All of the instruments must be valid for the inferences to be correct. So it tests that all exogenous instruments are in fact exogenous, and uncorrelated with the model residuals. If it is significant, it means that you don't have valid instruments (somewhere in there, as this is a global test). In this case, this isn't a concern. This can get more complex, and researchers have suggested doing further analysis (see this).

> [参考1](https://www.stata.com/support/faqs/statistics/two-stage-least-squares/)
> [参考2](https://stats.stackexchange.com/questions/139782/why-report-r-squared-in-instrumental-variables-estimation)
> [参考3](https://zhuanlan.zhihu.com/p/19756603)
> [参考4](https://stats.stackexchange.com/questions/134789/interpretation-of-ivreg-diagnostics-in-r)
