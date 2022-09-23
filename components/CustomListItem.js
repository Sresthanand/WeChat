import React, {useState, useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import { ListItem, Avatar } from 'react-native-elements';
import { db } from '../firebase';
import { collection, onSnapshot, orderBy, query} from "firebase/firestore";
import { doc } from 'firebase/firestore';

const CustomListItem = (props) => {
    const [chatMessages, setChatMessages] = useState([]);
    const[currentAvatar, setCurrentAvatar] = useState("");

    useEffect(() => {
        const docRef = doc(db, 'chats', props.id);
        const colRef = collection(docRef, "messages");
        const q = query(colRef, orderBy("timestamps", "desc"));
        const unsubscribe = onSnapshot(q, {
            next: (snapshot) => {
                setChatMessages(snapshot.docs[0]?.data()?.message)
                setCurrentAvatar(snapshot.docs[0]?.data()?.photoURL)
            },
            error: (err)=>{alert(err)}
        }, [db]);
        return unsubscribe;
    })
    return (
        <ListItem key = {props.id} bottomDivider onPress={()=> props.enterChat(props.id, props.chatName)}>
            <Avatar 
                rounded
                source = {{
                    uri: props.update ||
                    'https://randomuser.me/api/portraits/men/36.jpg',
                }}
            />
            <ListItem.Content>
                <ListItem.Title style = {{fontWeight: 'bold'}}>
                    {props.chatName}
                </ListItem.Title>
                <ListItem.Subtitle numberOfLines={1} ellipsizeMode='tail'>
                    {chatMessages}
                </ListItem.Subtitle>
            </ListItem.Content>
        </ListItem>
    )
}

export default CustomListItem

const styles = StyleSheet.create({})
