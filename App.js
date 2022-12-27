import React, { Component } from "react";
import { View } from "react-native";
import { Icon } from "react-native-elements";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import { createMaterialBottomTabNavigator } from "react-navigation-material-bottom-tabs";

import WelcomeScreen from "./src/screens/WelcomeScreen";
import UserRegistration from "./src/screens/UserRegistration";
import HomeScreen from "./src/screens/Home";
import LoginScreen from "./src/screens/UserLogin";
import VehicleRegistration from "./src/screens/VehicleRegistrationForm";
import { HomeNavigator } from "./src/screens/Home";
import UserProfile from "./src/screens/UserProfile";
import NotificationScreen from "./src/screens/NotificationScreen";
console.disableYellowBox = true;

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
  },
  {
    initialRouteName: "BottomTab",
  }
);

const App = createAppContainer(MainNavigator);

export default App;
