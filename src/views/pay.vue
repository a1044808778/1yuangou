<template>
    <div class="wap-wrap payDetailWarp pb80"  id="page" >
        <div class=' payDetailBox'>
            <h3>{{orderDetail.goodsName}} <span>{{orderDetail.expireTime | times}}</span> </h3>
            <p>Visa银联双标卡专享价</p>
            <h5> <strong class='pay noright'><span>¥</span>{{orderDetail.settleMoney}}</strong> <span class='oprice'>原价：{{orderDetail.subtotal}}</span> </h5>
        </div>
        <!-- <div class='payWays'>
            <h3>支付方式</h3>
            <van-radio-group v-model="radio">
                <van-radio name="wechat">
                    <dl>
                        <dt><img src="./images/weChat.png" alt="" /></dt>
                        <dd>微信支付</dd>
                    </dl>
                </van-radio> 
            </van-radio-group>
        </div> -->
        <!-- <div class='payDetail'>
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
        </div> -->
        <div class="payBtnbox">
            <!-- <a class='goCard'>我要办卡</a> -->
            <a :href="goAddr" class='submit' style='width:100%; box-sizing:border-box;margin:0' >立即支付</a>
        </div>
    </div>
</template>

<script>
import {InitTime,axiospost} from './js/utils.js';
import { ImagePreview } from 'vant';
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
            show:false,showDelete:true,radio:'wechat',position:0,
            //token
            isLogin:false,token:0,
            //page
            orderId:0,orderDetail:[],time:null,goAddr:'',
        
        }
    },
    
    created () {
         
        
    },
    mounted(){ 
        var that = this;
        clearInterval(this.time);this.time = null;
       //进入页面修改标题
        this.$emit('chageTitle','收银台'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageTitleShow',true);
        this.$emit('chageBackPage','order');
        this.$emit('chageRight',false);
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

    
        let data2 = {
            'orderId':this.orderId,
            "merchantCode":"0002900M00003",
            'channelId':sessionStorage.getItem('channelId'),
            "platformTp":"T0002"
        };
        axiospost('/api/client/ypJyOrder/cashier',data2).then(res=>{
            //此处处理唤起成功逻辑
            this.goAddr = res.data.data

        },error =>{
        
        })
        
    },
    methods: {


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
                },
            });
        },
        //关闭
        close(){
            this.show = false;
        },
        
       
    },
   
  
}
</script>

<style scoped>

</style>
