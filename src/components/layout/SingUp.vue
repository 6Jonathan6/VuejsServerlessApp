<template>
    <div class='form-conteiner'>
        <form v-if="successfulSignUp" @submit.prevent="confirmUser" class="confirmform">
            <fieldset>
                <legend>User <br> Confir<wbr>mation</legend>
                <ul>
                    <li>
                        <label for="confirmationCode">Write the confirmation code you were sent to your email</label><br>
                        <input type="number" v-model="code" id="confirmationCode" max="999999">
                    </li>
                    <li>
                        <input v-show="isConfirmActive" type="submit" value="Confirm">
                    </li>
                </ul>
            </fieldset>
        </form>

        <form v-if="!successfulSignUp" @submit.prevent="submit" role="form" id="signup">
            <fieldset>
                <legend>Sign Up</legend>
                <ul>
                    <li>
                        <label for="nickname">Nickname</label><br>
                        <input type="text" v-model="nickname" placeholder="Nickname" id="nickname"  maxlength="10" required>

                    </li>
                    <li>
                        <label for="email">Email <small>We suggest gmail emails</small> </label><br>
                        <input type="email" v-model="email" id="email"  placeholder="example@example.com" required>
                    </li>
                    <li>
                        <label for="password">Password: {{passwordCheck.length}}</label><br>
                        <input type="password" v-model="password" id="password" placeholder="Password"   minlength="8" required>

                    </li>
                    <li>
                        <input type="submit" value="Sign Up" v-show="isActive">
                    </li>
                </ul>
            </fieldset>
        </form>
        <div class="help">
        <p v-show="isError">{{errorMessage}}</p>
        <ul v-show="passwordCheck.ok" class="help">
            <li><strong>We are having troubles with hotmail and outlook</strong></li>
            <li><strong>Password must have uppercase</strong></li>
            <li><strong>Password must have lowercase</strong></li>
            <li><strong>Password must have numbers</strong></li>
            <li><strong>Password must be at least 8 characters</strong></li>
        </ul>
        </div>
    </div>
</template>
<script>
import {signUp} from '../../services/cognito.js'
import {confirmationCode} from '../../services/cognito.js'

export default {
    data(){
        return {
            nickname:'',
            email:'',
            password:'',
            isActive:false,//specs of password
            successfulSignUp:false, //  to confirm form
            errorMessage:'',//in case of an error happend through sign up process
            isError:false, //it's hidden after 5 secs
            code:null,
            sub:'',
            username:'',
            isConfirmActive:true
        }
    },
    methods:{
        submit:function(evt){
            const self  = this
            this.isActive = false
            const attributes ={
                nickname:this.nickname,
                email: this.email,
                password:this.password
            }
            signUp(attributes)

                .then(function(data){
                    console.log(data.userSub)
                    evt.target.reset()
                    self.successfulSignUp = true
                    self.sub = data.userSub
                    self.username = data.user.username

                })
                .catch(function(err){
                    self.password = ''
                    self.email = ''
                    console.log(err)
                    self.errorMessage = err.message
                    self.isError = true
                    setTimeout(function() {
                        self.isError = false
                    }, 5000);
                })
        },
        confirmUser:function(evt){
            const self = this
            self.isError = false
            self.isConfirmActive = false
            confirmationCode(self.username,self.code)
                .then(function(data){
                    console.log(data)
                    evt.target.reset()
                    self.$emit('goTo','login')
                })
                .catch(function(err){
                    console.log(err)
                    self.errorMessage = err.message
                    self.isError = true
                    evt.target.reset()
                    self.isConfirmActive = true


                })
        }

       
    },
    computed:{
        passwordCheck(){
            const regexUpper = /.*[A-Z].*/
            const regexLower = /.*[a-z].*/
            const regexNumber = /.*[1-9].*/
            let length = this.password === '' ? 0 : this.password.length
            if(regexUpper.test(this.password) && regexLower.test(this.password) && regexNumber.test(this.password) && length >= 8){
                this.isActive = true
                return {
                    ok:false,
                   length: length
                   }

            } else {
                this.isActive = false
                return {
                   ok:true,
                   length:length
                }
                    }
        }
    }
}
</script>

<style scoped>
    @import url("../../styles/forms.css");
</style>
