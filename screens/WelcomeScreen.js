import React from 'react';
import { StyleSheet, Text, View,TextInput,TouchableOpacity, Alert,Modal,KeyboardAvoidingView,ScrollView} from 'react-native';
import db from "../config"
import firebase from 'firebase'
import { RFValue } from "react-native-responsive-fontsize";
import { SearchBar, ListItem, Input } from "react-native-elements";

export default class WelcomeScreen extends React.Component{
    constructor(){
        super();
        this.state={
            emailId : "",
            password : "",
            isModalVisible : 'false',
            firstName : "",
            lastName : "",
            contact : "",
            address : "",
            confirmPassword : "",
            currencyCode:''
        }
    }

    userSignUp=(emailId,password,confirmPassword)=>{
        if(password!== confirmPassword)
        {
            return Alert.alert("Password doesn't match with confirm password")
        }
        else
        {
        firebase.auth().createUserWithEmailAndPassword(emailId,password).then((response)=>{
            console.log("The user  has been added")
            return Alert.alert("The user  has been added")
            
        }).catch((function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
            return Alert.alert(errorMessage);
        }),
        db.collection("users").add({
            first_name : this.state.firstName,
            last_name : this.state.lastName,
            address : this.state.address,
            contact:this.state.contact,
            emailId:this.state.emailId,
            password:this.state.password,
            confirmPassword:this.state.confirmPassword,
            isItemRequestActive : false,
            currency_code:this.state.currencyCode
        })
        )
        }
    }

    userLogin=(emailId,password)=>{
        firebase.auth().signInWithEmailAndPassword(emailId,password).then((response)=>{
            console.log("Successfull login")
            this.props.navigation.navigate('HomePage')
            return Alert.alert("Successfull login")
            
            
        }).catch((function(error){
            var errorCode = error.code;
            var errorMessage = error.message;
            console.log(errorMessage)
            return Alert.alert(errorMessage);
        }))
    }

    showSignUpModal=()=>{
        return(
            <Modal 
            animationType="fade" 
            transparent={true}
            visible={this.state.isModalVisible}>
                <View style={styles.modalContainer}>
                    <ScrollView style={{width:'100%'}}>
                        <KeyboardAvoidingView style={styles.KeyboardAvoidingViewStyle}>
                            <Text style={styles.modalTitle}>Sign Up !!!!</Text>

                            <Input
                                style={styles.modalTextInput}
                                placeholder="First Name"
                                maxLength={12}
                                onChangeText={(text)=>{
                                this.setState({
                                    firstName:text
                                })
                            }}/>

                            <Input
                                style={styles.modalTextInput}
                                placeholder ={"Country currency code"}
                                maxLength ={8}
                                onChangeText={(text)=>{
                                this.setState({
                                    currencyCode: text
                                })
                                }}
                            />

                            <Input
                                style={styles.modalTextInput}
                                placeholder="Last Name"
                                maxLength={12}
                                onChangeText={(text)=>{
                                    this.setState({
                                        lastName:text
                                    })
                            }}/>

                            <Input
                                style={styles.modalTextInput}
                                placeholder="Contact"
                                maxLength={10}
                                keyboardType="numeric"
                                onChangeText={(text)=>{
                                this.setState({
                                    contact:text
                                })
                            }}/>

                            <Input
                                style={styles.modalTextInput}
                                placeholder="Address"
                                multiline={true}
                                onChangeText={(text)=>{
                                this.setState({
                                    address:text
                                })
                            }}/>

                        <Input 
                            style={styles.modalTextInput} 
                            placeholder="Email id" 
                            keyboardType="email-address" 
                            onChangeText={(text)=>{
                            this.setState({
                                emailId : text
                            })
                        }}/>

                        <Input 
                            style={styles.modalTextInput}
                            placeholder="Password" 
                            secureTextEntry={true} 
                            onChangeText={(text)=>{
                            this.setState({
                                password:text
                        })
                        }}/>

                        <Input 
                            style={styles.modalTextInput} 
                            placeholder="Confirm Password" 
                            secureTextEntry={true} 
                            onChangeText={(text)=>{
                            this.setState({
                                confirmPassword:text
                            })
                        }}/>

                    <View style={styles.modalBackButton}>
                        <TouchableOpacity 
                        style={styles.signUpButton} 
                        onPress={()=>{
                            this.userSignUp(this.state.emailId,this.state.password,this.state.confirmPassword);
                        }}>
                            <Text style={styles.signUpButtonText}>Sign Up</Text>
                        </TouchableOpacity>
                    </View>

                    <View>
                        <TouchableOpacity 
                        style={styles.cancelButton} 
                        onPress={()=>{
                            this.setState({"isModalVisible" : false})
                        }}>
                            <Text style={{color:'#006994'}}>Cancel</Text>
                        </TouchableOpacity>
                    </View>

                        </KeyboardAvoidingView>
                    </ScrollView>
                </View>
            </Modal>
        )
    }

    render(){
        return(
            <View style={styles.container}>

                <View style={{justifyContent:"center",alignItems:"center"}}>
                    { this.showSignUpModal()}
                </View>
                <View>
                    <Text style={styles.text}>Barter System </Text>
                </View>
                
                <View>
                    <Input style={styles.inputBox} placeholder="Enter Email id" keyboardType="email-address" onChangeText={(text)=>{
                        this.setState({
                            emailId : text
                        })
                    }}/>

                    <Input style={styles.inputBox} placeholder="Enter Password" secureTextEntry={true} onChangeText={(text)=>{
                        this.setState({
                            password:text
                        })
                    }}/>

                    <TouchableOpacity style={[styles.button,{marginBottom:20,marginTop:20}]} onPress={()=>{
                        this.userLogin(this.state.emailId,this.state.password)
                    }}>
                        <Text style={styles.btText}>Login</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.button} onPress={()=>{
                        this.showSignUpModal()
                    }}>
                        <Text style={styles.btText}>Sign Up</Text>
                    </TouchableOpacity>
                </View>

                
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        alignItems:"center",
        backgroundColor:'#aec6cf',
        justifyContent:"center"
    },
    text:{
        fontSize:RFValue(65),
        fontWeight:'bold',
        paddingBottom:30,
        color:'#f5f2d0'
    },
    inputBox:{
        width:RFValue(300),
        height:RFValue(40),
        borderBottomWidth:1.5,
        borderColor:'#B6977D',
        fontSize:20,
        margin:10,
        paddingLeft:10
    },
    button:{
        width:RFValue(300),
        height:RFValue(50),
        justifyContent:"center",
        alignItems:"center",
        borderRadius:RFValue(25),
        backgroundColor:'#B6977D',
        
    },
    btText:{
        color:"#f5f2d0",
        fontSize:RFValue(25),
        fontWeight:'bold'
    },
    KeyboardAvoidingViewStyle:{
        flex:1,
        justifyContent:"center",
        alignItems:"center"
    },
    modalTitle:{
        justifyContent:"center",
        alignSelf:"center",
        fontSize:RFValue(30),
        color:'#006994',
        margin:RFValue(50),
        fontWeight:"bold"
    },
    modalContainer:{
        flex:1,
        borderRadius:RFValue(20),
        justifyContent:"center",
        alignItems:"center",
        backgroundColor:'#e3ddd3',
        marginRight:RFValue(30),
        marginLeft:RFValue(30),
        marginTop:RFValue(80),
        marginBottom:RFValue(80)
    },
    modalTextInput:{
        width:'75%',
        height:RFValue(35),
        alignSelf:"center",
        borderColor:"#006994",
        borderRadius:RFValue(10),
        borderWidth:1,
        marginTop:RFValue(20),
        padding:10
    },
    signUpButton:{
        width:RFValue(200),
        height:RFValue(40),
        alignItems:"center",
        justifyContent:"center",
        borderWidth:1,
        borderRadius:RFValue(10),
        marginTop:30
    },
    signUpButtonText:{
        color:'#5c54a4',
        fontSize:RFValue(15),
        fontWeight:"bold",
        justifyContent:"center",
        alignItems:"center"
    },
    cancelButton:{
        width:RFValue(200),
        height:RFValue(30),
        justifyContent:"center",
        alignItems:"center",
        marginTop:RFValue(5)
    }

})