<template>
    <div class="wap-wrap"  id="page" >
        <div class='orderListBox'>
            <h3 class='orderNav'>
                <span :class='{"cur":status == 0}' @click='changeStatus(0)'>全部</span>
                <span :class='{"cur":status == 1}' @click='changeStatus(1)'>待支付</span>
                <span :class='{"cur":status == 2}' @click='changeStatus(2)'>已完成</span>
                <span :class='{"cur":status == 4}' @click='changeStatus(4)'>已取消</span>
            </h3>
        </div>
        <div class='orderList'> 
            <div v-if='orderList.length == 0' style='text-align:center'>暂无订单</div>
            <dl v-for='(item,index) of orderList' :key='index' @click='goOrder(item.orderId)' class='orderDetailBox' :class='{"novisa":item.subtotal-item.settleMoney<=0}'>
                <dt><img :src="item.goodsImgUrl" /></dt>
                <dd> 
                    <h3>{{item.goodsName}}
                        <span class="clrPay" v-if='item.clientStatus == 1'>待支付</span>
                        <span class="clrOk" v-else-if='item.clientStatus == 3'>已完成</span>
                        <span class="clrCencel" v-else-if='item.clientStatus == 4'>已取消</span>
                        <span v-else>未知</span>
                    </h3>
                    <h5>{{item.createTime}}<span>原价：{{item.subtotal}}</span></h5>
                    <p><i v-if='item.subtotal-item.settleMoney>0'>Visa银联双标卡专享价</i> <strong><span>¥</span>{{item.settleMoney}}</strong></p>
                </dd>
            </dl>
 
        </div>
    </div>
</template>

<script>
import {getUrlParam,getBrowser,InitTime,savePicture,onLine} from './js/utils.js';

import QRCode from 'qrcodejs2';
import jsNative from 'js-native';
export default {
    name: 'index',
    
    data () {
        return {
            api:'',//api接口
            browser:'',channelId:'', 
            //token
            isLogin:false,token:0,
            //pages
            status:0,orderList:[],
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
        }else{
            //如果没有渠道ID 默认赋值
            this.channelId = this.$DefaultChannelId;
            sessionStorage.setItem('channelId',this.channelId);
        };
    },
    mounted(){ 
        //进入页面修改标题
        this.$emit('chageTitle','我的订单'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageBackPage','index');
        //检查是否登录
        this.isLogin = this.$cookies.isKey('token');
        console.log('用户登录状态',this.isLogin)
        if(this.isLogin == true){ 
            //如果登录获取用户ID
            this.token = this.$cookies.get('token');
            this.userId = this.$cookies.get('userId');
        }else{
            this.$dialog.alert({
                message: '请先登录',
            }).then(() => {
                sessionStorage.setItem('fromPage','myorder');
                this.$router.push({name: 'login'});
            });
            return false;
        };
        //获取分类
        this.getOrderList();
       
    },
    methods: {
        //更改订单状态
        changeStatus(status){
            this.status = status;
            this.getOrderList();
        },
        //获取订单列表
        getOrderList(){
            this.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
            this.$axios.post(this.api+'/api/client/ypJyOrder/list', {
                'channelId':this.channelId,
                'status':this.status,
            },{headers: {'token': this.token}}).then((res) => {
                console.log(res.data.data)
                this.$toast.clear(); //清除加载框
                if(res.data.code==0){
                    this.orderList = res.data.data;
                    
                }else if(res.data.code == 401){
                    this.$toast.clear(); //清除加载框
                    this.$cookies.remove('token');
                    this.$dialog.alert({
                        message: '登录状态过期，请重新登录',
                    }).then(() => {
                        sessionStorage.setItem('fromPage','detail');
                        this.$router.push({name: 'login',});
                    });
                    
                }else{
                    this.$toast.clear(); //清除加载框
                    this.$toast.fail({message: res.data.msg,forbidClick:true,duration:3000,overlay:true,});//接口返回错误
                }
            }).catch((err) => {
                this.$toast.clear(); //清除加载框
                this.$toast.fail({message: '加载失败请重试',forbidClick:true,duration:3000,overlay:true,});//接口返回错误
                console.log(err)
            })
        },
        //前往订单详情
        goOrder(orderId){
            sessionStorage.setItem('orderId',orderId);
            this.$router.push({name: 'order',});

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
