---
title: 学物联网之ESP8266NodeMCU（二）
abbrlink: 4e66da29
date: 2022-08-31 11:28:49
tags:
  - esp8266
  - 物联网
keywords: 互联网知识基础
description: 互联网知识基础
password:
abstract:
message:
cover: http://qiniu.hanvon.top/blog_cover/taichi-maker-internet-icon_cover.png
copyright: false
---

# [TCP/IP协议簇（TCP/IP Stack）](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/internet-basics/tcp-ip-stack/)

在网络系统中，为了保证通信设备之间能正确地进行通信，必须使用一种双方都能够理解的语言，这种语言被称为“协议”。

TCP/IP协议簇是Internet的基础，也是当今最流行的组网形式。TCP/IP是一组协议的代名词。

TCP/IP协议被划分为4层，分别是：

| 分层名称                 | 包含协议                          |
| ------------------------ | --------------------------------- |
| 应用层                   | HTTP, FTP, mDNS, WebSocket, OSC … |
| 传输层                   | TCP, UDP                          |
| 网络层                   | IP                                |
| 链路层（也称网络接口层） | Ethernet, Wi-Fi …                 |

# [链路层（Link Layer）](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/internet-basics/link-layer/)

链路层的主要作用是实现设备之间的物理链接。举例来说，我们日常使用的WiFi就是链路层的一种。

## ESP8266利用WiFi联网时有三种工作模式。

**模式1 – 无线终端模式（Wireless Station）**

如下图所示，ESP8266可通过WiFi连接无线路由器。这与用您的手机通过WiFi连接无线路由器的模式相同。

![ESP8266-NodeMCU无线终端(Wireless Station)工作模式](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/NodeMCU-Station.png)

**模式2 – 接入点模式（Access Point, 也称 AP）**

ESP8266也可以建立WiFi网络供其它设备连接。当ESP8266以此模式运行时，我们可以使用手机搜索ESP8266所发出的WiFi网络并进行连接。

![ESP8266-NodeMCU接入点(Access Point)工作模式](https://raw.githubusercontent.com/wild-civil/typora_img/main/images/NodeMCU-Access-Point.png)

**模式3 – 混合模式（Wireless Station + AP）**

混合模式即以上两种模式的混合。

# [网络层（Internet Layer）](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/internet-basics/internet-layer/)

##### 网络层与IP协议

尽管设备可以通过链路层联网，但是光有链路层还无法实现设备之间的数据通讯。因为网络设备没有明确的标识。网络设备无从知晓要向谁传输数据，也无法确定从何处获取数据。

网络层主要作用是通过IP协议为联网设备提供IP地址。

有了IP地址还不够，因为要确保网络中所有设备IP地址不重复，还需要DHCP (Dynamic Host Configuration Protocol) 服务器来实现这一功能。

当网络中所有设备都有了独立的IP地址后，设备之间就可以收发数据了。

# [传输层（Transportation Layer）](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/internet-basics/transportation-layer/)

网络设备通讯时，数据丢失和数据受损的情况经常出现。传输层的
TCP（Transmission Control Protocol）和UDP（User Datagram Protocol）协议可以用来解决这一问题。通常我们会选择这两种协议中的一种来保证数据传输的准确性。具体选择哪一种协议要看我们使用的是何种网络应用。因为不同的网络应用对于数据的传输要求是不同的。

TCP协议可以更好的保证数据传输的准确性，但是传输速度比UDP协议而言要慢一些。TCP协议的特点是可以保证所有数据都能被接收端接收，数据的传输顺序也不会被打乱，而且如有数据损坏则重发受损数据。基于以上功能特点，TCP通常用于电子邮件及文件上传等。

UDP协议并不能保证所有数据都被接收端所接受。一旦出现数据受损的情况，UDP协议将会抛弃受损的数据。这些数据一旦被抛弃将会永久性的消失，发送端不会因为数据受损而重新发送。因此UDP协议远不如TCP协议可靠。

但是既然是这样，为何还有人会选择UDP协议呢？这是因为UDP比TCP速度快。因此UDP协议通常用于网络游戏以及语音聊天或视频聊天应用。

# [应用层（Application Layer）](http://www.taichi-maker.com/homepage/esp8266-nodemcu-iot/internet-basics/application-layer/)

传输层可以实现设备间的数据传输。但发送端和接收端还需要一种协议来理解这些传输信息的含义。这就引出了即将给您介绍的应用层。

#### **HTTP协议**

应用层中有很多种协议，最常见是HTTP协议。它常被用来传输网页数据。我们这篇教程也将着重介绍HTTP协议。

HTTP协议由**请求**和**响应**构成。也就是说，HTTP的工作模式很像是一问一答。

#### **HTTP请求**

举例来说，当您在浏览器输入www.taichi-maker.com这一网址并按下回车，这时候浏览器会把这一操作转换成一个HTTP请求。

这个HTTP请求主要分为两大部分。一部分是请求头（Request Header）一部分是请求体（Request Body）。对于我们学习物联网知识来说，请求头是我们重点要关注的内容。而请求体的知识已经超越这篇教程的范围，抱歉我就不在这里详述了。

请看以下是简化后的请求头内容：

```http
GET / HTTP/1.1
Host: www.taichi-maker.com
```

在以上的HTTP请求中:

“GET” 是一个**读取**请求。也就是请求网站服务器把网页数据发送过来。

“/” 的作用就是要告诉网站服务器，我这个读取请求的内容是网站根目录下的内容。换句话说，就是请求服务器把网站首页的网页数据发过来。

“HTTP/1.1” 是指请求所采用的HTTP协议版本是1.1。

“Host: www.taichi-maker.com”表示请求的域名是 www.taichi-maker.com 也就是太极创客网站的域名。

以上是HTTP协议的 GET 请求中最关键的内容。在 HTTP 协议中，GET只是诸多请求方法中的一种。以下是HTTP协议中的其它请求方法：

**HTTP1.0定义了三种请求方法： GET, POST 和 HEAD方法。**
**HTTP1.1新增了五种请求方法：OPTIONS, PUT, DELETE, TRACE 和 CONNECT 方法。**

关于请求方法，我们这里主要介绍的只有GET。其它的请求方法已经超越了我们这个教程的范围，就不在这里继续深入讲下去了。感兴趣的话，您可以通过互联网找到这方面的教程资源。

#### **HTTP响应**

接下来我们再看一看浏览器发送以上HTTP请求后，接收到的服务器HTTP响应。HTTP响应内容也是分为两个部分，一部分是响应头（Response Header）一部分是响应体（Response Body）。其中响应体部分是可选项，也就是说有些HTTP响应只有响应头，而响应体是空的。

我们先来给大家介绍响应头部分。

由于响应头信息量比较大，我们还是选出主要内容给大家讲解。如下所示：

```http
HTTP/1.1 200 OK
Content-Type: text/html; charset=UTF-8
```

“HTTP/1.1”这个信息我们刚刚在HTTP请求部分中介绍过。它的含义就是此HTTP响应所采用的协议版本是1.1。

“200”这个代码可能有些朋友会感觉陌生。但是如果我说起“404”这个数字可能大家会感到更熟悉吧？无论是200也好还是404也好，这些都是HTTP响应状态码。它的作用是以代码的形式表达服务器在接到请求后的状态。“200”代表服务器成功找到了请求的网页资源（这一点大家在后面的OK中也已经体现出来了）。 “404”代表服务器无法找到请求的网页资源。：

以下是常见的服务器状态码：

100~199：成功接收请求，要求客户端继续提交下一次请求才能完成整个处理过程。

200~299：成功接收请求并已完成整个处理过程。常用200

300~399：完成请求，客户需进一步细化请求。

400~499：客户端的请求有错误，常用404和403(403的含义是权限不够，服务器拒绝访问。)

500~599：服务器端出现错误，常用500

**“Content-Type”** 指示响应体的内容是什么类型。这里的响应体内容类型是**“text/htm”**，即网页HTML代码。通过这一行响应头信息，我们的浏览器将会知道，在这一个响应中的响应体部分都是HTML网页代码。于是浏览器将会做好准备，将网页代码翻译成我们人类容易读懂的格式并且呈现在浏览器中。**charset=UTF-8**是字符集。

我们再举一个例子，假设某一个响应头中“Content-Type” 类型是”image/jpeg”。这就意味着该响应体中的信息是一个jpeg格式的图片，那么浏览器也就会按照jpeg的解码方式将图片呈现在我们的面前。

在以上示例中，我们使用互联网浏览器来讲解HTTP的请求和响应。当我们使用NodeMCU来开发物联网项目时，发出HTTP请求的就不再是浏览器而是NodeMCU开发板了。而读取这些响应请求的也将是NodeMCU开发板。那么，究竟如何让NodeMCU发出HTTP请求，而NodeMCU又是如何解读HTTP响应呢？这些都依赖于我们为NodeMCU开发的控制程序。这些内容会在后续的教程里给大家详细介绍。

#### **DNS（Domain Name System/域名系统）**

在之前的教程中，我曾经给大家讲过网络中的所有设备都具有独立的IP地址。这一点对于网站服务器来说也不例外。当我们使用浏览器访问某一个网站时，实际上我们是通过浏览器向网站服务器发送HTTP请求。然而网站服务器的IP地址很难记忆，比如太极创客网站的域名由两个单词组成，taichi是太极，maker是创客。这很好记，但是要想记住太极创客服务器的IP就没那么容易了。因为那是4个毫无规律的数字。

为了解决IP地址不好记这一问题，DNS被派上了用场。

我们可以把DNS看作是一个巨型电话本。电话本中的联系人一栏就是网站的域名，而电话本中的电话号码一栏则是这些网站的IP地址。有了DNS我们就可以使用简单易记的域名来访问网站了。

还是用太极创客网站来举例吧，每当我们在浏览器中输入域名[www.taichi-maker.com](www.taichi-maker.com)并按下回车后，这时浏览器首先会向DNS服务器发送请求，请求的内容大致如下：“亲爱的DNS服务器，我那个明明可以靠脸吃饭却偏偏要学物联网的主人想访问一个域名是[www.taichi-maker.com](www.taichi-maker.com)的网站。麻烦您把这个域名的网站服务器IP地址告诉我好吗？” DNS服务器在接收到这一请求后，会做出以下应答：“亲爱的浏览器，您要的网站服务器ip地址是 12 . 34 . 56 . 78。” 浏览器在接收到这一IP地址后，就开始向这个IP地址所对应的网站服务器正式发出HTTP GET请求了。
