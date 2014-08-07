--- 
layout: post
title: "站点GBK编码下jQuery Ajax中文乱码解决方案"
wordpress_id: 611
wordpress_url: http://www.wsria.com/?p=611
date: 2009-07-01 13:18:03 +08:00
tags: 
 - 乱码
 - ajax
---
哎，还是老话题，一直缠绕着国人……

现在来个快刀斩乱麻，let's go
由于项目前期使用的是1.2.6版本，后期使用的是1.3.2版本，所以分开来讲;

说说实现的办法，有点暴力——直接修改jQury源码，不过不用担心，不会影响整体功能而且就修改几行代码就可以解决乱码，也就是在发送请求的时候把参数值再进行一次转码，修改的方法为<em><strong>param</strong></em>

1、jQuery <strong>1.2.6</strong> 乱码解决办法
<ul>
	<li>打开1.2.6版本的源文件</li>
	<li>找到第2911、2921、2924行，分别修改对应参数值的地方包裹一层encodeURIComponent即可，修改后的结果如下：
<pre class="brush: js">param: function( a ) {
		var s = [];

		// If an array was passed in, assume that it is an array
		// of form elements
		if ( a.constructor == Array || a.jquery )
			// Serialize the form elements
			jQuery.each( a, function(){
				s.push( encodeURIComponent(this.name) + "=" + encodeURIComponent(encodeURIComponent( this.value )) );
			});

		// Otherwise, assume that it's an object of key/value pairs
		else
			// Serialize the key/values
			for ( var j in a )
				// If the value is an array then the key names need to be repeated
				if ( a[j] &amp;&amp; a[j].constructor == Array )
					jQuery.each( a[j], function(){
						s.push( encodeURIComponent(j) + "=" + encodeURIComponent(encodeURIComponent( this )) );
					});
				else
					s.push( encodeURIComponent(j) + "=" + encodeURIComponent(encodeURIComponent( jQuery.isFunction(a[j]) ? a[j]() : a[j] )) );

		// Return the resulting serialization
		return s.join("&amp;").replace(/%20/g, "+");
	}</pre>
[download id="19" format="1"]
[download id="21" format="1"]
</li>
</ul>
2、jQuery <strong>1.3.2 </strong>乱码解决办法

1.3.2的就不用这么麻烦了，因为这个版本简化了param方法的结构，只需要修改一行代码即可，因为只有一个地方转码了

找到第3737行，同样包裹一层encodeURIComponent，结果如下：
<pre class="brush: js">	param: function( a ) {
		var s = [ ];

		function add( key, value ){
			s[ s.length ] = encodeURIComponent(key) + '=' + encodeURIComponent(encodeURIComponent(value));
		};</pre>
[download id="20" format="1"]
[download id="22" format="1"]



<pre>重要说明：后台必须要转码：java.net.URLDecoder.decode(request.getParameter("name"), "UTF-8")</pre>



