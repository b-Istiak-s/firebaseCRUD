import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View ,TextInput,Button, Alert, FlatList,TouchableOpacity} from 'react-native';
import { doc, setDoc,addDoc,collection,query,orderBy,onSnapshot,getDocs, updateDoc,deleteDoc } from "firebase/firestore"; 
import {database} from './config/firebase.jsx';
import {useState,useLayoutEffect} from 'react';
import DialogInput from 'react-native-dialog-input';

export default function App() {
  const [username,setUsername] = useState([]);
  const [email,setEmail] = useState("");
  const [data,setData]=useState([]);

  // addData
  function create(){
    addDoc(collection(database, "users"), {
      username,
      email
    }).then(()=>{
      Alert.alert("Submitted");
    }).catch((error)=>{
      Alert.alert(error);
    });
  }
  
  // getData
  useLayoutEffect(() => {

    const collectionRef = collection(database, 'users');
    const q = query(collectionRef);

    const unsubscribe = onSnapshot(q, querySnapshot => {
        console.log('snapshot');
        // getting data from database and adding those data to setMessages
        setData(
            querySnapshot.docs.map(doc => ({
            id: doc.data().id,
            username: doc.data().username,
            email: doc.data().email
            }))
        );
    });
    return unsubscribe;
  }, []);

// some constants for setting data and and hiding/visibling DialogInput
  const [visible, setVisible] = useState(false);
  const [id, setId] = useState("");
  const [emailToUpdate, setEmailToUpdate] = useState("");
  // updateData
  function updateData(){
    updateDoc(doc(database,"users",id),{
      email: emailToUpdate
    }).then(()=>{
      Alert.alert("updated");
    }).catch((error)=>{Alert.alert(error);});
  }
  // deleteData
  function deleteData(){
    setId("6JSsZdVjGixsVXlpNWRL");
    deleteDoc(doc(database,"users",id))
    .then(()=>{
      Alert.alert("deleted");
    });
  }
  

  return (
    <View style={styles.container}>
      <TextInput  value={username} style={styles.textInput}
        onChangeText={(val)=>{setUsername(val)}} placeholder='Enter username'/>
      <TextInput value={email} style={styles.textInput}
        onChangeText={(val)=>{setEmail(val)}} placeholder='Enter Email'/>
      <Button title='Submit' onPress={create}/>
      <DialogInput 
          isDialogVisible={visible}
          title={"Update"}
          message={"Message for Feedback"}
          hintInput ={"Enter email for "+id}
          submitInput={ (inputText) => {
              setEmailToUpdate(inputText),
              setVisible(false);
              updateData();
          }}
          closeDialog={() => setVisible(false)}>
      </DialogInput>
      <FlatList
          data={data}
          keyExtractor={(item)=>item.id}
          renderItem={({item})=>(
            <TouchableOpacity onPress={()=>{
              setVisible(true);
              setId("6JSsZdVjGixsVXlpNWRL");
              
            }}
              onLongPress={()=>deleteData()}
            >
              <Text style={styles.item}> {item.email}</Text>
            </TouchableOpacity>
          )}
        />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textInput:{
    borderBottomColor:'#ddd',
    borderBottomWidth:1,
    padding:5,
    margin:5
  }
});
