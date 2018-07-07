<template>
    <div class="form-conteiner" id="login">
        <form @submit.prevent="login">
            <fieldset>
                <legend>Log In</legend>
                <ul>
                    <li>
                        <label for="email">Email</label><br>
                        <input type="email" v-model="email"  placeholder="example@example.com" id="email" required>

                    </li>
                    <li>
                        <label for="password">Password</label><br>
                        <input type="password" v-model="password" id="password" placeholder="Password" required>
                    </li>
                    <li>
                        <input type="submit" value="Log In">
                    </li>
                </ul>
            </fieldset>
            <div class="help"><p
                v-show="isError">{{errorMessage}} &#9785;  
                <button @click.prevent="goTo" >Sign Up</button>
            </p>
            </div>
        </form>
    </div>
</template>
<script>
import {logIn} from '../../services/cognito.js'
import {logOut} from '../../services/cognito.js'
export default {
    data(){
        return{
            isError:false,
            errorMessage:'',
            password:'',
            email:''
        }
    },
    methods:{
        login: function(){
            const self = this
            logIn(this.email,this.password)
                .then(function(user){
                    console.log(user)
                    self.$emit('goTo','logged')
                })
                .catch(function(err){
                    self.isError = true
                    self.errorMessage = `Bad news: ${err.message}`
                    console.log(err)
                })

        },
        goTo:function(){
            this.$emit('goTo','signup')
        },
    }
}
</script>

<style scoped>
   @import url("../../styles/forms.css");
   @import url("../../styles/logOut.css");
</style>
