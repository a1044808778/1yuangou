<template>
    <div class="wap-wrap"  id="page" >
        <div class='visaBanner'>
            <img class='bannerImg' src="./images/visa.png" alt="">
            <div class='userBox'>
                <p v-if='isLogin==true'><img src="./images/user.png" /><span>{{userId  | fuserId}}</span></p>
                <p v-else @click='goLogin'><img src="./images/user.png" /><span style='color:#999'>未登录</span></p>
            </div>
            <div class='helpBox' @click='goRule' title='活动细则'></div>
        </div>
        <div class='btnVisaOrder' @click='goOrder'>我的订单 ></div>
        <div class='visaNav'>
            <span :class='{"cur":curId == item.id}' v-for='(item,index) of catagoryList' :key='index' @click='changeCatagory(item.id)' >{{item.name}}</span>
        </div>
        <div class='proList visaProList'>
            <dl v-for='(item,index) of goodsList' :key='index' @click='goDetali(item.id)'>
                <dt><img :src="item.entranceImg" /></dt>
                <dd>
                    <h3>{{item.name}}</h3>
                    <p>{{item.subtitle}}</p>
                </dd>
            </dl>
        </div>
    </div>
</template>

<script>
import {getUrlParam,getBrowser,filtersUserId,axiospost} from './js/utils.js';

import QRCode from 'qrcodejs2';
import jsNative from 'js-native';
export default {
    props: ['title'],
    filters: { 
        fuserId(date) {
            return filtersUserId(date);
        },
    },
    name: 'index',
    data () {
        return {
            api:'https://testa.link2shops.com/vfuliApi',//api接口
            browser:'',channelId:'',
            //login
            isLogin:false,userId:0,token:0,
            //page
            catagoryList:[],goodsList:[],curId:null,activityId:0,
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
        this.$emit('chageTitle',this.$title);
        this.$emit('chageBack',false);
        this.$emit('chageBackPage','index');
       //检查是否登录
        this.isLogin = this.$cookies.isKey('token');
        console.log('用户登录状态',this.isLogin)
        if(this.isLogin == true){ 
            //如果登录获取用户ID
            this.token = this.$cookies.get('token');
            this.userId = this.$cookies.get('userId');
        };
       //获取分类
       this.getCatagory();
       
    },
    methods: {
        //切换分类
        changeCatagory(id){
            this.curId = id;
            this.getGoods();
        },
        //获取分类
        getCatagory(){
            var data = {
                'activityTag':'yyg',
                'parentId':'',
            }
            axiospost('/api/client/ypJyActivity/catagory',data,{}).then(res=>{
                console.log(res)
                console.log(res.data.data)
                this.$toast.clear(); //清除加载框
                this.catagoryList = res.data.data;
                if(this.curId == null){
                    this.curId = this.catagoryList[0].id;
                    this.getGoods();
                }
            },error =>{
                
            })
          
        },
        
        //获取商品列表
        getGoods(){
            let data = {
                'activityTag':'yyg',
                'catagoryId':this.curId,
            };
            axiospost('/api/client/ypJyActivity/goodsList',data,{}).then(res=>{
                this.activityId = res.data.data.activityId;
                this.goodsList = res.data.data.goodsList;
            },error =>{
                
            })

            
        },

        //前往商品详情
        goDetali(id){
            sessionStorage.setItem('goodsId',id);
            sessionStorage.setItem('activityId',this.activityId);
            this.$router.push({name: 'detail',});
        },
        //前往规则页面
        goRule(){
            this.$router.push({name: 'rule',});
        },
        //前往登录页面
        goLogin(){
            this.$router.push({name: 'login',});
        },
        //前往订单页面
        goOrder(){
            if(this.isLogin == true){ 
                //如果登录
            this.$router.push({name: 'myorder',});
            }else{
                this.$toast('请先登录');
                return false;
            };
        },
        


 
       
       
    },
  
    beforeDestroy() {
        
    }, 
    destroyed() {
       
    },
  
}
</script>

<style scoped>

</style>
