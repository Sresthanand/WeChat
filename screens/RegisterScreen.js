import React, {useState} from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import { StatusBar } from 'expo-status-bar'
import { auth } from '../firebase'
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";

const RegisterScreen = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    
    const register = () => {
        createUserWithEmailAndPassword(auth, email, password)
        .then(() => {
            updateProfile(auth.currentUser, {
                displayName: name,
                photoURL:
                imageUrl || 
                'https://randomuser.me/api/portraits/men/36.jpg',
            });
        })
        .catch((error) => {
        alert(error.message);
    });
    }
    return (
        <View style = {styles.container}>
            <StatusBar style = 'light'/>
            <Text style = {styles.textheader}>Create a Signal account</Text>
            <View style = {styles.inputContainer}>
                <TextInput 
                placeholder='Full Name'
                autoFocus
                type = 'text'
                value = {name}
                onChangeText={(text) => setName(text)}
                />
                <TextInput 
                placeholder='Email'
                type = 'email'
                value = {email}
                onChangeText={(text) => setEmail(text)}
                />
                <TextInput 
                placeholder='Password'
                type = 'password'
                secureTextEntry
                value = {password}
                onChangeText={(text) => setPassword(text)}
                />
                <TextInput 
                placeholder='Profile Picture URL (optional)'
                type = 'text'
                value = {imageUrl}
                onChangeText={(text) => setImageUrl(text)}
                />
            </View>
            <View style = {styles.button}>
            <Button title = "Register" onPress={register}/>
            </View>
            <View style = {{height: 100}}/>
        </View>
    )
}

export default RegisterScreen

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
    textheader: {
        marginBottom: 50,
        fontSize: 26,
        fontWeight: 'bold'
    },
    button: {
        width: 200,
        marginTop: 20,
    }
})
