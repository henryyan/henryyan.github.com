--- 
layout: post
title: "利用Windows的计划任务自动更新最新的Chromium"
wordpress_id: 1159
wordpress_url: http://www.wsria.com/?p=1159
date: 2010-10-01 14:45:43 +08:00
tags: 
 - 计划任务
 - Chromium
---
为了最先体验谷歌浏览器的新功能，从Chrome换到了Chromium，但是Chromium一天将近20个的更新包如果手动更新那要搞死人了，到时不是我用Chromium而是被他玩了，何况程序员最不喜欢干的事情就是<strong>重复</strong>……
所以找到了小飞的一篇文章，<a href="http://shawphy.com/2010/09/fast-update-chromium.html" target="_blank">快速更新Chromium</a>，还是拿来主义进行修改……

久违我的博客了，这段时间因为公司的项目人手不足导致我现在开发工作很大所以一直也没有更新博客，等这个项目完成后会提取一些成果写技术博客。

<h3>1、修改的原因：</h3>
小飞的脚本中因为是手动执行的所以没有问题，我想的是利用windows的计划任务每天自动更新或者每天间隔2小时更新一次，当然这个根据自己的情况定

<h3>2、完整脚本：</h3>
<pre lang="text">
@echo off
set MY_CHROME_HOME=E:\chrome
cd %MY_CHROME_HOME%
del %MY_CHROME_HOME%\chrome-win32.zip
wget http://build.chromium.org/buildbot/snapshots/chromium-rel-xp/LATEST
set/p=wget -P %MY_CHROME_HOME% http://build.chromium.org/buildbot/snapshots/chromium-rel-xp/<nul>tmp.bat
type LATEST>>tmp.bat
echo /chrome-win32.zip>>tmp.bat
del LATEST
call tmp.bat
del tmp.bat
unzip -o %MY_CHROME_HOME%\chrome-win32.zip  -d %MY_CHROME_HOME%
pause
</pre>

<h3>3、修改说明：</h3>
设置了<strong>MY_CHROME_HOME</strong>，因为在自动执行计划任务的时候需要打开cmd，而cmd所在的目录位于windows/System32下面，所以如果不指定下载目录则chrome-win32.zip文件会下载到windows/System32目录中，这可是我不想看到的，系统目录是神圣不可侵犯的……所以就利用了tomcat的catalina.bat方式，在开始运行的时候指定一个自定义的环境变量<strong>MY_CHROME_HOME</strong>来设置Chromium的位置


<h3>4、资源下载：</h3>
需要使用wget和unzip工具，<a href="http://users.ugent.be/~bpuype/wget/">wget</a>和<a href="http://gnuwin32.sourceforge.net/packages/unzip.htm">unzip</a><br/>
用过linux的童鞋应该比较熟悉wget工具了……无比的强大<br/>
这两个工具下载完成后记得设置到<strong>环境变量的path</strong>中
[download id="31" format="1"]
