import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import HomeScreen from '../screens/HomeScreen';
import AddChatScreen from '../screens/AddChatScreen';
import ChatScreen from '../screens/ChatScreen';

const Stack = createNativeStackNavigator();
const globalScreenOptions = {
    headerStyle: {backgroundColor: '#2C6BED'},
    headerTitleStyle: {color: 'white'},
    headerTintColor: 'white',
}
const Navigation = () => {
    return (
        <NavigationContainer>
            <Stack.Navigator screenOptions = {globalScreenOptions}>
                <Stack.Screen 
                    name="Login" 
                    component={LoginScreen} 
                    options = {{title: 'Welcome to WeChat'}}
                />
                <Stack.Screen 
                    name="Register" 
                    component={RegisterScreen} 
                    options = {{title: 'New User'}}
                />
                <Stack.Screen 
                    name="home" 
                    component={HomeScreen} 
                />
                <Stack.Screen 
                    name="AddChatScreen" 
                    component={AddChatScreen} 
                />
                <Stack.Screen 
                    name="Chat" 
                    component={ChatScreen} 
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigation

const styles = StyleSheet.create({})
