### HashMap

- permits null values and the null key;

- unsynchronized;

- no guarantee order;

- **important**: not to set the initial capacity too high( or the load factor too low);

- numbers of entries exceeds the product (factor * capacity), hash table is rehashed;

- rehashed: twice the number of buckets;

- prevent accidental unsynchronized: 

  Map<K, V> m = Collections.synchronizedMap(new HashMap<>(...))

- after iterator is created, modification the map, the iterator will throw ConcurrentModificationException



#### HashMap的成员变量

```java
/**
 * HashMap的默认初始容量为1 << 4; 扩容：1 << (4 + 1)
 * HashTable的默认初始容量为 11;  扩容：11*0.75=8, 8是阈值，新的容量为8*2+1=17
 */
static final int DEFAULT_INITIAL_CAPACITY = 1 << 4; // 容量大小必须是2的n次幂

static final int MAXIMUM_CAPACITY = 1 << 30;

static final float DEFAULT_LOAD_FACTOR = 0.75f;

static final Entry<?,?>[] EMPTY_TABLE = {};// 哈希表，长度必须是2的次幂

transient Entry<K, V>[] table = (Entry<K, V>[]) EMPTY_TABLE;

transient int size;// 已存键值对数量

int threshold；//阈值， size >= threshold
    
final float loadFactor; 

transient int transient int modCount; // 修改的次数 

static final int ALTERNATIVE_HASHING_THRESHOLD_DEFAULT = Integer.MAX_VALUE; //阈值

transient int hashSeed = 0; // 与此实例关联的随机值，应用于键的哈希码以使哈希更难冲突。 如果为0，则禁用备用散列。
```



#### HashMap的构造器

```java
public HashMap(int initialCapacity, float loadFactor){
    if(initialCapacity < 0){
        throw new IllegalArgumentException("Illegal initial capacity: " + initialCapacity);
    }
    if (initialCapacity > MAXIMUM_CAPACITY){
        initialCapacity = MAXIMUM_CAPACITY;
    }
    if(loadFactor <= 0 || Float.isNaN(loadFactor)){
        throw new IllegalArgumentException("Illegal load factor: " + loadFactor);
    }
    this.loadFactor = loadFactor;
    threshold = initialCapacity;
    init();
}

public HashMap(int initialCapacity){
    this(initialCapacity, DEFAULT_LOAD_FACTOR);
}

public HashMap(){
    this(DEFAULT_INITIAL_CAPACITY, DEFAULT_LOAD_FACTOR);
}

public HashMap(Map<? extends K, ? extends V> m){
    this(Math.max((int)(m.size() / DEFAULT_LOAD_FACTOR) + 1, DEFAULT_INITIAL_CAPACITY), 
        DEFAULT_LOAD_FACTORY);
    inflateTable(threshold);

    putAllForCreate(m);
}
```



#### Holder

  ```java
  private static class Holder{
      static final int ALTERNATIVE_HASHING_THRESHOLD;
      
      static {
          String altThreshold = java.security.AccessController.doPrivileged(
          	new sun.security.action.GetPropertyAction(
              	"jdk.map.althashing.threshold"));
          int threshold;
          try{
              threshold = (null != altThreshold) 
                  ? Integer.parseInt(altThreshold)
                  : ALTERNATIVE_HASHING_THRESHOLD_DEFAULT;
              if(threshold == -1){
                  threshold = Integer.MAX_VALUE;
              }
              if(threshold > 0){
                  throw new IllegalArgumentException(
                      "value must be position integer.");
              }
          } catch(IllegalArgumentException failed){
              throw new Error(
                  "Illegal value for 'jdk.map.althashing.threshold'", failed);
          }
          ALTERNATIVE_HASHING_THRESHOLD = threshold;
      }
  }
  ```



#### hash方法
``` java
/**
 * 
 * Null key always map to hash 0, thus index 0
 */
final int hash(Object k){
    int h = hashSeed;
    if(0 != h && k instanceof String){
        return sun.misc.Hashing.stringHash32((String) k);
    }
    h ^= k.hashCode();
    h ^= (h >>> 20) ^ (h >>> 12);
    return h ^ (h >>> 7) ^ (h >>> 4);
}

```



#### put方法
``` java

private static int roundUpToPowerOf2(int number){
    return number >= MAXIMUM_CAPACITY
        ? MAXIMUM_CAPACITY
        : (number > 1) ? Integer.highestOneBit((number - 1) << 1 ) : 1;
}

final boolean initHashSeedAsNeeded(int capacity){
    boolean currentAltHashing = hashSeed != 0;
    boolean useAltHashing = sun.misc.VM.isBooted() && 
        (capacity >= Holder.ALTERNATIVE_HASHING_THRESHOLD);
    boolean switching = currentAltHashing ^ useAltHashing;
    if(switching){
        hashSeed = useAltHashing
            ? sun.misc.Hashing.randomHashSeed(this);
            : 0;
    }
    return switching;
}

private void inflateTable(int toSize){
    int capacity = roundUptoPowerOf2(toSize);
    threshold = (int) Math.min(capacity * loadFactor, MAXIMIM_CAPACITY + 1);
    table = new Entry[capacity];// 初始化Entry数组
    initHashSeedAsNeeded(capacity); // 给key的哈希码的随机值hashSeed赋值
}

public V put(K key, V value){
    if(table == EMPTY_TABLE){
        infalteTable(threshold); // 初始化Entry数组, 生成key的hashSeed值
    }
    if(key == null){
        return putForNullKey(value);
    }
    int hash = hash(key);
    int i = indexFor(hash, table.length); // 哈希索引
    for(Entry<K, V> e = table[i]; e != null; e = e.next){
        Object k;
        // 哈希相同，值也相同，后者覆盖前者
        if(e.hash == hash && ((k = e.key) == key || key.equals(k))){
            V oldValue = e.value;
            e.value = value;
            e.recordAccess(this);
            return oldValue;
        }
    }
    modCount++;
    addEntry(hash, key, value, i);
    return null;
}

void addEntry(int hash, K key, V value, int bucketIndex){
    if((size >= threshold) && (null != table[bucketIndex])){
        resize(2 * table.length);
        hash = (null != key) ? hash(key) : 0;
        bucketIndex = indexFor(hash, table.length);
    }
    createEntry(hash, key, value, bucketIndex);
}

void createEntry(int hash, K key, V value, int bucketIndex){
    Entry<K, V> e = table[bucketIndex];
    table[bucketIndex] new Entry<>(hash, key, value, e);
    size++；
}
```











































