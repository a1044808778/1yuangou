<template>
    <div class="wap-wrap"  id="page" >
        <div class='orderListBox'>
            <h3 class='orderNav'>
                <span :class='{"cur":status == 0}' @click='changeStatus(0)'>全部</span>
                <span :class='{"cur":status == 1}' @click='changeStatus(1)'>待支付</span>
                <span :class='{"cur":status == 3}' @click='changeStatus(3)'>已完成</span>
                <span :class='{"cur":status == 4}' @click='changeStatus(4)'>已取消</span>
            </h3>
        </div>
        <div class='orderList'> 
            <div v-if='orderList.length == 0' style='text-align:center'>暂无订单</div>
            <dl v-for='(item,index) of orderList' :key='index' @click='goOrder(item.orderId,item.clientStatus)' class='orderDetailBox' :class='{"novisa":item.subtotal-item.settleMoney<=0}'>
                <dt><img :src="item.goodsImgUrl" /></dt>
                <dd> 
                    <h3>{{item.goodsName}}
                        <span class="clrPay" v-if='item.clientStatus == 1'>待支付</span>
                        <span class="clrOk" v-else-if='item.clientStatus == 3'>已完成</span>
                        <span class="clrCencel" v-else-if='item.clientStatus == 4'>已取消</span>
                        <span class="clrCencel" v-else-if='item.clientStatus == 6'>已退款</span>
                        <span class="clrCencel" v-else-if='item.clientStatus == 8'>退款中</span>
                        <span class="clrRed" v-else-if='item.clientStatus == 9'>支付失败</span>
                        <span class="clrRed" v-else-if='item.clientStatus == 10'>退款失败</span>
                        <span class="clrRed" v-else-if='item.clientStatus == 11'>充值失败</span>
                        <span v-else>未知</span>
                    </h3>
                    <h5>{{item.createTime}}<span>原价：{{item.subtotal}}</span></h5>
                    <p><i v-if='item.subtotal-item.settleMoney>0'>Visa银联双标卡专享价</i> <strong><span>¥</span>{{item.settleMoney}}</strong></p>
                </dd>
            </dl>
 
        </div>
    </div>
</template>

<script>
import {axiospost} from './js/utils.js';

export default {
    name: 'index',
    
    data () {
        return {
            //token
            isLogin:false,token:0,
            //pages
            status:0,orderList:[],
        }
    },
    
    created () {
         
    },
    mounted(){ 
        //进入页面修改标题
        this.$emit('chageTitle','我的订单'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageTitleShow',true);
        this.$emit('chageBackPage','index');
        this.$emit('chageRight',false);
        sessionStorage.setItem('activePage','myOrder'); 
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
        //获取分类
        this.getOrderList();
       
    },
    methods: {
        //更改订单状态
        changeStatus(status){
            this.status = status;
            this.getOrderList();
        },
        //获取订单列表
        getOrderList(){
            let data = {
                'channelId':sessionStorage.getItem('channelId'),
                'status':this.status,
            };
            axiospost('/api/client/ypJyOrder/list',data).then(res=>{
                this.orderList = res.data.data;
            },error =>{
            
            })

        },
        //前往订单详情
        goOrder(orderId,clientStatus){
            sessionStorage.setItem('orderId',orderId);
            // if(clientStatus==1){
            //     this.$router.push({name: 'pay',});
            // }else{
            //     this.$router.push({name: 'order',});
            // }
            
            this.$router.push({name: 'order',});
        },

    },
  
  
}
</script>

<style scoped>

</style>
