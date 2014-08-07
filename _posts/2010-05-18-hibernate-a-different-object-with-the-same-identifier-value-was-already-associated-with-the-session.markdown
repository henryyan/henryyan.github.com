--- 
layout: post
title: "解决a different object with the same identifier value was already associated with the session错误"
wordpress_id: 972
wordpress_url: http://www.wsria.com/?p=972
date: 2010-05-18 10:22:10 +08:00
tags: 
 - hibernate
---
使用Hibernate三年了第一次遇到这个异常，<strong>常发生在一对多和多对多关系映射时</strong>，其实翻译一下很简单就是在Session中有两个相同标示但是又不是相同的实体，当进行保存或者更新(saveOrUpdate)时就爆出了这个错误，因为Hibernate不知道改怎么操作了，Google了一下发现解决办法很多，比如清空Session对象的缓存、刷新Session，但是这些都会导致后遗症的发生

<strong>一、清空Session缓存</strong>
也就是执行session.clean()方法，但是如果在clean之后再对对象saveOrUpdate就会报错：“<em>Found two  representations of same collection</em>”，所以这个解决办法不可取

<strong>二、刷新Session</strong>

session.refresh(object)方 法就可以解决了，注意，当object不是数据库中已有数据的对象的时候，不能使用session.refresh(object)因为refresh是 从hibernate的session中去 重新取object，如果session中 没有这个对象，则会报错所以当你使用saveOrUpdate(object)之前还需要判断一下

<strong>三、最好的解决办法：session.merge()</strong>

这个是我认为比较好的解决办法了，session里面有一个相同标示的对象，业务方法里也有一个相同标示的对象，把两个合并起来不就可以了，最后调用session.merge()更新到数据库，OK

<strong>四、Hibernate 疑难异常及处理 </strong>

1、a different object with the same identifier value was  already associated with the session。

错误原因：在hibernate中同一个session里 面有了两个相同标识但是是不同实体。

解决方法一：session.clean()

PS：如果在clean操作后面又进行了saveOrUpdate(object)等改变数据状态的操作，有可能会报出"Found two representations of same collection"异常。

解决方法二：session.refresh(object)

PS：当object不是数据库中已有数据的对象的时 候，不能使用session.refresh(object)因为该方法是从hibernate的session中去重新取object，如果session中没有这个对象，则 会报错所以当你使用saveOrUpdate(object)之前还需要判断一下。

解决方法三：session.merge(object)

PS：Hibernate里面自带的方法，推荐使用。

2、Found two representations of same collection

错误原因：见1。

解决方法：session.merge(object)
