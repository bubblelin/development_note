```
version: "3.3"
services:

 Redis:
  image: sameersbn/redis:latest
  ports:
    - "6379:6379"
  volumes:
    - redis_data:/var/lib/redis
  restart: always

 mysql:
    image: mysql:latest
    restart: always
    command: --default-authentication-plugin=mysql_native_password #这行代码解决无法访问的问题
    networks:
      - dev
    ports:
      - "3306:3306"
    environment:
      MYSQL_ROOT_PASSWORD: abc123
      MYSQL_USER: 'test'
      MYSQL_PASS: 'test'
    volumes:
      - mysql_data:/var/lib/mysql

networks:
  dev:
    driver: bridge

volumes:
  redis_data:
  mysql_data:
```

