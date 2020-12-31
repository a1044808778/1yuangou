
<template>
    <div class="wap-wrap detailWarp"  id="page" >
        <dl class='detailBox'>
            <dt><img :src="goodsMap.entranceImg" /></dt>
            <dd>
                <h3 style='width:100%'>{{goodsMap.name}}</h3>
                <h5>原价：{{goodsMap.sellPrice}}</h5>
                <p> <i>指定Visa双标卡专享价</i>  <strong><span>¥</span>{{goodsMap.sellPrice - goodsMap.reductionAmount}}</strong></p>
            </dd>
        </dl>
        <div class='detailInput' v-if='goodsMap.rechargeAccountType == 1 || goodsMap.rechargeAccountType == 2'>
            {{goodsMap.placeholder}}：<input type="text" v-model='addFrom.rechargeAccount' :placeholder="goodsMap.placeholder" >
        </div>
        <div class='detailCont'>
            <h3>商品详情</h3>
            <div v-html="goodsMap.goodsIntroduction"></div>
        </div>
        
        <div class='orderBtnBox'>
            <button class='buyBtn' @click='check'>立即购买</button>
        </div>
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
        this.$emit('chageTitleShow',true);
        this.$emit('chageBackPage','index');
        this.$emit('chageRight',false);
        sessionStorage.setItem('activePage','detail');
        var fromPage = sessionStorage.getItem('fromPage');
        if(fromPage){
            this.$emit('chageBackPage',sessionStorage.getItem('fromPage'));
            sessionStorage.removeItem('fromPage');
        }else{
            this.$emit('chageBackPage','index');
        }
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
                this.$merchantCode = res.data.goodsMap.merchantCode;
                // this.$emit('chageTitle',this.goodsMap.name+this.$addTitle);
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
                        message: '本活动规定每位用户每月仅可购买一份一元购商品\n 本月您已参与过该活动 \n 期待您下月光临。',
                    }).then(() => {

                    });
                }else if(this.checked==2){
                    this.$dialog.alert({
                        message: `该类型商品在活动期间每个手机号\n<b>【全网】</b>仅限一次购买\n 请确保您之前未购买过该商品\n 若您参加过该活动，本次购买的商品将不会生效`,
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
            sessionStorage.setItem('rechargeAccount',this.addFrom.rechargeAccount);
            this.$router.push({name: 'checkOrder',});
            //下单
            // let data = {
            //     'activityId':this.activityId,
            //     'goodsId':this.goodsId,
            //     'channelId':sessionStorage.getItem('channelId'),
            //     "activeId":this.activityId,
            //     "rechargeAccount":this.addFrom.rechargeAccount,
            //     "notifyMobile":this.addFrom.rechargeAccount,
            //     "merchantCode":this.$merchantCode,
            //     "platformTp":"T0002"
            // };
            // axiospost('/api/client/ypJyOrder/submit',data).then(res=>{
            //     console.log(res.data.data)
            //     this.orderData = res.data.data
            //     this.$dialog.alert({
            //         message: '下单成功，请尽快支付',
            //     }).then(() => {
            //         sessionStorage.setItem('orderId',this.orderData.orderId);
            //         this.$router.push({name: 'order',});
            //     });
            // },error =>{
            
            // })
            
        },

        
    },
  
  
}
</script>

<style scoped>

</style>
