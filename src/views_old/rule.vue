<template>
    <div class="wap-wrap ruleCont"  id="page" >
        <div class='ruleBox'>
            <div v-html="activityRules"></div>
        </div>
    </div>
</template>

<script>
import {getUrlParam,getBrowser,InitTime,savePicture,onLine} from './js/utils.js';

import QRCode from 'qrcodejs2';
import jsNative from 'js-native';
export default {
    name: 'rule',
    data () {
        return {
            api:'',//api接口
            activityRules:'',token:0,
        }
    },
    //生命周期，当页面加载
    created () {
        this.api = this.$mainApi;
        this.browser = getBrowser();
        
        
    },
    mounted(){ 
        //进入页面修改标题
        this.$emit('chageTitle','活动细则'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageBackPage','index');
        //获取规则
        this.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
        this.$axios.post(this.api+'/api/client/ypJyActivity/activityRules', {
            'activityTag':'yyg',
        }).then((res) => {
            console.log(res)
            this.$toast.clear(); //清除加载框
            if(res.data.code==0){
                this.activityRules = res.data.data.activityRules;
            }else{
                this.$toast.clear(); //清除加载框
                this.$toast.fail({message: res.data.msg,forbidClick:true,duration:1000,overlay:true,});//接口返回错误
            }
        }).catch((err) => {
            this.$toast.clear(); //清除加载框
            this.$toast.fail({message: '加载失败请重试',forbidClick:true,duration:1000,overlay:true,});//接口返回错误
            console.log(err)
        })
    },
    methods: {
        

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
