<template>
    <div class="wap-wrap payDetailCheckWarp pb80"  id="page" >
        <div class=' payDetailBox'>
            <h3>{{goodsMap.name}}<span>X1</span></h3>
            <p><i v-if='goodsMap.reductionAmount>0'>Visa银联双标卡专享价</i></p>
            <h5> <strong class='pay noright'><span>¥</span>{{goodsMap.sellPrice - goodsMap.reductionAmount}}</strong> <span class='oprice'>原价：{{goodsMap.sellPrice}}</span> </h5>
        </div>
        <div class='detailInput' v-if='goodsMap.rechargeAccountType == 1 || goodsMap.rechargeAccountType == 2'>
            {{goodsMap.placeholder}}：<input type="text" v-model='rechargeAccount' :placeholder="goodsMap.placeholder" >
        </div>
        <div class='orderBtnBox'>
            <button class='buyBtn' @click='btnBuy'>提交订单</button>
        </div>
    </div>
</template>

<script>
import {InitTime,axiospost} from './js/utils.js';
export default {
    
    name: 'check',
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
            time:null,goodsMap:[],rechargeAccount:'',
        
        }
    },
    
    created () {
         
        
    },
    mounted(){ 
        var that = this;
        clearInterval(this.time);this.time = null;
       //进入页面修改标题
        this.$emit('chageTitle','确认订单'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageTitleShow',true);
        this.$emit('chageBackPage','detail');
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
        this.rechargeAccount = sessionStorage.getItem('rechargeAccount'); 
        this.goodsId = sessionStorage.getItem('goodsId'); 
        this.activityId = sessionStorage.getItem('activityId'); 
        if(this.goodsId==0){
            this.$toast('未找到商品ID，请重试');
            this.$router.push({name: 'index',});
            return false;
        }
        //获取商品详情
        let data2 = {
            'activityId':this.activityId,
            'goodsId':this.goodsId,
            'channelId':sessionStorage.getItem('channelId')
        };
        axiospost('/api/client/ypJyActivity/goodsDetail',data2,{}).then(res=>{
            this.goodsMap = res.data.goodsMap;
            this.$emit('chageTitle',this.goodsMap.name+this.$addTitle);
        },error =>{
        
        })
        
    },
    methods: {

         btnBuy(){
            //下单
            let data = {
                'activityId':this.activityId,
                'goodsId':this.goodsId,
                'channelId':sessionStorage.getItem('channelId'),
                "activeId":this.activityId,
                "rechargeAccount":this.rechargeAccount,
                "notifyMobile":this.rechargeAccount,
                "merchantCode":this.$merchantCode,
                "platformTp":"T0002"
            };
            axiospost('/api/client/ypJyOrder/submit',data).then(res=>{
                this.orderData = res.data.data;
                location.href = res.data.cashierUrl;
                // this.$dialog.alert({
                //     message: '下单成功，请尽快支付',
                // }).then(() => {
                // });
                // sessionStorage.setItem('orderId',this.orderData.orderId);
                // let data2 = {
                //     'orderId':this.orderData.orderId,
                //     "merchantCode":this.$merchantCode,
                //     'channelId':sessionStorage.getItem('channelId'),
                //     "platformTp":"T0002"
                // };
                // axiospost('/api/client/ypJyOrder/cashier',data2).then(res=>{
                //     //此处处理唤起成功逻辑
                //     location.href = res.data.data;

                // },error =>{
                
                // })
                // this.$router.push({name: 'pay',});
            },error =>{
            
            })
            
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
