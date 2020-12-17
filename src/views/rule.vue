<template>
    <div class="wap-wrap ruleCont"  id="page" >
        <div class='ruleBox'>
            <div v-html="activityRules"></div>
        </div>
    </div>
</template>

<script>
import {axiospost} from './js/utils.js';
export default {
    name: 'rule',
    data () {
        return {
            activityRules:'',
        }
    },
    
    created () {
        
    },
    mounted(){ 
        //进入页面修改标题
        this.$emit('chageTitle','活动细则'+this.$addTitle);
        this.$emit('chageBack',true);
        this.$emit('chageTitleShow',true);
        this.$emit('chageBackPage','index');
        this.$emit('chageRight',false);
        //获取规则
        let data = {
            'activityTag':'yyg',
        };
        axiospost('/api/client/ypJyActivity/activityRules',data).then(res=>{
            this.activityRules = res.data.data.activityRules;
        },error =>{
        
        })

    },
    methods: {
        

    },
  
  
}
</script>

<style scoped>

</style>
