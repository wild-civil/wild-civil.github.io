---
title: 学物联网之ESP8266NodeMCU（三）
abbrlink: 336e95a3
date: 2022-08-31 11:54:16
tags:
  - esp8266
  - 物联网
keywords: ESP8266-NodeMCU通过C/C++开发使用物联网
description: 开发基础
password:
abstract:
message:
cover: http://qiniu.hanvon.top/blog_cover/iot_develop-basics_cover.png
copyright: false
---

# 准备工作

## [安装 ESP8266-NodeMCU开发板驱动](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/install-esp8266-nodemcu-driver/)

目前大部分电脑驱动都已自动安装完成，可先进行下一步，若遇连接问题，可自行百度安装驱动。

## [为ESP8266-NodeMCU搭建Arduino IDE开发环境](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/nodemcu-arduino-ide/)

**下载 Arduino IDE **

打开Arduino IDE，**“文件” -> "首选项", 在 "附加开发板管理网址"** 中输入以下网址：

esp8266开发板管理器地址：

```html
http://arduino.esp8266.com/stable/package_esp8266com_index.json
```

（选填，方便日后开发esp32）esp32开发版管理器地址：

```html
https://dl.espressif.com/dl/package_esp32_index.json
```

紧接着点击**”工具“ -> ”开发板“ -> "开发板管理器"**, **在搜索栏中输入“esp8266”**，看到搜索结果显示**"esp8266 by ESP8266 Community", 选择最新版本安装即可（我这里是3.0.2）**

安装成功后，在**”工具“ -> ”开发板“ 中选择”NodeMCU 1.0 (ESP-12E Moudle)“ 即可**

紧接着设置**NodeMCU开发板的端口，在 “工具” -> "端口"**

<font color=purple>（这里比较简单，如果有其它问题自行百度解决）</font>

# [NodeMCU开发板的接入点模式](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/ap/)

## 接入点模式（Access Point, 也称 AP）

![ESP8266-NodeMCU接入点(Access Point)工作模式](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/NodeMCU-Access-Point.png)



```c
/*
NodeMCU接入点模式 
    
此程序用于演示如何将NodeMCU以接入点模式工作。通过此程序，您可以使用
电脑或者手机连接NodeMCU所建立WiFi网络。
*/
 
#include <ESP8266WiFi.h>        // 本程序使用ESP8266WiFi库
 
const char *ssid = "设定自己的wifi名"; // 这里定义将要 建立 的WiFi名称
                                   // 您可以将自己想要建立的WiFi名称填写入此处的双引号中
 
const char *password = "设定自己的wifi密码";  // 这里定义将要建立的WiFi密码
                                    // 您可以将自己想要使用的WiFi密码放入引号内
                                    // 如果建立的WiFi不要密码，则在双引号内不要填入任何信息
 
void setup() {
  Serial.begin(9600);              // 启动串口通讯
 
  WiFi.softAP(ssid, password);     // 此语句是重点。WiFi.softAP用于启动NodeMCU的AP模式。
                                   // 括号中有两个参数，ssid是WiFi名。password是WiFi密码。
                                   // 这两个参数具体内容在setup函数之前的位置进行定义。
 
  Serial.print("Access Point: ");    // 通过串口监视器输出信息
  Serial.println(ssid);              // 告知用户NodeMCU所建立的WiFi名
  Serial.print("IP address: ");      // 以及NodeMCU的IP地址
  Serial.println(WiFi.softAPIP());   // 通过调用WiFi.softAPIP()可以得到NodeMCU的IP地址
}
 
void loop() { 
}
```

将程序上传至开发板以后, NodeMCU在每次启动以后，都会自动启动接入点模式。接入点WiFi的详细信息会通过串口监视器输出给用户查看。

若想要验证一下电脑是否可以与NodeMCU进行网络通讯，那么同样可以在Windows操作系统的“命令提示符”中输入：`ping IP address`

（注意：ping的IP地址是NodeMCU默认的接入点IP地址，这一信息在上面的 串口监视器截屏中可以看到。）

# [NodeMCU开发板的无线终端模式](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/station/)

## 无线终端模式(Station)

### **1. 连接WiFI**

![ESP8266-NodeMCU无线终端(Wireless Station)工作模式](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/NodeMCU-Station.png))

```c
/*
NodeMCU无线终端模式连接WiFi
 
本示例程序用于演示如何使用NodeMCU无线终端模式连接WiFi
*/
 
#include <ESP8266WiFi.h>        // 本程序使用ESP8266WiFi库
 
const char* ssid     = "自家路由器的wifi名";      // 连接WiFi名
                                            // 请将您需要连接的WiFi名填入引号中
const char* password = "自家路由器的wifi密码";          // 连接WiFi密码
                                            // 请将您需要连接的WiFi密码填入引号中
                                            
void setup() {
  Serial.begin(9600);         // 启动串口通讯
  
  WiFi.begin(ssid, password);                  // 启动网络连接
  Serial.print("Connecting to ");              // 串口监视器输出网络连接信息
  Serial.print(ssid); Serial.println(" ...");  // 告知用户NodeMCU正在尝试WiFi连接
  
  int i = 0;                                   // 这一段程序语句用于检查WiFi是否连接成功
  while (WiFi.status() != WL_CONNECTED) {      // WiFi.status()函数的返回值是由NodeMCU的WiFi连接状态所决定的。 
    delay(1000);                               // 如果WiFi连接成功则返回值为WL_CONNECTED                       
    Serial.print(i++); Serial.print(' ');      // 此处通过While循环让NodeMCU每隔一秒钟检查一次WiFi.status()函数返回值
  }                                            // 同时NodeMCU将通过串口监视器输出连接时长读秒。
                                               // 这个读秒是通过变量i每隔一秒自加1来实现的。
                                               
  Serial.println("");                          // WiFi连接成功后
  Serial.println("Connection established!");   // NodeMCU将通过串口监视器输出"连接成功"信息。
  Serial.print("IP address:    ");             // 同时还将输出NodeMCU的IP地址。这一功能是通过调用
  Serial.println(WiFi.localIP());              // WiFi.localIP()函数来实现的。该函数的返回值即NodeMCU的IP地址。
}
 
void loop() {                                   
}
```

### **2. 自动连接最强信号WiFi网络**

有时会在家，学校，公司等来回跑，这样的话没换一个地方就得重新更改代码，太麻烦，于是我们可以：

```c
/*
NodeMCU无线终端模式连接WiFi-2
 
此程序将会控制NodeMCU在当前的网络环境里搜索预先存储好的WiFi。
一旦找到预存的WiFi名称，NodeMCU将会使用预存的密码信息尝试连接该WiFi。
如果同时找到多个预存WiFi，NodeMCU将会尝试连接信号最强的WiFi。
*/
 
#include <ESP8266WiFi.h>          // 本程序使用ESP8266WiFi库
#include <ESP8266WiFiMulti.h>   // 本程序使用ESP8266WiFiMulti库
 
ESP8266WiFiMulti wifiMulti;     // 建立ESP8266WiFiMulti对象,对象名称是'wifiMulti'
 
void setup() {
  Serial.begin(9600);            // 启动串口通讯
 
//通过addAp函数存储  WiFi名称       WiFi密码
  wifiMulti.addAP("taichi-maker", "12345678");  // 这三条语句通过调用函数addAP来记录3个不同的WiFi网络信息。
  wifiMulti.addAP("taichi-maker2", "87654321"); // 这3个WiFi网络名称分别是taichi-maker, taichi-maker2, taichi-maker3。
  wifiMulti.addAP("taichi-maker3", "13572468"); // 这3个网络的密码分别是123456789，87654321，13572468。
                                                // 此处WiFi信息只是示例，请在使用时将需要连接的WiFi信息填入相应位置。
                                                // 另外这里只存储了3个WiFi信息，您可以存储更多的WiFi信息在此处。
                                                
  Serial.println("Connecting ...");         // 通过串口监视器输出信息告知用户NodeMCU正在尝试连接WiFi
  int i = 0;                                 
  while (wifiMulti.run() != WL_CONNECTED) {  // 此处的wifiMulti.run()是重点。通过wifiMulti.run()，NodeMCU将会在当前
    delay(1000);                             // 环境中搜索addAP函数所存储的WiFi。如果搜到多个存储的WiFi那么NodeMCU
    Serial.print('.');                       // 将会连接信号最强的那一个WiFi信号。
  }                                           // 一旦连接WiFI成功，wifiMulti.run()将会返回“WL_CONNECTED”。这也是
                                              // 此处while循环判断是否跳出循环的条件。
 
  
  Serial.println('\n');                     // WiFi连接成功后
  Serial.print("Connected to ");            // NodeMCU将通过串口监视器输出。
  Serial.println(WiFi.SSID());              // 连接的WiFI名称
  Serial.print("IP address:\t");            // 以及
  Serial.println(WiFi.localIP());           // NodeMCU的IP地址
}
 
void loop() { 
}
```

