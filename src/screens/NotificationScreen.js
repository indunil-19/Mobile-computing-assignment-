import React, { Component } from "react";
import { Text, View } from "react-native";

export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Your notifications </Text>
      </View>
    );
  }
}
