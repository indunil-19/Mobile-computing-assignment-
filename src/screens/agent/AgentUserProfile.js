import ButtonComponent from "../../components/ButtonComponent";
import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
  Alert,
} from "react-native";
import { Button } from "react-native-paper";
import TextField from "../../components/TextBox";
import { database, auth } from "../../../firebase";
import AsyncImage from "../../components/AsyncImage";
export default class AgentUserProfile extends Component {
  constructor(props) {
    super(props);
  }
  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    await database
      .ref(`/users/${auth.currentUser.uid}`)
      .once("value")
      .then((snapshot) => {
        this.setState({
          ID: snapshot.val().ID,
          email: snapshot.val().email,
          firstname: snapshot.val().firstname,
          lastname: snapshot.val().lastname,
          type: snapshot.val().type,
        });
      })
      .catch((error) => console.log(error));
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
          auth.signOut().then(() => console.log("User signed out!"));
          this.props.navigation.navigate("WelcomeScreen");
        },
      },
    ]);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require("../../../assets/agent.png")}
            alignSelf="center"
            style={styles.image}
          />
          <Text style={styles.logo}>User Details</Text>

          <TextField
            icon="user"
            type="antdesign"
            text={"ID"}
            value={this.state?.ID}
            editable={false}
          />
          <TextField
            icon="user"
            type="antdesign"
            text={"First name"}
            value={this.state?.firstname}
            editable={false}
          />
          <TextField
            icon="user"
            type="antdesign"
            text={"Last name"}
            value={this.state?.lastname}
            editable={false}
          />
          <TextField
            icon="calendar"
            type="antdesign"
            text={"Email"}
            value={this.state?.email}
            editable={false}
          />
          <TextField
            icon="calendar"
            type="antdesign"
            text={"Type"}
            value={this.state?.type}
            editable={false}
          />
        </View>

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
    backgroundColor: "#EFF1F3",
  },
  content: {
    flex: 1,
    alignSelf: "center",
    width: "90%",
    paddingTop: "10%",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 35,
    color: "#2E6CB5",
    marginBottom: 5,
    textAlign: "center",
  },
  image: {
    // flex: 2,
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
