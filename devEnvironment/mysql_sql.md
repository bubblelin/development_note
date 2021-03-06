1. 导出数据库
```sql
mysqldump -u root top800 > sql_database_bk/top800_database_bk_2011-10-22.sql
```

2. 导出数据库的表
```sql
mysqldump -u root top800 tabletop800 > sql_database_bk/top800_tabletop800_table_bk_2011-10-22.sql

```

3. 导入数据库：    
```sql
mysql -u root -p'123456' top800 < top800_database_bk_2011-11-11.sql
```

4. EXPLAIN查询出来的字段解析：
？Table：显示这一行的数据是关于哪张表的
？possible_keys：显示可能应用在这张表中的索引。如果为空，没有可能的索引。可以为相关的域从WHERE语句中选择一个合适的语句
？key：实际使用的索引。如果为NULL，则没有使用索引。MYSQL很少会选择优化不足的索引，此时可以在SELECT语句中使用USE INDEX（index）来强制使用一个索引或者用IGNORE INDEX（index）来强制忽略索引
？key_len：使用的索引的长度。在不损失精确性的情况下，长度越短越好
？ref：显示索引的哪一列被使用了，如果可能的话，是一个常数
？rows：MySQL认为必须检索的用来返回请求数据的行数
？type：这是最重要的字段之一，显示查询使用了何种类型。从最好到最差的连接类型为system、const、eq_reg、ref、range、index和ALL
    nsystem、const：可以将查询的变量转为常量. 如id=1; id为 主键或唯一键.
    neq_ref：访问索引,返回某单一行的数据.(通常在联接时出现，查询使用的索引为主键或惟一键)
    nref：访问索引,返回某个值的数据.(可以返回多行) 通常使用=时发生
    nrange：这个连接类型使用索引返回一个范围中的行，比如使用>或<查找东西，并且该字段上建有索引时发生的情况(注:不一定好于index)
    nindex：以索引的顺序进行全表扫描，优点是不用排序,缺点是还要全表扫描
    nALL：全表扫描，应该尽量避免
？Extra：关于MYSQL如何解析查询的额外信息，主要有以下几种
    nusing index：只用到索引,可以避免访问表.
    nusing where：使用到where来过虑数据. 不是所有的where clause都要显示using where. 如以=方式访问索引.
    nusing tmporary：用到临时表
    nusing filesort：用到额外的排序. (当使用order by v1,而没用到索引时,就会使用额外的排序)
    nrange checked for eache record(index map:N)：没有好的索引.

5. 单表查询优化
    （1）明确需要的字段，要多少就写多少字段;
    （2）使用分页语句：limit start , count 或者条件 where子句;
    （3）如果是有序的查询，可使用ORDER BY
    （4）开启查询缓存：http://www.cnblogs.com/zemliu/p/3234372.html

6. 多表查询
（1）基本连接方法（内连接、外连接以及交叉连接）：
    内连接：用比较运算符根据每个表共有的列的值匹配两个表中的行（=或>、<）
        得到的满足某一条件的是A，B内部的数据；正因为得到的是内部共有数据，所以连接方式称为内连接。
    外连接之左连接:可以看到，首先是左表数据全部罗列，然后有满足条件的右表数据都会全部罗列出。
        若两条右表数据对左表一条数据，则会用对应好的左表数据补足作为一条记录。
（2）超大型数据尽可能尽力不要写子查询，使用连接（JOIN）去替换它
（3）使用联合(UNION)来代替手动创建的临时表

7. 查询编写的注意点：
（1）对查询进行优化，要尽量避免全表扫描，首先应考虑在 where 及 order by 涉及的列上建立索引。
（2）应尽量避免在 where 子句中对字段进行 null 值判断，否则将导致引擎放弃使用索引而进行全表扫描
（3）in 和 not in 也要慎用，否则会导致全表扫描
    对于连续的数值，能用 between 就不要用 in 了;
    很多时候用 exists 代替 in 是一个好的选择;
    like ‘%abc%’ 会导致全表扫描
（5）尽量使用数字型字段，若只含数值信息的字段尽量不要设计为字符型，这会降低查询和连接的性能，并会增加存储开销。
这是因为引擎在处理查询和连 接时会逐个比较字符串中每一个字符，而对于数字型而言只需要比较一次就够了。
（6）任何地方都不要使用 select * from t ，用具体的字段列表代替“ * ”，不要返回用不到的任何字段。
（7）尽量使用表变量来代替临时表。如果表变量包含大量数据，请注意索引非常有限（只有主键索引）。
（8）在Join表的时候使用相当类型的例，并将其索引

8. 表的设计与优化
第一范式：属性(字段)的原子性约束，要求属性具有原子性，不可再分割；
第二范式：记录的惟一性约束，要求记录有惟一标识，每条记录需要有一个属性来做为实体的唯一标识，即每列都要和主键相关。
第三范式：属性(字段)冗余性的约束，即任何字段不能由其他字段派生出来，在通俗点就是：主键没有直接关系的数据列必须消除(消除的办法就是再创建一个表来存放他们，当然外键除外)。即：确保每列都和主键列直接相关,而不是间接相关。
如果数据库设计达到了完全的标准化，则把所有的表通过关键字连接在一起时，不会出现任何数据的复本(repetition)。标准化的优点是明显的，它避免了数据冗余，自然就节省了空间，也对数据的一致性(consistency)提供了根本的保障，杜绝了数据不一致的现象，同时也提高了效率


9. 字段类型
整数类型   字节数	最小值 ~ 最大值
tinyint	    1	-128~127 或 0-255
smallint	2	-32768~32767 或 0~65535
mediumint	3	-8388608~8388607 或 0~1677215
int	        4	-2147483648~2147483647 或 0~4294967295
bigint	    8	-9223372036854775808~9223372036854775807 或 0~18446744073709551615

浮点数类型	字节数	最小值 ~ 最大值
double	     4	  ±1.175494351E-38 ~ ± 3.402823466E+38
double	     8	  ±2.2250738585072014E-308 ~ ±1.7976931348623157E+308

定点数类型	字节数	最小值 ~ 最大值
dec(m,d)	m+2	   最大取值范围与double相同，给定decimal的有效值取值范围由m和d决定

关于浮点数与定点数有点看法：
浮点数相对于定点数的优点是在长度一定的情况下，浮点数能够表示更大的数据范围；它的缺点是会引起精度问题。
使用时我们要注意：
1. 浮点数存在误差问题；
2. 对货币等对精度敏感的数据，应该用定点数表示或存储；
3. 编程中，如果用到浮点数，要特别注意误差问题，并尽量避免做浮点数比较；
4. 要注意浮点数中一些特殊值的处理。

位类型	 字节数	最小值 ~ 最大值
bit(m)	1~8	     bit(1) ~ bit(64)

时间日期类型	字节数	 最小值 ~ 最大值
date	       4	1000-01-01 ~ 9999-12-31
datetime       8	1000-01-01 00:00:00 ~ 9999-12-31 23:59:59
timestamp	   4	19700101080001 ~ 2038年某个时刻
time	       3	-838:59:59 ~ 838:59:59
year	       1	1901 ~ 2155

字符串类型	字节数	取值范围
char(m)	m	m为0 ~ 255之间的整数
varchar(m)	值长度+1	m为0~65535之间的整数
tinytext	值长度+2	允许长度0~255字节
text	    值长度+2	允许长度0~65535字节
mediumtext	值长度+3	允许长度0~167772150字节
longtext	值长度+3	允许长度0~4294967295字节
binary(m)	m	      允许0~m个字节定长的字符串
varbinary(m)	值长度+1	允许0~m个字节变长的字符串
tinyblob	值长度+1	允许长度0~255字节
blob    	值长度+2	允许长度0~65535字节
mediumblob	值长度+3	允许长度0~167772150字节
longblob	值长度+4	允许长度0~4294967295字节
enum	    1或2	      1~255个成员需要1个字节存；255~65535个成员，2个字节存
set	        1/2/3/4/8  类似enum,set一次可以选取多个成员，而enum只能一个
