import Vue from 'vue'
import router from '../../router';
//获取url参数
export function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值
};

//关闭网页
export function closeWindow(){
	var userAgent = navigator.userAgent;
	if (userAgent.indexOf("Firefox") != -1 || userAgent.indexOf("Chrome") !=-1) {
        window.location.href="about:blank";
        window.close();
	} else {
        window.opener = null;
        window.open("", "_self");
        window.close();
	}
}

//检测支付宝
 
//判断手机版本

export function getBrowser(){
    var browser = {
        
        version: (function() {
            var u = navigator.userAgent,
            app = navigator.appVersion;
            return { //移动终端浏览器版本信息
                noIntentTest : /aliapp|360 aphone|weibo|windvane|ucbrowser|baidubrowser/.test(u),
                hasIntentTest :/chrome|samsung/.test(u),
                isAndroid : /android|adr/.test(u) && !(/windows phone/.test(u)),
                trident: (/Trident/i).test(u), //IE内核
                presto: (/Presto/i).test(u), //opera内核
                webKit: (/AppleWebKit/i).test(u), //苹果、谷歌内核
                gecko: (/Gecko/i).test(u) && !(/KHTML/i).test(u), //火狐内核
                mobile: (/AppleWebKit.*Mobile.*/i).test(u), //是否为移动终端
                ios: (/\(i[^;]+;( U;)? CPU.+Mac OS X/i).test(u), //ios终端
                android: (/Android/i).test(u) || (/Linux/i).test(u), //android终端或者uc浏览器
                windowsphone: (/Windows Phone/i).test(u), //Windows Phone
                iPhone: (/iPhone/i).test(u), //是否为iPhone或者QQHD浏览器
                iPad: (/iPad/i).test(u), //是否iPad
                MicroMessenger: (/MicroMessenger/i).test(u), //是否为微信
                webApp: !(/Safari/i).test(u), //是否web应该程序，没有头部与底部
                edge: (/edge/i).test(u),
                weibo: (/Weibo/i).test(u),
                uc: (/UCBrowser/i).test(u),
                qq: (/MQQBrowser/i).test(u),
                baidu: (/Baidu/i).test(u)
            };
        })(),
        language: (navigator.browserLanguage || navigator.language).toLowerCase(),
        lteIE: function(ver) {
            return $.browser.msie && parseInt($.browser.version) <= ver;
        },
   
    }; 
    return browser;
}

//获取网络状态
export function onLine(){
    var a = navigator.onLine
    return a;
}
//提示信息
export function Toast(msg,duration){  
    duration=isNaN(duration)?3000:duration;  
    var m = document.createElement('div');  
    m.innerHTML = msg;  
    m.style.cssText="font-size: .32rem;color: rgb(255, 255, 255);background-color: rgba(0, 0, 0, 0.6);padding: 10px 18px;margin: 0 0 0 -108px;border-radius: 4px;position: fixed;top: 50%;left: 50%;width: 180px;text-align: center; z-index:9999";
    document.body.appendChild(m);  
    setTimeout(function() {  
        var d = 0.5;
        m.style.opacity = '0';  
        setTimeout(function() { document.body.removeChild(m) }, d * 1000);  
    }, duration);  
}  



//倒计时
export function InitTime(time){  
    var dd,hh,mm,ss = null;
    if(time<=0){
        return "00:00";
    }else{
    dd = Math.floor(time / 60 / 60 / 24);
    hh = Math.floor((time / 60 / 60) % 24);
    mm = Math.floor((time / 60) % 60);
    if(mm<10){
        mm ='0'+mm;
    }
    ss = Math.floor(time % 60);
    if(ss<10){
        ss ='0'+ss;
    }
    //var str = dd+"天"+hh+"小时"+mm+"分"+ss+"秒";
 
    if(dd==0&&hh==0&&mm==0){
        var str = "00:"+ss;
    }
    else if(dd==0&&hh==0){
        var str = mm+":"+ss; 
    }
    else if(dd==0){
        str =  hh+":"+mm+":"+ss;
    }else{
        str = dd+"天"+hh+":"+mm+":"+ss;
    }
    return str;
    }
};

//过滤用户ID
export function filtersUserId(str){  
     var firstStr = str.substr(0,4); 
    var middleStr = '***';
    var tempStr = firstStr + middleStr;
    return tempStr;
};
 

//接口统一处理 
export function axiospost (api,data,headers) {
    return new Promise((resolve, reject) => {
          Vue.prototype.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
          Vue.prototype.$axios.post(Vue.prototype.$mainApi+api,data,{headers}).then((res) => {
            console.log(res)
            Vue.prototype.$toast.clear(); //清除加载框
            if(res.data.code==0){
              resolve(res);
            }else if(res.data.code==401){
                Vue.prototype.$dialog.alert({
                    message: '登录状态过期，请重新登录',
                }).then(() => {
                    sessionStorage.setItem('fromPage','detail');
                    router.push({name: 'login',});
                });
            }else{
              Vue.prototype.$toast.clear(); //清除加载框
              Vue.prototype.$toast.fail({message: res.data.msg,forbidClick:true,duration:5000,overlay:true,});//接口返回错误
              reject('err')
            }
        }).catch((err) => {
            Vue.prototype.$toast.clear(); //清除加载框
            Vue.prototype.$toast.fail({message: '加载失败请重试',forbidClick:true,duration:5000,overlay:true,});//接口返回错误
            console.log(err)
            reject(err)
        })
    });
};
