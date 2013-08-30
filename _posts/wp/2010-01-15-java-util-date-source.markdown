--- 
layout: post
title: "分享：Java日期工具类"
wordpress_id: 785
wordpress_url: http://www.wsria.com/?p=785
date: 2010-01-15 14:27:34 +08:00
tags: 
 - java
---
平常开发中积累了一些，可能会和其他有重复，发上来按需取舍
包括：日期格式化、日期相加、日期排序等
因为在项目中要对一组无序日期排序并分组就写了一个方法，
<pre class="brush: java">
/**
 * 日期分组<br/>
 * 能够对指定日期列表按照连续性分组<br/>
 * 例如：[2010-01-15, 2010-01-16, 2010-01-17, 2010-01-20, 2010-01-21, 2010-01-25]<br/>
 * 分组结果为：<br/>
 * <ul>
 * <li>[2010-01-15, 2010-01-16, 2010-01-17]</li>
 * <li>[2010-01-20, 2010-01-21]</li>
 * <li>[2010-01-25]</li>
 * </ul>
 * @param dates	日期对象
 * @return	连续性分组结果
 */
public static List<List<Date>> groupDates(List<Date> dates) {}
</pre>
感觉以后会用到所以放上来共享
<!--more-->
下面是源码，也可以访问：<a href="http://code.google.com/p/finance-p/source/browse/trunk/WEB-INF/src/net/yanhl/util/DateUtil.java">http://code.google.com/p/finance-p/source/browse/trunk/WEB-INF/src/net/yanhl/util/DateUtil.java</a>下载

<pre class="brush: java" line="1">import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.List;

import net.yanhl.util.ReadProperties;
import net.yanhl.util.StringUtil;

import org.apache.commons.configuration.ConfigurationException;
import org.apache.commons.lang.StringUtils;

/**
 *

<strong>Title：</strong> 日期工具类

 *

<strong>Description：</strong>

 *
 * @author Henry Yan
 * @since  1.0
 * @version 1.0.0.20090605
 */
public class DateUtil {

	public final static String FORMAT_DATE = "yyyy-MM-dd";
	public final static String FORMAT_DATETIME = "yyyy-MM-dd HH:mm:ss";

	public final static String FORMAT_DATE_ZH = "yyyy年MM月dd日";
	public final static String FORMAT_DATETIME_ZH = "yyyy年MM月dd日 HH时mm分ss秒";

	public final static String TYPE_DATE = "date";
	public final static String TYPE_DATETIME = "datetime";

	/**
	 * 日期排序类型-升序
	 */
	public final static int DATE_ORDER_ASC = 0;

	/**
	 * 日期排序类型-降序
	 */
	public final static int DATE_ORDER_DESC = 1;

	/**
	 * 用字符串获得日期
	 * @throws ParseException
	 * @dateValue 日期字符串
	 * @dateType 格式化的类型,date和datetime
	 */
	public static Date getDate(String dateValue, String dateType) throws ParseException {
		if (dateValue == null)
			return null;
		if (dateType.equals(TYPE_DATE)) {
			SimpleDateFormat sfdate = new SimpleDateFormat(FORMAT_DATE);
			return sfdate.parse(dateValue);
		} else if (dateType.equals(TYPE_DATETIME)) {
			SimpleDateFormat sftime = new SimpleDateFormat(FORMAT_DATETIME);
			return sftime.parse(dateValue);
		}
		return null;
	}

	/**
	 * 用字符串获得java.sql.Date日期
	 * @throws ParseException
	 * @dateValue 日期字符串
	 * @dateType 格式化的类型,date和datetime
	 */
	public static java.sql.Date getSqlDate(String dateValue, String dateType) throws ParseException {
		Date date = getDate(dateValue, dateType);
		if (date == null) {
			return null;
		}
		return new java.sql.Date(date.getTime());
	}

	/**
	 *将日期加上某些天或减去天数)返回字符串
	 * @param date 待处理日期
	 * @param to 加减的天数
	 * @return 日期
	 */
	public static Date dateAdd(String date, int to) {
		java.util.Date d = null;
		try {
			d = java.sql.Date.valueOf(date);
		} catch (Exception e) {
			e.printStackTrace();
			d = new java.util.Date();
		}
		Calendar strDate = Calendar.getInstance();
		strDate.setTime(d);
		strDate.add(Calendar.DATE, to); // 日期减 如果不够减会将月变动
		return strDate.getTime();
	}

	/**
	 *将日期加上某些天或减去天数)返回字符串
	 * @param date 待处理日期
	 * @param to 加减的天数
	 * @return 日期
	 */
	public static java.sql.Date dateAdd(java.sql.Date date, int to) {
		Calendar strDate = Calendar.getInstance();
		strDate.setTime(date);
		strDate.add(Calendar.DATE, to); // 日期减 如果不够减会将月变动
		return new java.sql.Date(strDate.getTime().getTime());
	}

	/**
	 * 格式化日期
	 * @param date		日期对象
	 * @param splitChar	分隔字符
	 * @return
	 */
	public static String formatDate(Date date, String splitChar) {
		java.text.SimpleDateFormat sfdate = new java.text.SimpleDateFormat("yyyy" + splitChar
				+ "MM" + splitChar + "dd");
		return sfdate.format(date);
	}

	/**
	 * @dateValue 日期对象，可以是java.util.Date和java.sql.Date
	 * @dateType 格式化的类型,date和datetime
	 */
	public static String format(Object dateValue, String dateType) {
		if (dateValue == null)
			return "";
		if (dateValue instanceof java.sql.Date) {
			return dateValue.toString();
		} else if (dateValue instanceof java.util.Date) {
			if (dateType.equals(TYPE_DATE)) {
				java.text.SimpleDateFormat sfdate = new java.text.SimpleDateFormat(FORMAT_DATE);
				return sfdate.format(dateValue);
			} else if (dateType.equals(TYPE_DATETIME)) {
				java.text.SimpleDateFormat sftime = new java.text.SimpleDateFormat(FORMAT_DATETIME);
				return sftime.format(dateValue);
			} else {
				return "非法日期格式[" + dateType + "]";
			}
		} else {
			return "非日期类型";
		}
	}

	/**
	 * 转换日期对象为中文化日期
	 * @dateValue 日期对象，可以是java.util.Date和java.sql.Date
	 * @dateType 格式化的类型,date和datetime
	 */
	public static String formatZh(Date dateValue, String dateType) {
		if (dateValue == null)
			return "";
		if (dateValue instanceof java.sql.Date) {
			return dateValue.toString();
		} else if (dateValue instanceof java.util.Date) {
			if (dateType.equals(TYPE_DATE)) {
				java.text.SimpleDateFormat sfdate = new java.text.SimpleDateFormat(FORMAT_DATE_ZH);
				return sfdate.format(dateValue);
			} else if (dateType.equals(TYPE_DATETIME)) {
				java.text.SimpleDateFormat sftime = new java.text.SimpleDateFormat(FORMAT_DATETIME_ZH);
				return sftime.format(dateValue);
			} else {
				return "非法日期格式[" + dateType + "]";
			}
		} else {
			return "非日期类型";
		}
	}

	/**
	   * 转化成年月日期
	   * @param sDate          字符型日期：2009-02-02
	   * @param DelimeterChar  分割符号比如 / -
	   * @return               年月日期 :2009年02月02日
	   */
	public static String chDateChange(String sDate, String DelimeterChar) {
		String tmpArr[] = sDate.split(DelimeterChar);
		tmpArr[0] = tmpArr[0] + "年";
		tmpArr[1] = tmpArr[1] + "月";
		tmpArr[2] = tmpArr[2] + "日";
		return tmpArr[0] + tmpArr[1] + tmpArr[2];
	}

	/**
	 * 得到系统日期
	 * @return YYYY-MM-DD
	 */
	public static String getSysdate() {
		java.sql.Timestamp timeNow = new java.sql.Timestamp(System.currentTimeMillis());
		return timeNow.toString().substring(0, 10);
	}

	/**
	 * 得到某天是周几
	 * @param strDay
	 * @return 周几
	 */
	public static int getWeekDay(String strDay) {
		Date day = DateUtil.dateAdd(strDay, -1);
		Calendar strDate = Calendar.getInstance();
		strDate.setTime(day);
		int meStrDate = strDate.get(Calendar.DAY_OF_WEEK);
		return meStrDate;
	}

	/**
	 * 得到某天是周几
	 * @param strDay
	 * @return 周几
	 */
	public static int getWeekDay(Date date) {
		Date day = DateUtil.dateAdd(format(date, "date"), -1);
		Calendar strDate = Calendar.getInstance();
		strDate.setTime(day);
		int meStrDate = strDate.get(Calendar.DAY_OF_WEEK);
		return meStrDate;
	}

	/**
	 * 取得两个日期段的日期间隔
	 *
	 * @author color
	 * @param t1
	 *            时间1
	 * @param t2
	 *            时间2
	 * @return t2 与t1的间隔天数
	 * @throws ParseException
	 *             如果输入的日期格式不是0000-00-00 格式抛出异常
	 */
	public static int getBetweenDays(String t1, String t2) throws ParseException {
		DateFormat format = new SimpleDateFormat("yyyy-MM-dd");
		int betweenDays = 0;
		Date d1 = format.parse(t1);
		Date d2 = format.parse(t2);
		betweenDays = getBetweenDays(d1, d2);
		return betweenDays;
	}

	/**
	 * 取得两个日期段的日期间隔
	 * @param d1	日期1
	 * @param d2	日期2
	 * @return	t2 与t1的间隔天数
	 */
	private static int getBetweenDays(Date d1, Date d2) {
		if (d1 == null || d2 == null) {
			return -1;
		}
		int betweenDays;
		Calendar c1 = Calendar.getInstance();
		Calendar c2 = Calendar.getInstance();
		c1.setTime(d1);
		c2.setTime(d2);
		// 保证第二个时间一定大于第一个时间
		if (c1.after(c2)) {
			c2.setTime(d1);
			c1.setTime(d2);
		}
		int betweenYears = c2.get(Calendar.YEAR) - c1.get(Calendar.YEAR);
		betweenDays = c2.get(Calendar.DAY_OF_YEAR) - c1.get(Calendar.DAY_OF_YEAR);
		for (int i = 0; i &lt; betweenYears; i++) { 			c1.set(Calendar.YEAR, (c1.get(Calendar.YEAR) + 1)); 			betweenDays += c1.getMaximum(Calendar.DAY_OF_YEAR); 		} 		return betweenDays; 	} 	 	/** 	 * 判断指定日期是否在一个日期范围内 	 * @param fromDate	范围开始日期 	 * @param toDate	范围结束日期 	 * @param testDate	测试日期 	 * @return	在范围内true,否则false 	 */ 	public static boolean betweenDays(java.sql.Date fromDate, java.sql.Date toDate, java.sql.Date testDate) { 		if (fromDate == null || toDate == null || testDate == null) { 			return false; 		} 		 		//1、 交换开始和结束日期 		if (fromDate.getTime() &gt; toDate.getTime()) {
			java.sql.Date tempDate = fromDate;
			fromDate = toDate;
			toDate = tempDate;
		}

		//2、缩小范围
		long testDateTime = testDate.getTime();
		if ( (testDateTime &gt; fromDate.getTime() &amp;&amp; testDateTime &gt; toDate.getTime())
				|| testDateTime &lt; fromDate.getTime() &amp;&amp; testDateTime &lt; toDate.getTime()) {
			return false;
		}

		return true;
	}

	/**
	 * 得到指定年、月的最后一天
	 * @param year	年
	 * @param month	月
	 * @return	本年月的最后一天，如果2009,10，返回结果：2009-10-31
	 */
	public static String getLastDateDayOfMonth(int year, int month) {
		Calendar cal = Calendar.getInstance();
		cal.set(Calendar.YEAR, year);
		cal.set(Calendar.MONTH, month);
		// 某年某月的最后一天
		int lastDate = cal.getActualMaximum(Calendar.DATE);
		return year + "-" + (month + 1) + "-" + lastDate;
	}

	/**
	 * 判断两个日期是否为同一天
	 * @param d1	日期一
	 * @param d2	日期二
	 * @return	同一天true，不是同一天false
	 */
	public static boolean isSameDate(Date d1, Date d2) {
		boolean result = false;
		Calendar c1 = Calendar.getInstance();
		c1.setTime(d1);

		Calendar c2 = Calendar.getInstance();
		c2.setTime(d2);

		if (c1.get(Calendar.YEAR) == c2.get(Calendar.YEAR)
				&amp;&amp; c1.get(Calendar.MONTH) == c2.get(Calendar.MONTH)
				&amp;&amp; c1.get(Calendar.DAY_OF_MONTH) == c2.get(Calendar.DAY_OF_MONTH)) {
			result = true;
		}
		return result;
	}

	/**
	 * 是否为周末
	 * @param strDate
	 * @return true|false
	 */
	public static boolean isWeekend(String strDate) {
		int weekDay = getWeekDay(strDate);
		if (weekDay == 6 || weekDay == 7) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 是否为周末
	 * @param strDate
	 * @return true|false
	 */
	public static boolean isWeekend(Date date) {
		int weekDay = getWeekDay(format(date, "date"));
		if (weekDay == 6 || weekDay == 7) {
			return true;
		} else {
			return false;
		}
	}

	/**
	 * 是否为法定节假日
	 * @param strDate
	 * @return true|false
	 */
	public static boolean isHoliday(String strDate) {
		return false;
	}

	/**
	 * 是否为法定节假日
	 * @param strDate
	 * @return true|false
	 * @throws ConfigurationException 读取系统配置文件时
	 */
	public static boolean isHoliday(Date date) throws ConfigurationException {
		String specialDay = ReadProperties.getSystemValue("specialDay");

		// 未设置法定节假日价格
		if (!StringUtils.isEmpty(specialDay) &amp;&amp; date != null) {
			String strDate = format(date, StringUtil.TYPE_DATE);
			String[] specialDays = specialDay.split(";");
			if (StringUtil.hasInArray(specialDays, strDate)) {
				return true;
			}
		}
		return false;
	}

	/**
	 * 日期排序
	 * @param dates		日期列表
	 * @param orderType	排序类型
	 * 			
{@link net.yanhl.util.DateUtil.DATE_ORDER_ASC}

	 * 			{@link net.yanhl.util.DateUtil.DATE_ORDER_DESC}
	 * @return	排序结果
	 */
	public static List orderDate(List dates, int orderType) {
		DateComparator comp = new DateComparator(orderType);
		Collections.sort(dates, comp);
		return dates;
	}

	/**
	 * 日期分组

	 * 能够对指定日期列表按照连续性分组

	 * 例如：[2010-01-15, 2010-01-16, 2010-01-17, 2010-01-20, 2010-01-21, 2010-01-25]

	 * 分组结果为：

	 *
<ul>
	 *
	<li>[2010-01-15, 2010-01-16, 2010-01-17]</li>
*
	<li>[2010-01-20, 2010-01-21]</li>
*
	<li>[2010-01-25]</li>
*</ul>
* @param dates	日期对象
	 * @return	连续性分组结果
	 */
	public static List
&gt; groupDates(List dates) {
		List
&gt; result = new ArrayList
&gt;();

		// 按照升序排序
		orderDate(dates, DateUtil.DATE_ORDER_ASC);

		// 临时结果
		List tempDates = null;

		// 上一组最后一个日期
		Date lastDate = null;

		// 当前读取日期
		Date cdate = null;
		for (int i = 0; i &lt; dates.size(); i++) {
			cdate = dates.get(i);

			// 第一次增加
			if (tempDates == null) {
				tempDates = new ArrayList();
				tempDates.add(cdate);
				result.add(tempDates);
			} else {
				/**
				 * 差距为1是继续在原有的列表中添加，大于1就是用新的列表
				 */
				lastDate = tempDates.get(tempDates.size() - 1);
				int days = getBetweenDays(lastDate, cdate);
				if (days == 1) {
					tempDates.add(cdate);
				} else {
					tempDates = new ArrayList();
					tempDates.add(cdate);
					result.add(tempDates);
				}
			}

		}

		return result;
	}

	public static void main(String[] args) {
		java.sql.Date fromDate = java.sql.Date.valueOf("2009-12-10");
		java.sql.Date toDate = java.sql.Date.valueOf("2009-12-11");
		java.sql.Date testDate = java.sql.Date.valueOf("2009-12-12");
		java.sql.Date d1 = java.sql.Date.valueOf("2009-12-13");
		java.sql.Date d2 = java.sql.Date.valueOf("2009-12-16");
		java.sql.Date d3 = java.sql.Date.valueOf("2009-12-17");
		java.sql.Date d4 = java.sql.Date.valueOf("2009-12-18");
		java.sql.Date d5 = java.sql.Date.valueOf("2009-12-20");
		java.sql.Date d6 = java.sql.Date.valueOf("2009-12-21");
		java.sql.Date d7 = java.sql.Date.valueOf("2009-12-23");
		List dates = new ArrayList();
		dates.add(fromDate);
		dates.add(toDate);
		dates.add(testDate);
		dates.add(d1);
		dates.add(d2);
		dates.add(d3);
		dates.add(d4);
		dates.add(d5);
		dates.add(d6);
		dates.add(d7);
		List
&gt; groupDates = groupDates(dates);
		for (List date : groupDates) {
			System.out.println(date);
		}
	}
}

/**
 *

<strong>Title：</strong>日期大小比较

 *

<strong>Description：</strong>实现比较接口，按照排序类型[升序,降序]排列日期集合

 *
 * @author Henry Yan
 * @since  1.0
 * @version 1.0.0.20091015
 */
class DateComparator implements Comparator {

	int orderType;

	public DateComparator(int orderType) {
		this.orderType = orderType;
	}

	/* (non-Javadoc)
	 * @see java.util.Comparator#compare(java.lang.Object, java.lang.Object)
	 */
	public int compare(Date d1, Date d2) {
		if (d1.getTime() &gt; d2.getTime()) {
			if (orderType == DateUtil.DATE_ORDER_ASC) {
				return 1;
			} else {
				return -1;
			}
		} else {
			if (d1.getTime() == d2.getTime()) {
				return 0;
			} else {
				if (orderType == DateUtil.DATE_ORDER_DESC) {
					return 1;
				} else {
					return -1;
				}
			}
		}
	}

}</pre>
