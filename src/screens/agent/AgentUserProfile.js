import React, { Component } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import ButtonComponent from "../../components/ButtonComponent";
import { auth } from "../../../firebase";
export default class AgentUserProfile extends Component {
  constructor(props) {
    super(props);
  }
  //on log out request
  logout() {
    //prompt confirmation from user
    //displays modal
    Alert.alert("Logout", "Are you sure you would like to logout?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "Logout",
        onPress: () => {
          console.info("EVENT: " + auth.currentUser.email + " logged out");
          auth.signOut();
          this.props.navigation.navigate("WelcomeScreen");
        },
      },
    ]);
  }
  render() {
    return (
      <View style={styles.container}>
        <ButtonComponent
          icon="logout"
          type="antdesign"
          text="Logout"
          onPress={() => this.logout()}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
  },
  image: {
    flex: 1,
    height: 150,
    width: 150,
    resizeMode: "contain",
  },
});
