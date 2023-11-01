---
title: 学物联网之ESP8266NodeMCU（四）
abbrlink: 84438cc6
date: 2022-08-31 15:28:02
tags:
  - esp8266
  - 物联网
keywords:
description: ESP8266-NodeMCU网络服务器
password:
abstract:
message:
cover: http://qiniu.hanvon.top/blog_cover/esp8266-nodemcu-web-server_covrer.png
copyright: false
---

# [建立基本网络服务器](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/esp8266-nodemcu-web-server/web-server/)

网络服务是一个很宽泛的概念，我们在这里即将给您介绍的是网络服务中的网页服务功能。所谓**网页服务**就是专门用于网页浏览的服务。这个操作我相信所有看到这篇教程的朋友们都使用过，因为您现在正阅读的这篇教程就是通过网页服务传输到您面前的。

为了能够应付来自全世界的朋友们大量访问，网站服务器是一台运算能力很强的计算机。假如这个网站只有您自己访问，那么ESP8266-NodeMCU就足够了。下面这个示例程序可以让ESP8266-NodeMCU实现最基本的网页服务功能。请先将这段示例程序复制并且上传NodeMCU。

```c
/**********************************************************************
项目名称/Project          : 零基础入门学用物联网
程序名称/Program name     : 3_2_1_First_Web_Server
团队/Team                : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)
程序目的/Purpose          : 使用NodeMCU建立基本服务器。用户可通过浏览器使用8266的IP地址
                           访问8266所建立的基本网页（Hello from ESP8266）
 
***********************************************************************/
#include <ESP8266WiFi.h>        // 本程序使用 ESP8266WiFi库
#include <ESP8266WiFiMulti.h>   //  ESP8266WiFiMulti库
#include <ESP8266WebServer.h>   //  ESP8266WebServer库
 
ESP8266WiFiMulti wifiMulti;     // 建立ESP8266WiFiMulti对象,对象名称是'wifiMulti'
 
ESP8266WebServer esp8266_server(80);// 建立ESP8266WebServer对象，对象名称为esp8266_server
                                    // 括号中的数字是网路服务器响应http请求的端口号
                                    // 网络服务器标准http端口号为80，因此这里使用80为端口号
 
void setup(void){
  Serial.begin(9600);          // 启动串口通讯
 
  //通过addAp函数存储  WiFi名称       WiFi密码
  wifiMulti.addAP("taichi-maker", "12345678");  // 这三条语句通过调用函数addAP来记录3个不同的WiFi网络信息。
  wifiMulti.addAP("taichi-maker2", "87654321"); // 这3个WiFi网络名称分别是taichi-maker, taichi-maker2, taichi-maker3。
  wifiMulti.addAP("taichi-maker3", "13572468"); // 这3个网络的密码分别是123456789，87654321，13572468。
                                                // 此处WiFi信息只是示例，请在使用时将需要连接的WiFi信息填入相应位置。
                                                // 另外这里只存储了3个WiFi信息，您可以存储更多的WiFi信息在此处。
 
  int i = 0;                                 
  while (wifiMulti.run() != WL_CONNECTED) {  // 此处的wifiMulti.run()是重点。通过wifiMulti.run()，NodeMCU将会在当前
    delay(1000);                             // 环境中搜索addAP函数所存储的WiFi。如果搜到多个存储的WiFi那么NodeMCU
    Serial.print(i++); Serial.print(' ');    // 将会连接信号最强的那一个WiFi信号。
  }                                          // 一旦连接WiFI成功，wifiMulti.run()将会返回“WL_CONNECTED”。这也是
                                             // 此处while循环判断是否跳出循环的条件。
 
  // WiFi连接成功后将通过串口监视器输出连接成功信息 
  Serial.println('\n');                     // WiFi连接成功后
  Serial.print("Connected to ");            // NodeMCU将通过串口监视器输出。
  Serial.println(WiFi.SSID());              // 连接的WiFI名称
  Serial.print("IP address:\t");            // 以及
  Serial.println(WiFi.localIP());           // NodeMCU的IP地址
  
//--------"启动网络服务功能"程序部分开始-------- //  此部分为程序为本示例程序重点1
  esp8266_server.begin();                   //  详细讲解请参见太极创客网站《零基础入门学用物联网》
  esp8266_server.on("/", handleRoot);       //  第3章-第2节 ESP8266-NodeMCU网络服务器-1
  esp8266_server.onNotFound(handleNotFound);        
//--------"启动网络服务功能"程序部分结束--------
  Serial.println("HTTP esp8266_server started");//  告知用户ESP8266网络服务功能已经启动
}
 
/* 以下函数语句为本示例程序重点3
详细讲解请参见太极创客网站《零基础入门学用物联网》
第3章-第2节 3_2_1_First_Web_Server 的说明讲解*/  
void loop(void){
  esp8266_server.handleClient();     // 处理http服务器访问
}
 
/* 以下两个函数为本示例程序重点2
详细讲解请参见太极创客网站《零基础入门学用物联网》
第3章-第2节 3_2_1_First_Web_Server 的说明讲解*/                                                                            
void handleRoot() {   //处理网站根目录“/”的访问请求 
  esp8266_server.send(200, "text/plain", "Hello from ESP8266");   // NodeMCU将调用此函数。 
}														//这个网站只有一个网页。且网页只有一行文字“Hello from ESP8266”。
 
// 设置处理404情况的函数'handleNotFound'
void handleNotFound(){                                        // 当浏览器请求的网络资源无法在服务器找到时，
  esp8266_server.send(404, "text/plain", "404: Not found");   // NodeMCU将调用此函数。
}
```

上传给NodeMCU，启动NodeMCU并且确保它已经成功连接WiFi, 打开浏览器，在地址栏中输入NodeMCU的IP地址并按下回车。

假如将在浏览器中看到“Hello from ESP8266”(如下所示），那么恭喜您已经成功的让NodeMCU实现了网络服务功能，因为您所看到的这条文字信息正是来自于NodeMCU。换句话说，NodeMCU为您建立了一个超级迷你的小网站。

首先讲解示例程序的第1个重点内容：**”启动网络服务功能“程序部分**

``` c
esp8266_server.begin();             
esp8266_server.on("/", handleRoot);      
esp8266_server.onNotFound(handleNotFound); 
```

程序第一句`esp8266_server.begin()`使用了ESP8266WebServer库中的`begin`函数。这个函数的作用是让ESP8266-NodeMCU来启动网络服务功能。该函数无需任何参数。

接下来的的语句`esp8266_server.on("/", handleRoot)`相对复杂一些。这条语句调用了ESP8266WebServer库中的`on`函数，该函数的作用是**指挥NodeMCU来如何处理浏览器的http请求**。我们看到`on`函数一共有两个参数，第一个参数是字符串”/”，第二个参数是一个函数的名称handleRoot。这个handleRoot函数的具体内容，我后面会给您做详细讲解。现在请您留意`on`函数有两个参数，一个是字符串”/”，另一个是函数名handleRoot。

下面我来给您仔细解释一下参数”/”的作用。我们知道一个网站有很多页面。为了加以区分，这些页面都有各自的名称。对于刚刚您在浏览器看到的“Hello from ESP8266”这个页面是NodeMCU服务器中的网站首页。这个网站首页的名称正是”/”。目前的ESP8266-NodeMCU服务器中只有一页，因此我们还无法了解如果想要调用其他页面该如何操作。不过请别担心，这个操作我们会在下一个示例程序中为您讲解。

好了，现在请将您的思绪拉回到我们的NodeMCU程序中来。接下来我们来看`on`函数的第二个参数。这个参数是`handleRoot`函数的名字。`handlRoot`函数的主要作用是告诉NodeMCU该如何生成和发送网站首页给浏览器。不过关于这个`handleRoot`函数的具体内容，我会在接下来的教程中给您做详细讲解。现在我们需要把关注点集中在`on`函数上。

最后我们再来完整的看一下这条语句`esp8266_server.on("/", handleRoot)`。它的作用就是告诉NodeMCU，当有浏览器请求网站首页时，请执行handlRoot函数来生成网站首页内容然后发送给浏览器。

讲到这里不知道您会不会感到好奇。我们只是在浏览器地址栏输入了NodeMCU的IP地址，然后就按下了回车。浏览器怎么会知道我们需要的是网站的首页呢。这是浏览器约定俗成的一种操作方法。当我们在地址栏只输入IP地址而没有任何附加地址信息，浏览器就会知道我们是要获取一个网站的首页信息。

结束了`on`函数的讲解，我们来继续往下看。下面一条语句`esp8266_server.onNotFound(handleNotFound)`使用了`onNotFound`函数。它的作用是**指挥NodeMCU在收到无法满足的http请求时应该如何处理**。目前Hello from ESP8266网站只有一个页面。假如有人想要浏览网站的其它页面，NodeMCU是无法满足这一请求的。这时候我们可以让NodeMCU答复一个“错误提示”页面给提出请求的浏览器。`onNotFound`函数就是用来告诉NodeMCU如果出现无法满足的http请求时该如何进行处理。`onNotFound`函数有一个参数，这个参数的内容是函数`handleNotFound`的名字。  



假设现在我们通过浏览器向NodeMCU服务器请求一个名叫“LED”的页面。由于NodeMCU的程序里没有“LED”页面信息，因此需要给浏览器答复一个“错误提示”页面。`onNotFound`的作用就是告诉NodeMCU在遇到这种无法满足的http请求时，应该执行`handleNotFound`函数来生成并发送“错误提示”页面给浏览器。

为了验证这一功能，我们来做一个实验。请在浏览器中输入NodMCU的IP地址然后加一个“/LED”再回车。比如下图所示，我的NodeMCU的IP地址是192.168.0.109，那么当我在浏览器栏中输入`192.168.0.109/LED`然后回车，就会看到浏览器显示出文字404: Not found。



这里我们所看到的这行文字“404: Not found”正是因为NodeMCU没有名叫“LED”的页面，因此它会使用handleNotFound函数生成并发送给浏览器这个“错误提示”页面。既然讲到这里了，那么我们就来仔细看一看handleNotFound函数的具体内容。  

```c
void handleNotFound(){                                
  esp8266_server.send(404, "text/plain", "404: Not found");  
}
```

handleNotFound函数只有一条语句： `esp8266_server.send(404, "text/plain", "404: Not found")`。这条语句调用了ESP8266WebServer库中的`send`函数。该函数的作用是生成并且发送http响应信息。也就是说，电脑浏览器所收到的网页信息都是通过`send`函数生成并且发送的。那么具体这个网页信息是如何生成的呢？这就要仔细看看`send`函数的几个参数内容了。  

首先我们来看第一个参数404。这个数字对于很多朋友来说都不会感到陌生，在[互联网基础-应用层](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/internet-basics/application-layer/#http-response)的http响应部分对它做过介绍。404是一个服务器状态码。它的含义是“客户端的请求有错误”。也就是说，浏览器在收到了状态码404后就知道，它所请求的页面在服务器上是不存在的。请留意，这个服务器状态码是专门给浏览器用的。我们是看不到它的。为了让我们也看到页面不存在的出错信息，`send`函数的最后一个参数使用了一个字符串”404: Not found”。这个字符串的内容才是真正显示在浏览器中供我们阅读的内容。你可以任意的改变这个字符串的内容。  

  

到这里我们来小结一下。浏览器能够看懂的信息是send函数的第一个参数,它的类型是整数型，它的内容是数字404。而显示在浏览器中的出错信息是一个字符串型的参数。它是send函数的最后一个参数。在我们的示例程序里，它的内容是“404: Not found”。

`send`函数还有一个字符串参数“text/plain”。它的作用是**说明http响应体的信息类型**。在这段示例中，我们用“text/plain”的原因是要告诉浏览器后面的”404: Not found”为一段纯文本信息。这里当然也可以使用其它类型的信息。不过这一知识我们后续教程中会给您介绍。

为了让您更好的理解刚刚给您解释的内容，我来对这句`esp8266_server.send(404, "text/plain", "404: Not found")`做一下总结。

send函数一共有3个参数。第一个参数404是服务器状态码。第二个参数“text/plain”是说明http响应体信息类型。第三个参数“404: Not found”则是响应体的具体信息了。

细心的读者可能已经发现了。我在上面这段总结文字中指明了响应体这一概念。http响应是分为两部分的。第一部分是响应头，在我们这个示例中，响应头的内容就是404 text/plain。而响应体的内容则是404: Not found。

结束了handleNotFound的讲解我们最后再来看看示例程序中另一个用于生成和发送首页信息的函数：`handleRoot`。

```c
void handleRoot() {                         
    esp8266_server.send(200, "text/plain", "Hello from ESP8266");
}
```

这段示例程序与刚刚我们见到的handleNotFound函数非常相似。都是使用`send`函数生成并且发送http响应信息。

`send`函数的第一个参数200，它同样是一个服务器状态码，含义是“成功接收请求，并已完成整个处理过程”。 第二个参数text/plain的作用我刚刚给您讲过，不再赘述了。最后一个参数”Hello from ESP8266″正是我们在浏览器中看到的首页文字内容。

最后我们来看一下这段示例程序的第3个重点内容，也就是loop函数中唯一的一条语句`esp8266_server.handleClient()`。这句程序调用了`handleClient`函数。它的主要作用之一是检查有没有设备通过网络向NodeMCU发送请求。`函数handleClient`每次被调用时，NodeMCU都会检查一下是否有人发送http请求。因此我们需要把它放在loop函数中，从而确保它能经常被调用。假如我们的loop函数里有类似delay一类的函数延迟程序运行，那么这时候就一定要注意了。如果`handleClient`函数长时间得不到调用，NodeMCU的网络服务会变得很不稳定。因此在使用NodeMCU执行网络服务功能的时候，一定要确保`handleClient`函数经常得以调用。我在这里反复强调这一点是因为这一点非常关键，请务必注意！

这一节的程序内容到这里就讲解完毕了，下一节教程我将为您讲解如何建立可以控制NodeMCU开发板的网页。



# [通过网络服务实现NodeMCU开发板基本控制](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/esp8266-nodemcu-web-server/pin-control/)

利用NodeMCU建立网络服务

用户通过浏览器可以访问NodeMCU所建立的网页

通过该网页，用户可实现对NodeMCU的控制。

以下是示例代码：

```c
/**********************************************************************
项目名称/Project          : 零基础入门学用物联网
程序名称/Program name     : 3_2_2_Turning_on_and_off_an_LED
团队/Team                : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)
程序目的/Purpose          : 使用NodeMCU建立基本服务器。用户可通过浏览器使用8266的IP地址
                           访问8266所建立的基本网页并通过该页面点亮/熄灭NodeMCU的内置LED

***********************************************************************/
#include <ESP8266WiFi.h>        // 本程序使用 ESP8266WiFi库
#include <ESP8266WiFiMulti.h>   //  ESP8266WiFiMulti库
#include <ESP8266WebServer.h>   //  ESP8266WebServer库
 
ESP8266WiFiMulti wifiMulti;     // 建立ESP8266WiFiMulti对象,对象名称是 'wifiMulti'
 
ESP8266WebServer esp8266_server(80);// 建立网络服务器对象，该对象用于响应HTTP请求。监听端口（80）
 
void setup(void){
  Serial.begin(9600);   // 启动串口通讯
 
  pinMode(LED_BUILTIN, OUTPUT); //设置内置LED引脚为输出模式以便控制LED
  
  wifiMulti.addAP("ssid_from_AP_1", "your_password_for_AP_1"); // 将需要连接的一系列WiFi ID和密码输入这里
  wifiMulti.addAP("ssid_from_AP_2", "your_password_for_AP_2"); // ESP8266-NodeMCU再启动后会扫描当前网络
  wifiMulti.addAP("ssid_from_AP_3", "your_password_for_AP_3"); // 环境查找是否有这里列出的WiFi ID。如果有
  Serial.println("Connecting ...");                            // 则尝试使用此处存储的密码进行连接。
  
  int i = 0;                                 
  while (wifiMulti.run() != WL_CONNECTED) {  // 此处的wifiMulti.run()是重点。通过wifiMulti.run()，NodeMCU将会在当前
    delay(1000);                             // 环境中搜索addAP函数所存储的WiFi。如果搜到多个存储的WiFi那么NodeMCU
    Serial.print(i++); Serial.print(' ');    // 将会连接信号最强的那一个WiFi信号。
  }                                          // 一旦连接WiFI成功，wifiMulti.run()将会返回“WL_CONNECTED”。这也是
                                             // 此处while循环判断是否跳出循环的条件。
  
  // WiFi连接成功后将通过串口监视器输出连接成功信息 
  Serial.println('\n');
  Serial.print("Connected to ");
  Serial.println(WiFi.SSID());              // 通过串口监视器输出连接的WiFi名称
  Serial.print("IP address:\t");
  Serial.println(WiFi.localIP());           // 通过串口监视器输出ESP8266-NodeMCU的IP
 
  esp8266_server.begin();                           // 启动网站服务
  esp8266_server.on("/", HTTP_GET, handleRoot);     // 设置服务器根目录即'/'的函数'handleRoot'
  esp8266_server.on("/LED", HTTP_POST, handleLED);  // 设置处理LED控制请求的函数'handleLED'
  esp8266_server.onNotFound(handleNotFound);        // 设置处理404情况的函数'handleNotFound'
 
  Serial.println("HTTP esp8266_server started");//  告知用户ESP8266网络服务功能已经启动
}
 
void loop(void){
  esp8266_server.handleClient();                     // 检查http服务器访问
}
 
/*设置服务器根目录即'/'的函数'handleRoot'
  该函数的作用是每当有客户端访问NodeMCU服务器根目录时，
  NodeMCU都会向访问设备发送 HTTP 状态 200 (Ok) 这是send函数的第一个参数。
  同时NodeMCU还会向浏览器发送HTML代码，以下示例中send函数中第三个参数，
  也就是双引号中的内容就是NodeMCU发送的HTML代码。该代码可在网页中产生LED控制按钮。 
  当用户按下按钮时，浏览器将会向NodeMCU的/LED页面发送HTTP请求，请求方式为POST。
  NodeMCU接收到此请求后将会执行handleLED函数内容*/
void handleRoot() {       
  esp8266_server.send(200, "text/html", "<form action=\"/LED\" method=\"POST\"><input type=\"submit\" value=\"Toggle LED\"></form>");
}
 
//处理LED控制请求的函数'handleLED'
void handleLED() {                          
  digitalWrite(LED_BUILTIN,!digitalRead(LED_BUILTIN));// 改变LED的点亮或者熄灭状态
  esp8266_server.sendHeader("Location","/");          // 跳转回页面根目录
  esp8266_server.send(303);                           // 发送Http相应代码303 跳转  
}
 
// 设置处理404情况的函数'handleNotFound'
void handleNotFound(){
  esp8266_server.send(404, "text/plain", "404: Not found"); // 发送 HTTP 状态 404 (未找到页面) 并向浏览器发送文字 "404: Not found"
}
```



# [通过网络服务将开发板引脚状态显示在网页中](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/iot-c/esp8266-nodemcu-web-server/pin-state/)

为了便于学习，我们将使用D3引脚作为演示, 因为它已经与开发板上的FLASH按键开关连接好了。*我们可以通过NodeMCU开发板上的FLASH按键控制D3引脚的电平。*

![NodeMCU开发板FLASH按键开关](https://raw.githubusercontent.com/wild-civil/typora_img/main/backgrounds/esp8266-nodemcu-Flash-Button-1.jpg)



```c
/**********************************************************************
项目名称/Project          : 零基础入门学用物联网
程序名称/Program name     : 3_2_3_Pin_State_Display
团队/Team                : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)

程序目的/Purpose          : 使用NodeMCU建立基本服务器。该页面将会自动刷新并且显示NodeMCU
                           的D3引脚状态。NodeMCU开发板上的FLASH按键可以控制D3引脚的电平。
                           没有按下该按键时D3引脚将会保持高电平状态。当按下该按键后，
                           D3引脚会变为低电平。

***********************************************************************/
 
#include <ESP8266WiFi.h>        // 本程序使用 ESP8266WiFi库
#include <ESP8266WiFiMulti.h>   //  ESP8266WiFiMulti库
#include <ESP8266WebServer.h>   //  ESP8266WebServer库
 
#define buttonPin D3            // 按钮引脚D3
 
ESP8266WiFiMulti wifiMulti;     // 建立ESP8266WiFiMulti对象,对象名称是'wifiMulti'
 
ESP8266WebServer esp8266_server(80);// 建立网络服务器对象，该对象用于响应HTTP请求。监听端口（80）
 
bool pinState;  // 存储引脚状态用变量
 
void setup(){
  Serial.begin(9600);   // 启动串口通讯
 
  pinMode(buttonPin, INPUT_PULLUP); // 将按键引脚设置为输入上拉模式
 
  wifiMulti.addAP("ssid_from_AP_1", "your_password_for_AP_1"); // 将需要连接的一系列WiFi ID和密码输入这里
  wifiMulti.addAP("ssid_from_AP_2", "your_password_for_AP_2"); // ESP8266-NodeMCU再启动后会扫描当前网络
  wifiMulti.addAP("ssid_from_AP_3", "your_password_for_AP_3"); // 环境查找是否有这里列出的WiFi ID。如果有
  Serial.println("Connecting ...");                            // 则尝试使用此处存储的密码进行连接。
  
  int i = 0;                                 
  while (wifiMulti.run() != WL_CONNECTED) {  // 此处的wifiMulti.run()是重点。通过wifiMulti.run()，NodeMCU将会在当前
    delay(1000);                             // 环境中搜索addAP函数所存储的WiFi。如果搜到多个存储的WiFi那么NodeMCU
    Serial.print(i++); Serial.print(' ');    // 将会连接信号最强的那一个WiFi信号。
  }                                          // 一旦连接WiFI成功，wifiMulti.run()将会返回“WL_CONNECTED”。这也是
                                             // 此处while循环判断是否跳出循环的条件。
  // WiFi连接成功后将通过串口监视器输出连接成功信息 
  Serial.println('\n');                     // WiFi连接成功后
  Serial.print("Connected to ");            // NodeMCU将通过串口监视器输出。
  Serial.println(WiFi.SSID());              // 连接的WiFI名称
  Serial.print("IP address:\t");            // 以及
  Serial.println(WiFi.localIP());           // NodeMCU的IP地址
  
  esp8266_server.begin();                   // 启动网站服务                
  esp8266_server.on("/", handleRoot);       // 设置服务器根目录即'/'的函数'handleRoot'
  esp8266_server.onNotFound(handleNotFound);// 设置处理404情况的函数'handleNotFound'        
 
  Serial.println("HTTP esp8266_server started");//  告知用户ESP8266网络服务功能已经启动
}
 
void loop(){
  esp8266_server.handleClient();     // 处理http服务器访问
  pinState = digitalRead(buttonPin); // 获取引脚状态
}
 
//--------------------------------------------------------------------------------
/* 以下函数处理网站首页的访问请求。此函数为本示例程序重点1
详细讲解请参见太极创客网站《零基础入门学用物联网》
第3章-第2节“通过网络服务将开发板引脚状态显示在网页中”的说明讲解。*/                                                                       
void handleRoot() {   
  String displayPinState;                   // 存储按键状态的字符串变量
  
  if(pinState == HIGH){                     // 当按键引脚D3为高电平
    displayPinState = "Button State: HIGH"; // 字符串赋值高电平信息
  } else {                                  // 当按键引脚D3为低电平
    displayPinState = "Button State: LOW";  // 字符串赋值低电平信息
  }
  
  esp8266_server.send(200, "text/plain", displayPinState); 
                                            // 向浏览器发送按键状态信息  
}
//--------------------------------------------------------------------------------
 
// 设置处理404情况的函数'handleNotFound'
void handleNotFound(){                                        // 当浏览器请求的网络资源无法在服务器找到时，
  esp8266_server.send(404, "text/plain", "404: Not found");   // NodeMCU将调用此函数。
}
```



在以上程序的loop函数中，`pinState = digitalRead(buttonPin);` 语句将不断检查NodeMCU开发板D3引脚状态，也就是检查该引脚所连接的按键是否被按下。该状态将会存储与布尔变量pinState中。

变量pinState将会用于本程序的重点1，也就是handleRoot() 函数里。在handleRoot函数里，我们利用逻辑判断语句来对displayPinState 进行赋值。**如果按键没有被按下**，pinState为HIGH，这时候程序将会执行`displayPinState = "Button State: HIGH";`也就是为displayPinState的赋值为“Button State: HIGH”。这句话的意思是“按键引脚状态为高电平”。反之，当我们按下按键后，程序将会执行`displayPinState = "Button State: LOW";`也就是为displayPinState的赋值为“Button State: LOW”。

在handleRoot函数的结尾处，
`esp8266_server.send(200, "text/plain", displayPinState);`
这条语句将会把displayPinState所存储的信息发送给浏览器。于是我们在没有按下按键时，将会得到以下页面信息。

# **暂时没放图**

以上示例中，我们需要刷新网页页面才能将按键的最新状态显示在网页中。为了实现页面的自动刷新，请您参考以下示例程序。

```c
/**********************************************************************
项目名称/Project          : 零基础入门学用物联网
程序名称/Program name     : 3_2_4_Pin_State_Display_Auto_Refresh
团队/Team                : 太极创客团队 / Taichi-Maker (www.taichi-maker.com)

程序目的/Purpose          : 使用NodeMCU建立基本服务器。该网页将显示引脚D3状态。同时状态会
                           每隔5秒钟更新一次。

***********************************************************************/
 
#include <ESP8266WiFi.h>        // 本程序使用 ESP8266WiFi库
#include <ESP8266WiFiMulti.h>   //  ESP8266WiFiMulti库
#include <ESP8266WebServer.h>   //  ESP8266WebServer库
 
#define buttonPin D3            // 按钮引脚D3
 
ESP8266WiFiMulti wifiMulti;     // 建立ESP8266WiFiMulti对象,对象名称是'wifiMulti'
 
ESP8266WebServer esp8266_server(80);// 建立网络服务器对象，该对象用于响应HTTP请求。监听端口（80）
 
bool pinState;                      // 存储引脚状态用变量
 
void setup(){
  Serial.begin(9600);          // 启动串口通讯
  delay(10);
  Serial.println("");
 
  pinMode(buttonPin, INPUT_PULLUP); // 将按键引脚设置为输入上拉模式
 
  wifiMulti.addAP("ssid_from_AP_1", "your_password_for_AP_1"); // 将需要连接的一系列WiFi ID和密码输入这里
  wifiMulti.addAP("ssid_from_AP_2", "your_password_for_AP_2"); // ESP8266-NodeMCU在启动后会扫描当前网络
  wifiMulti.addAP("ssid_from_AP_3", "your_password_for_AP_3"); // 环境查找是否有这里列出的WiFi ID。如果有
  Serial.println("Connecting ...");                            // 则尝试使用此处存储的密码进行连接。
                                                               // 另外这里只存储了3个WiFi信息，您可以存储更多
                                                               // 的WiFi信息在此处。
  int i = 0;                                 
  while (wifiMulti.run() != WL_CONNECTED) {  // 此处的wifiMulti.run()是重点。通过wifiMulti.run()，NodeMCU将会在当前
    delay(1000);                             // 环境中搜索addAP函数所存储的WiFi。如果搜到多个存储的WiFi那么NodeMCU
    Serial.print(i++); Serial.print(' ');    // 将会连接信号最强的那一个WiFi信号。
  }                                          // 一旦连接WiFI成功，wifiMulti.run()将会返回“WL_CONNECTED”。这也是
                                             // 此处while循环判断是否跳出循环的条件。
  // WiFi连接成功后将通过串口监视器输出连接成功信息 
  Serial.println('\n');                     // WiFi连接成功后
  Serial.print("Connected to ");            // NodeMCU将通过串口监视器输出。
  Serial.println(WiFi.SSID());              // 连接的WiFI名称
  Serial.print("IP address:\t");            // 以及
  Serial.println(WiFi.localIP());           // NodeMCU的IP地址
  
  esp8266_server.begin();                  
  esp8266_server.on("/", handleRoot);      
  esp8266_server.onNotFound(handleNotFound);        
 
  Serial.println("HTTP esp8266_server started");//  告知用户ESP8266网络服务功能已经启动
}
 
void loop(){
  esp8266_server.handleClient();     // 处理http服务器访问
  pinState = digitalRead(buttonPin); // 获取引脚状态
}                                                                   
 
/* 以下函数处理网站首页的访问请求。此函数为本示例程序重点1
详细讲解请参见太极创客网站《零基础入门学用物联网》
第3章-第2节“通过网络服务将开发板引脚状态显示在网页中”的说明讲解。*/    
void handleRoot() {   //处理网站目录“/”的访问请求 
  esp8266_server.send(200, "text/html", sendHTML(pinState));  
}
 
//--------------------------------------------------------------------------------
/*
建立用于发送给客户端浏览器的HTML代码。此代码将会每隔5秒刷新页面。
通过页面刷新，引脚的最新状态也会显示于页面中
*/
String sendHTML(bool buttonState){
  
  String htmlCode = "<!DOCTYPE html> <html>\n";
  htmlCode +="<head><meta http-equiv='refresh' content='5'/>\n";
  htmlCode +="<title>ESP8266 Butoon State</title>\n";
  htmlCode +="<style>html { font-family: Helvetica; display: inline-block; margin: 0px auto; text-align: center;}\n";
  htmlCode +="body{margin-top: 50px;} h1 {color: #444444;margin: 50px auto 30px;} h3 {color: #444444;margin-bottom: 50px;}\n";
  htmlCode +="</style>\n";
  htmlCode +="</head>\n";
  htmlCode +="<body>\n";
  htmlCode +="<h1>ESP8266 BUTTON STATE</h1>\n";
  
  if(buttonState)
    {htmlCode +="<p>Button Status: HIGH</p>\n";}
  else
    {htmlCode +="<p>Button Status: LOW</p>\n";}
    
  htmlCode +="</body>\n";
  htmlCode +="</html>\n";
  
  return htmlCode;
}
//--------------------------------------------------------------------------------
 
// 设置处理404情况的函数'handleNotFound'
void handleNotFound(){                                        // 当浏览器请求的网络资源无法在服务器找到时，
  esp8266_server.send(404, "text/plain", "404: Not found");   // NodeMCU将调用此函数。
}
```

在以上示例程序中的`handleRoot`函数中，`esp8266_server.send(200, "text/html", sendHTML(pinState))`语句的的3个参数 `sendHTML(pinState)`调用了`sendHTML`函数。该函数的作用是建立一个可以定时刷新的HTML网页代码。通过定时刷新网页，开发板的引脚状态将会不断地在页面中进行更新。

此HTML网页代码是由`sendHTML`函数产生的。该函数建立了一个字符串变量，该字符串变量所存储的信息正是网页HTML代码。值得注意的是，该HTML代码会不断地检查变量pinState状态，并且根据pinState的状态改变HTML代码的信息，从而实现在网页上显示引脚状态。

此HTML代码中真正实现定时刷新网页功能的语句是代码中的第79行语句。这条语句是告诉网页需要定时刷新，刷新频率5秒钟，即每5秒钟刷新一次页面。您可以通过改变此行语句中的数值5来调整页面刷新频率。

每一次页面刷新，浏览器都会向NodeMCU发送HTTP请求。NodeMCU在收到浏览器请求后，将会把最新的HTML代码信息返回给浏览器。浏览器收到最新的HTML代码后将会在页面中显示引脚的状态。
以下是没有按下按键时的页面显示信息。

# **暂时没放图**
