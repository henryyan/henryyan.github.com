--- 
layout: post
title: "使用hibernate和json-lib时忽略属性和集合"
wordpress_id: 670
wordpress_url: http://www.wsria.com/?p=670
date: 2009-08-04 22:58:20 +08:00
tags: 
 - hibernate
---
在使用Java语言开发项目的时候一般都是使用SSH架构，基本上大家没有例外，目前流利的Ajax技术给我们开发的系统了带来了不少的改善和性能方面的提高，去年开始学习了jQuery框架，因为使用Java语言做为后台而且jQuery中使用是目前数据结构良好的且方便的JSON做为数据传输方式，所以就在JSON官网找到了json-lib这个第三方JAR包，后来学习了一下就在finance系统中试用了一下，感觉不错；但是也遇到了一些问题，比如当我们映射了hibernate对象后，两个表做了关联，如下例子：
<pre class="brush: sql" line="1">
create table people(id bigint not null auto_increment primary key,
        name varchar(20) not null);   

create table location(id bigint not null auto_increment,
        peopleId bigint not null,addr varchar(20) not null,primary key(id,peopleId));  
</pre>
<!--more-->
People类：
<pre class="brush: xml" line="1">
  <?xml version="1.0"?>  
 <!DOCTYPE hibernate-mapping PUBLIC    
     "-//Hibernate/Hibernate Mapping DTD 3.0//EN"   
     "http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">  
 <hibernate-mapping package="org.test.bean">  
   
    <class name="People" table="people">  
        <id name="id" column="id">  
           <generator class="native"/>  
         </id>  
         <property name="name" type="string" column="name"/>  
         <set name="locations" cascade="save-update" lazy="false">  
             <key column="peopleId"/>  
             <one-to-many class="Location"/>  
         </set>  
     </class>  
       
</hibernate-mapping>  
</pre>

Location 类：
<pre class="brush: xml" line="1">
 <?xml version="1.0"?>  
 <!DOCTYPE hibernate-mapping PUBLIC    
     "-//Hibernate/Hibernate Mapping DTD 3.0//EN"   
     "http://hibernate.sourceforge.net/hibernate-mapping-3.0.dtd">  
 <hibernate-mapping    
     package="org.test.bean">  
  
    <class name="Location" table="location">  
        <id name="id" column="id">  
            <generator class="native"/>  
         </id>  
         <property name="peopleId" type="integer" column="peopleId"/>  
         <property name="addr" type="string" column="addr"/>  
     </class>  
       
</hibernate-mapping>  
</pre>

从上面来看很明显Person和Location是一对多的关系，这样我们就可以这样做：

伪代码：
<pre class="brush: java">
People people= session.get(People.class, 20);
JSONObject fromObject = JSONObject.fromObject(person );
response.getWriter().print(fromObject.toString());
</pre>

如果我们现在只需要把person对象的属性输出到前台，而上面的代码是把整个Person对象所有的属性都输出到前台了，
根据需求这不是我们要的结果，比如只需要一个people对象的name属性即可，如果你用过json-lib的话就知道 JSONObject输出的时候是输出整个对象的所有属性（在没有任何设置的情况下），看看people类的属性中有一个locations的集合中里面，假如现在people对象中有10个Location对象而我们现在不需要Location的任何信息该怎么办呢？
看看json-lib的API就知道了，提供了一系列的自定义属性、对象处理接口供我们实现，后来就发现了这个PropertyFilter接口，然后就写了一个实现类出来：
<pre class="brush: java" line="1">
package net.sf.json.processors;

import java.lang.reflect.Field;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Set;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;

import net.sf.json.util.PropertyFilter;
import net.yanhl.util.StringUtil;

/**
 * <p>Title: 忽略属性</p>
 * <p>Description：忽略JAVABEAN的指定属性、是否忽略集合类属性</p>
 * 
 * @author 闫洪磊
 * @since  1.0
 * @version 1.0.0.20090630
 */
public class IgnoreFieldProcessorImpl implements PropertyFilter {
	
	Log log = LogFactory.getLog(this.getClass());
	
	/**
	 * 忽略的属性名称
	 */
	private String[] fields;
	
	/**
	 * 是否忽略集合
	 */
	private boolean ignoreColl = false;
	
	/**
	 * 空参构造方法<br/>
	 * 默认不忽略集合
	 */
	public IgnoreFieldProcessorImpl() {
		// empty
	}
	
	/**
	 * 构造方法
	 * @param fields 忽略属性名称数组
	 */
	public IgnoreFieldProcessorImpl(String[] fields) {
		this.fields = fields; 
	}
	
	/**
	 * 构造方法
	 * @param ignoreColl	是否忽略集合
	 * @param fields	忽略属性名称数组
	 */
	public IgnoreFieldProcessorImpl(boolean ignoreColl, String[] fields) {
		this.fields = fields;
		this.ignoreColl = ignoreColl; 
	}
	
	/**
	 * 构造方法
	 * @param ignoreColl 是否忽略集合
	 */
	public IgnoreFieldProcessorImpl(boolean ignoreColl) {
		this.ignoreColl = ignoreColl; 
	}

	public boolean apply(Object source, String name, Object value) {
		Field declaredField = null;
		try {
			declaredField = source.getClass().getDeclaredField(name);
		} catch (NoSuchFieldException e) {
			log.equals("没有找到属性" + name);
			e.printStackTrace();
		}
		
		// 忽略集合
		if (declaredField != null) {
			if(ignoreColl) {
				if(declaredField.getType() == Collection.class
						|| declaredField.getType() == Set.class
						|| declaredField.getType() == Map.class
						|| declaredField.getType() == List.class) {
					return true;
				}
			}
		}
		
		// 忽略设定的属性
		if(fields != null && fields.length > 0) {
			if(StringUtil.hasInArray(fields, name)) {
				return true;
			}
		}
		
		return false;
	}

	public String[] getFields() {
		return fields;
	}

	/**
	 * 设置忽略的属性
	 * @param fields
	 */
	public void setFields(String[] fields) {
		this.fields = fields;
	}

	public boolean isIgnoreColl() {
		return ignoreColl;
	}

	/**
	 * 设置是否忽略集合类
	 * @param ignoreColl
	 */
	public void setIgnoreColl(boolean ignoreColl) {
		this.ignoreColl = ignoreColl;
	}
}

</pre>
方法的功能都写清楚了，相信不用我解释了，下面来使用一下：
<pre class="brush: java">
JsonConfig config = new JsonConfig();
config.setJsonPropertyFilter(new IgnoreFieldProcessorImpl(true)); // 忽略掉集合对象

People people= session.get(People.class, 20);
JSONObject fromObject = JSONObject.fromObject(person, config );
response.getWriter().print(fromObject.toString());
</pre>
上面的代码就会忽略掉集合属性locations，<strong>忽略location的原因还有一个原因就是当集合中的lazy="true"时会出现session关闭的问题，因为当加载完一个对象后session就关闭了，然后我们再输入调用关联对象时就会抛出session close异常，所以忽略掉集合类是较好的选择</strong>

到这里还一个问题就是不需要people对象的nam值，只需要id，当然你可以直接getId()输出，这里为了演示请读者不要追究
<pre class="brush: java">
JsonConfig config = new JsonConfig();
config.setJsonPropertyFilter(new IgnoreFieldProcessorImpl(true, new String[]{"name"})); // 忽略掉name属性及集合对象

People people= session.get(People.class, 20);
JSONObject fromObject = JSONObject.fromObject(person, config );
response.getWriter().print(fromObject.toString());
</pre>
这样得到的就只是id属性了，因为name在自定义的filter中被忽略掉了

讲述的不太详细，因为项目中的例子比如庞大就自己随便写了一点，大概意思就是这样，希望读者可以使用成功，有问题请email或者msn 找我

本文来自<a href="http://www.wsria.com">www.wsria.com</a>，转载请注名出处
