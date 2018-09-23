# SQL数据库面试题以及答案（50例题）



- **学生表Student**

  Sid：学号，

  Sname：学生姓名，

  Sage：学生年龄，

  Ssex：学生性别

- **课程表Course**

  Cid：课程编号，

  Cname：课程名称，

  Tid：教师编号

- **成绩表SC**

  Sid：学号，

  Cid：课程编号，

  score：成绩

- **教师表Teacher**

  Tid：教师编号，

  Tname：教师名字



### 问题

1. 查询“001”课程比“002”课程成绩高的所有学生的学号

   ```mysql
   select Sid 
   from
   (select Sid, score from SC where Cid = '001') a
   join
   (select Sid, score from SC where Cid = '002') b
   on a.Sid = b.Sid
   where a.score > b.score;
   ```

2. 查询平均成绩大于60分的同学的学号和平均成绩

   ```mysql
   select Sid, avg(score) avgScore
   from SC
   group by Sid
   having avgScore > 60;
   ```

3. 查询所有同学的学号、姓名、选课数、总成绩

   ```mysql
   select t0.Sid, t1.Sname, count(t0.Cid) course_num, sum(t0.score) total_score
   from SC t0
   left join Student t1 on t1.Sid = t0.Sid
   group by t0.Sid
   ```

4. 查询姓‘李’的老师的个数

   ```mysql
   select count(Tid) from Teacher where Tname like '李%';
   ```

5. 查询没有学过“叶平”老师课的同学的学号、姓名

   ```mysql
   select t0.Sid, t0.Sname
   from Student t0
   where t0.Sid in (
       select disinct(t1.Sid) Sid
   	from SC t1
   	where t1.Cid not in (
           select t2.Cid 
    		from Course t2
       	where t2.Tid in (
           	select t3.Tid
           	from Teacher t3
           	where t3.Tname = '叶平')));
   ```

6. 查询学过“叶平”老师所教的所有课的同学的学号、姓名

   ```mysql
   select t3.Sid, t3.Sname
   from Student t3
   where t3.Sid in (
       select distinct(t2.Sid) 
       from SC t2
       where t2.Cid in (
           select t1.Cid
           from Course t1
           where t1.Tid in (
               select t0.Tid
               from Teacher t0
               where t0.Tname = '叶平')));
   ```

7. 查询学过“011”并且也学过编号“002”课程的同学的学号、姓名

   ```mysql
   select t1.Sid, t1.Sname
   from Student t1
   where t1.Sid in (
       select distinct(t0.Sid)
   	from SC t0
   	where t0.Cid = '011' and t0.Cid = '002');
   ```

8. 查询课程编号“002”的成绩比课程编号“001”课程低的所有同学的学号、姓名

   ```mysql
   
   ```

9. 查询所有课程成绩小于60的同学的学号、姓名

   ```mysql
   
   ```

10. 查询没有学全所有课的同学的学号、姓名

    ```mysql
    
    ```

11. 查询至少有一门课与学号为“1001”同学所学相同的同学的学号和姓名

12. 查询至少学过学号为“001”同学所有一门课的其他同学学号和姓名

13. 把“SC”表中“叶平”老师教的课的成绩都更改为此课程的平均成绩

14. 查询和“1002”号的同学学习的课程完全相同的其他同学学号和姓名

15. 删除学习“叶平”老师课的SC表记录

16. 向SC表中插入一些记录，这些记录要求符合以下条件：没有上过编号“003”课程的同学学号、002号课的平均成绩

17. 按平均成绩从高到低显示所有学生的“数据库”、“企业管理”、“英语”三门的课程成绩，按如下形式显示：学生ID，数据库，企业管理，英语，有效课程数，有效平均分

18. 查询各科成绩最高和最低的分：以如下的形式显示：课程ID，最高分，最低分

19. 按各科平均成绩从低到高和及格率的百分数从高到低顺序

20. 查询如下课程平均成绩和及格率的百分数(用”1行”显示): 企业管理（001），马克思（002），OO&UML （003），数据库（004）

21. 查询不同老师所教不同课程平均分从高到低显示

22. 查询如下课程成绩第3名到第6名的学生成绩单：企业管理(001)，马克思(002)，UML(003)，数据库(004)

23. 统计下列各科成绩，各分数段人数：课程ID，课程名称，[100-85],[85-70],[70-60],[ 小于60]

24. 查询学生平均成绩及其名次

25. 查询各科成绩前三名的记录（不考虑成绩并列情况）

26. 查询每门课程被选修的学生数

27. 查询出只选修一门课程的全部学生的学号和姓名

28. 查询男生、女生人数

29. 查询姓“张”的学生名单

30. 查询同名同姓的学生名单，并统计同名人数

31. 1981年出生的学生名单（注：student表中sage列的类型是datetime）

32. 查询平均成绩大于85的所有学生的学号、姓名和平均成绩

33. 查询每门课程的平均成绩，结果按平均成绩升序排序，平均成绩相同时，按课程号降序排列

34. 查询课程名称为“数据库”，且分数低于60的学生名字和分数

35. 查询所有学生的选课情况

36. 查询任何一门课程成绩在70分以上的姓名、课程名称和分数

37. 查询不及格的课程，并按课程号从大到小的排列

38. 查询课程编号为“003”且课程成绩在80分以上的学生的学号和姓名

39. 求选了课程的学生人数

40. 查询选修“叶平”老师所授课程的学生中，成绩最高的学生姓名及其成绩

41. 查询各个课程及相应的选修人数

42. 查询不同课程成绩相同的学生和学号、课程号、学生成绩

43. 查询每门课程成绩最好的前两名

44. 统计每门课程的学生选修人数(超过10人的课程才统计)。要求输出课程号和选修人数，查询结果按人数降序排序，若人数相同，按课程号升序排序

45. 检索至少选修两门课程的学生学号

46. 查询全部学生选修的课程和课程号和课程名

47. 查询没学过”叶平”老师讲授的任一门课程的学生姓名

48. 查询两门以上不及格课程的同学的学号以及其平均成绩

49. 检索“004”课程分数小于60，按分数降序排列的同学学号

50. 删除“002”同学的“001”课程的成绩

