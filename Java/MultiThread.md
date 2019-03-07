

## Java线程同步机制

##### 内部锁：Synchronized关键字
Java平台中的任何一个对象都有唯一一个与之关联的锁。这种锁被称为监视器或者内部锁。内部锁是一种排他锁，它内能够保障原子性、可见性和有序性。

作为锁句柄的变量通常采用private final修饰，如：private final Object lock = new Object();

显示锁：Lock接口

volatile关键子

volatile关键字的作用包括：保障可见性、保障有序性和保障long/double型变量读写操作的原子性.

> 约定：访问同一个volatile变量的线程称为同步在这个变量之上的线程，其中读取这个变量的线程被称为读线程，更新这个变量的线程称为写线程。一个线程既是读线程又是写线程。

volatile关键字在原子性方面仅仅保障对被修饰的变量的读操作、写操作本身的原子性。如果要保障对volatile变量的赋值操作的原子性，那么这个赋值操作不能涉及任何共享变量的访问。

CAS

CAS能够将read-modify-write和check-and-act之类的操作转换为原子操作。

> CAS好比一个代理人（中间人），共享同一个变量V的多个线程就是它的客户。当客户需要更新变量V的值的时候，它们只需要请求代理人代为修改，为此，客户需要告诉代理人其看到的共享变量的当前值A及其期望的新值B。

``` java
boolean compareAndSwap(Variable V, Object A, Object B){
    if(A == V.get()) {// check: 检查变量值是否被其他线程修改过
        V.set(B); // act: 更新变量值
        return true; // 更新成功
    }
    return false;// 变量值已被其他线程修改，更新失败
}
```

原子变量类是基于CAS实现的能够保障对共享变量进行read-modify-write更新操作的原子性和可见性的一组工具类。

| 分组       | 类                                                           |
| ---------- | ------------------------------------------------------------ |
| 基础数据型 | AtomicInteger、AtomicLong、AtomicBoolean                     |
| 数组型     | AtomicIntegerArray、AtomicLongArray、AtomicReferenceArray    |
| 字段更新器 | AtomicIntegerFieldUpdater、AtomicLongFieldUpdater、AtomicReferenceFieldUpdater |
| 引用型     | AtomicReference、AtomicStampedReference、AtomicMarkableReference |

