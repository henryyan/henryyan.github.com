--- 
layout: post
title: "出现net.sf.json.JSONException: There is a cycle in the hierarchy异常的解决办法"
wordpress_id: 14
wordpress_url: http://wsria.com/?p=14
date: 2009-02-07 18:33:22 +08:00
category: json
tags: 
 - hibernate
 - json-lib
---
因为项目中使用了AJAX技术，JAR包为：json-lib.jar，?在开发过程中遇到了一个JSON-LIB和Hibernate有关的问题：

net.sf.json.JSONException: There is a cycle in the hierarchy!

<!--more-->
<pre class="brush: java" line="1">
at net.sf.json.util.CycleDetectionStrategy$StrictCycleDetectionStrategy.handleRepeatedReferenceAsObject(CycleDetectionStrategy.java:97)
at net.sf.json.JSONObject._fromBean(JSONObject.java:857)
at net.sf.json.JSONObject.fromObject(JSONObject.java:192)
at net.sf.json.JSONObject._processValue(JSONObject.java:2774)
at net.sf.json.JSONObject._setInternal(JSONObject.java:2798)
at net.sf.json.JSONObject.setValue(JSONObject.java:1507)
at net.sf.json.JSONObject._fromBean(JSONObject.java:940)
at net.sf.json.JSONObject.fromObject(JSONObject.java:192)
at net.sf.json.JSONObject._processValue(JSONObject.java:2774)
at net.sf.json.JSONObject._setInternal(JSONObject.java:2798)
at net.sf.json.JSONObject.setValue(JSONObject.java:1507)
at net.sf.json.JSONObject._fromBean(JSONObject.java:940)
at net.sf.json.JSONObject.fromObject(JSONObject.java:192)
at net.sf.json.JSONObject._processValue(JSONObject.java:2774)
at net.sf.json.JSONObject._setInternal(JSONObject.java:2798)
at net.sf.json.JSONObject.setValue(JSONObject.java:1507)
at net.sf.json.JSONObject._fromBean(JSONObject.java:940)
at net.sf.json.JSONObject.fromObject(JSONObject.java:192)
at net.sf.json.JSONObject._processValue(JSONObject.java:2774)
at net.sf.json.JSONObject._setInternal(JSONObject.java:2798)
at net.sf.json.JSONObject.setValue(JSONObject.java:1507)
at net.sf.json.JSONObject._fromBean(JSONObject.java:940)
at net.sf.json.JSONObject.fromObject(JSONObject.java:192)
at net.yanhl.iouser.action.IOUserAction.loadUser(IOUserAction.java:142)
</pre>
因为Hibernate中设置了自身关联：
Iouser.hbm.xml:
<pre class="brush: xml" line="25">
<many-to-one name="group" class="net.yanhl.iouser.pojo.GroupRelation" lazy="false" cascade="none">
<column name="group_id" />
</many-to-one>
</pre>

//设置自身关联的组对象
<pre class="brush: java" line="5">
public class GroupRelation implements Serializable {

private static final long serialVersionUID = 6202253180943473205L;
private Integer id;// 主键ID
private Integer creatorId;// 创建人
private Date createDate;// 创建日期
private String groupName;// 组名称
private GroupRelation parentGroup;
private Set<GroupRelation> childGroups = new HashSet<GroupRelation>();
</pre>

<pre class="brush: xml" line="10">
<many-to-one name="parentGroup" column="parent_id" lazy="false"
class="net.yanhl.iouser.pojo.GroupRelation">
</many-to-one>

<set name="childGroups" cascade="save-update" inverse="true">
<key column="parent_id"></key>
<one-to-many class="net.yanhl.iouser.pojo.GroupRelation" />
</set>
</pre>

起初想通过hibernate来解决问题，就是想过滤掉自身关联后来查资料发现不可能实现，最后找到通过JSON-LIB来过滤关联的集合属性，代码如下：
<pre class="brush: java" line="56">
JsonConfig config = new JsonConfig();
config.setJsonPropertyFilter(new PropertyFilter(){
	public boolean apply(Object source, String name, Object value) {
		if(name.equals("parentGroup") || name.equals("childGroups")) {
			return true;
		} else {
			return false;
		}
	}
});
Iouser user = (Iouser) getBaseManager().get(Iouser.class, iouserId);
JSONObject jsonObject = JSONObject.fromObject(user, config);
</pre>

当JSON-LIB解析JAVABEAN时过滤掉parentGroup、childGroups这两个属性，重新启动服务，pass
