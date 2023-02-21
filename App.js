import React, { Component } from "react";
import { View, AsyncStorage } from "react-native";
import { Icon } from "react-native-elements";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import { HomeNavigator } from "./src/screens/Home";
import { AgentHomeNavigator } from "./src/screens/agent/AgentHome";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import UserRegistration from "./src/screens/UserRegistration";
import HomeScreen from "./src/screens/Home";
import LoginScreen from "./src/screens/UserLogin";
import VehicleRegistration from "./src/screens/VehicleRegistrationForm";
import UserProfile from "./src/screens/UserProfile";
import NotificationScreen from "./src/screens/NotificationScreen";
import SignupSwitcher from "./src/screens/SignupSwitcher";
import AgentHomeScreen from "./src/screens/agent/AgentHome";
import AgentRegistrationScreen from "./src/screens/agent/AgentRegistration";
import AgentNotificationScreen from "./src/screens/agent/AgentNotification";
import AgentUserProfile from "./src/screens/agent/AgentUserProfile";
import { database } from "./firebase";

console.disableYellowBox = true;

async function x() {
  return 5;
}

const BottomTab = createMaterialBottomTabNavigator(
  {
    HomeScreen: {
      screen: HomeNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon name="home" color={tintColor} />
            </View>
          );
        },
      },
    },
    UserProfile: {
      screen: UserProfile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon name="user" type="feather" color={tintColor} />
            </View>
          );
        },
      },
    },
    NotificationScreen: {
      screen: NotificationScreen,
      navigationOptions: {
        tabBarBadge: 0,
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon name="notifications" type="ionicons" color={tintColor} />
            </View>
          );
        },
      },
    },
  },
  {
    initialRouteName: "HomeScreen",
    activeColor: "#74A4D7",
    inactiveColor: "white",
    barStyle: {
      backgroundColor: "#373E45",
      elevation: 10,
    },
  }
);

const AgentBottomTab = createMaterialBottomTabNavigator(
  {
    HomeScreen: {
      screen: AgentHomeNavigator,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon name="home" color={tintColor} />
            </View>
          );
        },
      },
    },
    UserProfile: {
      screen: AgentUserProfile,
      navigationOptions: {
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon name="user" type="feather" color={tintColor} />
            </View>
          );
        },
      },
    },
    NotificationScreen: {
      screen: AgentNotificationScreen,
      navigationOptions: {
        tabBarBadge: 4,
        tabBarIcon: ({ tintColor }) => {
          return (
            <View>
              <Icon name="notifications" type="ionicons" color={tintColor} />
            </View>
          );
        },
      },
    },
  },
  {
    initialRouteName: "HomeScreen",
    activeColor: "#74A4D7",
    inactiveColor: "white",
    barStyle: {
      backgroundColor: "#373E45",
      elevation: 10,
    },
  }
);

const MainNavigator = createStackNavigator(
  {
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: {
        title: "Welcome Screen",
        headerShown: false,
      },
    },
    UserRegistration: {
      screen: UserRegistration,
      navigationOptions: {
        title: "User Registration",
        headerShown: false,
      },
    },

    LoginScreen: {
      screen: LoginScreen,
      navigationOptions: {
        title: "Login Screen",
        headerShown: false,
      },
    },
    BottomTab: {
      screen: BottomTab,
      navigationOptions: {
        headerShown: false,
      },
    },
    VehicleRegistration: {
      screen: VehicleRegistration,
      navigationOptions: {
        title: "Vehicle Registration Screen",
        headerShown: false,
      },
    },
    SignupSwitcher: {
      screen: SignupSwitcher,
      navigationOptions: {
        title: "Selecting User Type",
        headerShown: false,
      },
    },
    AgentRegistration: {
      screen: AgentRegistrationScreen,
      navigationOptions: {
        title: "Agent Registration Screen",
        headerShown: false,
      },
    },

    AgentBottomTab: {
      screen: AgentBottomTab,
      navigationOptions: {
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "WelcomeScreen",
  }
);

const App = createAppContainer(MainNavigator);

export default App;
