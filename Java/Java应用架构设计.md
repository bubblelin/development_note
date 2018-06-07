<h1>OSGi</h1>

<b>开放服务网关倡议（OSGi，Open Service Gateway Initiative）</b>

> OSGi服务平台是Java中的动态模块化系统。在OSGi的术语中，模块称为bundle。OSGi提供了一个框架来管理Java JAR文件，里面包含了清单文件（mainifest）。在清单文件中含了重要的元数据信息，这些信息描述了bundle以及对OSGi框架的依赖。

<strong>OSGi功能：</strong>

1. 模块坏   
2. 版本管理
3. 热部署
4. 封装
5. 面向服务: 在同一个JVM中使用面向服务的设计原则，使用µService
6. 依赖管理

---

## 模块定义

Java平台中最适合的模块化单元就是JAR文件


## 模块化的两个方面

1. 运行时模式
2. 开发模式


## 架构与模块化

1. 架构（architecture）
架构就是一系列重要的决策，这些决策涉及软件系统的组织、组成系统的结构化元素及其接口的选择、元素之间协作时特定的行为、结构化元素和行为元素形成更大子系统的组合方式以及引导这一组合方式的架构风格。（1999）
一个系统的基本组织，通过组件、组件之间和组件与环境之间的关系以及管理其设计和演变的原则具体实现。（2000）


<i>参看：OSGi基本原理 https://cloud.tencent.com/developer/article/1014387</i>

---

<h1>类设计的SOLID原则</h1>

## 单一职责原则 Single Responsible Principle

> 对于一个类应该仅有一个引起它变化的原因

## 开放封闭原则 Open Closed Principle

> 类应该对扩展开放，对修改关闭

## Liskov原则 Liskov Substitution Principle

> 子类型应该能替换它们的基类型

## 依赖倒置原则 Dependency Inversion Principle

> 依赖抽象体，不要依赖固定的类

## 接口隔离原则 Interface Segregation Principle

> 众多的接口要优于单一的、通用型的接口

## 组合重用原则 Composite Reuse Principle

> 优先选择对象的多态组合，而不是继承
