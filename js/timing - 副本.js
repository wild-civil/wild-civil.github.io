
document.addEventListener('DOMContentLoaded', function () {
    let staySpan = document.getElementById("stayTiming");
    let activeSpan = document.getElementById("activeTiming");
    let warningSpan = document.getElementById("warning");

    if (!staySpan || !activeSpan || !warningSpan) {
        console.error("计时元素未找到，请检查HTML结构");
        return;
    }

    // 重启计时器
    startInactivityTimer();
    startActiveTimer();

    let localhostTime = new Date(); // 页面打开时间
    let activeStartTime = new Date(); // 活跃时间计时开始时间
    let pausedTime = 0; // 用于记录不活动阶段的活跃计时停止时间
    let inactivityTimer = null; // 不活动检测的定时器
    let activeTimer = null; // 活跃时间的计时器

    // 辅助函数，用于补零
    function tow(n) {
        return n >= 0 && n < 10 ? '0' + n : '' + n;
    }

    // 页面停留时间的计时器
    setInterval(function () {
        let goTime = new Date();
        let diffTime = goTime.getTime() - localhostTime.getTime();

        let hour = Math.floor(diffTime / 3600000);
        let minute = Math.floor((diffTime % 3600000) / 60000);
        let second = Math.floor((diffTime % 60000) / 1000);

        let str = tow(hour) + '<span class="time">小时</span> ' +
                  tow(minute) + '<span class="time">分钟</span> ' +
                  tow(second) + '<span class="time">秒</span>';

        staySpan.innerHTML = "您已打开网页 " + str;
    }, 1000);

    // 活跃时间的计时器
    function startActiveTimer() {
        if (activeTimer) {
            clearInterval(activeTimer); // 防止重复计时器
        }
        activeStartTime = new Date(); // 重置活跃时间起点
        activeTimer = setInterval(function () {
            let currentTime = new Date();
            let diffTime = currentTime.getTime() - activeStartTime.getTime() + pausedTime;

            let hour = Math.floor(diffTime / 3600000);
            let minute = Math.floor((diffTime % 3600000) / 60000);
            let second = Math.floor((diffTime % 60000) / 1000);

            let str = tow(hour) + '<span class="time">小时</span> ' +
                      tow(minute) + '<span class="time">分钟</span> ' +
                      tow(second) + '<span class="time">秒</span>';

            activeSpan.innerHTML = "您已浏览网页 " + str;
        }, 1000);
    }

    // 停止活跃时间计时器
    function stopActiveTimer() {
        if (activeTimer) {
            clearInterval(activeTimer);
            activeTimer = null; // 停止活跃计时器
        }
    }

    // 启动不活动计时器的方法
    function startInactivityTimer() {
        if (inactivityTimer) {
            clearTimeout(inactivityTimer);
        }
        inactivityTimer = setTimeout(() => {
            if (warningSpan) {
                warningSpan.innerHTML = "<font color='red'>您已超过十分钟未做出任何响应！</font>";
            }
            // 停止活跃时间计时器，并记录当前的活跃时间
            pausedTime += new Date().getTime() - activeStartTime.getTime();
            stopActiveTimer(); // 停止活跃时间计时
        }, 10*60*1000); // 设置为10分钟，超过这个时间 consider as 不活动
    }

    // 用户活动时重置不活动计时器并清除警告
    function resetInactivityTimer() {
        if (warningSpan) {
            warningSpan.innerHTML = ""; // 清除不活动警告
        }
        startInactivityTimer(); // 重新启动不活动计时器

        // 如果活跃计时器已经停止，则重新启动活跃计时器
        if (!activeTimer) {
            startActiveTimer();
        }
    }

    // 页面加载时启动不活动检测计时器
    startInactivityTimer();
    startActiveTimer(); // 页面初次加载时启动活跃时间计时器

    // 监听用户活动事件
    window.addEventListener('mousemove', resetInactivityTimer);
    window.addEventListener('keydown', resetInactivityTimer);
    window.addEventListener('click', resetInactivityTimer);
    window.addEventListener('scroll', resetInactivityTimer);

    // // PJAX事件监听器 启用pjax时需要complete
    // document.addEventListener('pjax:end', function () {
    //     // 重启计时器
    //     startInactivityTimer();
    //     startActiveTimer();
    // });



    // 通用PJAX事件监听
    document.addEventListener('pjax:complete', resetTimers); 

    function resetTimers() {
    clearTimeout(inactivityTimer);
    clearInterval(activeTimer);
    pausedTime = 0;
    startInactivityTimer();
    startActiveTimer();
    }

    // 确保PJAX已初始化（示例使用jquery-pjax）
    $(document).pjax('a', '#main', { fragment: '#main' });



    console.log("DOMContentLoaded触发"); // 检查事件是否触发
console.log("PJAX监听器注册"); // 检查pjax:end是否绑定


});


























// let oSpan = document.getElementsByTagName("timing")[0];
// let localhostTime = new Date();//获取页面打开的时间
// function tow(n) {
//     return n >= 0 && n < 10 ? '0' + n : '' + n;
// }
// setInterval(function () {
//     let goTime = new Date();//获取动态时间
//     let diffTime = goTime.getTime() - localhostTime.getTime();
//     var second = Math.floor(diffTime / 1000);//未来时间距离现在的秒数
//     var day = Math.floor(second / 86400);//整数部分代表的是天；一天有24*60*60=86400秒 ；
//     second = second % 86400;//余数代表剩下的秒数；
//     var hour = Math.floor(second / 3600);//整数部分代表小时；
//     second %= 3600; //余数代表 剩下的秒数；
//     var minute = Math.floor(second / 60);
//     second %= 60;
//     // var str = tow(day) + '<span class="time">天</span>'
//     //     + tow(hour) + '<span class="time">小时</span>'
//     //     + tow(minute) + '<span class="time">分钟</span>'
//     //     + tow(second) + '<span class="time">秒</span>';
//     var str = tow(hour) + '<span class="time">小时</span>'
//         + tow(minute) + '<span class="time">分钟</span>'
//         + tow(second) + '<span class="time">秒</span>';
//     oSpan.innerHTML = "您已浏览网页" + str;
// }, 1000)


// // // 来源: https://cnhuazhu.gitee.io/2021/02/24/Hexo%E9%AD%94%E6%94%B9/Hexo%E5%A2%9E%E6%B7%BB%E5%85%AC%E5%91%8A%E6%A0%8F%E8%AE%A1%E6%97%B6%E5%99%A8%E5%B0%8F%E9%83%A8%E4%BB%B6/
