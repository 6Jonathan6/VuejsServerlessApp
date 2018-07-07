import IoT from 'aws-iot-device-sdk'
import {getCurrentCredentials} from './cognito.js'
import {getCredentials} from './cognito.js'
import aws_exports from './aws-exports.js'


function startWebSocket(){
    return new Promise(function(resolve,reject){
        getCurrentCredentials()
            .then(function(info){
                if(info.authenticated){
                    console.log('starting web socket...')
                    getCredentials()
                        .then(function(credentials){
                            console.log('Credentials in websocket...')
                            const expiration = credentials.expiration
                            let clientId = 'mqtt-explorer-' + (Math.floor(Math.random() * 100000) + 1)
                            let mqttClient = IoT.device({
                                region: aws_exports.region,
                                host: aws_exports.iotEndpoint,
                                clientId: clientId,
                                protocol:'wss',
                                maximumReconnectTimeMs:8000,
                                debug:false,
                                accessKeyId:'',
                                secretKey:'',
                                sessionToken:''
                            })
                            mqttClient.updateWebSocketCredentials(
                                credentials.accessKeyId,
                                credentials.secretKey,
                                credentials.sessionToken
                                )
                
                            resolve({
                                mqttClient,
                                expiration
                            })
                        })
                        .catch(function(error){
                            console.log(error)
                            reject(error)
                        })

                } else {
                        reject({
                            error:'UnAuth'
                        })
                    }
            })
            .catch(function(error){
                console.log(error)
            })
    })
}
//new credentials for wss every 50 min
function updateCredenditials(){
    console.log('Updating Credentials for wss...')
    return new Promise(function(resolve,reject){
        getCurrentCredentials()
            .then(function(info){
                if(info.authenticated){
                    getCredentials()
                        .then(function(credentials){
                            resolve(credentials)
                        })
                        .catch(function(error){
                            reject(error)
                        })
                } else {
                    reject({
                        error:'UnAuth'
                    })
                }
            })
            .catch(function(error){
                console.log(error)
                reject(error)

            })
    })
}

export {
    startWebSocket,
    updateCredenditials
}