<template>
    <div class="wap-wrap"  id="page" >
        <div class='loginBox'>
            <h1>登录账号</h1>
            <div class='litem'><input type="text" v-model="loginForm.mobile" class='in01' placeholder="请输入手机号"></div>
            <div class='litem'><input type="text" v-model="loginForm.verifyCode" class='in02' placeholder="请输入图形验证码"><div id="v_container" class='code'></div> </div>
            <div class='litem'><input type="text" v-model="loginForm.smsCode" class='in03' placeholder="请输入短信验证码"><button :disabled='disableVerifyCodeType' class='send' @click='sendVerifyCode'>{{sendVerifyCodeText}}</button></div>
            <button class='btnLogin' @click='btnLogin' :disabled='true==(loginForm.mobile=="" || loginForm.verifyCode=="" || loginForm.smsCode=="")'>完成</button>
            <p class='lread'> <img src="./images/check.png" alt="" /> 登录即阅读并同意<a href="#" @click='getQuestion("05")'>《用户协议》</a>和<a href="#" @click='getQuestion("09")'>《隐私协议》</a></p>
        </div>
        <!-- 用户协议 -->
        <van-popup v-model="tipsShow" position="bottom" :style="{ height: '90%' }" round closeable>
            <div class='popupCont'>
                <div class='popupBox'>
                    <h3>{{title}}</h3>
                    <div v-html="content"></div>
                </div>
            </div>
        </van-popup>
    </div>
</template>
<script>
import {axiospost} from './js/utils.js';
import { GVerify } from '../components/verifyCode';
export default {
    name: 'index',
    data () {
        return {
            verifyCode:null,
            loginForm: {
                mobile: '',
                smsCode: '',
                verifyCode: ''
            },
            tipsShow:false,content:'',title:'',
            //验证码
            verifyCode:'',verifyCodeTimer:60, sendVerifyCodeText:'获取验证码',disableVerifyCodeType:false,timerSendVerifyCode:'',
        }
    },
    
    created () {
         
        
    },
    mounted(){ 
        //进入页面修改标题
        this.$emit('chageTitle','登录'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageTitleShow',true);
        this.$emit('chageRight',false);
        var fromPage = sessionStorage.getItem('fromPage');
        if(fromPage){
            this.$emit('chageBackPage',sessionStorage.getItem('fromPage'));
        }else{
            this.$emit('chageBackPage','index');
        }
        //初始化验证码
        this.verifyCode = new GVerify('v_container');
        //检查是否登录
        this.isLogin = this.$cookies.isKey('token');
        console.log('用户登录状态',this.isLogin)
        if(this.isLogin == true){ 
            // 如果登录直接进入首页
            // this.$dialog.alert({
            //     message: '您已登录',
            // }).then(() => { 
            //     this.$router.push({name: 'index',});
            // });
        };
        
    },
    methods: {
        //发送验证码
        sendVerifyCode(){
            var that = this;
            var verifyCode = this.loginForm.verifyCode;
            var verifyFlag = this.verifyCode.validate(verifyCode);
            if(verifyFlag == false){
                this.$toast.fail({message: '请输入正确的图形验证码',forbidClick:true,duration:1000,overlay:true,});//错误提示
                this.verifyCode = new GVerify('v_container');
                return false
            }
            if(this.loginForm.mobile == ''){
                this.$toast.fail({message: '请输入手机号',forbidClick:true,duration:1000,overlay:true,});//错误提示
                this.verifyCode = new GVerify('v_container');
                return false
            }
            this.disableVerifyCodeType = true;
            this.sendVerifyCodeText = `发送中`;
            let data = {
                'mobile':this.loginForm.mobile,
                'channelId':sessionStorage.getItem('channelId')
            };
            axiospost('/api/client/sms/sendVerifyCode',data,{}).then(res=>{
                this.sendVerifyCodeText = this.verifyCodeTimer+`秒后再试`;
                this.timerSendVerifyCode = setInterval(function(){
                    that.verifyCodeTimer--;
                    that.sendVerifyCodeText =  that.verifyCodeTimer+`秒后再试`;
                    if(that.verifyCodeTimer==0){
                        clearInterval(that.timerSendVerifyCode);that.timerSendVerifyCode = null;
                        that.sendVerifyCodeText='重发验证码';
                        that.verifyCodeTimer = 60;
                        that.disableVerifyCodeType = false;
                    }
                }, 1000);
            },error =>{
                this.verifyCode = new GVerify('v_container');
                this.$toast.clear(); //清除加载框
                this.disableVerifyCodeType = false;
                this.sendVerifyCodeText = `发送失败重试`;
            })
        },
        //登录
        btnLogin(){
            var verifyCode = this.loginForm.verifyCode;
            var verifyFlag = this.verifyCode.validate(verifyCode);
            if(verifyFlag == false){
                this.$toast.fail({message: '请输入正确的图形验证码',forbidClick:true,duration:1000,overlay:true,});//错误提示
                this.verifyCode = new GVerify('v_container')
                return false
            }
            if(this.loginForm.mobile == ''){
                this.$toast.fail({message: '请输入手机号',forbidClick:true,duration:1000,overlay:true,});//错误提示
                this.verifyCode = new GVerify('v_container');
                return false
            }
            if(this.loginForm.smsCode == ''){
                this.$toast.fail({message: '请输入验证码',forbidClick:true,duration:1000,overlay:true,});//错误提示
                this.verifyCode = new GVerify('v_container');
                return false
            }


            let data = {
                'mobile':this.loginForm.mobile,
                'smsCode':this.loginForm.smsCode,
                'channelId':sessionStorage.getItem('channelId')
            };
            axiospost('/api/client/user/login',data,{}).then(res=>{
                //储存token
                this.$cookies.set('token',res.data.data.token);
                this.$cookies.set('userNo',res.data.data.userNo);
                this.$cookies.set('userId',res.data.data.userId);
                this.$cookies.set('pendPayOrderNum',res.data.data.pendPayOrderNum);
                var fromPage = sessionStorage.getItem('fromPage');
                if(fromPage){
                    this.$dialog.alert({
                        message: '登录成功，点击确认返回',
                    }).then(() => {
                        sessionStorage.removeItem('fromPage');
                        this.$router.push({name: fromPage});
                    });
                }else{
                    this.$dialog.alert({
                        message: '登录成功',
                    }).then(() => {
                        this.$router.push({name: 'index',});
                    });
                }
            },error =>{
                this.verifyCode = new GVerify('v_container')
            })


 

        },
        //获取协议
        getQuestion(type){
            let data = {
                'channelId':sessionStorage.getItem('channelId'),
                'type':type,
            }
            axiospost('/api/client/content/question',data,{}).then(res=>{
                this.content = res.data.data.content;
                this.title = res.data.data.title;
                this.tipsShow = true;
            },error =>{
            
            })
        },
      
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
