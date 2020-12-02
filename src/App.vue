<template>
    <div id="app">
      <van-nav-bar fixed :title="title"  :left-arrow='backType==true' @click-left="onClickLeft" @click-right="onClickRight">
        <template #right>
          <van-icon name="wap-home-o" size="18" v-if='rightType==true' />
        </template>
      </van-nav-bar>
      <div class='mainApp'>
        <router-view  @chageTitle="chageTitle" @chageRight='chageRight' @chageBack="chageBack" @chageBackPage="chageBackPage"></router-view>
      </div>
    </div>
</template>

<script>
import index from './views/index'

export default {
    name: 'App',
        data(){
        return{
            title: 'visa一元购',backType:true,backPage:'',rightType:false,
        }
    },
  components: {
    index
  },
  methods: {
    chageBackPage(item) {
      this.backPage = item;
    },
    chageTitle(item) {
      this.title = item;
    },
    chageBack(type) {
      this.backType = type;
    },
    chageRight(type) {
      this.rightType = type;
    },
    onClickLeft() { 
      this.$router.push({name: this.backPage});
    },
    onClickRight() {
      this.$router.push({name: 'index'});

    },
     
  },
}
</script>

