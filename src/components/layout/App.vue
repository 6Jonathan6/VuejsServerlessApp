<template>
<!--svlc => serverlesschat-->
  <div id="app">
    <svlc-header @goTo="hgoTo" v-if="!isLogged"></svlc-header>
    <svlc-sign-up @goTo="hgoTo" v-show="showsignup" v-if="!isLogged"></svlc-sign-up>
    <svlc-log-in  @goTo="hgoTo" v-show="showlogin" v-if="!isLogged"></svlc-log-in>
    <svlc-chat v-if="isLogged"></svlc-chat>
    <!-- <router-view @submit="submit2"></router-view> -->
  </div>
</template>

<script>
import Header from '@/components/layout/Header.vue'
import SignUpVue from '@/components/layout/SingUp.vue'
import LogIn from '@/components/layout/LogIn.vue'
import Chat from '@/components/layout/Chat.vue'
export default {
  name: 'app',
  components:{
    svlcHeader:Header,
    svlcSignUp:SignUpVue,
    svlcLogIn:LogIn,
    svlcChat: Chat
    },
  data(){
    return{
      showsignup:false,
      showlogin:false,
      isLogged:false,
    }
  },
  methods:{
    confirmation(username){
      console.log(username)
      this.showlogin = true
      window.location.href = '#login'
      this.showsignup=false
    },
    hgoTo(id){
      console.log('fatherGoTo')
      if(id == 'login'){
        this.showlogin =true
        this.showsignup = false
        setTimeout(function(){
          window.location.href = '#login' 

        },0)
      } else if(id == 'signup'){
        this.showlogin =false
        this.showsignup = true
        setTimeout(function(){
          window.location.href = '#signup'

        },0)
      } else if(id = 'logged'){
        this.isLogged = true
        this.showlogin = false
        setTimeout(function(){
          window.location.href ='#chat'
        })
      }
    }
    
    
  }
}
</script>
<style >
  #app{
    margin: 0;
    padding: 0;
    height:auto
  }

</style>

