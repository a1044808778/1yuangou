<!-- 
    无法支付，未测试订单支付完成后的状态

-->
<template>
    <div class="wap-wrap detailWarp pb140"  id="page" >
        <dl class='detailBox' @click="goDetail">
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
                <p v-else-if='orderDetail.clientStatus == 6'><span class="clrCencel" >已退款</span></p> 
                <p v-else-if='orderDetail.clientStatus == 8'><span class="clrCencel" >退款中</span></p> 
                <p v-else-if='orderDetail.clientStatus == 9'><span class="clrRed" >支付失败</span></p> 
                <p v-else-if='orderDetail.clientStatus == 10'><span class="clrRed" >退款失败</span></p> 
                <p v-else-if='orderDetail.clientStatus == 11'><span class="clrRed" >充值失败</span></p> 
                <p v-else><span>未知</span></p> 
            </div>
            <div class='orderListItem'>
                <label for="">订单编号</label>
                <p><span>{{orderDetail.orderNo}}</span></p> 
            </div>
            <div class='orderListItem'>
                <label for="">创建时间</label>
                <p><span>{{orderDetail.createTime}}</span></p> 
            </div>
        </div>
        <div class='orderInfo' v-if='orderDetail.clientStatus == 3'>
            <div class='orderListItem'>
                <label for="">实付款</label>
                <p><strong class='pay'><span>¥</span>{{orderDetail.settleMoney}}</strong></p> 
            </div>
        </div> 
        <div class='orderInfo' v-if='(orderDetail.goodsType == 2 || orderDetail.goodsType == 4 ) && orderDetail.clientStatus == 3'>
            <div class='orderListItem'>
                <label for="">兑换码</label>
                <p class='code'>{{orderDetail.specialInfo}}</p> 
            </div>
            <!-- <text type="text" class='exchange' disabled v-html="orderDetail.couponCodeDesc"> -->
            <div type="text" class='exchange' disabled v-html="orderDetail.couponCodeDesc"></div>
        </div>
        <!-- <div class='orderInfo' v-if='orderDetail.goodsType == 5 && orderDetail.clientStatus == 3'>
            <div class='orderListItem'>
                <label for="">兑换码</label>
                <p class='code'><a :href="orderDetail.specialInfo">兑换链接</a> </p> 
            </div>
        </div> -->
        <div class='tips' v-else-if='orderDetail.clientStatus == 3'>
            请留意查看登录手机短信通知并领取权益
        </div>
        <div class='cancelBox' v-if='orderDetail.clientStatus == 1'>
            <button @click='cancelShow=true' class='buyBtn btnCancel'>取消订单</button>
        </div>
        <div class='cancelBox' v-if='orderDetail.clientStatus == 11'>
            <button @click='refundShow=true' class='buyBtn btnCancel'>申请退款</button>
        </div>
        <div class='orderBtnBox'>
            <button @click='goPay' class='buyBtn btnBuy' v-if='orderDetail.expireTime > 0 && orderDetail.clientStatus == 1'>立即支付 剩余支付时间：{{orderDetail.expireTime | times}}</button>
            <!-- <a class='buyBtn btnReceive' :href="orderDetail.specialInfo" v-if='orderDetail.goodsType == 4  && orderDetail.clientStatus == 3' >前往领取</a> -->
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
        <!-- alert -->
        <van-popup v-model="refundShow">
            <div class='alertBox alertConfirmBox'>
                <h1>您是否确认申请退款？</h1>
                <p>退款金额将由原支付通道退回</p>
                <div class='alertBtnBox'>
                    <button class='cancel' @click='refundShow=false'>关闭</button>
                    <button class='delete' @click='btnRefund'>确认退款</button>
                </div>
            </div>
        </van-popup>
        <!-- alert -->
        <van-popup v-model="refundEndShow">
            <div class='alertBox'>
                <h1>退款成功</h1>
                <p>退款金额将由原支付通道退回</p>
                <button class='close' @click='close'></button>
                <div class='alertBtnBox'>
                    <button class='normal' @click='btnRefundEnd'>确定</button>
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import {InitTime,axiospost} from './js/utils.js';
export default {
    name: 'order',
    filters: { 
        times(date) {
            return InitTime(date);
        },
    },
    data () {
        return {
            show:false,showDelete:false,cancelShow:false,refundShow:false,refundEndShow:false,
            //token
            isLogin:false,token:0,
            //page
            orderId:0,orderDetail:[],time:null,
        }
    },
    
    created () {
        
    },
    mounted(){ 
        var that = this;
        clearInterval(this.time);this.time = null;
       //进入页面修改标题
        this.$emit('chageTitle','订单详情'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageTitleShow',true);
        this.$emit('chageBackPage','myorder');
        this.$emit('chageRight',false);
        sessionStorage.setItem('activePage','order'); 
        //检查是否登录
        this.isLogin = this.$cookies.isKey('token');
        console.log('用户登录状态',this.isLogin)
        if(this.isLogin == true){ 
            //如果登录获取用户ID
            this.token = this.$cookies.get('token');
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
        let data = {
            'orderId':this.orderId, 
            'channelId':sessionStorage.getItem('channelId')
        };
        axiospost('/api/client/ypJyOrder/detail',data).then(res=>{
            this.orderDetail = res.data.data;
            this.time = setInterval(function(){
                that.orderDetail.expireTime--;
                if(that.orderDetail.expireTime==0){
                    clearInterval(that.time);that.time = null;
                }
            }, 1000);
        },error =>{
        
        })
      

    },
    methods: {
        //去详情
        goDetail(){
            console.log(this.orderDetail)
            sessionStorage.setItem('goodsId',this.orderDetail.goodsId);
            this.$router.push({name: 'detail',});

        },

        //申请退款
        btnRefund(){
            let data = {
                'orderId':this.orderId, 
                'channelId':sessionStorage.getItem('channelId')
            };
            axiospost('/api/client/ypJyOrder/refund',data).then(res=>{
                // this.$dialog.alert({
                //     message: '申请成功',
                // }).then(() => {
                //     this.$router.push({name: 'index',});
                // });
                this.refundEndShow = true;
            },error =>{
            
            })
        },
        // 退款成功
        btnRefundEnd(){
            this.$router.push({name: 'index',});
        },
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
            let data = {
                'orderId':this.orderId, 
                'channelId':sessionStorage.getItem('channelId')
            };
            axiospost('/api/client/ypJyOrder/cancel',data).then(res=>{
                this.$dialog.alert({
                    message: '取消成功',
                }).then(() => {
                    this.$router.push({name: 'index',});
                });
            },error =>{
            
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
