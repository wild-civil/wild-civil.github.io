---
title: 学物联网之ESP8266NodeMCU（五）
description: ESP8266 NodeMCU 闪存文件系统（SPIFFS）
copyright: false
abbrlink: e2f4da2
date: 2022-09-02 15:23:18
tags:
  - esp8266
  - 物联网
keywords:
password:
abstract:
message: 
cover: >-
  http://qiniu.hanvon.top/blog_cover/esp8266-nodemcu-flash-file-system_cover.png
---

# 一、[ESP8266闪存文件系统基本操作](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/spiffs-operation/)

当我们上传程序给ESP8266时，我们的程序具体存放在什么地方呢？

每一个ESP8266都配有一个闪存，这个闪存很像是一个小硬盘，我们上传的文件就被存放在这个闪存里。这个闪存的全称是Serial Peripheral Interface Flash File System（SPIFFS）。

除了可以存放上传的程序以外，我们还可以将网页文件或者系统配置文件存放在ESP8266的闪存中。在这节课里，我们将学习如何利用程序对闪存文件系统（SPIFFS）进行文件读取和修改。

## 1、通过程序向闪存文件系统写入信息

```c
/**********************************************************************
项目名称/Project           : 零基础入门学用物联网
程序名称/Program name      : esp8266-flash-write
团队/Team                 : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)


程序目的/Purpose           : 此程序用于演示如何向NodeMCU的SPIFFS中建立名为
                            notes.txt的文件，程序还将向该文件写入信息。
-----------------------------------------------------------------------
函数说明：
SPIFFS.open(file_name, "w"); 
以上函数有两个参数：
第一个参数是被操作的文件名称，本示例中该文件为/notes.txt
第二个参数"w" 代表写入文件信息。（如需了解如何读取信息，请参阅示例程序esp8266-flash-read）
***********************************************************************/
 
 
#include <FS.h>  //★★★
 
String file_name = "/taichi-maker/notes.txt"; //被读取的文件位置和名称★★★
 
void setup() {
  Serial.begin(9600);
  Serial.println("");
  
  Serial.println("SPIFFS format start");
  SPIFFS.format();    			// 格式化SPIFFS★★★
  Serial.println("SPIFFS format finish");
  
  if(SPIFFS.begin()){ 			// 启动SPIFFS★★★
    Serial.println("SPIFFS Started.");
  } else {
    Serial.println("SPIFFS Failed to Start.");
  }
  
  File dataFile = SPIFFS.open(file_name, "w");// 建立File对象用于向SPIFFS中的file对象（即/notes.txt）写入信息★★★
  dataFile.println("Hello IOT World.");       // 向dataFile写入字符串信息★★★
  dataFile.close();                           // 完成文件写入后关闭文件★★★
  Serial.println("Finished Writing data to SPIFFS");
}
 
void loop() {
}
```

在使用SPIFFS存储文件以前，我们必须使用`#include "FS.h"`,如以上程序第18行所示。

程序第20行，我们建立了一个字符串变量。该变量用于存储文件位置和文件名。其中`/`代表根目录。`/taichi-maker/`代表根目录下的`taichi-maker`目录。`notes.txt`代表着文件名称。

程序第27行`SPIFFS.format();`是对闪存文件系统进行格式化。这很想是我们对u盘进行格式化的操作。您无需每次使用闪存文件系统都对它进行格式化操作。这里仅仅是为了演示如何使用`SPIFFS.format();`。

程序第30行，`SPIFFS.begin()`用于启动闪存文件系统。在每次使用闪存文件系统以前都需要执行这一操作。如果闪存文件系统成功启动，该函数的返回值为布尔型，如果成功启动闪存文件形同，则返回真。否则将返回假。

程序第36行，`File dataFile = SPIFFS.open(file_name, "w");`这条语句中，open函数可用于对SPIFFS进行操作。该函数共有两个参数。第一个参数`file_name`是被操作的文件名称，本示例中该文件为/taichi-maker/notes.txt
第二个参数`"w"`代表此操作为向SPIFFS写入文件信息。请注意：如果文件系统没有/taichi-maker/notes.txt文件，此操作将会在文件系统中建立该文件。如果文件系统有该文件，则程序将会重新建立该文件，即原有文件信息将会被覆盖。

程序第37行`dataFile.println("Hello IOT World.");`用于向dataFile文件写入信息。信息内容为“Hello IOT World.”。

程序第38行`dataFile.close();`用于关闭dataFile文件。结束文件操作后，应执行此操作。



## 2、通过程序从闪存文件系统读取信息

```c
/**********************************************************************
项目名称/Project           : 零基础入门学用物联网
程序名称/Program name      : esp8266-flash-read
团队/Team                 : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)


程序目的/Purpose           : 此程序用于演示如何从NodeMCU的内置SPIFFS中存储的文件notes.txt读取数据。
                           notes.txt 文件内容将会通过串口监视器显示出来供用户确认。
                           注意在使用本程序以前需要先将notes.txt 文件上传到NodeMCU开发板的SPIFFS中

-----------------------------------------------------------------------

函数说明：
SPIFFS.open(file_name, "r"); 
以上SPIFFS函数有两个参数：
第一个参数是被操作的文件名称，本示例中该文件为/notes.txt
第二个参数"r" 代表读取文件信息。（如需了解如何写入信息，请参阅示例程序esp8266-flash-write）

***********************************************************************/
 
#include <FS.h>
 
String file_name = "/taichi-maker/notes.txt";              //被读取的文件位置和名称
 
void setup() {
  Serial.begin(9600);
  Serial.println("");
  
  if(SPIFFS.begin()){ // 启动闪存文件系统
    Serial.println("SPIFFS Started.");
  } else {
    Serial.println("SPIFFS Failed to Start.");
  }
 
  //确认闪存中是否有file_name文件★★★
  if (SPIFFS.exists(file_name)){
    Serial.print(file_name);
    Serial.println(" FOUND.");
  } else {
    Serial.print(file_name);
    Serial.print(" NOT FOUND.");
  }
 
  //建立File对象用于从SPIFFS中读取文件★★★
  File dataFile = SPIFFS.open(file_name, "r"); 
 
  //读取文件内容并且通过串口监视器输出文件信息★★★
  for(int i=0; i<dataFile.size(); i++){
    Serial.print((char)dataFile.read());       
  }
 
  //完成文件读取后关闭文件
  dataFile.close();                           
}
 
void loop() {
}
```

以上程序第36行，`SPIFFS.exists(file_name)`用于检查闪存文件系统中有file_name文件（注：file_name变量具体信息在本程序第23行）。该函数返回值为布尔型。如果文件存在则返回真，否则将返回假。

以上程序第45行，`File dataFile = SPIFFS.open(file_name, "r");`这条语句中，open函数可用于对SPIFFS进行操作。该函数共有两个参数。第一个参数`file_name`是被操作的文件名称，本示例中该文件为/taichi-maker/notes.txt
第二个参数`"r"`代表此操作为读取文件信息。

以上程序第48行的for循环语句中，循环条件使用了函数`dataFile.size()`。该函数将会返回dataFile的大小。循环语句体中，`dataFile.read()`将会读取dataFile文件内容。每调用一次该含税都会返回dataFile文件中一个字符。再次调用，将会返回下一个字符。以此类推，直到dataFile结尾。通过for循环语句，程序将会依次读取dataFile文件内容，并且将文件内容逐字符输出于串口监视器中。



## 3、通过程序向闪存文件系统文件添加信息

```c
/**********************************************************************
项目名称/Project           : 零基础入门学用物联网
程序名称/Program name      : esp8266-flash-append
团队/Team                 : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)

程序目的/Purpose           : 此程序用于演示如何向NodeMCU的内置SPIFFS中存储的文件
                            notes.txt添加数据。                      
-----------------------------------------------------------------------  

函数说明：
SPIFFS.open(file_name, "a"); 
以上SPIFFS函数有两个参数：
第一个参数是被操作的文件名称，本示例中该文件为/notes.txt
第二个参数"a" 代表添加文件信息。（如需了解如何读取信息，请参阅示例程序esp8266-flash-read）
此示例程序所演示的是向SPIFFS中的文件里添加信息。这一操作写入信息有所区别。
添加信息是不会删除文件内原有信息，而是在原有信息后面添加新的信息。
但写入操作（示例 esp8266-flash-write.ino）是将文件内容完全清除，重新写入新信息。    
***********************************************************************/
 
#include <FS.h>
 
String file_name = "/taichi-maker/notes.txt";              //被读取的文件位置和名称
 
void setup() {
  Serial.begin(9600);
  Serial.println("");
  
  if(SPIFFS.begin()){ // 启动闪存文件系统
    Serial.println("SPIFFS Started.");
  } else {
    Serial.println("SPIFFS Failed to Start.");
  }
 
  //确认闪存中是否有file_name文件
  if (SPIFFS.exists(file_name)){
    
    Serial.print(file_name);
    Serial.println(" FOUND.");
 
    File dataFile = SPIFFS.open(file_name, "a");// 建立File对象用于向SPIFFS中的file对象（即/notes.txt）写入信息★★★
    dataFile.println("This is Appended Info."); // 向dataFile添加字符串信息★★★
    dataFile.close();                           // 完成文件操作后关闭文件★★★   
    Serial.println("Finished Appending data to SPIFFS");
    
  } else {
    Serial.print(file_name);
    Serial.print(" NOT FOUND.");
  }
                        
}
 
void loop() {
}
```

在以上程序的第40行里，`File dataFile = SPIFFS.open(file_name, "a");`这条语句中，open函数可用于对SPIFFS进行操作。该函数共有两个参数。第一个参数`file_name`是被操作的文件名称,第二个参数`"a"`代表向该文件添加信息。请留意，此处的添加信息是不会删除文件内原有信息，而是在原有信息后面添加新的信息。这与但写入操作是有所区别的。写入操作是将文件内容完全清除，重新写入新信息。
,
程序的第41行，`dataFile.println("This is Appended Info.")`，此语句作用将会向dataFile文件尾部添加双引号中的信息内容，也就是在文件尾部添加“This is Appended Info.”。

## 4、通过程序读取目录内容

```c
/**********************************************************************
项目名称/Project           : 零基础入门学用物联网
程序名称/Program name      : esp8266-flash-folder-read
团队/Team                 : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)


程序目的/Purpose           : 此程序用于演示如何从NodeMCU的内置SPIFFS中文件夹里读取文件信息
                           文件夹内容将会通过串口监视器显示出来。

-----------------------------------------------------------------------


函数说明：
SPIFFS.openDir(folder_name);
以上函数打开指定目录并返回一个目录对象实例。

***********************************************************************/
 
 
#include <FS.h>
 
String file_name = "/taichi-maker/myFile.txt"; //被读取的文件位置和名称
String folder_name = "/taichi-maker";         //被读取的文件夹★★★
 
void setup() {
  Serial.begin(9600);
  Serial.println("");
  
  if(SPIFFS.begin()){ // 启动闪存文件系统
    Serial.println("SPIFFS Started.");
  } else {
    Serial.println("SPIFFS Failed to Start.");
  }
 
  File dataFile = SPIFFS.open(file_name, "w");// 建立File对象用于向SPIFFS中的file对象（即myFile.txt）写入信息
  dataFile.println("Hello Taichi-Maker.");    // 向dataFile写入字符串信息
  dataFile.close();                           // 完成文件写入后关闭文件
  Serial.println(F("Finished Writing data to SPIFFS"));
 
  // 显示目录中文件内容以及文件大小
  Dir dir = SPIFFS.openDir(folder_name);  // 建立“目录”对象★★★
  
  while (dir.next()) {  // dir.next()用于检查目录中是否还有“下一个文件”★★★
    Serial.println(dir.fileName()); // 输出文件名★★★
  }
}
 
void loop() {
}
```

本程序第23行建立了一个字符串变量。该变量用于存储文件夹名。其中`/`代表根目录。`/taichi-maker/`代表根目录下的`taichi-maker`目录。

本程序第41行`SPIFFS.openDir(folder_name)`中的openDir函数函将返回一个“目录”对象并且赋值给dir。此”目录”对象正是folder_name所存储的`/taichi-maker/`目录。后续程序对dir的所有操作都是针对`/taichi-maker/`所执行的。

本程序第43行while循环语句的循环条件是`dir.next()`的返回值。`dir.next()`函数用于检查dir文件夹内的文件。我们可以想象dir文件夹里有一个指针，每一次调用next函数都会让指针向下挪动一格。每一次挪动一格，如果下一个位置有文件，则返回真。否则将会返回假。因此，`while (dir.next())`循环语句中的内容会依次显示dir文件夹中的每一个文件的文件名。

## 5、从闪存文件系统中删除文件

```c
/**********************************************************************
项目名称/Project           : 零基础入门学用物联网
程序名称/Program name      : esp8266-flash-remove
团队/Team                 : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)


程序目的/Purpose           : 此程序用于演示如何删除SPIFFS中存储的文件       
***********************************************************************/
 
#include <FS.h>
 
String file_name = "/taichi-maker/notes.txt";              //被读取的文件位置和名称
 
void setup() {
  Serial.begin(9600);
  Serial.println("");
  
  if(SPIFFS.begin()){ // 启动闪存文件系统
    Serial.println("SPIFFS Started.");
  } else {
    Serial.println("SPIFFS Failed to Start.");
  }
  
  //从闪存中删除file_name文件★★★
  if (SPIFFS.remove(file_name)){
    
    Serial.print(file_name);
    Serial.println(" remove sucess");
    
  } else {
    Serial.print(file_name);
    Serial.println(" remove fail");
  }                       
}
 
void loop() {
}
```

以上程序中第25行，通过使用`SPIFFS.remove(file_name)`将`file_name`所指代的文件进行了删除操作。另外，`SPIFFS.remove(file_name)`的返回值为布尔型。如果文件删除执行成功则返回真，否则返回假。

## 6、显示闪存文件系统信息

```c
/**********************************************************************
项目名称/Project           : 零基础入门学用物联网
程序名称/Program name      : esp8266-flash-info
团队/Team                 : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)


程序目的/Purpose           : 此程序用于演示如何使用FSInfo对象来显示闪存文件系统状态
-----------------------------------------------------------------------


***********************************************************************/
 
 
#include <FS.h>
 
FSInfo fs_info;
 
void setup() {
  Serial.begin(9600);
 
  SPIFFS.begin();       //启动SPIFFS
  Serial.println("");
  Serial.println("SPIFFS Started.");
 
  // 闪存文件系统信息
  SPIFFS.info(fs_info);
 
  // 可用空间总和（单位：字节）
  Serial.print("totalBytes: ");     
  Serial.print(fs_info.totalBytes); 
  Serial.println(" Bytes"); 
 
  // 已用空间（单位：字节）
  Serial.print("usedBytes: "); 
  Serial.print(fs_info.usedBytes);
  Serial.println(" Bytes"); 
 
  // 最大文件名字符限制（含路径和'\0'）
  Serial.print("maxPathLength: "); 
  Serial.println(fs_info.maxPathLength);
 
  // 最多允许打开文件数量
  Serial.print("maxOpenFiles: "); 
  Serial.println(fs_info.maxOpenFiles);
 
  // 存储块大小
  Serial.print("blockSize: "); 
  Serial.println(fs_info.blockSize);
 
  // 存储页大小
  Serial.print("pageSize: ");
  Serial.println(fs_info.pageSize);
}
 
void loop() {
}
```

以上程序第16行语句`FSInfo fs_info;`建立了FSInfo 对象，用于存储闪存状态信息。

以上程序第26行语句`SPIFFS.info(fs_info);`。通过info函数将闪存状态信息赋给fs_info。后续的程序中，通过一系列语句将闪存状态信息通过串口监视器输出。具体信息内容可参考程序注释部分。

以上是关于ESP8266闪存文件系统的常用功能介绍。关于ESP8266闪存文件系统的更多操作介绍，请参考Arduino ESP8266官方页面中的介绍部分。该页面可点击以下链接前往。

https://arduino-esp8266.readthedocs.io/en/latest/filesystem.html

# 二、[通过Arduino IDE向闪存文件系统上传文件](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/upload-files/)



## 1、下载 Arduino-ESP8266闪存文件插件程序

您有两种方法可以下载该插件程序。

**第一种**方法是通过[点击此链接进入 Arduino-ESP8266官方GitHub页面下载](https://github.com/esp8266/arduino-esp8266fs-plugin/releases)。详情请见以下截图：

![esp8266fs下载页面](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266fs-download.jpg)

由于GitHub网站服务器在国外，有些朋友登录该网站会有些困难。如果是这样的话，那么您也可以[点击此链接进入太极创客网站下载页面去下载该插件](http://www.taichi-maker.com/homepage/download/#esp8266fs)。

## 2、确定Arduino IDE项目文件夹位置

![Arduino-ide-首选项菜单项](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/Arduino-ide-preferences.jpg)

![Arduino-IDE-项目文件夹位置](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/Arduino-Project-Folder.jpg)

## 3、通过资源管理器打开Arduino IDE项目文件夹并建立tools文件夹

![在项目文件夹中建立名称为tools的文件夹](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266fs-tools-folder.jpg)

## 4、解压缩esp8266fs插件压缩包，并将解压缩后的文件内容粘贴到项目文件夹中

![esp8266fs解压缩](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266fs-unzip.jpg)

![解压缩后可找到esp8266fs文件夹](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266fs-unzipped.jpg)

![将esp8266fs文件夹粘贴到tools文件夹里](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266fs-paste.jpg)

## 5、重新启动Arduino IDE

## 检查“工具”菜单确认插件安装

![ESP8266 data upload 菜单项](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266-data-upload-menu.jpg)

## 6、根据上传的文件总大小来设置闪存大小

![设置esp8266闪存大小](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266-flash-size-settings.jpg)

##  7、将需要上传的文件保存在程序路径下的data文件夹中

![将需要上传到esp8266闪存文件系统的文件保存在data目录中](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266-flash-data-storage.jpg)

## 8、将需要上传的文件保存在程序路径下的data文件夹中

![通过ESP8266 Sketch Data Upload可以将data文件夹里的文件上传](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/esp8266-flash-data-upload.jpg)

假如您不确定具体文件如何存储，请点击以下链接下载示例程序压缩包。
[文件上传示例程序](http://www.taichi-maker.com/wp-content/uploads/2020/02/esp8266-data-upload.zip)

# 三、[使用闪存文件系统建立功能丰富的网络服务器](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/spiffs-web-server/)

掌握了如何向ESP8266开发板的闪存文件上传文件，我们就有了更多的空间来存储更加丰富的网页资源，从而让我们实现功能更加丰富的物联网项目。

本节教程里，我们将向您介绍一系列ESP8266开发板搭建的网页服务示例。通过这些示例，您可以通过物联网控制ESP8266开发板的引脚以及获取引脚状态。这些示例的功能相对单一，这是因为这些示例的目的是为您提供项目搭建的启发。在后续的教程中里，我们和为您提供一系列完整的物联网项目示例，供您学习参考。

- ## [在网页中加载闪存文件系统中的图片、CSS和JavaScript](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/spiffs-web-server/load-imagecsss-javascript/)

- ## [通过网页控制ESP8266开发板的引脚](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/spiffs-web-server/esp8266-pin-control/)

- ## [通过网页文本框控制ESP8266开发板的PWM引脚](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/spiffs-web-server/text-pwm-pin-control/)

- ## [(Ajax)控制LED引脚并将A0引脚读数实时显示于网页中](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/spiffs-web-server/a0-pin-control/)

- ## [(JavaScript)通过网页图形界面控制ESP8266的PWM引脚](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/spiffs-web-server/javascript-know-pwm-control/)

- ## [(JavaScript)使用指针表显示模拟输入引脚数值](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/spiffs-web-server/javascript-analog-input-gauge/)

- ## [通过网页将文件上传到ESP8266开发板闪存文件系统](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/spiffs/spiffs-web-server/file-upload-server/)



