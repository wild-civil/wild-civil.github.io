---
title: 粗学IIC
tags: 
  - iic
  - 时序
abbrlink: 11f9a402
date: 2022-09-12 17:34:47
keywords:
description:
password:
abstract:
message:
cover: http://qiniu.hanvon.top/blog_cover/shixutu_cover.png
---



# 一、IIC简介

**I2C（Inter-Integrated Circuit，集成线路总线） 总线**是由飞利浦(Philips)公司开发的一种简单、双向二线制同步串行总线。它只需要两根线即可在连接于总线上的器件之间传送信息。

I2C 总线支持任何IC 生产过程(NMOS CMOS、 双极性)。两线――串行数据（SDA） 和串行时钟 （SCL） 线在连接到总线的器件间传递信息。 每个器件都有一个唯一的地址识别（无论是微控制器——MCU、 LCD 驱动器、 存储器或键盘接口） ， 而且都可以作为一个发送器或接收器（由器件的功能决定) 。
在 `CPU 与被控 IC 之间`、 `IC 与 IC 之间进行双向传送`， 高速 IIC 总线一般<u>可达 400kbps 以上</u>。
I2C 总线在传送数据过程中共有三种类型信号， 它们分别是：==开始信号、结束信号和应答信号==。

# 二、I2C总线物理拓补结构（主从模式）

![IIC总线物理拓扑](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/IIC%E6%80%BB%E7%BA%BF%E7%89%A9%E7%90%86%E6%8B%93%E6%89%91.jpg)

一般情况下，数据线SDA和时钟线SCL都是处于上拉电阻状态。因为：在总线空闲状态时，这两根线一般被上面所接的上拉电阻拉高，保持着高电平。<font color=red>(上拉电阻一般在4.7k~10k之间，默认拉高)</font>

数据的传输速率在标准模式下可达100kbit/s，在快速模式下可达400kbit/s，在高速模式（Hs模式）下可达3.4Mbit/s，各种被控器件均并联在总线上，通过器件地址（每个器件的地址在器件手册有些）识别。

一般我们使用的I2C总线速度小于400Kbit/s。

由于I2C器件一般采用开漏结构与总线连接，所以SCL和SDA线均接上拉电阻


# 三、I2C时序

IIC总线在传输数据的过程的信号中，**<u>起始信号</u>是必需的**，**结束信号和应答信号，都可以不要**。同时我们还要介绍其`空闲状态、数据的有效性、数据传输`。

IIC总线的时序图：

![iic时序](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/iic%E6%97%B6%E5%BA%8F.jpg)

简化了的时序图

![start_stop](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/start_stop.jpg)



## 空闲状态

**当IIC总线的数据线SDA和时钟线SCL两条信号线同时处于高电平时，规定为总线的空闲状态。**此时各个器件的输出级场效应管均处在截止状态，即释放总线，由两条信号线各自的上拉电阻把电平拉高。 

## 起始信号与停止信号

- **起始信号：**当时钟线SCL为高电平时，数据线SDA由高到低低电的跳变；(启动信号是一种电平跳变时序信号，而不是一个电平信号)

- **停止信号：**当时钟线SCL为高电平时，数据线SDA由低到高低电的跳变；(停止信号也是一种电平跳变时序信号，而不是一个电平信号)

## 应答信号

发送器每发送一个字节（8个bit），就在时钟脉冲9期间释放数据线，由接收器反馈一个应答信号。 

- 应答信号为低电平时，规定为有效应答位（ACK，简称应答位），表示接收器已经成功地接收了该字节；

- 应答信号为高电平时，规定为非应答位（NACK），一般表示接收器接收该字节没有成功。 

![ACK](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/ACK.jpg)

对于反馈有效应答位ACK的要求是：接收器在第9个时钟脉冲之前的低电平期间将数据线SDA拉低，并且确保在该时钟的高电平期间为稳定的低电平。 **如果接收器是主控器，则在它收到最后一个字节后，发送一个NACK信号，以通知被控发送器结束数据发送，并释放数据线SDA，以便主控接收器发送一个停止信号P。**

### 数据有效性

**IIC总线进行数据传送时，时钟信号为高电平期间，数据线上的数据必须保持稳定；只有在时钟线上的信号为低电平期间，数据线上的高电平或低电平状态才允许变化。** 

即：**数据在时钟线SCL的上升沿到来之前就需准备好。并在在下降沿到来之前必须稳定。**

![stable](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/stable.jpg)

### 数据的传达

在IIC总线上传送的每一位数据都有一个时钟脉冲相对应（或同步控制），即在SCL串行时钟的配合下，在SDA上逐位地串行传送每一位数据。数据位的传输是边沿触发。

### 延时时间

可以查手册，也可以直接浏览下方图：

![delay_time](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/delay_time.jpg)

## IIC总线的数据传送

**IIC总线上的每一个设备都可以作为主设备或者从设备，而且每一个设备都会对应一个唯一的地址（地址通过物理接地或者拉高），主从设备之间就通过这个地址来确定与哪个器件进行通信**，在通常的应用中，我们把CPU带I2C总线接口的模块作为主设备，把挂接在总线上的其他设备都作为从设备。

也就是说，**主设备在传输有效数据之前要先指定从设备的地址，地址指定的过程和上面数据传输的过程一样，只不过大多数从设备的地址是7位的，然后协议规定再给地址添加一个最低位用来表示接下来数据传输的方向，0表示主设备向从设备写数据，1表示主设备向从设备读数据。**

![shixutu](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/shixutu.jpg)



- **主设备往从设备中写数据。数据传输格式如下：**

![w_data](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/w_data.jpg)



淡蓝色部分表示数据由主机向从机传送，粉红色部分则表示数据由从机向主机传送。

**写用0来表示（高电平），读用1来表示（低电平）。**

- **主设备从从设备中读数据。数据传输格式如下：**

![r_data](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/r_data.jpg)

**在从机产生响应时，主机从发送变成接收，从机从接收变成发送。之后，数据由从机发送，主机接收，每个应答由主机产生，时钟信号仍由主机产生。若主机要终止本次传输，则发送一个非应答信号，接着主机产生停止条件。**

- 主设备往从设备中写数据，然后重启起始条件，紧接着从从设备中读取数据；或者是主设备从从设备中读数据，然后重启起始条件，紧接着主设备往从设备中写数据。数据传输格式如下：



![rw_data](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/rw_data.jpg)

在多主的通信系统中，总线上有多个节点，它们都有自己的寻址地址，可以作为从节点被别的节点访问，同时它们都可以作为主节点向其它的节点发送控制字节和传送数据。但是如果有两个或两个以上的节点都向总线上发送启动信号并开始传送数据，这样就形成了冲突。要解决这种冲突，就要进行仲裁的判决，这就是I2C总线上的仲裁。


**I2C总线上的仲裁分两部分：SCL线的同步和SDA线的仲裁。**

这部分就暂时不介绍了，想要了解：可以参考链接[浅谈I2C总线](https://blog.csdn.net/bluewhaletech/article/details/37876111)或[I2C总线协议图解](http://www.cnblogs.com/aaronLinux/p/6218660.html)。







