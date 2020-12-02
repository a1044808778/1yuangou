<!--
    检查支付名额提示需要修改
-->
<template>
    <div class="wap-wrap detailWarp"  id="page" >
        <dl class='detailBox'>
            <dt><img :src="goodsMap.entranceImg" /></dt>
            <dd>
                <h3>{{goodsMap.name}}</h3>
                <h5>原价：{{goodsMap.sellPrice - goodsMap.reductionAmount}}</h5>
                <p> <i v-if='goodsMap.reductionAmount>0'>Visa银联双标卡专享价</i>  <strong><span>¥</span>{{goodsMap.sellPrice}}</strong></p>
            </dd>
        </dl>
        <div class='detailInput' v-if='goodsMap.rechargeAccountType == 1'>
            充值号码：<input type="text" v-model='addFrom.rechargeAccount' placeholder="请输入充值手机号码" >
        </div>
        <div class='detailInput' v-if='goodsMap.rechargeAccountType == 2'>
            充值账户：<input type="text" v-model='addFrom.rechargeAccount' placeholder="请输入充值账户" >
        </div>
        <div class='detailCont'>
            <h3>商品详情</h3>
            <div v-html="goodsMap.goodsIntroduction"></div>
        </div>
        <button class='buyBtn' @click='check'>立即购买</button>
    </div>
</template>

<script>
import {axiospost} from './js/utils.js';
export default {
    name: 'detail',
    data () {
        return {
            //token
            isLogin:false,token:0,checked:0,
            //page
            goodsId:0,activityId:0,goodsMap:[],orderData:[],
            //submit
            addFrom:{
                rechargeAccount:'',
            },
        }
    },
    
    created () {  
         
        
    },
    mounted(){ 
        //进入页面修改标题
        this.$emit('chageTitle','商品详情'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageBackPage','index');
        this.$emit('chageRight',false);
        //检查是否登录
        this.isLogin = this.$cookies.isKey('token');
        console.log('用户登录状态',this.isLogin)
        if(this.isLogin == true){ 
            //如果登录获取用户ID
            this.token = this.$cookies.get('token');
        }
        this.goodsId = sessionStorage.getItem('goodsId'); 
        this.activityId = sessionStorage.getItem('activityId'); 
        this.getGoodsDetail();
      
    },
    methods: {
         

        //获取商品详情
        getGoodsDetail(){ 
            if(this.goodsId==0){
                this.$toast('未找到商品ID，请重试');
                this.$router.push({name: 'index',});
                return false;
            }
            //获取商品详情
            let data = {
                'activityId':this.activityId,
                'goodsId':this.goodsId,
                'channelId':sessionStorage.getItem('channelId')
            };
            axiospost('/api/client/ypJyActivity/goodsDetail',data,{}).then(res=>{
                this.goodsMap = res.data.goodsMap;
                this.$emit('chageTitle',this.goodsMap.name+this.$addTitle);
            },error =>{
            
            })
            
        },
        //校验活动名额
        check(){
            if(this.isLogin == false){ 
                //如果没有登录
                this.$dialog.alert({
                    message: '请先登录',
                }).then(() => {
                    sessionStorage.setItem('fromPage','detail');
                    this.$router.push({name: 'login'});
                });
                return false;
            }
            if(this.goodsMap.rechargeAccountType!==undefined && this.goodsMap.rechargeAccountType!==null && this.addFrom.rechargeAccount == ''){
                this.$toast.fail({message: '请输入充值号码',forbidClick:true,duration:1000,overlay:true,});//错误提示
                return false;
            };
            //检查剩余名额
            let data = {
                'activityId':this.activityId,
                'goodsId':this.goodsId,
                'channelId':sessionStorage.getItem('channelId')
            };
            axiospost('/api/client/ypJyOrder/check',data).then(res=>{
                this.checked = res.data.data.checked
                if(this.checked==0){
                    this.btnBuy();
                }else if(this.checked==1){
                    this.$dialog.alert({
                        message: '不要太贪心哦，你已经买过了',
                    }).then(() => {

                    });
                }else if(this.checked==2){
                    this.$dialog.alert({
                        message: '本月第一次购买，可以下单',
                    }).then(() => {
                        this.btnBuy();
                    });
                }else{
                    this.$dialog.alert({
                        message: '你来晚了，名额都被抢光了去看看别的优惠吧',
                    }).then(() => {
                    });
                }
            },error =>{
                
            })

        },
        

        //下单
        btnBuy(){
            //下单
            let data = {
                'activityId':this.activityId,
                'goodsId':this.goodsId,
                'channelId':sessionStorage.getItem('channelId'),
                "activeId":this.activityId,
                "rechargeAccount":this.addFrom.rechargeAccount,
                "notifyMobile":this.addFrom.rechargeAccount,
                "merchantCode":"0002900M00002",
                "platformTp":"T0003"
            };
            axiospost('/api/client/ypJyOrder/submit',data).then(res=>{
                console.log(res.data.data)
                this.orderData = res.data.data
                this.$dialog.alert({
                    message: '下单成功，请尽快支付',
                }).then(() => {
                    sessionStorage.setItem('orderId',this.orderData.orderId);
                    this.$router.push({name: 'order',});
                });
            },error =>{
            
            })
            
        },

        
    },
  
  
}
</script>

<style scoped>

</style>
