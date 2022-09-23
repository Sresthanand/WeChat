import React, {useEffect, useLayoutEffect, useState} from 'react'
import { StyleSheet, Text, Image,TouchableOpacity, View, SafeAreaView, KeyboardAvoidingView, ScrollView, TextInput, Keyboard, TouchableWithoutFeedback } from 'react-native'
import { Avatar } from 'react-native-elements';
import {AntDesign} from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import { auth, db } from '../firebase';
import { addDoc, collection, onSnapshot, orderBy, query, serverTimestamp} from "firebase/firestore";
import { doc } from 'firebase/firestore';
import { Entypo } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

const ChatScreen = ({navigation, route}) => {
    const [image, setImage] = useState("");
    const [document, setDocument] = useState("");
    const[input, setInput] = useState("");
    const[messages, setMessages] = useState([]);
    

    useLayoutEffect(()=>{
        navigation.setOptions({
            title: "Chat",
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View style = {styles.container}>
                    <Avatar rounded
                    source = {{uri: messages[0]?.data.photoURL || 'https://www.pngarts.com/files/3/Avatar-PNG-Download-Image.png'}}
                    />
                    <Text style = {{color: 'white', marginLeft: 10, fontWeight:'700'}}>{route.params.chatName}</Text>
                </View>
            ),
            headerRight: () => (
                <View style = {styles.rightContainer}>
                    <TouchableOpacity>
                        <AntDesign name = 'videocamera' size = {24} color = 'white'/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name = 'call' size = {24} color = 'white' />
                    </TouchableOpacity>
                </View>
            )
        })
    }, [navigation, messages])
    
    const sendMessage = () => {

        Keyboard.dismiss();
        const docRef = doc(db, 'chats', route.params?.id);
        const colRef = collection(docRef, "messages");
        addDoc(colRef, {
            timestamps: serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email:auth.currentUser.email,
            photoURL:auth.currentUser.photoURL,
            imageURL: image,
            documents: document,
        });
        setInput("");
        setImage("");
        setDocument("");
    };
        useEffect(() => {
            const docRef = doc(db, 'chats', route.params?.id);
            const colRef = collection(docRef, "messages");
            const q = query(colRef, orderBy("timestamps", "asc"));
            const unsubscribe = onSnapshot(q, {
                next: (snapshot) => {
                    setMessages(snapshot.docs.map(doc => ({
                        id: doc.id,
                        data: doc.data()
                    })));
                },
                error: (err)=>{}
            });
            return unsubscribe;
        }, [route])

        const imageSender = async () => {
            
            let result = await ImagePicker.launchImageLibraryAsync({
              mediaTypes: ImagePicker.MediaTypeOptions.All,
              allowsEditing: true,
              aspect: [4, 3],
              quality: 1,
            });
            if (!result.cancelled) {
              setImage(result.uri);
            }
          };
          const photoSelect = async() => {
            let result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [16, 16],
                quality: 1,
              });
              if (!result.cancelled) {
                setImage(result.uri);
              }
          };
        
    return (
        <SafeAreaView style = {{flex: 1, backgroundColor: 'white'}}>
            <StatusBar style = 'light'/>
            <KeyboardAvoidingView style = {styles.keyboardContainer} keyboardVerticalOffset={90}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <>
                <ScrollView style = {{paddingTop: 15}}>
                    {messages.map(({id, data}) => (
                        data.email === auth.currentUser.email ? (
                            <View key = {id} style = {styles.rec}>
                                <Avatar 
                                    position = 'absolute'
                                    rounded
                                    bottom= {-15}
                                    right = {-5}
                                    size = {30}
                                    source = {{uri : data.photoURL}}
                                />
                                <Text style = {styles.recieverText}>{data.message}</Text>
                                <Text style = {styles.senderName}>{data.document}</Text>
                                { data.imageURL? <Image style={styles.image} source={{uri:data.imageURL}}/> :null}
                                { data.documents? <Image style={styles.doc} source={{uri:data.documents}}/> :null}
                            </View>
                        ): (
                            <View key = {id}  style = {styles.sendr}>
                                <Avatar 
                                    position = 'absolute'
                                    rounded
                                    bottom= {-15}
                                    right = {-5}
                                    size = {30}
                                    source = {{uri : data.photoURL}}
                                />
                                <Text style = {styles.senderText}>{data.message}</Text>
                                <Text style = {styles.senderName}>{data.displayName}</Text>
                                <Text style = {styles.senderName}>{data.document}</Text>
                                { data.imageUrl? <Image style={styles.image} source={{uri:data.imageUrl}}/> :null}
                                { data.documents? <Image style={styles.doc} source={{uri:data.documents}}/> :null}
                            </View>
                        )
                    ))}
                </ScrollView>
                <View style = {styles.footer}>
                    <TextInput
                    value = {input} 
                    placeholder='Type Message' 
                    style = {styles.textInput}
                    onSubmitEditing={sendMessage}
                    onChangeText={(text) => setInput(text)}
                    />
                     <Entypo onPress={imageSender} style = {{marginHorizontal: 15}}name="attachment" size={24} color="#2B68E6" />
                     <AntDesign onPress = {photoSelect}style = {{padding: 20}}name="camera" size={24} color="#2B68E6" />
                    <TouchableOpacity 
                        activeOpacity={0.5} 
                        onPress={sendMessage}>
                            <View style = {styles.camera}>
                                <View style = {styles.pin}>
                            <Ionicons name = 'send' size={24} color='#2B68E6'/>
                            </View>
                            </View>
                    </TouchableOpacity>
                   
                </View>
                </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    rightContainer:{
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: 80,
        marginRight: 20,
    },
    keyboardContainer:{
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    textInput:{
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        backgroundColor: '#ECECEC',
        padding: 10,
        color: 'grey',
        borderRadius: 30,
    },
    rec: {
        padding: 15,
        backgroundColor: "#ECECEC",
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        position: "relative"
    },
    sendr:{
        padding: 15,
        backgroundColor: "#2868E6",
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        position: "relative"
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        top: 20,
        fontSize: 10,
        color: 'white',
    },
    senderText: {
        color: 'white',
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: 15,
    },
    recieverText: {
        color: 'black',
        fontWeight: '800',
        marginLeft: 10,
    },
    pin: {
        flexDirection: 'row'
    },
    image: {
        height: 200,
        width: 200,
    },
    doc: {
        height: 200,
        width: 200,
    }
})
