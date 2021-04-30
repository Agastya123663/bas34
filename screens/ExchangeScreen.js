import React,{Component} from 'react';
import {
  View,
  Text,
  TextInput,
  KeyboardAvoidingView,
  StyleSheet,
  TouchableOpacity,
  Alert} from 'react-native';
import db from '../config';
import firebase from 'firebase';
import MyHeader from '../components/MyHeader'
import { RFValue } from "react-native-responsive-fontsize";
import { SearchBar, ListItem, Input } from "react-native-elements";

export default class ExchangeScreen extends Component{
  constructor(){
    super();
    this.state ={
      userId : firebase.auth().currentUser.email,
      itemName:"",
      description:"",
      isItemRequestActive:'',
      requestedItemName:'',
      itemStatus:'',
      requestId:'',
      userDocId:'',
      docId:'',
      currencyCode:'',
      itemValue:''
    }
  }

  createUniqueId(){
    return Math.random().toString(36).substring(7);
  }

  addRequest = async (itemName,description)=>{
    var userId = this.state.userId
    var randomRequestId = this.createUniqueId()
    db.collection('requested_items').add({
        "user_id": userId,
        "item_name":itemName,
        "description":description,
        "request_id"  : randomRequestId,
        "item_status" : "requested",
        'item_value':this.state.itemValue,
         "date"       : firebase.firestore.FieldValue.serverTimestamp()

    })

    await  this.getItemRequest()
    db.collection('users').where("email_id","==",userId).get()
    .then()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        db.collection('users').doc(doc.id).update({
      isItemRequestActive: true
      })
    })
  })

    this.setState({
        itemValue:'',
        itemName :'',
        description : '',
        requestId: randomRequestId,
    })

    return Alert.alert("Item Requested Successfully")

  }


getData(){
  fetch("http://data.fixer.io/api/latest?access_key=b665aaa62471a4fcea7185430c91f0c1")
  .then(response=>{
    return response.json();
  }).then(responseData =>{
    var currencyCode = this.state.currencyCode
    var currency = responseData.rates.INR
    var value =  69 / currency
    console.log(value);
  })
  }

  receivedItems=(itemName)=>{
    var userId = this.state.userId
    var requestId = this.state.requestId
    db.collection('received_items').add({
      'user_id':userId,
      'item_name':itemName,
      'request_id':requestId,
      'itemStatus':'received'
    })
  }

  getIsItemRequestActive(){
    db.collection('users').where('email_id','==',this.state.userId).onSnapshot(querySnapshot=>{
      querySnapshot.forEach(doc=>{
        this.setState({
          isItemRequestActive:doc.data().isItemRequestActive,
          userDocId:doc.id,
          currencyCode: doc.data().currency_code
        })
      })
    })
  }

  getItemRequest=()=>{
    // getting the requested item
    var itemRequest = db.collection('requested_items').where('user_id','==',this.state.userId).get().then((snapshot)=>{
      snapshot.forEach((doc)=>{
        if(doc.data().item_status !== 'received')
        {
          this.setState({
            requestId:doc.data().request_id,
            requestedItemName:doc.data.item_name,
            itemValue : doc.data().item_value,
            itemStatus:doc.data().item_status,
            docId:doc.id
          })
        }
      })
    })
  }

  


  sendNotification=()=>{
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc)=>{
        var name = doc.data().first_name
        var lastName = doc.data().last_name
  
        db.collection('all_notifications').where('request_id','==',this.state.requestId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            var donorId  = doc.data().donor_id
            var itemName =  doc.data().item_name
  
            db.collection('all_notifications').add({
              "targeted_user_id" : donorId,
              "message" : name +" " + lastName + " received the item " + itemName ,
              "notification_status" : "unread",
              "item_name" : itemName
            })
          })
        })
      })
    })
  }

  componentDidMount(){
    this.getItemRequest()
    this.getIsItemRequestActive()
    this.getData()
    console.log(this.state.isItemRequestActive);
  }

  updateItemRequestStatus=()=>{
    db.collection('requested_items').doc(this.state.docId)
    .update({
      item_status : 'received'
    })
  
    db.collection('users').where('email_id','==',this.state.userId).get()
    .then((snapshot)=>{
      snapshot.forEach((doc) => {
        db.collection('users').doc(doc.id).update({
          isItemRequestActive: false
        })
      })
    })
  
  
  }

  

  render(){
    if(this.state.isItemRequestActive === true){
      return(
        <View style = {{flex:1,justifyContent:'center'}}>

          <View style={{borderColor:"#34b1eb",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text>Item Name</Text>
            <Text>{this.state.requestedItemName}</Text>
          </View>

          <View style={{borderColor:"#34b1eb",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Item Value </Text>
            <Text>{this.state.itemValue}</Text>
         </View>

          <View style={{borderColor:"#34b1eb",borderWidth:2,justifyContent:'center',alignItems:'center',padding:10,margin:10}}>
            <Text> Item Status </Text>
            <Text>{this.state.itemStatus}</Text>
          </View>

          <TouchableOpacity style={{borderWidth:1,borderColor:'#34b1eb',backgroundColor:"#34b1eb",width:300,alignSelf:'center',alignItems:'center',height:30,marginTop:30}}
          onPress={()=>{
            this.sendNotification()
            this.updateItemRequestStatus();
            this.receivedItems(this.state.requestedItemName)
          }}>
          <Text>I received the item </Text>
          </TouchableOpacity>
        </View>
      )
    }
  else
    {
    return(
        <View style={{flex:1,backgroundColor:"#87ceeb"}}>
          <MyHeader title="Put up your item for exchange" navigation={this.props.navigation} />
            <KeyboardAvoidingView style={styles.keyBoardStyle}>
              <Input
                style ={styles.formTextInput}
                placeholder={"Enter item name"}
                onChangeText={(text)=>{
                    this.setState({
                        itemName:text
                    })
                }}
                value={this.state.itemName}
              />

            <Input
              style={styles.formTextInput}
              placeholder ={"Item Value"}
              maxLength ={8}
              onChangeText={(text)=>{
                this.setState({
                  itemValue: text
                })
              }}
              value={this.state.itemValue}
            />

              <Input
                style ={[styles.formTextInput,{height:RFValue(300)}]}
                multiline
                numberOfLines ={8}
                placeholder={"Description"}
                onChangeText ={(text)=>{
                    this.setState({
                        description:text
                    })
                }}
                value ={this.state.description}
              />
              <TouchableOpacity
                style={styles.button}
                onPress={()=>{this.addRequest(this.state.itemName,this.state.description),this.setState({
                  isItemRequestActive : true
                })}}
                >
                <Text>Put this item for exchange </Text>
              </TouchableOpacity>
            </KeyboardAvoidingView>
        </View>
    )
  }
}
}

const styles = StyleSheet.create({
  keyBoardStyle : {
    flex:1,
    alignItems:'center',
    justifyContent:'center'
  },
  formTextInput:{
    width:"75%",
    height:RFValue(35),
    alignSelf:'center',
    borderColor:'white',
    borderRadius:RFValue(10),
    borderWidth:1,
    marginTop:RFValue(20),
    padding:10,
  },
  button:{
    width:"75%",
    height:RFValue(25),
    justifyContent:'center',
    alignItems:'center',
    borderRadius:RFValue(10),
    backgroundColor:"#eaf8fe",
    shadowColor: "#000",
    marginTop:RFValue(20)
    },
  }
)