# LinkedList

- permits null;

- unsynchronized

- to prevent accidental unsynchronized:

  List list = Collections.sychronizedList(new LinkedList(...))

- fail-fast

### 

### LinkedList 成员变量

```java
transient int size = 0;

transient Node<E> first;

transient Node<E> last;

```



### LinkedList构造器

```java
public LinkedList(){}

public LinkedList(Collections<? extends E> c){
    this();
    addAll();
}

```

