--- 
layout: post
title: "单表查询树形结构的SQL语句"
wordpress_id: 241
wordpress_url: http://www.wsria.com/?p=241
date: 2009-02-20 18:25:14 +08:00
category: database
tags: 
 - sql
 - 树
 - 关联
---
今天在做一个项目模块的时候遇到了点问题，数据库设计是单表自身关联，就是增加一个字段保存父级ID实现树状数据结构，开始设计的时候没有考虑要怎么查询，今天做到着一步卡住了，不晓得怎么写SQL语句，当时还在想是不是没有这种案例，但是转念一想不肯能这么经典的案例都没有解决方案，然后google了一下晓得了：

Start with...Connect By子句递归查询

下面是从网上转载的内容：

<!--more-->
<pre class="brush: sql" line="1">
CREATE TABLE TBL_TEST
(
ID    NUMBER,
NAME  VARCHAR2(100 BYTE),
PID   NUMBER                                  DEFAULT 0
);

#插入测试数据：
INSERT INTO TBL_TEST(ID,NAME,PID) VALUES(''''1'''',''''10'''',''''0'''');
INSERT INTO TBL_TEST(ID,NAME,PID) VALUES(''''2'''',''''11'''',''''1'''');
INSERT INTO TBL_TEST(ID,NAME,PID) VALUES(''''3'''',''''20'''',''''0'''');
INSERT INTO TBL_TEST(ID,NAME,PID) VALUES(''''4'''',''''12'''',''''1'''');
INSERT INTO TBL_TEST(ID,NAME,PID) VALUES(''''5'''',''''121'''',''''2'''');

#从Root往树末梢递归
select * from TBL_TEST
start with id=1
connect by prior id = pid

#从末梢往树ROOT递归
select * from TBL_TEST
start with id=5
connect by prior pid = id
</pre>
