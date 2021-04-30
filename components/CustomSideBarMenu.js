import React from 'react'
import { View, StyleSheet, Text, FlatList,TouchableOpacity } from 'react-native';
import {DrawerItems} from 'react-navigation-drawer'
import {Avatar} from 'react-native-elements';
import * as ImagePicker from 'expo-image-picker'
import * as Permissions from 'expo-permissions'
import db from '../config';
import firebase from 'firebase'
import { Icon } from "react-native-elements";
import { RFValue } from "react-native-responsive-fontsize";

export default class CustomSideDrawerMenu extends React.Component{
    state={
        userId:firebase.auth().currentUser.email,
        image:'#',
        name:'',
        docId:'',
   
      }
  
      selectPicture=async()=>{
        const{cancelled,uri} = await ImagePicker.launchImageLibraryAsync({
          mediaTypes:ImagePicker.MediaTypeOptions.All,
          allowsEditing:true,
          aspect:[4,3],
          quality:1
        })
        if(!cancelled)
        {
          this.uploadImage(uri,this.state.userId)
        }
      }
  
      uploadImage=async(uri,imageName)=>{
        var response = await fetch(uri);
        var blob = await response.blob()
        var ref = firebase.storage().ref().child('user_profiles/' + imageName);
  
        return ref.put(blob).then((response)=>{
          this.fetchImage(imageName)
        })
      }
  
      fetchImage=(imageName)=>{
        var storageRef = firebase.storage().ref().child('user_profiles/' + imageName);
        // get the download url
        storageRef.getDownloadURL().then((url)=>{
          this.setState({
            image:url
          })
          .catch((error)=>{
            this.setState({
              image:'#'
            })
          })
        })
      }
  
      getUserDetails(){
        db.collection("users").where('email_id','==', userId).get()
        .then((snapshot)=>{
          snapshot.forEach((doc) => {
            this.setState({
              name  :doc.data().first_name + " " + doc.data().last_name,
              docId:doc.id,
              image:doc.data().image
            })
          })
        })
      }
  

    render(){
        return(
            <View style={{flex:1}}>
              
              <View style={{flex:0.5,alignItems:'center',backgroundColor:'orange'}}>
                <Avatar 
                  rounded
                  source={{uri:this.state.image}}
                  size='xlarge'
                  onPress={()=>this.selectPicture()}
                  containerStyle = {styles.imageContainer}
                  showEditButton
                />

                <Text style={{fontWeight:'100',fontSize:20,paddingTop:10}}>{this.state.name}</Text>
            </View>

                <View style={styles.drawerItemsContainer}>
                    <DrawerItems {...this.props}/>
                </View>

                <View style={styles.logOutContainer}>
                    <TouchableOpacity style={styles.logOutButton} onPress={()=>{
                        this.props.navigation.navigate('WelcomeScreen')
                        firebase.auth().signOut()
                    }}>

                  <Icon
                      name="logout"
                      type="antdesign"
                      size={RFValue(20)}
                      iconStyle={{ paddingLeft: RFValue(10) }}
                  />

                        <Text style={{fontWeight:"bold",fontSize:20,textAlign:"center",color:'#7bc9c7'}}>Log Out</Text>
                    </TouchableOpacity>
                </View>

            </View>
        )
    }
}

const styles = StyleSheet.create({
    drawerItemsContainer:{
        flex:0.7,
    },
    logOutContainer:{
        flex:0.2,
        justifyContent:'flex-end',
        paddingBottom:30,
    },
    logOutButton:{
        height:25,
        width:'100%',
        padding:11,
        justifyContent:'center'
    }
})