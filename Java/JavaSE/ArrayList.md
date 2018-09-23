# ArrayList

- permits null

- unsynchronized

  to prevent accidental unsynchronized access to the list:

  List list = Collections.synchronizedList(new ArrayList(...));

- get、set、iterator、listIterator operations run in constant time

- add operation runs in amorited constant time :  o(n) time

- auto increase the capacity using ensureCapacity operation

- fail-fast



### ArrayList的成员变量

```java
private static final int DEFAULT_CAPACITY = 10；

private static final Object[] EMPTY_ELEMENTDATA = {};

private transient Object[] elementData;

private int size;
```



### 构造器

```java
public ArrayList(int initialCapacity){
    super();
    if(initialCapacity < 0)
        throw new IllegalArgumentException('Illegal Capacity:' +
                                          initialCapacity);
    this.elementData = new Object[initailCapacity];
}

public ArrayList(){
    super();
    this.elementData = EMPTY_ELEMENTDATA;
}

public ArrayList(Collection<? extends E> c){
    elementData = c.toArray;
    size = elementData.length;
    if(elementData.getClass != Object[].class)
        elementData = Arrays.copyOf(elementData, size, Object[].class);
}
```



### ensureCapacity方法

```java
public void ensureCapacity(int minCapacity){
    int minExpand = (elementData != EMPTY_ELEMENTDATA)
        ? 0
        : DEFAULT_CAPACITY;
    if(minCapacity > minExpand){
        ensureExplicitCapacity(minCapacity);
    }
}

private void ensuraCapacityInternal(int minCapacity){
    if(elementData == EMPTY_ELEMENTDATA){
        minCapacity = Math.max(DEFAULT_CAPACITY, minCapacity);
    }
    ensureExplicitCapacity(minCapacity);
}

private void ensureExplicitCapacity(int minCapacity){
    modCount++;
    if(minCapacity - elementData.length > 0)
        grow(minCapacity);
}

private static final int MAX_ARRAY_SIZE = Integer.MAX_VALUE - 8;

private void grow(int minCapacity){
    int oldCapacity = elementData.length;
    int newCapacity = oldCapacity + (oldCapacity >> 1);
    if(newCapacity - minCapacity < 0)
        newCapacity = minCapacity;
    if(newCapacity - MAX_ARRAY_SIZE > 0)
        newCapacity = hugeCapacity(minCapacity);
    elementData = Arrays.copyOf(elementData, newCapacity);
}

private static int hugeCapacity(int minCapacity){
    if(minCapacity < 0)
        throw new OutOfMemoryError();
    return (minCapacity > MAX_ARRAY_SIZE) ?
        Integer.MAX_VALUE :
    	MAX_ARRAY_SIZE;
}
```



### add和remove方法

```java
public boolean add(E e){
    ensureCapacityInternal(size + 1);
    elementData(size++) = e;
    return true;
}

public void add(int index, E element){
    rangeCheckForAdd(index);
    ensureCapacityInternal(size + 1);
    System.arraycopy(elementData, index, elementData, index + 1);
    elementData[index] = element;
    size++;
}

public E remove(int index){
    rangeCheck(index);
    modCount++;
    E oldValue = elementData(index);
    
    int numMoved = size - index - 1 ;
    if(numMoved > 0)
        System.arraycopy(elementData, index + 1, elementData, index, numMoved);
    
    elementData[--size] = null;
    return oldValue;
}

public boolean remove(Object o){
    if(o == null){
        for(int index = 0; index < size; index++)
            if(elementData[index] == null){
                fastRemove(index);
                return true;
            }
	}else {
        for(int index = 0; index < size; index++){
            if(o.equals(elementData[index])){
                fastRemove(index);
                return true;
            }
        }
	}
    return false;
}

private void fastRemove(int index){
    modCount++;
    int numMoved = size - index - 1;
    if(numMoved > 0)
        System.arraycopy(elementData, index + 1, elementData, index, numMoved);
    
    elementData[--size] = null;
}
```































