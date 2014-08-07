--- 
layout: post
title: "Json-lib 与 hibernate 共同使用的问题"
wordpress_id: 724
wordpress_url: http://www.wsria.com/?p=724
date: 2009-10-24 13:28:20 +08:00
tags: 
 - hibernate
 - json-lib
---
<div>Posted by: <a href="http://www.groovygrails.com/conference/speaker/andres_almiray.html">Andres  Almiray</a> on 05/01/2008 <a title="原文" href="http://www.groovygrails.com/blog/andres_almiray/2008/05/json_lib__hibernate_tips_and_hints.html" target="_blank">原文</a></div>
hibernate使用CGLIB把POJO的domain对象动态代理，实现它的魔法，但是给JSON的序列化带来了麻烦，因为JSON无法对lazy的属性进行序列化。有以下的四个方法可以解决hibernate的序列化问题
<ol>
	<li><code>domain类实现JSONString接口
</code></li>
	<li>建立JsonConfig实例，并配置属性排除列表</li>
	<li><code>用属性过滤器</code></li>
	<li>写一个自定义的JsonBeanProcessor</li>
</ol>
1. 实现JSONString接口是侵入性最强的方法
<pre class="brush: java">public class Person implements JSONString {
   private String name;
   private String lastname;
   private Address address;

   // getters &amp; setters

   public String toJSONString() {
      return "{name:'"+name+"',lastname:'"+lastname+"'}";
   }
}</pre>
<pre class="brush: java"><!--more--></pre>
2.第二种方法通过jsonconfig实例，对包含和需要排除的属性进行方便添加删除
<pre class="brush: java">public class Person {
   private String name;
   private String lastname;
   private Address address;

   // getters &amp; setters
}

JsonConfig jsonConfig = new JsonConfig();
jsonConfig.setExclusions( new String[]{ "address" } );
Person bean = /* initialize */;
JSON json = JSONSerializer.toJSON( bean, jsonConfig );</pre>
注意：这种方法不区分目标类，就是说如果有2个bean当中都存在“address”属性，那么采用这种方法，这两个bean中的address属性都将被排除

3. 使用propertyFilter可以允许同时对需要排除的属性和类进行控制，这种控制还可以是双向的，也可以应用到json字符串到java对象
<pre class="brush: java">public class Person {
   private String name;
   private String lastname;
   private Address address;

   // getters &amp; setters
}

JsonConfig jsonConfig = new JsonConfig();
jsonConfig.setJsonPropertyFilter( new PropertyFilter(){
   public boolean apply( Object source, String name, Object value ){
      // return true to skip name
      return source instanceof Person &amp;&amp; name.equals("address");
   }
});
Person bean = /* initialize */;
JSON json = JSONSerializer.toJSON( bean, jsonConfig )</pre>
4.  最后来看JsonBeanProcessor,这种方式和实现JsonString很类似，返回一个代表原来的domain类的合法JSONOBJECT
<pre class="brush: java">public class Person {
   private String name;
   private String lastname;
   private Address address;

   // getters &amp; setters
}

JsonConfig jsonConfig = new JsonConfig();
jsonConfig.registerJsonBeanProcessor( Person.class,
   new JsonBeanProcessor(){
      public JSONObject processBean( Object bean, JsonConfig jsonConfig ){
         if( !(bean instanceof Person) ){
            return new JSONObject(true);
         }
         Person person = (Person) bean;
         return new JSONObject()
            .element( "name", person.getName() )
            .element( "lastname", person.getLastname() );
      }
});
Person bean = /* initialize */;
JSON json = JSONSerializer.toJSON( bean, jsonConfig );</pre>

----
用fastjson可以自动忽略！