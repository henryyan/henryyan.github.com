--- 
layout: post
title: "Hibernate的映射类型 hibernate mysql映射类型"
wordpress_id: 667
wordpress_url: http://www.wsria.com/?p=667
date: 2009-07-30 11:47:56 +08:00
tags: 
 - hibernate
---
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td width="142" valign="top"><strong>Hibernate  映射类型</strong></td>
<td width="165" valign="top"><strong>Java 类型</strong></td>
<td width="119" valign="top"><strong>标准 SQL 类型</strong></td>
<td width="142" valign="top"><strong>大小和取值范围</strong></td>
</tr>
<tr>
<td width="142" valign="top">integer 或者  int</td>
<td width="165" valign="top">int 或者  java.lang.Integer</td>
<td width="119" valign="top">INTEGER</td>
<td width="142" valign="top">4 字节</td>
</tr>
<tr>
<td width="142" valign="top">long</td>
<td width="165" valign="top">long? Long</td>
<td width="119" valign="top">BIGINT</td>
<td width="142" valign="top">8 字节</td>
</tr>
<tr>
<td width="142" valign="top">short</td>
<td width="165" valign="top">short? Short</td>
<td width="119" valign="top">SMALLINT</td>
<td width="142" valign="top">2 字节</td>
</tr>
<tr>
<td width="142" valign="top">byte</td>
<td width="165" valign="top">byte? Byte</td>
<td width="119" valign="top">TINYINT</td>
<td width="142" valign="top">1 字节</td>
</tr>
<tr>
<td width="142" valign="top">float</td>
<td width="165" valign="top">float? Float</td>
<td width="119" valign="top">FLOAT</td>
<td width="142" valign="top">4 字节</td>
</tr>
<tr>
<td width="142" valign="top">double</td>
<td width="165" valign="top">double? Double</td>
<td width="119" valign="top">DOUBLE</td>
<td width="142" valign="top">8 字节</td>
</tr>
<tr>
<td width="142" valign="top">big_decimal</td>
<td width="165" valign="top">java.math.BigDecimal</td>
<td width="119" valign="top">NUMERIC</td>
<td width="142" valign="top">NUMERIC(8,2)8 位</td>
</tr>
<tr>
<td width="142" valign="top">character</td>
<td width="165" valign="top">char? Character?  String</td>
<td width="119" valign="top">CHAR(1)</td>
<td width="142" valign="top">定长字符</td>
</tr>
<tr>
<td width="142" valign="top">string</td>
<td width="165" valign="top">String</td>
<td width="119" valign="top">VARCHAR</td>
<td width="142" valign="top">变长字符串</td>
</tr>
<tr>
<td width="142" valign="top">boolean</td>
<td width="165" valign="top">boolean? Boolean</td>
<td width="119" valign="top">BIT</td>
<td width="142" valign="top">布尔类型</td>
</tr>
<tr>
<td width="142" valign="top">yes_no</td>
<td width="165" valign="top">boolean? Boolean</td>
<td width="119" valign="top">CHAR(1) (Y-N)</td>
<td width="142" valign="top">布尔类型</td>
</tr>
<tr>
<td width="142" valign="top">true_false</td>
<td width="165" valign="top">boolean? Boolean</td>
<td width="119" valign="top">CHAR(1) (T-F)</td>
<td width="142" valign="top">布尔类型</td>
</tr>
</tbody></table>
2 、  Java 时间和日期类型的 Hibernate 映射
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td width="127" valign="top"><strong>映射类型</strong></td>
<td width="157" valign="top"><strong>Java 类型</strong></td>
<td width="142" valign="top"><strong>标准 SQL 类型</strong></td>
<td width="142" valign="top"><strong>描述</strong></td>
</tr>
<tr>
<td width="127" valign="top">date</td>
<td width="157" valign="top">util.Date 或者  sql.Date</td>
<td width="142" valign="top">DATE</td>
<td width="142" valign="top">YYYY-MM-DD</td>
</tr>
<tr>
<td width="127" valign="top">time</td>
<td width="157" valign="top">Date??? Time</td>
<td width="142" valign="top">TIME</td>
<td width="142" valign="top">HH:MM:SS</td>
</tr>
<tr>
<td width="127" valign="top">timestamp</td>
<td width="157" valign="top">Date?? Timestamp</td>
<td width="142" valign="top">TIMESTAMP</td>
<td width="142" valign="top">YYYYMMDDHHMMSS</td>
</tr>
<tr>
<td width="127" valign="top">calendar</td>
<td width="157" valign="top">calendar</td>
<td width="142" valign="top">TIMESTAMP</td>
<td width="142" valign="top">YYYYMMDDHHMMSS</td>
</tr>
<tr>
<td width="127" valign="top">calendar_date</td>
<td width="157" valign="top">calendar</td>
<td width="142" valign="top">DATE</td>
<td width="142" valign="top">YYYY-MM-DD</td>
</tr>
</tbody></table>
3 、  Java 大对象类型的 Hibernate 映射类型
<table border="1" cellspacing="0" cellpadding="0">
<tbody>
<tr>
<td width="114" valign="top"><strong>映射类型</strong></td>
<td width="114" valign="top"><strong>Java 类型</strong></td>
<td width="114" valign="top"><strong>标准 SQL 类型</strong></td>
<td width="114" valign="top"><strong>MySQL  类型</strong></td>
<td width="114" valign="top"><strong>Oracle 类型</strong></td>
</tr>
<tr>
<td width="114" valign="top">binary</td>
<td width="114" valign="top">byte[]</td>
<td width="114" valign="top">VARBINARY( 或  BLOB)</td>
<td width="114" valign="top">BLOB</td>
<td width="114" valign="top">BLOB</td>
</tr>
<tr>
<td width="114" valign="top">text</td>
<td width="114" valign="top">String</td>
<td width="114" valign="top">CLOB</td>
<td width="114" valign="top">TEXT</td>
<td width="114" valign="top">CLOB</td>
</tr>
<tr>
<td width="114" valign="top">serializable</td>
<td width="114" valign="top">Serializable  接口任意实现类</td>
<td width="114" valign="top">VARBINARY( 或  BLOB)</td>
<td width="114" valign="top">BLOB</td>
<td width="114" valign="top">BLOB</td>
</tr>
<tr>
<td width="114" valign="top">clob</td>
<td width="114" valign="top">java.sql.Clob</td>
<td width="114" valign="top">CLOB</td>
<td width="114" valign="top">TEXT</td>
<td width="114" valign="top">CLOB</td>
</tr>
<tr>
<td width="114" valign="top">blob</td>
<td width="114" valign="top">java.sql.Blob</td>
<td width="114" valign="top">BLOB</td>
<td width="114" valign="top">BLOB</td>
<td width="114" valign="top">BLOB</td>
</tr>
</tbody></table>
在程序中通过 Hibernate 来保存  java.sql.Clob 或者 java.sql.Blob  实例时，必须包含两个步骤：

在一个数据库事务中先保存一个空的 Blob  或 Clob 实例。

接着锁定这条记录，更新上面保存的 Blob  或 Clob 实例，把二进制数据或文本数据写到 Blob  或 Clob 实例中
