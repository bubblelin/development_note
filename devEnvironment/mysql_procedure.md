## 创建存储过程
``` sql
CREATE PROCEDURE sp_name ([ proc_parameter ]) [ characteristics..] routine_body 
-- 调用:
CALL sp_name()
```
proc_parameter指定存储过程的参数列表，列表形式如下：
``` sql
[IN|OUT|INOUT] param_name type
```
其中,
- in表示输入参数;
- out表示输出参数;
- inout表示既可以输入也可以输出；
- param_name表示参数名称；
- type表示参数的类型; 

该类型可以是MYSQL数据库中的任意类型, 有以下取值：
``` sql
characteristic: 
    LANGUAGE SQL 
  | [NOT] DETERMINISTIC 
  | { CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA } 
  | SQL SECURITY { DEFINER | INVOKER } 
  | COMMENT 'string' 
routine_body: 
    Valid SQL procedure statement or statements
```
- LANGUAGE SQL ：说明routine_body部分是由SQL语句组成的，当前系统支持的语言为SQL，SQL是LANGUAGE特性的唯一值
- [NOT] DETERMINISTIC：指明存储过程执行的结果是否正确。
DETERMINISTIC 表示结果是确定的。每次执行存储过程时，相同的输入会得到相同的输出。
NOT DETERMINISTIC 表示结果是不确定的，相同的输入可能得到不同的输出。如果没有指定任意一个值.
默认为NOT DETERMINISTIC 
- CONTAINS SQL | NO SQL | READS SQL DATA | MODIFIES SQL DATA：指明子程序使用SQL语句的限制。
CONTAINS SQL表明子程序包含SQL语句，但是不包含读写数据的语句；
NO SQL表明子程序不包含SQL语句；
READS SQL DATA：说明子程序包含读数据的语句；
MODIFIES SQL DATA表明子程序包含写数据的语句。
默认情况下，系统会指定为CONTAINS SQL
- SQL SECURITY { DEFINER | INVOKER } ：指明谁有权限来执行。
DEFINER 表示只有定义者才能执行;
INVOKER 表示拥有权限的调用者可以执行。
默认情况下，系统指定为DEFINER 
- COMMENT 'string' ：注释信息，可以用来描述存储过程或函数
- routine_body是SQL代码的内容，可以用BEGIN...END来表示SQL代码的开始和结束。


## 定义用户变量
``` sql
DECLARE a int; SET a = 100;
-- 或者
DECLARE a int default 100;
```
### 用户变量
``` sql
select 'hello world' into @a;  select @a; -- 语法1
set @b='goodbye cruel world';  select @b; -- 语法2
set @c=1+2+3;                  select @c; -- 语法3
```
### 存储过程中使用用户变量
``` sql
create PROCEDURE greet_world() select CONCAT(@greeting,'world');
set @greeting='hello';
CALL greet_world();
```
### 传递全局范围的用户变量
``` sql
create PROCEDURE p1() set @last_procedure='p1';
create PROCEDURE p2() select CONCAT('last procedure was ',@last_procedure);
CALL p1(); CALL p2();
```

## 存储过程三种参数:IN, OUT, INOUT
### IN: 必须在调用存储过程时指定，在存储过程中修改该参数的值不能被返回，为默认值
``` sql
DELIMITER //
create PROCEDURE demo_in(IN d_in INT)
BEGIN
select d_in; -- 1
set d_in=2; 
select d_in; -- 2
END//
DELIMITER ;
-- 执行结果
set @p_in=1;
call demo_in(@p_in);
select @p_in; -- 1 (存储过程不改变变量的值)
```
### OUT: 调用是不需要指定, 该值可在存储过程内部被改变，并可返回
``` sql
DELIMITER //
create PROCEDURE demo_out(OUT d_out INT)
BEGIN
select d_out; -- null
set d_out=2;
select d_out; -- 2
END //
DELIMITER ;
-- 执行结果:
set @d_out=1;
call demo_out(@d_out);
select @d_out; -- 2 (存储过程改变了变量的值)
```
### INOUT: 调用时指定，并且可被改变和返回
``` sql
DELIMITER //
create PROCEDURE demo_inout(INOUT d_inout INT)
BEGIN
select d_inout; -- 1
set d_inout=2;
select d_inout; -- 2
END //
DELIMITER ;
-- 执行结果:
set @d_inout=1;
call demo_inout(@d_inout);
select @d_inout; -- 2 (存储过程改变了变量的值)
```


## 创建存储过程
``` sql
CREATE FUNCTION func_name([func_parameter])
RETURNS TYPE
[characteristics...] routine_body
```
- func_parameter: 存储函数的参数列表，参数列表如下
``` sql
[IN|OUT|INOUT]PARAM_NAMETYPE
```
> 指定参数为IN、OUT、INOUT只对PROCEDURE是合法的。
>（FUNCTION中总是默认是IN参数）RETURNS子句对FUNCTION做指定，对函数而言这是强制的。
>他用来指定函数的返回类型，而且函数体必须包含一个RETURN value语句

例子:
``` sql
DELIMITER //
CREATE FUNCTION NameByT()
RETURNS CHAR(50)
RETURN (SELECT NAME FROM t3 WHERE id=2);
//
DELIMITER ;
```
注意：
RETURNS CHAR(50)数据类型的时候，RETURNS 是有S的，
而RETURN (SELECT NAME FROM t3 WHERE id=2)的时候RETURN是没有S的