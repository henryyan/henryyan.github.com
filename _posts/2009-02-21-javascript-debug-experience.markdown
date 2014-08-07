--- 
layout: post
title: "转：Javascript 脚本的调试经验"
wordpress_id: 255
wordpress_url: http://www.wsria.com/?p=255
date: 2009-02-21 20:03:38 +08:00
category: javascript
tags: 
 - 调试
---
随着用JavaScript编程的深入，你会开始理解那些JavaScript给出的不透明错误信息。一旦你理解了你常犯的一般性错误，你就会很快知 道怎样避免它们，这样你写的代码中的错误将越来越少。编程实际上是一种能随着时间不断飞快进步的技术。但是不管变得多么熟练，你仍然要花一些时间调试你的 代码。如果你做过家庭作业，或有过JacaScript编程经验，你会知道相当多的时间是花在调试上。这很正常 - 这只是编程者必须做的事之一。实际上，按照大量的研究，程序员平均百分之五十的时间花在解决代码中的错误。

关键是学会怎样有效地调试你的程序。我有一些技巧可以帮助你解决程序为什么没有象应该的那样运行，或者帮你首先避免写有很多错误的代码：

1.用不同方式打印出变量
2.注意一般性错误
3.编码之前先想好
--------------------------------------------------------------------------------
如果JavaScript没能捕获你的错误，你也没有通过查看代码发现错误，有时打印出变量会对你有所帮助。最简单的方法是象下面这样使用一个alert()：

<!--more-->
<div class="highlighter">
<ol class="highlighter-c">
	<li><span> </span><span class="comment">//?theGreeting?gets?a?name?using?getName,?then?presents</span></li>
	<li class="alt"><span> </span><span class="comment">//?one?or?two?alert?boxes?depending?on?what?the?name?is</span></li>
	<li><span> </span><span class="comment">//function?getName()</span></li>
	<li class="alt"><span> {</span></li>
	<li><span> </span><span class="keyword">var</span><span> first_name?=?prompt(</span><span class="string">"what's?your?first?name?"</span><span>,</span><span class="string">""</span><span>);</span></li>
	<li class="alt"><span> </span><span class="keyword">var</span><span> last_name?=?prompt(</span><span class="string">"what's?your?last?name?"</span><span>,</span><span class="string">""</span><span>);</span></li>
	<li><span> </span><span class="keyword">var</span><span> the_name?=?first_name?+ </span><span class="string">"?"</span><span> +?last_name;</span></li>
	<li class="alt"><span> alert(</span><span class="string">"in?getName,?the_name?is:?"</span><span> +?the_name);</span></li>
	<li><span> }</span></li>
</ol>
</div>
-----------------------------<span style="color: #ff0000;"><strong>找到错误</strong></span>--------------------------------------------------
<strong>1.一般性程序错误 </strong>
多数错误只是无聊的语法错误。记住关闭那些引号，大括号和小括号会花费很长时间，不过幸运的是 JavaScript自动错误检测器能捕获大部分此类错误。虽然JavaScript错误检测器随着日渐复杂的流览器而不断完善，但是一些错误仍会溜走。 下面是一些需要留意的常见错误：

<strong>2.混淆变量名或函数名</strong>
大写和复数变量和函数名产生的错误令人烦恼地经常出现，有时JavaScript错误检测器不 能捕获它们。通过建立和坚持使用一种对变量和函数的命名协定，会大大减少这些麻烦的数量。例如，我全部用小写字母定义变量，并用下划线代替空格 （my_variable,the_data, an_example_variable），用内置符号表示函数 (addThreeNumbers(), writeError()等)。我避免使用任何复数，因为我总是忘记那些变量是不是复数。

<strong>3.偶然地使用了保留字</strong>
一些字不能作为变量名，因为它们已经被JavaScript使用。例如，不能定义一个叫 “if”的变量，因为它实际上是JavaScript的一部分 - 如果使用“if”，你会遇到各种麻烦。当你因为使用命名为“if”的变量而变得疯狂时，一个叫做“document”的变量是很诱人的。不幸的 是，“document”是一个JavaScript对象。另一个经常遇到的问题是把变量命名为“name”（窗体元素有“names”属性）。把变量命 名为“name”不会总出问题，只是有时 - 这会更使人迷惑 - 这就是避免使用“name”变量的原因。
不幸的是，不同的流览器有不同的保留字，所以没有办法知道该回避哪些字。最安全的办法是避免使用已经成为JavaScript一部分的字和HTML使用的字。如果你因为变量遇到问题，并且不能发现哪儿错了，试着把变量改个名字。如果成功了，你或许就避开了保留字。

<strong>4.记住在逻辑判断时应该用两个等号</strong>
一些流览器能捕获这种错误，有些却不能。这是一种非常常见的错误，但是如果流览器不能替你指出来，你就很难发现。下面是一个这种错误的例子：
<div class="highlighter">
<ol class="highlighter-c">
	<li><span> </span><span class="keyword">var</span><span> the_name?=?prompt(</span><span class="string">"what's?your?name?"</span><span>, </span><span class="string">""</span><span>);</span></li>
	<li class="alt"><span> </span><span class="keyword">if</span><span> (the_name?= </span><span class="string">"the?monkey"</span><span>)</span></li>
	<li><span> {</span></li>
	<li class="alt"><span> alert(</span><span class="string">"hello?monkey!"</span><span>);</span></li>
	<li><span> } </span><span class="keyword">else</span><span> {</span></li>
	<li class="alt"><span> alert(</span><span class="string">"hello?stranger."</span><span>);</span></li>
	<li><span> }</span></li>
</ol>
</div>
这段代码将产生“hello monkey!”警告对话框 - 不管你在提示里敲的是什么 - 这不是我们希望的。原因是在if-then语句中只有一个等号，这句话告诉JavaScript你想让一件事等于另一件。假设你在提示中敲的是 “robbie the robot”。最开始，变量the_name的值是“robbie the robot”，但是随后if语句告诉JavaScript你想把the_name设为“the monkey.”。于是JavaScript很高兴地执行你的命令，送一个“true”消息给if-then语句，结果警告对话框每次都出现“hello monkey!”。这种阴险的错误会使你发疯，所以注意使用两个等号。

<strong>5.偶然给变量加上了引号，或忘了给字符串加引号</strong>
我不时遇到这个问题。JavaScript区分变量和字符串的唯一方法是：字符串有引号，变量没有。下面有一个明显的错误：
<div class="highlighter">
<ol class="highlighter-c">
	<li><span> </span><span class="keyword">var</span><span> the_name?= </span><span class="string">'koko?the?gorilla'</span><span>;</span></li>
	<li class="alt"><span> alert(</span><span class="string">"the_name?is?very?happy"</span><span>);</span></li>
</ol>
</div>
虽然the_name是一个变量，但是程序还会产生一个提示“the_name is very happy,”的警告对话框。这是因为一旦JavaScript看见引号包围着某些东西就不再考虑它，所以当你把the_name放在引号里，你就阻止了 JavaScript从内存中查找它。下面是一个不太明显的此类错误的扩展：
<div class="highlighter">
<ol class="highlighter-j">
	<li><span> function?wakeMeIn3()</span></li>
	<li class="alt"><span> {</span></li>
	<li><span> var?the_message?= </span><span class="string">"Wake?up!?Hey!?Hey!?WAKE?UP!!!!"</span><span>;</span></li>
	<li class="alt"><span> setTimeout(</span><span class="string">"alert(the_message);"</span><span>, </span><span class="number">3000</span><span>);</span></li>
	<li><span> }</span></li>
</ol>
</div>
这里的问题是你告诉JavaScript三秒后执行alert(the_message)。但是，三秒后the_message将不再存在，因为你已经退出了函数。这个问题可以这样解决：
<div class="highlighter">
<ol class="highlighter-c">
	<li><span> </span><span class="keyword">function</span><span> wakeMeIn3()</span></li>
	<li class="alt"><span> {</span></li>
	<li><span> </span><span class="keyword">var</span><span> the_message?= </span><span class="string">"Wake?up!"</span><span>;</span></li>
	<li class="alt"><span> setTimeout(</span><span class="string">"alert('"</span><span> +?the_message+ </span><span class="string">"');"</span><span>,?3000);</span></li>
	<li><span> }</span></li>
</ol>
</div>
把the_message放在引号外面，命令“alert('Wakeup!');”由 setTimeout预定好，就可以得到你想要的。这只是一些可能在你的代码中作祟的很难调试的错误。一旦发现了它们，就有不同的或好或差的方法来改正错 误。你很幸运，因为你能从我的经验和错误中获益。

-------------------------------<span style="color: #ff0000;"><strong>清除错误</strong></span>------------------------------------
找到错误，有时侯虽然很难，却只是第一步。然后你必须<span style="color: #ff0000;"><strong>清除错误</strong></span>。下面是一些在清除错误时应该做的一些事：
<strong>
首先拷贝你的程序</strong>
有些错误很难清除。实际上，有时在根除错误时，你会破坏整个程序 - 一个小错误使你疯狂。在开始调试前保存你的程序是确保错误不会利用你的最好方法。

<strong>一次修正一个错误</strong>
如果你知道有好几个错误，应该修正一个，检验其结果，再开始下一个。一次修正许多错误而不检验你的工作只会招致更多的错误。

<strong>警惕迷惑性错误</strong>
有时你知道存在一个错误，但不真正知道为什么。假设有一个变量“index”，由于某种原因 “index”总比你期望的小1。你可以做下面两件事中的一件：在那儿坐一会儿，解决它为什么变小了，或只是耸耸肩；在使用“index”之前加1,然后 继续进行。后一种方法称为迷惑编程。当你开始思考“究竟是怎么了 - 为什么index是2而不是3呢？好吧...我现在先让它正常工作，以后再修改错误。”时，你正在把一块护创膏布贴到一处潜在的硬伤上。
迷惑编程可能在短期内有用，但是你可以看到长期的厄运 - 如果你没有完全理解你的代码到可以真正清除错误的程度，那个错误将会回来困扰你。它或者以另一种你不能解决的怪异错误的方式回来，或者当下一个可怜的被诅咒的灵魂读你的代码时，他会发现你的代码非常难以理解。

<strong>寻找小错误</strong>
有时侯，对程序员来说，剪切和粘贴代码的能力是一种很坏的事。通常，你会在一个函数中写一些 JavaScript代码，然后把它们剪切和粘贴到另一个函数中。如果第一个函数有问题，那么现在两个函数都有问题。我并不是说你不应该剪切和粘贴代码。 但是错误会以某种方式繁殖，如果你发现了一个错误，你就应该寻找与其相似的其它错误。（或者在制作它的若干版本之前确切知道会发生什么。）变量名拼写错误 在一段JavaScript代码中会突然多次出现 - 在一个地方把the_name错拼成teh_name，你就有机会在其它地方发现这个错误。

<strong>如果所有其它的方法都失败了</strong>
如果你正坐在那儿盯着一个错误，并且不能指出是怎么回事（或者根本没有发现错误，但是因为程序 不能正确运行，你知道存在错误），你最好从计算机前走开。去读一本书，在角落散散步，或者拿一杯可口的饮料 - 做些事，任何事，但不要去想程序或问题。这种技术在某种情况下叫做“酝酿”，效果非常好。在你稍做休息和放松后，再试着找出错误。你会得到一幅比较清晰的 景象。“酝酿”起作用是因为它使你从思维混乱中解脱出来。如果沿着一条错路走太远，你有时会发现无法转身。这种情况下最好开辟一条新路。我知道这会令人发 火，但确实有效。真的！

<strong>如果上面的方法还不成功...</strong>
请求别人的帮助。有时你的思想会形成定式，只有换一种眼光才能洞察问题之所在。在结构化编程环 境中，程序员们定期地互相复查别人的代码。这可以适当地叫做“代码复查”，不仅可以帮助消除错误，还可以得到更好的代码。不要怕把你的 JavaScript代码给别人看,它会使你成为更好的JavaScript程序员。
<strong>
但是消除错误的绝对最好的办法是...</strong>
一开始就创建没有错误的代码。

-------------------------------<span style="color: #ff0000;"><strong>创建没有错误的代码</strong></span>---------------------------------------
编好程序的关键是程序是写给人的，不是写给计算机的。如果你能明白其他人或许会阅读你的 JavaScript，你就会写更清晰的代码。代码越清晰，你就越不容易犯错误。机灵的代码是可爱的，但就是这种机灵的代码会产生错误。最好的经验法则是 KISS，即Keep It Simple,Sweetie（保持简单，可爱）。另一个有帮助的技术是在写代码之前作注释。这迫使你在动手之前先想好。一旦写好了注释，你就可以在其下 面写代码。
下面是一个用这种方法写函数的例子：

<strong>第一步：写注释</strong>

<strong>第二步：填充代码</strong>
这种先写注释的策略不仅迫使你在写代码前思考，而且使编码的过程看起来容易些 - 通过把任务分成小的，易于编码的各个部分，你的问题看起来就不太象珠穆朗玛峰，而象一群令人愉悦的起伏的小山。

<strong>最后...</strong> <strong>总以分号结束你的每一条语句。</strong>
虽然并不是严格必需，你应该养成以分号结束每一条语句的习惯，这样可以避免这行后面再有代码。 忘了加分号，下一行好的代码会突然产生错误。把变量初始化为“var”，除非你有更好的理由不这样做。用“var”把变量局域化可以减少一个函数与另一个 不相关函数相混淆的机会。
好了，既然你已经知道了如何编码，下面就让我们学习怎样使

<strong><span style="color: #ff0000;">你的JavaScript快速运行</span>。&gt;&gt;</strong>
---------------------------------------------------------
按速度优化JavaScript代码
1.限制循环内的工作量
2.定制if-then-else语句，按最可能到最不可能的顺序
3.最小化重复执行的表达式
