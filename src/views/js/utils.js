import Vue from 'vue'
import router from '../../router';
//获取url参数
export function getUrlParam(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
    var r = window.location.search.substr(1).match(reg);  // 匹配目标参数
    if (r != null) return unescape(r[2]); return null; // 返回参数值
};

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
export function axiospost (api,data) {
    var headers = {headers: {'token': Vue.prototype.$cookies.get('token')}};
    return new Promise((resolve, reject) => {
          Vue.prototype.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); 
          Vue.prototype.$axios.post(Vue.prototype.$mainApi+api,data,headers).then((res) => {
            Vue.prototype.$toast.clear();
            if(res.data.code==0){
                resolve(res);
            }else if(res.data.code==401){
                Vue.prototype.$dialog.alert({
                    message: '登录状态过期，请重新登录',
                }).then(() => {
                    router.push({name: 'login',});
                });
            }else{
              Vue.prototype.$toast.clear(); //清除加载框
              Vue.prototype.$toast.fail({message: res.data.msg,forbidClick:true,duration:2200,overlay:true,});
              reject('err')
            }
        }).catch((err) => {
            Vue.prototype.$toast.clear(); //清除加载框
            Vue.prototype.$toast.fail({message: '加载失败请重试',forbidClick:true,duration:2200,overlay:true,});
            reject(err)
        })
    });
};
