<template>
    <div id="chat" class="chatDiv">
        <button @click.prevent="logout" id=logout>Log Out </button>
        <div class="conversation">
            <div>
            <p v-for="message in messages">
                {{message}}
            </p>
            </div>
            </div>
        <div class="sendMessage">
            <textarea name="message" id="messageArea" form="messageForm" v-model="msg"></textarea>
            <form id="messageForm" @submit.prevent="sendMessage">
                <fieldset>
                    <ul>
                        <li>
                            <input type="submit" value="Send">
                        </li>
                    </ul>
                </fieldset>
            </form>
        </div>
    </div>
</template>
<script>
import {getCurrentSession} from '../../services/cognito.js'
import{getUserAttributes,connecMQtt, publish} from '../../services/cognito.js'
import{startWebSocket, updateCredenditials} from '../../services/websocket.js' 
import aws_exports from '../../services/aws-exports'
import {logOut} from '../../services/cognito.js'
export default {
    created(){
        const self = this
            startWebSocket()
                .then(function(response){
                    console.log(response)
                    self.mqttClient = response.mqttClient
                    self.mqttClient.subscribe('chat/')
                    self.mqttClient.on('connect',self.connected)
                    self.mqttClient.on('reconnect',self.reconnect)
                    self.mqttClient.on('message',self.writeMessage)

                })
                .catch(function(err){
                    console.log(err)
                })
    },
    mounted(){
        const self = this
        setTimeout(function(){
            updateCredenditials()
                .then(function(credentials){
                     self.mqttClient.updateWebSocketCredentials(
                                credentials.accessKeyId,
                                credentials.secretKey,
                                credentials.sessionToken
                                )
                .catch(function(error){
                    console.log(err)
                })
            })
        },3000000)
    },
    data(){
        return{
            mqttClient:null,
            messages:[],
            msg:'',

        }
    },
    methods:{
        sendMessage:function(evt){

            this.mqttClient.publish('chat/',JSON.stringify({message:this.msg}))
            this.msg = ''
        },
        connected:function(){
            console.log('mqtt Connected')
            this.messages.push('Welcome to THE great Serverlesschat')
        },
        reconnect:function(){
            console.log('mqtt reconnecting')
        },
        writeMessage: function(topic, payload){
            this.messages.push(JSON.parse(payload.toString()).message)
        },
        logout: function(evt){
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

        
        
    },
}
</script>
<style scoped>
    @import url('../../styles/chat.css');
</style>