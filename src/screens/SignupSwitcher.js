import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  AsyncStorage,
  Image,
  ImageBackground,
} from "react-native";
import { Icon } from "react-native-elements";
import ButtonComponent from "../components/ButtonComponent";

export default class SignupSwitcher extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <ImageBackground
          source={require("../../assets/road-bkg.png")}
          style={styles.image}
        >
          <View style={{ flex: 1 }}></View>

          <View style={{ flex: 4 }}>
            <Image
              source={require("../../assets/logo-yellow-blue.png")}
              alignSelf="center"
              style={styles.logo}
            />
            <Text style={styles.header}>
              <Text style={{ color: "#EFC066" }}>D</Text>r
              <Text style={{ color: "#EFC066" }}>i</Text>v
              <Text style={{ color: "#EFC066" }}>i</Text>a
            </Text>
          </View>

          <View style={{ flex: 1 }}></View>

          <View style={{ flex: 3 }}>
            <ButtonComponent
              text="Agent Sign Up"
              icon="adduser"
              type="antdesign"
              onPress={() => this.props.navigation.navigate("AgentRegistration")}
            />
            <ButtonComponent
              text="Driver Sign Up"
              icon="adduser"
              type="antdesign"
              onPress={() => this.props.navigation.navigate("UserRegistration")}
            />
          </View>
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF1F3",
  },
  image: {
    flex: 1,
    resizeMode: "cover",
    justifyContent: "center",
  },
  header: {
    flex: 2,
    fontWeight: "bold",
    fontSize: 50,
    color: "#373E45",
    textAlign: "center",
  },
  logo: {
    flex: 1,
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  button: {
    alignSelf: "center",
    alignContent: "center",
    width: "70%",
    backgroundColor: "white",
    borderRadius: 400,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: "5%",
    borderWidth: 2,
    borderColor: "#2E6CB5",
  },
  text: {
    fontSize: 20,
    marginLeft: 20,
    color: "white",
    fontWeight: "normal",
    color: "#2E6CB5",
  },
});
