import React, { Component } from "react";
import { Text, View } from "react-native";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>You are logged in.. </Text>
      </View>
    );
  }
}
