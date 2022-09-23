import React, {useLayoutEffect, useState, useEffect} from 'react'
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Button, TouchableOpacity } from 'react-native'
import { Avatar } from 'react-native-elements';
import CustomListItem from '../components/CustomListItem'
import { auth } from '../firebase';
import {AntDesign, SimpleLineIcons} from '@expo/vector-icons';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import {updateProfile } from "firebase/auth";
import * as ImagePicker from 'expo-image-picker';


const HomeScreen = ({navigation, route}) => {
    
    const[chat, setChat] = useState([]);
    const [update, setUpdate] = useState(auth?.currentUser?.photoURL);
    const signOutUser = () => {
        auth.signOut().then(() => {
            navigation.replace('Login')
        })
    }
    useEffect(() => {
        const colRef = collection(db, 'chats');
        const unsubscribe = onSnapshot(colRef, {
            next: (snapshot) => {
                setChat(snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data()
                })));
            },
            error: (error) => {
                alert(error);
            } 
        });
        return unsubscribe;
    },[])

    useLayoutEffect(() => {
        navigation.setOptions({
          title: 'WeChat',
          headerStyle: {backgroundColor: '#fff'},
          headerTintColor:'black',
          headerTitleStyle: {color:'black', marginLeft:60},
          headerLeft: () => (
              <View style = {{marginLeft: 20}}>
                  <TouchableOpacity style = {styles.avatar} activeOpacity={0.5}>
                  <SimpleLineIcons onPress={signOutUser} style = {{right: 20,marginTop: 2}} name="logout" size={24} color="red" />
                  <Avatar rounded source = {{uri: update}}/>
                  </TouchableOpacity>
              </View>
          ),
          headerRight: () => (
              <View style = {styles.upContainer}>
                  <TouchableOpacity activeOpacity={0.5}>
                      <AntDesign name = 'camerao' size = {24} color ='black' onPress={updateProfileim}/>
                  </TouchableOpacity>
                  <TouchableOpacity activeOpacity={0.5} onPress={() => {
                      navigation.navigate('AddChatScreen');
                  }}>
                      <SimpleLineIcons name = 'pencil' size = {24} color = 'maroon'/>
                  </TouchableOpacity>
              </View>
          )
        });
      }, [navigation]);

      const enterChat = (id, chatName) => {
          navigation.navigate('Chat', {
              id,
              chatName,
          });
      };
     const updateProfileim = async() => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [16, 16],
            quality: 1,
          });
          if (!result.cancelled) {
            setUpdate(result.uri);
          }
         updateProfile(auth.currentUser, {
             photoURL: {update}
         })
     }
    return (
        <SafeAreaView>
            <ScrollView style = {styles.container}>
                {chat.map(({id, data: {chatName}}) => (
                    <CustomListItem key = {id} 
                        id = {id} 
                        chatName = {chatName}
                        enterChat = {enterChat}
                        />
                ))}
                
            </ScrollView>
            </SafeAreaView>
    )
} 

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        height: '100%'
    },
    upContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 80,
        marginRight: 20
    },
    avatar:{
        marginRight: 50,
        flexDirection: 'row',
    }
})
