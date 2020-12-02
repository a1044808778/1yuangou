<template>
    <div class="wap-wrap detailWarp pb140"  id="page" >
        <dl class='detailBox'>
            <dt><img :src="orderDetail.goodsImgUrl" /></dt>
            <dd>
                <h3>{{orderDetail.goodsName}}</h3>
                <h5>原价：{{orderDetail.subtotal}}</h5>
                <p>Visa银联双标卡专享价 <strong><span>¥</span>{{orderDetail.settleMoney}}</strong></p>
            </dd>
        </dl>
        <div class='orderInfo'>
            <div class='orderListItem'>
                <label for="">订单状态</label> 
                <p v-if='orderDetail.clientStatus == 1'><span class="clrPay">待支付</span></p> 
                <p v-else-if='orderDetail.clientStatus == 3'><span class="clrOk">已完成</span></p> 
                <p v-else-if='orderDetail.clientStatus == 4'><span class="clrCencel" >已取消</span></p> 
                <p v-else><span>未知</span></p> 
            </div>
            <div class='orderListItem'>
                <label for="">订单编号</label>
                <p><span>{{orderDetail.orderId}}</span></p> 
            </div>
            <div class='orderListItem'>
                <label for="">创建时间</label>
                <p><span>{{orderDetail.createTime}}</span></p> 
            </div>
        </div>
        <div class='orderInfo'>
            <div class='orderListItem'>
                <label for="">实付款</label>
                <p><strong class='pay'><span>¥</span>{{orderDetail.settleMoney}}</strong></p> 
            </div>
        </div> 
        <!-- <div class='orderInfo'>
            <div class='orderListItem'>
                <label for="">兑换码</label>
                <p class='code'>D784GHYR</p> 
            </div>
            <input type="text" class='exchange' disabled value="请前往线下门店/app兑换">
        </div> -->
        <div class='cancelBox' v-if='orderDetail.clientStatus == 1'>
            <button @click='cancelShow=true' class='buyBtn btnCancel'>取消订单</button>
        </div>
        <div class='orderBtnBox'>
            <button @click='goPay' class='buyBtn btnBuy' v-if='orderDetail.expireTime > 0 && orderDetail.clientStatus == 1'>立即支付 剩余支付时间：{{orderDetail.expireTime | times}}</button>
            <button class='buyBtn btnReceive' v-if='orderDetail.clientStatus == 3' >前往领取</button>
            <!-- <button class='buyBtn btnDelete' @click='cancelShow=true'>删除订单</button> -->
            <button class='buyBtn btnBack' @click='goMainPage'>返回活动首页</button>
        </div>
        <!-- alert -->
        <van-popup v-model="show">
            <div class='alertBox'>
                <h1>抱歉</h1>
                <p>本活动规定用户每月仅可购买一份商品本月您已参与该活动商品购买请下月再来！</p>
                <button class='close' @click='close'></button>
                <div class='alertBtnBox'>
                    <button class='normal' @click='close'>确定</button>
                </div>
            </div>
        </van-popup>
        <!-- alert -->
        <van-popup v-model="showDelete">
            <div class='alertBox alertConfirmBox'>
                <h1>您是否确认删除订单？</h1>
                <p>订单删除后无法查找</p>
                <div class='alertBtnBox'>
                    <button class='cancel' @click='btnCancelCheck=false'>取消</button>
                    <button class='delete' @click='btnCancel'>删除</button>
                </div>
            </div>
        </van-popup>
        <!-- alert -->
        <van-popup v-model="cancelShow">
            <div class='alertBox alertConfirmBox'>
                <h1>您是否确认取消订单？</h1>
                <p>取消后无法恢复</p>
                <div class='alertBtnBox'>
                    <button class='cancel' @click='cancelShow=false'>关闭</button>
                    <button class='delete' @click='btnCancel'>确认取消</button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import {getUrlParam,getBrowser,InitTime} from './js/utils.js';

import QRCode from 'qrcodejs2';
import jsNative from 'js-native';
export default {
    name: 'order',
    filters: { 
        times(date) {
            return InitTime(date);
        },
    },
    data () {
        return {
            api:'https://testa.link2shops.com/vfuliApi',//api接口
            browser:'',channelId:'',show:false,showDelete:false,cancelShow:false,
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
        this.$emit('chageTitle','订单详情'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageBackPage','myorder');
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
        //去支付
        goPay(){
            sessionStorage.setItem('orderId',this.orderId);
            this.$router.push({name: 'pay',});
            
        },
        //关闭
        close(){
            this.show = false;
        },


        btnCancel(){
            
            this.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
            this.$axios.post(this.api+'/api/client/ypJyOrder/cancel', {
                'orderId':this.orderId, 
                'channelId':this.channelId
            },{headers: {'token': this.token}}).then((res) => {
                console.log(res)
                this.$toast.clear(); //清除加载框
                if(res.data.code==0){
                    this.$dialog.alert({
                        message: '取消成功',
                    }).then(() => {
                        this.$router.push({name: 'index',});
                    });
                     
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
        
        //返回首页
        goMainPage(){
            this.$router.push({name: 'index',});
        },
         
    },
  
    beforeDestroy() {
        clearInterval(this.time);this.time = null;
        
    }, 
    destroyed() {
        clearInterval(this.time);this.time = null;
       
    },
  
}
</script>

<style scoped>

</style>
