import React from 'react'
import {createDrawerNavigator} from 'react-navigation-drawer'
import {AppTabNavigator} from '../components/AppTabNavigator'
import CustomSideDrawerMenu from '../components/CustomSideBarMenu'
import SettingsScreen from '../screens/SettingsScreen'
import MyBarterScreen from "../screens/MyBarterScreen"
import NotificationsScreen from "../screens/NotificationsScreen"

import {Icon} from 'react-native-elements';

export const AppDrawerNavigator = createDrawerNavigator({
    Home:{
        screen:AppTabNavigator,
        navigationOptions:{
            drawerIcon : <Icon name="home" type ="fontawesome5" />
          }
    },
    MyBarters : {
        screen : MyBarterScreen,
        navigationOptions:{
            drawerIcon : <Icon name="gift" type ="font-awesome" />,
            drawerLabel : "My Donations"
          }

      },
    Settings:{
        screen:SettingsScreen,
        navigationOptions:{
            drawerIcon : <Icon name="settings" type ="fontawesome5" />,
            drawerLabel : "Settings"
          }
    },
    Notification:{
        screen:NotificationsScreen,
        navigationOptions:{
            drawerIcon : <Icon name="bell" type ="font-awesome" />,
            drawerLabel : "Notifications"
          }
    }
    
},
{
    contentComponent:CustomSideDrawerMenu
},
{
    initialRouteName:'Home'
}

)

