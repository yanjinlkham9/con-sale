use con_sale;
show tables;

-- 테이블에 full-text 인덱스 추가
ALTER TABLE products ADD FULLTEXT(name);

 SELECT * FROM products WHERE MATCH(name) AGAINST ("훈제");

 SELECT * FROM products WHERE name LIKE '%훈제%';

SHOW INDEX FROM products; 
ALTER TABLE products DROP INDEX name;

ALTER TABLE products ADD FULLTEXT(name) WITH PARSER ngram;
SELECT * FROM products WHERE MATCH(name) AGAINST('훈제');
