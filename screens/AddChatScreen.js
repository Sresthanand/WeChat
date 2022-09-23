import React, {useLayoutEffect, useState} from 'react'
import { StyleSheet, Text, View, TextInput, Button } from 'react-native'
import { AntDesign } from '@expo/vector-icons';
import { db } from '../firebase';
import { addDoc, collection} from "firebase/firestore";

const AddChatScreen = ({navigation}) => {

    const[input, setInput] = useState("");
    useLayoutEffect(() => {
        navigation.setOptions({
          title: 'Add a New Chat',
        });
      }, [navigation]);
      
      const createChat = async () => {
        await addDoc(
           collection(db,'chats'), {
               chatName: input,
           } 
        )
        .then(() => {
            navigation.goBack();
        })
        .catch((error) => alert(error));
    }
    return (
        <View style = {styles.container}>
            <View style = {styles.insideImg}>
            <AntDesign name="wechat" size={24} color="black" />
            <TextInput 
                placeholder='Enter a chat name'
                value = {input}
                onChangeText={(text) => setInput(text)}
            />
            </View>
            <View style = {styles.btn}>
            <Button disabled = {!input} onPress = {createChat} title = 'Create new Chat'/>
            </View>
        </View>
    )
}

export default AddChatScreen

const styles = StyleSheet.create({
    insideImg: {
        flexDirection: 'row',
    },
    btn:{
        marginTop: 30
    }
    
})
