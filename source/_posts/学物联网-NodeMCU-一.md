---
title: 学物联网之ESP8266NodeMCU（一）
abbrlink: a01e6d85
date: 2022-08-31 09:53:31
tags: 
  - esp8266
  - 物联网
keywords: 初识NodeMCU开发板
password:
abstract:
message:
cover: http://qiniu.hanvon.top/blog_cover/imagesnodemcu_pinLocation_cover.png
---

# 初识NodeMCU开发板

市面上销售的配有ESP8266芯片的开发板有很多种。比较流行的有SparkFun ESP8266 Thing、Adafruit Feather HUZZAH with ESP8266、NodeMCU等。这里选择跟太极创客团队学NodeMCU。

![ESP8266-NodeMCU开发板](https://raw.githubusercontent.com/wild-civil/typora_img/main/imagesnodemcu_pinLocation.jpg)

## 数字输入输出引脚（GPIO）

如下图所示，ESP8266芯片四周分布很多引脚。这些引脚大部分可用作输入输出使用。这些用作输入输出的引脚统称为GPIO。

当引脚以数字输出模式工作时，低电平是<font color=red size=4>0V</font>> (灌电流)，高电平是<font color=red size=4>3.3V</font> (拉电流)。

<font face="黑体" color=green size=4>请注意:ESP8266芯片与Arduino Uno/Mega/Nano等开发板的引脚电平电压有所区别。Arduino开发板的高电平是+5V，低电平是0V。</font>

### GPIO编号与NodeMCU开发板引脚名的区别

请留意：在很多介绍ESP8266以及NodeMCU的资料里会出现两种引脚命名方法。一种是GPIO编号，一种是NodeMCU引脚名。请注意这两者是不同的，请千万不要混淆。

![nodemcu-pin-number](https://raw.githubusercontent.com/wild-civil/typora_img/main/imagesnodemcu-pin-number.jpg)

简而言之，只要您看到GPIO这几个字母，就说明是芯片引脚，而没有GPIO这几个字母，那肯定是指开发板引脚。

### ESP8266 GPIO编号与NodeMCU开发板引脚名的对应关系

![nodemcu-pin-GPIO_001](https://raw.githubusercontent.com/wild-civil/typora_img/main/imagesnodemcu-pin-GPIO_001.png)



![esp8266_devkit_horizontal-002](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266_devkit_horizontal-002.png)

在以上图片中深蓝底白色字的标识就是GPIO引脚编号。如![NodeMCU-GPIO4](http://www.taichi-maker.com/wp-content/uploads/2019/02/GPIO4.png) 

而开发板上所印刷的D2,D3等等就是NodeMCU开发板引脚名称。

```c
digitalWrite(4, High);
```

以上语句通过digitalWrite函数将引脚4设置为高电平。这里的数字4就是指GPIO4。也可以说这个语句是将NodeMCU开发板的D2引脚设置为高电平,即：

```c
digitalWrite(D2, High);    //因为D2对应的是GPIO4。
```

## 可用引脚

ESP8266芯片有17个GPIO引脚（GPIO0～GPIO16）。这些引脚中的GPIO6～GPIO 11被用于连接开发板的闪存（Flash Memory）。如果在实验电路中使用GPIO6～GPIO11，NodeMCU开发板将无法正常工作。因此建议您<font color=red size=4>不要使用GPIO6～GPIO 11。</font>

![*ESP8266的GPIO6-GPIO11用于连接闪存，因此不建议使用这些引脚。*](https://raw.githubusercontent.com/wild-civil/typora_img/main/imagesesp8266_devkit_horizontal-flash-pins.png)

### 电压电流限制

NodeMCU开发板引脚的<font color=orange>输入输出电压限制是3.3 V</font>。如果向引脚施加3.6V以上的电压就有可能对芯片电路造成损坏。同时请注意，这些引脚的<font color=orange>最大输出电流是12mA。</font>

由于NodeMCU开发板的引脚允许电压和电流都是低于Arduino开发板的引脚，将NodeMCU与Arduino引脚相互连接时一定要特别注意这两个开发板的引脚电压和电流的区别。操作不当极有可能可能会损坏NodeMCU开发板。

### 特殊引脚情况说明

**GPIO2引脚** 在NodeMCU开发板启动时是不能连接低电平的。

**GPIO15引脚**在开发板运行中一直保持低电平状态。因此请不要使用GPIO15引脚来读取开关状态或进行I²C通讯。

**GPIO0引脚**在开发板运行中需要一直保持高电平状态。否则ESP8266将进入程序上传工作模式也就无法正常工作了。您无需对GPIO0引脚进行额外操作，因为NodeMCU的内置电路可以确保GPIO0引脚在工作时连接高电平而在上传程序时连接低电平。

### 上拉电阻/下拉电阻

**GPIO 0-15引脚**都配有内置上拉电阻。这一点与Arduino十分类似。**GPIO16 引脚**配有内置下拉电阻。

### 模拟输入

ESP8266 只有一个模拟输入引脚（该引脚通过模拟-数字转换将引脚上的模拟电压数值转化为数字量）。<font color=red>此引脚可读取的模拟电压值为 0 – 1.0V。</font>请注意：ESP8266 芯片模拟输入引脚连接在1.0V以上电压可能损坏ESP8266芯片。

以上所描述的是针对ESP8266芯片的引脚。而对于NodeMCU开发板引脚，情况就不同了。

NodeMCU开发板配有降压电路。您可以用NodeMCU开发板的模拟输入引脚读取0-3.3V的模拟电压信号。

### 通讯

#### **串行端口**

ESP8266有2个硬件串行端口（UART）。

串行端口0（UART0）使用GPIO1和GPIO3引脚。其中GPIO1引脚是TX0，GPIO3是RX0。

串行端口1（UART1）使用GPIO2和GPIO8引脚。其中GPIO2引脚是TX1，GPIO8是RX1。请注意，由于GPIO8被用于连接闪存芯片，串行端口1只能使用GPIO2来向外发送串行数据。

#### **I²C**

ESP8266只有软件模拟的I²C端口，没有硬件I²C端口。也就是说我们可以使用任意的两个GPIO引脚通过软件模拟来实现I²C通讯。ESP8266的数据表（datasheet）中，GPIO2标注为SDA，GPIO14标注为SCL。

#### **SPI**

ESP8266的SPI端口情况如下：

GPIO14 — CLK
GPIO12 — MISO
GPIO13 — MOSI
GPIO 15 — CS(SS)

### **ESP8266引脚功能一览**

| GPIO   | 功能             | 状态 | 限制                                               |
| :----- | :--------------- | :--- | :------------------------------------------------- |
| 0      | 引导模式选择     | 3.3V | 无Hi-Z                                             |
| 1      | TX0              | –    | 串口通讯过程中不能使用                             |
| 2      | 引导模式选择 TX1 | 3.3V | 启动时不能接地 启动时发送调试信息                  |
| 3      | RX0              | –    | 串口通讯过程中不能使用                             |
| 4      | SDA (I²C)        | –    | –                                                  |
| 5      | SCL (I²C)        | –    | –                                                  |
| 6 – 11 | 连接闪存         | x    | 不可用                                             |
| 12     | MISO (SPI)       | –    | –                                                  |
| 13     | MOSI (SPI)       | –    | –                                                  |
| 14     | SCK (SPI)        | –    | –                                                  |
| 15     | SS (SPI)         | 0V   | 上拉电阻不可用                                     |
| 16     | 睡眠唤醒         | –    | 无上拉电阻，仅有下拉电阻 连接 RST 引脚实现睡眠唤醒 |
