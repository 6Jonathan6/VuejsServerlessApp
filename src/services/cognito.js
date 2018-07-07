import Amplify, { Auth, JS } from 'aws-amplify'
import AWS from 'aws-sdk'
import aws_exports from './aws-exports'

Amplify.configure({
    Auth:{
        identityPoolId: aws_exports.identityPoolId,
        region: aws_exports.region,
        userPoolId: aws_exports.userPoolId,
        userPoolWebClientId:aws_exports.userPoolWebClientId,
    }
})

function signUp(attributes){
    return Auth.signUp({
        username: attributes.email,
        password: attributes.password,
        attributes:{
            email: attributes.email,
            nickname: attributes.nickname
        }

    })

 }

 function confirmationCode(username,code){
    return Auth.confirmSignUp(username,code)
 }

 function logIn(username,password){
     return Auth.signIn(username,password)
 }

 function logOut(){
     return Auth.signOut()
 }
//promise
 function getUserAttributes(){
     return Auth.currentAuthenticatedUser()
 }

 function getCurrentSession(){
     return Auth.currentSession()
 }

 function getCurrentCredentials(){
     return Auth.currentCredentials()
 }

 function getCredentials(){ 
    console.log("starting get Credentials..")
    return new Promise(function (resolve,reject){
        getCurrentSession()
            .then(function(token){
                const idToken = token.idToken.jwtToken
            
                AWS.config.region = aws_exports.region; 
                AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                    IdentityPoolId: 'us-east-1:10ce77a1-3b20-41cb-8c77-585aa500c1b8',
                    Logins:{
                        'cognito-idp.us-east-1.amazonaws.com/us-east-1_V1NxChtjX': idToken
                    }
                })
                const lambda = new AWS.Lambda()
                lambda.invoke({
                        FunctionName:'getCredentials',
                        Payload:JSON.stringify({method:'credentials'})
                        }).promise()
                            .then(function(response){
                                console.log('Lambda response line 71')
                                const credentials = JSON.parse(response.Payload)
                                resolve(credentials)
                            })
                            .catch(function(error){
                                console.log(error)
                            })
            })
            .catch(function(error){
                reject(errr)
                console.log(error)
                })
        })
}


 export  {
     signUp,
     confirmationCode,
     logIn,
     logOut,
     getUserAttributes,
     getCurrentSession,
     getCurrentCredentials,
     getCredentials
    }

            