<template>
    <header>
        <div id="header-caption">
            <h1>
                Welcome to the Serverless Chat <sub>created by Jonathan P.</sub>
            </h1>
            <p>This is a personal project, I hope you have fun using it.If you want to see the code <a>visit my github</a></p>
            <table>
                <tr>
                    <td>
                        <button @click="goToLogIn" v-if="isButton" >Log In</button>
                        <button @click="logOut" v-if="!isButton" >Log Out</button>
                        
                    </td>
                    <td>
                        <button @click="goToSingUp" v-if="isButton" >Sing Up</button>
                    </td>
                </tr>
            </table>

        </div>
    </header>
</template>
<script>
import {getCurrentCredentials} from '../../services/cognito.js'
import {logOut} from '../../services/cognito.js'
export default {
    created(){
        const self = this
        getCurrentCredentials()
            .then(function(info){
                if(info.authenticated){
                    console.log('auth')
                    self.$emit('goTo','logged')
                    self.isButton = false 
                }
            })
            .catch(function(err){
                console.log(err)
            })
    },
    data:function(){
        return {
                isButton:true
            }
    },
    methods:{
        goToLogIn: function(evt){
            console.log('goToLogIn')
            this.$emit('goTo','login')
        },
        goToSingUp : function(evt){
            console.log('goToSingUp')
            this.$emit('goTo','signup')
        },
        logOut: function(evt){
            const self = this
            logOut()
                .then(function(data){
                    console.log('logOut')
                    setTimeout(function(){
                        window.location.reload()
                    },0)
                })
                .catch(function(err){
                    console.log(err)
                    self.isError = true
                    self.errorMessage = err.message
                })
        }
    }
}
</script>

<style scoped>
   @import url("../../styles/header.css");
</style>


