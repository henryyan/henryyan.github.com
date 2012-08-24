---
layout: post
title: "jqGrid启用列冻结之后列高度不一致问题解决办法"
category: jquery 
tags: 
 - jqgrid
 - 列冻结
 - 高度
 - jquery
---

## 1.喜欢又憎恨的列冻结功能

jqGrid 4.3.0版本发布中包含了一个我期待已久的功能——列冻结。和Excel中的冻结效果一样，把需要一直显示的列固定显示，其他辅助的列横向滚动显示，可以参考jqGrid的列冻结演示：[http://trirand.com/blog/jqgrid/jqgrid.html](http://trirand.com/blog/jqgrid/jqgrid.html)，打开页面之后选择”Frozen Cols.Group Header(new)”的“Frozen column”。

下图是正常情况：

![jqGrid列冻结高度一致的情况](/files/2012/08/jqgrid-frozen.png)

**但是**，事情总是那么的不顺利……

![jqGrid启用列冻结之后列高度不一致](/files/2012/08/jqgrid-frozen-problem.png)

从图中可以看出列：[Inv No，Date]是冻结的列，后面的是未冻结的列；未冻结的”Note“列内容太多导致分两行显示，问题就处在红色边框区域内，高度不一致。

## 2.解决办法

目前官方还没有发布解决办法，所以我先用**hack**的方式临时解决这个问题。对于高度不同又分为两种情况：冻结的列比未冻结的高，未冻结的列比冻结的高。

我专为此写了一个页面**演示**这种问题：

[http://www.kafeitu.me/demo/jqgrid/frozen.html](/demo/jqgrid/frozen.html)

读者打开演示页面之后点击按钮即可修复此问题，右键查看源码看我如何hack！！！

### 2.1 未冻结的列比冻结的列高度高

此种情况要读取未冻结列的高度，然后设置到冻结列的**style**中，但是不能用height()设置必须使用**height: 20px !important**方式，其中**!important**必须有，代码参考**#32**行处。

除了设置高度之外还需要根据浏览器的不同设置一个**过渡值**，见代码清单22~29行处。

问题请参考演示的**第一个**例子。

<pre class="brush:javascript">
/**
 * 终极hack列冻结导致的高度问题
 * @param  {[String]} listId [列表ID]
 */
function hackHeight(listId) {
    $(listId + '_frozen tr').slice(1).each(function() {

        var rowId = $(this).attr('id');

        var frozenTdHeight = parseFloat($('td:first', this).height());
        var normalHeight = parseFloat($(listId + ' #' + $(this).attr('id')).find('td:first').height());

        // 如果冻结的列高度小于未冻结列的高度则hack之
        if (frozenTdHeight < normalHeight) {

            $('td', this).each(function() {

                /*
                 浏览器差异高度hack
                 */
                var space = 0; // opera默认使用0就可以
                if (browser.isChrome()) {
                    space = 0.6;
                } else if (browser.isIE()) {
                    space = -0.2;
                } else if (browser.isMozila()) {
                    space = 0.5;
                }

                if (!$(this).attr('style') || $(this).attr('style').indexOf('height:') == -1) {
                    $(this).attr('style', $(this).attr('style') + ";height:" + (normalHeight + space) + "px !important");
                }
            });
        }
    });
}
</pre>

### 2.2 冻结的列比未冻结的列高度高

![jqGrid启用列冻结之后列高度不一致](/files/2012/08/jqgrid-frozen-problem1.png)

这种情况和第一种不同，高度是一致了，但是冻结列的整个div下移了1个像素（opera浏览器除外），所以解决办法就是把列冻结的div上移1个像素。

从上图中可以看出明显错位了，问题请参考演示的**第二个**例子。

代码清单中的12~14处用于上移表头的top；代码清单15~17处用于上移数据table的top。

<pre class="brush:javascript">
$('#hackFrozenHeight1').click(function() {
    var listId = 'list1';
    var divTop = -1;
    var bdivTop = -1;

    // opera 不需要hack
    if (browser.isOpera()) {
        divTop = 0;
        bdivTop = 0;
    }

    $('#gview_' + listId + ' .frozen-div').css({
        top: $('#gview_' + listId + ' .frozen-div').position().top + divTop
    });
    $('#gview_' + listId + ' .frozen-bdiv').css({
        top: $('#gview_' + listId + ' .frozen-bdiv').position().top + bdivTop
    });
});
</pre>

## 3.结束语

已经报告次问题，希望官网能尽快解决次问题。