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
import {getUrlParam,getBrowser,InitTime} from './js/utils.js';
import jsNative from 'js-native';
export default {
    name: 'detail',
    data () {
        return {
            api:'https://testa.link2shops.com/vfuliApi',//api接口
            browser:'',channelId:'',
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
    //生命周期，当页面加载
    created () {
        var that = this;
        //清除定时器
        clearInterval(this.timerSendVerifyCode);this.timerSendVerifyCode = null;
        this.browser = getBrowser();
        //网页传参
        if(getUrlParam("channelId")!==null){
            sessionStorage.setItem('channelId',getUrlParam("channelId"));
            this.channelId=getUrlParam("channelId")
        }else if(sessionStorage.getItem('channelId')!==null){
            this.channelId=sessionStorage.getItem('channelId');
        }else{
            //如果没有渠道ID 默认赋值
            this.channelId = this.$DefaultChannelId;
            sessionStorage.setItem('channelId',this.channelId);
        };
        
    },
    mounted(){ 
        //进入页面修改标题
        this.$emit('chageTitle','商品详情'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageBackPage','index');
       //检查是否登录
        this.isLogin = this.$cookies.isKey('token');
        console.log('用户登录状态',this.isLogin)
        if(this.isLogin == true){ 
            //如果登录获取用户ID
            this.token = this.$cookies.get('token');
            this.userId = this.$cookies.get('userId');
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
            this.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
            this.$axios.post(this.api+'/api/client/ypJyActivity/goodsDetail', {
                'activityId':this.activityId,
                'goodsId':this.goodsId,
                'channelId':this.channelId
            }).then((res) => {
                console.log(res)
                this.$toast.clear(); //清除加载框
                if(res.data.code==0){
                    this.goodsMap = res.data.goodsMap;
                    this.$emit('chageTitle',this.goodsMap.name+this.$addTitle);
                }else{
                    this.$toast.clear(); //清除加载框
                    this.$toast.fail({message: res.data.msg,forbidClick:true,duration:1500,overlay:true,});//接口返回错误
                    
                    
                }
            }).catch((err) => {
                this.$toast.clear(); //清除加载框
                this.$toast.fail({message: res.data.msg,forbidClick:true,duration:1000,overlay:true,});//接口返回错误
                console.log(err)
            })
        },




        //校验活动名额
        check(){
            var that = this;
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
            this.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
            this.$axios.post(this.api+'/api/client/ypJyOrder/check', {
                'activityId':this.activityId,
                'goodsId':this.goodsId,
                'channelId':this.channelId
            },{headers: {'token': this.token}}).then((res) => {
                console.log(res)
                this.$toast.clear(); //清除加载框
                if(res.data.code==0){ 
                    this.checked = res.data.data.checked
                    if(this.checked==0){
                        this.btnBuy();
                    }else if(this.checked==1){
                        this.$dialog.alert({
                            message: '不要太贪心哦，你应该买过了',
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
                    this.$dialog.alert({
                        message: res.data.msg,
                    }).then(() => {
                    });
                }
            }).catch((err) => {
                this.$toast.clear(); //清除加载框
                this.$toast.fail({message: '加载失败请重试',forbidClick:true,duration:3000,overlay:true,});//接口返回错误
                console.log(err)
            })

        },
        

        //下单
        btnBuy(){
            //下单
            this.$toast.loading({message: '加载中...',duration: 0,forbidClick: true,loadingType: 'spinner',}); //加载框
            this.$axios.post(this.api+'/api/client/ypJyOrder/submit', {
                'activityId':this.activityId,
                'goodsId':this.goodsId,
                'channelId':this.channelId,
                "activeId":this.activityId,
                "rechargeAccount":this.addFrom.rechargeAccount,
                "notifyMobile":this.addFrom.rechargeAccount,
                "merchantCode":"0002900M00002",
                "platformTp":"T0003"
            },{headers: {'token': this.token}}).then((res) => {
                console.log(res)
                this.$toast.clear(); //清除加载框
                if(res.data.code==0){ 
                    this.orderData = res.data.data
                    this.$dialog.alert({
                        message: '下单成功，请尽快支付',
                    }).then(() => {
                        sessionStorage.setItem('orderId',this.orderData.orderId);
                        this.$router.push({name: 'order',});
                    });
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
                    this.$dialog.alert({
                        message: res.data.msg,
                    }).then(() => {
                    });
                }
            }).catch((err) => {
                this.$toast.clear(); //清除加载框
                this.$toast.fail({message: '加载失败请重试',forbidClick:true,duration:3000,overlay:true,});//接口返回错误
                console.log(err)
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
