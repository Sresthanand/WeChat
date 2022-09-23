import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View, Image, TextInput, Button } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { onAuthStateChanged, signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase'

const LoginScreen = ({navigation}) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    useEffect(()=>{
        const unsubscribe = onAuthStateChanged(auth, authUser => {
            if(authUser){
                navigation.replace('home');
            }
          });
          return unsubscribe;
    },[])
    const signIn = () => {
         signInWithEmailAndPassword(auth, email,password)
         .then(() => {
            onAuthStateChanged(auth, authUser=> {
                if(authUser){
                    navigation.replace('home');
                }
             });
         })
         .catch((error) => alert("Invalid Credentials"));
    }
    return (
        <View style = {styles.container}>
            <StatusBar style = 'light'/>
            <Image source = {{
                uri: 
                'https://blog.mozilla.org/internetcitizen/files/2018/08/signal-logo.png',
                }} style = {styles.img}
            />
            <View style= {styles.inputContainer}>
                <TextInput placeholder='Email' 
                autoFocus 
                type = 'email' 
                value = {email} 
                onChangeText={(text) => setEmail(text)}/>

                <TextInput 
                placeholder='Password' 
                secureTextEntry 
                type = 'password'
                value = {password}
                onChangeText={(text) => setPassword(text)}
                />
            </View>

            <View style = {styles.change1}>
            <Button title = 'Login' onPress={signIn}/>
            </View>
            <View style= {styles.change2}>
            <Button title = 'Register' onPress={()=> navigation.navigate('Register')}/>
            </View>
            <View style = {{height: 100}}/>
        </View>
    )
}

export default LoginScreen

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        backgroundColor: 'white',
    },
    inputContainer: {
        width: 300,
    },
    img: {
        width: 200,
        height: 200,
    },
    change1: {
        width: 200,
        marginTop: 10,
    },
    change2: {
        width: 200,
        marginTop: 10,
    },
})
