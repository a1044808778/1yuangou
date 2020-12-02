<template>
    <div class="wap-wrap payDetailWarp pb80"  id="page" >
        <div class=' payDetailBox'>
            <h3>{{orderDetail.goodsName}} <span>{{orderDetail.expireTime | times}}</span> </h3>
            <p>Visa银联双标卡专享价</p>
            <h5> <strong class='pay noright'><span>¥</span>{{orderDetail.settleMoney}}</strong> <span class='oprice'>原价：{{orderDetail.subtotal}}</span> </h5>
        </div>
        <div class='payWays'>
            <h3>支付方式</h3>
            <van-radio-group v-model="radio">
                <van-radio name="wechat">
                    <dl>
                        <dt><img src="./images/weChat.png" alt="" /></dt>
                        <dd>微信支付</dd>
                    </dl>
                </van-radio> 
            </van-radio-group>
        </div>
        <div class='payDetail'>
            <h3>微信支付优惠使用说明</h3>
            <p>1、提交订单</p>
            <p>2、确保微信支付绑定了Visa信用卡</p>
            <div class='guideBox' style='margin-top:10px'>
                <p><img src="./images/y1.png"  @click="openImageView(0)" alt=""></p>
                <p><img src="./images/y2.png"  @click="openImageView(1)" alt=""></p>
            </div>
            <div class='guideBox'>
                <p><img src="./images/y3.png"  @click="openImageView(2)" alt=""></p>
                <p><img src="./images/y4.png"  @click="openImageView(3)" alt=""></p>
            </div>
            <div class='guideBox'>
                <p><img src="./images/y5.png"  @click="openImageView(4)" alt=""></p>
                <p> </p>
            </div>
        </div>
        <div class="payBtnbox">
            <a class='goCard'>我要办卡</a>
            <button class='submit' @click='goPay'>立即支付</button>
        </div>
    </div>
</template>

<script>
import {getUrlParam,getBrowser,InitTime} from './js/utils.js';
import { ImagePreview } from 'vant';
import QRCode from 'qrcodejs2';
import jsNative from 'js-native';
import y1 from './images/y1.png';
import y2 from './images/y2.png';
import y3 from './images/y3.png';
import y4 from './images/y4.png';
import y5 from './images/y5.png';
export default {
    
    name: 'pay',
    filters: { 
        times(date) {
            return InitTime(date);
        },
    },
    data () {
        return {
            api:'',//api接口
            browser:'',channelId:'',show:false,showDelete:true,radio:'wechat',position:0,
            //token
            isLogin:false,token:0,
            //page
            orderId:0,orderDetail:[],time:null,
        
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
        var that = this;
        clearInterval(this.time);this.time = null;
       //进入页面修改标题
        this.$emit('chageTitle','收银台'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageBackPage','detail');
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
        this.orderId = sessionStorage.getItem('orderId');
        //获取订单详情
        if(this.goodsId==0){
            this.$toast('未找到商品ID，请重试');
            this.$router.push({name: 'index',});
            return false;
        }
        //获取商品详情
        this.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
        this.$axios.post(this.api+'/api/client/ypJyOrder/detail', {
            'orderId':this.orderId, 
            'channelId':this.channelId
        },{headers: {'token': this.token}}).then((res) => {
            console.log(res)
            this.$toast.clear(); //清除加载框
            if(res.data.code==0){
                this.orderDetail = res.data.data;
                this.time = setInterval(function(){
                    that.orderDetail.expireTime--;
                    if(that.orderDetail.expireTime==0){
                        clearInterval(that.time);that.time = null;
                    }
                }, 1000);
            }else{
                this.$toast.clear(); //清除加载框
                this.$toast.fail({message: res.data.msg,forbidClick:true,duration:0,overlay:true,});//接口返回错误
            }
        }).catch((err) => {
            this.$toast.clear(); //清除加载框
            this.$toast.fail({message: '加载失败请重试',forbidClick:true,duration:0,overlay:true,});//接口返回错误
            console.log(err)
        })
        
    },
    methods: {

        goPay(){
            this.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
            this.$axios.post(this.api+'/api/client/ypJyOrder/cashier', {
                'orderId':this.orderId,
            },{headers: {'token': this.token}}).then((res) => {
                console.log(res.data.data)
                this.$toast.clear(); //清除加载框
                if(res.data.code==0){
                    //此处处理唤起成功逻辑

                    
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

        //img
        openImageView(position){
            this.position = position;
            ImagePreview({
                images: [
                    y1,y2,y3,y4,y5
                ],
                closeable: true,
                startPosition: this.position,
                onClose() {
                    console.log('关闭');
                },
            });
        },
        //关闭
        close(){
            this.show = false;
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
