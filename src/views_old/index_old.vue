<template>
    <div class="wap-wrap"  id="page" >
        <div class='banner'>
            <img class='bannerImg' src="./images/banner.png" alt="">
            <div class='userBox'>
                <p v-if='isLogin==true'><img src="./images/user.png" /><span>{{userId  | fuserId}}</span></p>
                <p v-else @click='goLogin'><img src="./images/user.png" /><span style='color:#999'>未登录</span></p>
            </div>
            <div class='helpBox' @click='goRule' title='活动细则'></div>
            <div class='btnOrder' @click='goOrder'>我的订单 ></div>
        </div>
        <div class='proList'>
            <dl v-for='(item,index) of goodsList' :key='index' @click='goDetali(item.id)'>
                <dt><img :src="item.entranceImg" /></dt>
                <dd>
                    <h3>{{item.name}}</h3>
                    <p>{{item.subtitle}}</p>
                </dd>
            </dl>
            
        </div>
    </div>
</template>

<script>
import {getUrlParam,getBrowser,filtersUserId} from './js/utils.js';
import QRCode from 'qrcodejs2';
import jsNative from 'js-native';
export default {
    filters: { 
        fuserId(time) {
            var date = time;
            return filtersUserId(date);
        },
    },
    name: 'index',
    data () {
        return {
            api:'',//api接口
            browser:'',channelId:'',
            //token
            isLogin:false,
            // pages
            goodsList:[],
        }
    },
    //生命周期，当页面加载
    created () {
        var that = this;
        this.api = this.$mainApi;
        this.browser = getBrowser();
        //网页传参
        if(getUrlParam("channelId")!==null){
            sessionStorage.setItem('channelId',getUrlParam("channelId"));
            this.channelId=getUrlParam("channelId")
        }else if(sessionStorage.getItem('channelId')!==null){
            this.channelId=sessionStorage.getItem('channelId');
        }else{
            //如果没有渠道ID 默认赋值
            this.channelId = this.$DefaultChannelId;
            sessionStorage.setItem('channelId',this.channelId);
        }
    },
    mounted(){ 
       //检查是否登录
        this.isLogin = this.$cookies.isKey('token');
        console.log('用户登录状态',this.isLogin)
        if(this.isLogin == true){ 
            //如果登录获取用户ID
            this.userId = this.$cookies.get('userId');
        };

    //获取商品列表
        this.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
        this.$axios.post(this.api+'/api/client/ypJyActivity/goodsList', {
            'activityTag':'yyg',
        }).then((res) => {
            console.log(res)
            this.$toast.clear(); //清除加载框
            if(res.data.code==0){
                this.goodsList = res.data.data.goodsList;
            }else{
                this.$toast.clear(); //清除加载框
                this.$toast.fail({message: res.data.msg,forbidClick:true,duration:1000,overlay:true,});//接口返回错误
            }
        }).catch((err) => {
            this.$toast.clear(); //清除加载框
            this.$toast.fail({message: res.data.msg,forbidClick:true,duration:1000,overlay:true,});//接口返回错误
            console.log(err)
        })


    },
    methods: {
        //前往商品详情
        goDetali(id){
            sessionStorage.setItem('activeId',id);
            this.$router.push({name: 'detail',});
        },
        //前往规则页面
        goRule(){
            this.$router.push({name: 'rule',});
        },
        //前往登录页面
        goLogin(){
            this.$router.push({name: 'login',});
        },
        //前往订单页面
        goOrder(){
            this.$router.push({name: 'myorder',});
        },
        copy(type){
            var Url2= this.payData.payMoney;
            var text = '金额';
            var oInput = document.createElement('input');
            var v = this.browser.version;
            if(v.ios == true){
                oInput.setAttribute('disabled','disabled')
            }
            oInput.value = Url2;
            document.body.appendChild(oInput);
            oInput.select(); // 选择对象
            document.execCommand("Copy"); // 执行浏览器复制命令
            oInput.className = 'oInput';
            oInput.style.display='none';
            this.$notify({ type: 'success', message: '复制'+text+'成功' });
        },
         
        timetrans(Time){ 
            var _date = new Date(Time)//;
            var Y = _date.getFullYear() + '-';
            var M = (_date.getMonth()+1 < 10 ? '0'+(_date.getMonth()+1) : _date.getMonth()+1) + '-';
            var D = _date.getDate() + '';
            var h = _date.getHours() + ':';
            var m = _date.getMinutes() + ':';
            var s = _date.getSeconds() ;
            if (M < 10 ){M = "0" + M;}
            if (_date.getDate() < 10 ){D = "0" + D ;}
            if (_date.getHours() < 10 ){h = "0" + h ;}
            if (_date.getMinutes() < 10 ){m = "0" + m ;}
            if (_date.getSeconds() < 10 ){s = "0" + s ;}
            if (D < 10 ){s = "0" + s ;}
            return(Y+M+D)
        },  
        //设置动态标题
        setTitle : function(t,image) { 
            document.title = t;
            var i = document.createElement('iframe');
            i.src = image;
            i.style.display = 'none';
            i.onload = function() {
                setTimeout(function(){
                    i.remove();
                }, 9)
            }
            document.body.appendChild(i);
        } ,
    },
  
    beforeDestroy() {
        clearInterval(this.timerSendVerifyCode);this.timerSendVerifyCode = null;
        
    }, 
    destroyed() {
        clearInterval(this.timerSendVerifyCode);this.timerSendVerifyCode = null;
       
    },
  
}
</script>

<style scoped>

</style>
