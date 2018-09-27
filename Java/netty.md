# 

**Netty是由JBOSS提供的一个Java开源框架。Netty提供异步的、事件驱动的网络应用程序框架和工具，用以快速开发高性能、高可靠性的网络服务器和客户端程序。**



# Netty特性总结

| 分类     | Netty特性                                                    |
| -------- | ------------------------------------------------------------ |
| 设计     | 统一的API，支持多种传输类型，阻塞的和非阻塞的。<br />简单而强大的线程模型。<br />真正的无连接数据报套接字支持。<br />连接逻辑组件以支持复用 |
| 易于使用 | 详实的Javadoc和大量的示例集。                                |
| 性能     | 拥有比Java的核心API更高的吞吐量以及更低的延迟。<br />得益于池化和复用，拥有更低的资源消耗。<br />最少的内存复制。 |
| 健壮性   | 不会因为慢速、快速或者超载的连接而导致OutOfMenmoryError。<br />消除在高速网络中NIO应用程序常见的不公平读写比率 |
| 安全性   | 完整的SSL/TLS以及StartTLS支持。<br />可用于受限环境下，如Applet和OSGI |
| 社区驱动 | 发布快速而且频繁                                             |

## 异步和可伸缩性之间的联系

- 非阻塞网络调用使得我们可以不必等待一个操作的完成。

  完全异步的I/O正是基于这个特性构建的，并且更进一步：

  异步方法会立即返回，并且在它完成时，会直接或者在稍后的某个时间点通知用户。

- 选择器使得我们能够通过较少的线程便可监视许多连接上的事件。



## Netty的核心组件

- Channel

  > 它代表一个到实体（一个硬件设备、一个文件、一个网络套接字或者一个能
  >
  > 执行一个或者多个不同的I/O操作的程序组件）的开放连接，如读操作和写操作。

- 回调

  > 一个回调其实就是一个方法，一个指向已经被提供给另外一个方法的方法引用。
  >
  > 这使得后者可以在适当的时候调用前者。
  >
  > Netty在内部使用了回调来处理事件，当一个回调被触发时，相关的事件可以被一个InterfaceChannelHandler的实现处理。

- Future

  > Future提供了另一种在操作完成时通知应用程序的方式。
  >
  > 这个对象可以看作是一个异步操作的结果的占位符；它将在未来的某个时刻完成，
  >
  > 并提供对其结果的访问。
  >
  > Netty在内部提供了自己的实现ChannelFuture，每个Netty的出战I/O操作都将返回一个ChannelFuture；也就是说，他们都不会阻塞。所以Netty完全是异步和事件驱动的。

- 事件和ChannelHandler

![1534830655887](.\1534830655887.png)

> Netty使用不同的事件来通知我们状态的改变或者是操作的状态。事件是按照它们与入站或出站
>
> 数据流的相关性进行分类的。
>
> ChannelHandler组件实现了服务器对从客户端接收的数据的处理，每个事件都可以被分发给ChannelHandler类中的某个用户实现的方法。



### 传输

传输类型：

- OIO
- NIO
- Local
- Embedded



### ByteBuf

Netty的数据处理API通过两个组件——abstract class **ByteBuf** 和 interface **ByteBufHolder**

###### 优点：

1. 可以被用户自定义的缓冲区类型扩展
2. 通过内置的复合缓冲区类型实现了透明的零拷贝
3. 容量可以按需增长
4. 在读和写这两种模式之间切换不需要调用ByteBuffer的flip()方法
5. 读和写用了不同的索引
6. 支持方法的链式调用
7. 支持引用计数
8. 支持池化

###### 工作原理

ByteBuf维护了两个不同的索引：读取和写入。（而JDK的ByteBuffer却只有一个索引）

从ByteBuf读取时，它的 readerIndex 将会被递增已经读取的字节数；

写入ByteBuf时，它的 writeIndex 也会递增。

###### ByteBuf的使用模式

- 堆缓冲区
- 直接缓冲区
- 复合缓冲区

###### 字节级操作



### ChannelHandler和ChannelPipeline

Interface Channel定义了一组和ChannelInboundHandler API密切相关的状态模型

###### Channel的生命周期

channelUnregistered：Channel已经被创建，但还没有注册到EventLoop

channelRegistered：Channel已经被注册到了EventLoop

###### ChannelHandler家族

channelActive： Channel处于活动状态（已经连接到它的远程节点）。它现在可以接收和发送数据

channelInactive：Channel没有连接到远程节点。

###### ChannelHandler的生命周期

handlerAdded：当把ChannelHandler添加到channelPipeline中时调用

handlerRemoved：当从ChannelPipeline中移除ChannelHandler时调用

exceptionCaught：当处理过程中在ChannelPipeline中有错误产生时调用



### EventLoop和线程模型















> 应用层通过传输层进行数据通信时，TCP和UDP会遇到同时为多个应用程序进程提供并发服务的问题。多个TCP连接或多个应用程序进程可能需要 通过同一个TCP协议端口传输数据。为了区别不同的应用程序进程和连接，许多计算机操作系统为应用程序与TCP／IP协议交互提供了称为套接字 (Socket)的接口，区分不同应用程序进程间的网络通信和连接。