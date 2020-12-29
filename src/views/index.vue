<template>
    <div class="wap-wrap indexwarp"  id="page" >
        <div class='visaBanner'>
            <img class='bannerImg' src="./images/visa.png" alt="">
            <div class='userBox'>
                <p v-if='isLogin==true' @click='logOut'><img src="./images/userNoLogin.png" /><span>{{mobile | fuserId}} 用户</span></p>
                <p v-else @click='goLogin'><img src="./images/userNoLogin.png" /><span style='color:#999;'><i class='notLogin' >请登录</i></span></p>
            </div>
            <div class='helpBox' @click='goRule' title='活动说明'>活动说明</div>
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
import {filtersUserId,axiospost,axiosget} from './js/utils.js';
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
            //login
            isLogin:false,userId:0,token:0,mobile:'',
            //page
            catagoryList:[],goodsList:[],curId:null,activityId:0,
        }
    },
    
    created () {
         
    },
    mounted(){
        //进入页面修改标题
        this.$emit('chageTitle',this.$title);
        this.$emit('chageBack',false);
        this.$emit('chageTitleShow',false);
        this.$emit('chageBackPage','index');
        this.$emit('chageRight',false);
        //检查是否登录
        this.isLogin = this.$cookies.isKey('token');
        console.log('用户登录状态',this.isLogin)
        if(this.isLogin == true){ 
            //如果登录获取用户ID
            this.token = this.$cookies.get('token');
            this.userId = this.$cookies.get('userId');
            this.mobile = this.$cookies.get('mobile');
        };
       //获取分类
       this.getCatagory();
       
    },
    methods: {
        //logOut
        logOut(){
            this.$dialog.confirm({
                title: '确认登出',
                message: '确认登出',
            })
            .then(() => {
                let data = {
                }
                axiosget('/api/client/user/loginout',data,{}).then(res=>{
                    //删除token
                    this.$cookies.remove('token');
                    this.$cookies.remove('userNo');
                    this.$cookies.remove('userId');
                    this.$cookies.remove('pendPayOrderNum');
                    this.isLogin = this.$cookies.isKey('token');
                    this.$dialog.alert({
                        message: '退出登录成功',
                    }).then(() => {
                       
                    });
                },error =>{
                    
                })
                // on confirm
            })
            .catch(() => {
                // on cancel
            });
        },
        //切换分类
        changeCatagory(id){
            this.curId = id;
            this.getGoods();
        },
        //获取分类
        getCatagory(){
            let data = {
                'activityTag':'yyg',
                'parentId':'',
            }
            axiospost('/api/client/ypJyActivity/catagory',data,{}).then(res=>{
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
  
}
</script>

<style scoped>

</style>
