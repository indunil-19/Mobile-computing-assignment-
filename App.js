import React, { Component } from "react";
import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
console.disableYellowBox = true;

import WelcomeScreen from "./src/screens/WelcomeScreen";

const MainNavigator = createStackNavigator(
  {
    WelcomeScreen: {
      screen: WelcomeScreen,
      navigationOptions: {
        title: "Welcome Screen",
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
