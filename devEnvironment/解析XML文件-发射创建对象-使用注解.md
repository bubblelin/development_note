### 使用apache.commons.configuration.XMLConfiguration解析XML文件

1. 需要用到的jar包：
commons-configuration-1.10.jar
commons-lang-2.6.jar
commons-logging-1.2.jar
commons-collections-3.2.1.jar

2. XML文件：
``` xml
<cars>
    <factory1>
        <name>Benz</name>
    </factory1>
    <factory2>
        <class>com.product.BMWCar</class>
    </factory2>
    <factory3>
        <type>LandRover</type>
    </factory3>
    <factory4>
        <type>ypb</type>
    </factory4>
</cars>
```

3. java代码
``` java
//得到factory1节点下name节点的内容
try {
	XMLConfiguration config = new XMLConfiguration("car.xml");
	name = config.getString("factory1.name");
} catch (ConfigurationException e) {
    e.printStackTrace();
}
```


### 使用反射创建对象
``` java
//得到factory2节点下class节点的内容
//得到BMWCar的权限定名
//得到BMWCar的对象
try {
	XMLConfiguration config = new XMLConfiguration("car.xml");
	name = config.getString("factory2.class");
} catch (ConfigurationException e) {
    e.printStackTrace();
}
try {
	car = (Car) Class.forName(name).newInstance();//创建对象
} catch (InstantiationException | IllegalAccessException | ClassNotFoundException e) {
    e.printStackTrace();
}
```


### 使用注解代替XML
1. 需要用到的jar包：
reflections-0.9.10.jar
guava-18.0.jar
javassist-3.20.0-GA.jar

2. 创建注解
```java
@Target(ElementType.TYPE)
@Retention(RetentionPolicy.RUNTIME)
@Documented
@Inherited
public @interface Vehicle {
	String type () default "";
}
```

3. 使用注解
```java
@Vehicle(type = "LandRover")
public class LandRoverCar extends Car {
	public LandRoverCar(){
		this.name = "LandRover";
	}

	@Override
	public void drive() {
		//TODO
	}
}
```

4. 解析注解
```java
private static Map<String, Class> allCars;

static {
	Reflections reflections = new Reflections("com.product");
	Set<Class<?>> annotationClasses = reflections.getTypesAnnotatedWith(Vehicle.class);
	allCars = new ConcurrentHashMap<>();
	for(Class<?> classObject : annotationClasses){
		Vehicle vehicle = classObject.getAnnotation(Vehicle.class);
		allCars.put(vehicle.type(), classObject);
	}
	allCars = Collections.unmodifiableMap(allCars);
}

public static Car carInstance(){
	Car car = null;
	String type = null;

	try {
		XMLConfiguration config = new XMLConfiguration("car.xml");
		type = config.getString("factory3.type");
	} catch (ConfigurationException e) {
        e.printStackTrace();
	}

	if(allCars.containsKey(type)){
		try {
			car = (Car)allCars.get(type).newInstance();//反射创建对象；
		} catch (InstantiationException | IllegalAccessException e) {
            e.printStackTrace();
		}
	}else{
        //不存在 TODO
	}
	return car;
}
```
