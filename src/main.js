import Vue from 'vue'
import App from './App'
import router from './router';
import axios from 'axios' 
import 'vant/lib/index.css';
import 'lib-flexible/flexible'
import './views/css/info.css';
import {getUrlParam} from './views/js/utils.js';
import VueCookies from 'vue-cookies'
import Vant from 'vant';
axios.defaults.timeout = 30000;

//token过期时间 7天后过期
var time = 7;
//api地址
Vue.prototype.$mainApi = 'https://testa.link2shops.com/vfuliApi'; 
//默认渠道ID 页面没有带入渠道ID时使用
Vue.prototype.$DefaultChannelId = '73b34182aaed4559b56e5504801f557b'; 
//默认首页标题 
Vue.prototype.$title = 'Visa 一元购';
//子页面后添加的标题 不需要填空格
Vue.prototype.$addTitle = ' - Visa';











//网页传参
if(getUrlParam("channelId")!==null && getUrlParam("channelId")!==undefined){
    sessionStorage.setItem('channelId',getUrlParam("channelId"));
}else{
  //如果没有渠道ID 默认赋值
    sessionStorage.setItem('channelId',Vue.prototype.$DefaultChannelId);
};



Vue.use(Vant);
Vue.use(VueCookies);
Vue.prototype.$cookies.config(60 * 60 * 24 * time,'');
Vue.prototype.$axios = axios;
Vue.config.productionTip = false
new Vue({router,
  el: '#app',
  components: { App },
  template: '<App/>'
})
