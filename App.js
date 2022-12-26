import React, { Component } from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
console.disableYellowBox = true;

import WelcomeScreen from "./src/screens/WelcomeScreen";
import UserRegistration from "./src/screens/UserRegistration";
import HomeScreen from "./src/screens/Home";
import LoginScreen from "./src/screens/UserLogin";
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
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        title: "Home Screen",
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
  },
  {
    initialRouteName: "WelcomeScreen",
  }
);

const App = createAppContainer(MainNavigator);

export default App;
