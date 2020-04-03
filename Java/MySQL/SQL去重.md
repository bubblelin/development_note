```sql
-- 1.将重复数据建一张临时表，集合里是重复记录的最小id
-- 2.关联两张表,根据条件删除原表大于投t2表的记录，这样就可以去重保留一条
DELETE consum_record
FROM
 consum_record, 
 (
  SELECT
   min(id) id,
   user_id,
   monetary,
   consume_time
  FROM
   consum_record
  GROUP BY
   user_id,
   monetary,
   consume_time
  HAVING
   count(*) > 1
 ) t2
WHERE
 consum_record.user_id = t2.user_id 
 and consum_record.monetary = t2.monetary
 and consum_record.consume_time = t2.consume_time
AND consum_record.id > t2.id;
```