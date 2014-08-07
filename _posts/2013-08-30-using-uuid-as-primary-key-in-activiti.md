---
layout: post
title: "在Activiti中使用UUID作为主键生成策略"
category: activiti
tags: 
 - Activiti
 - UUID
 - 主键
---

## 1. 默认的主键生成策略

了解过Activiit表中数据的同学可能知道记录的主键ID是用自增的生成策略，这样的生成策略有两个优点：

* 有顺序：所有引擎的表在插入新记录时全部使用同一个ID生成器
* 便于记忆：因为是自增的所以有一定的顺序，便于记忆；例如业务人员让管理员删除一条数据（ID为5位左右的长度），管理员只要看一眼就可以记住

当然也有**缺点**：

* 随着时间的推移或者数据量非常大自增的ID生成策略的“便于记忆”优势也就不存在了，因为ID的位数会逐步增加（举个例子，我们公司做的一个小系统，用户量在30人左右，ID的长度已经到了7位数）
* 并发量高时会**可能**导致主键冲突

在引擎初始化的时候会注册ID生成器，看过源码的同学还可能知道有一个类：**org.activiti.engine.impl.db.DbIdGenerator**，这个类实现了一个接口：**org.activiti.engine.impl.cfg.IdGenerator**：

<pre class="brush:java">
public interface IdGenerator {
  String getNextId();
}
</pre>

该接口仅有一个方法，返回一个String类型的字符串，有兴趣的同学可以去看看引擎默认的生成器源码，接下来介绍如何更改引擎的主键生成器。

## 2. 更改默认的主键生成器

UUID是全球唯一的主键生成器，也是除自增策略之外最常用的一种，很幸运：引擎内置了UUID生成器实现。

要更改引擎默认的主键生成器很简单，只需要在配置引擎时覆盖一个属性即可，代码如下：

<pre class="brush:xml">
<bean id="uuidGenerator" class="org.activiti.engine.impl.persistence.StrongUuidGenerator" />
<bean id="processEngineConfiguration" class="org.activiti.spring.SpringProcessEngineConfiguration">
	<property name="idGenerator" ref="uuidGenerator" />
</bean>
</pre>

ID为“uuidGenerator”的bean对象就是引擎内部提供的UUID生成器，把Bean对象注册好以后覆盖引擎的“idGenerator”属性即可；再次启动系统后创建的新数据都会用UUID生成策略。

### 2.1 添加依赖

引擎提供的UUID生成器依赖fastxml的一个模块，需要在pom.xml（Maven工程）中添加如下依赖：

<pre class="brush:xml">
<dependency>
    <groupId>com.fasterxml.uuid</groupId>
    <artifactId>java-uuid-generator</artifactId>
    <version>3.1.3</version>
</dependency>
</pre>

![用UUID生成策略产生的ID](/files/2013/08/uuid-example.png)

## 3. 自定义ID生成器

* Step 1：创建一个类实现接口**org.activiti.engine.impl.cfg.IdGenerator**
* Step 2：参考本文第2部分 ^_^