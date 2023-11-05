fetch('https://api.gmit.vip/Api/UserInfo').then(data=>data.json()).then(data=>{
    let html = '<style>.visitor_location{color:#cb4c46;font-weight:bold;}.visitor_ip{color:#2d80c2;font-weight:bold;}</style>'
    html += '<div class="visitor">'
    html += '欢迎来自 ' + '<span class="visitor_location">' + data.data.location + '</span>' + ' 的小伙伴！'
    html += '</br>'
    html += '访问IP：' + '<span class="visitor_ip">' + data.data.ip + '</span>'
    html += '</div>'
    document.getElementById('visitor-container').innerHTML = html
}).catch(function(error) {
    console.log(error);
});


// 来源: https://cnhuazhu.top/butterfly/2023/02/01/Hexo%E9%AD%94%E6%94%B9/Hexo%E6%B7%BB%E5%8A%A0%E5%BD%93%E5%89%8D%E8%AE%BF%E5%AE%A2%E4%BF%A1%E6%81%AF/
