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
import { auth } from "../../firebase";

export default class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  async componentDidMount() {
    //check is user is remembered
    await this.getRememberedUser();

    //user logged out event listener
    auth.onAuthStateChanged((user) => {
      if (!user) {
        this.forgetUser();
      }
    });
  }

  //check if user is previously remembered
  getRememberedUser = async () => {
    try {
      //make call to async storage
      const email = await AsyncStorage.getItem("EMAIL");
      const password = await AsyncStorage.getItem("PASSWORD");

      //user remembered
      if (email !== null) {
        //authorise user
        auth
          .signInWithEmailAndPassword(email, password)
          .then(() => {
            this.props.navigation.navigate("BottomTab");
          })
          .catch((error) => {});
      } else {
        console.info("User not remembered");
      }
    } catch (error) {
      console.log("async getRememberedUser error: " + error);
    }
  };

  //trigger forget user
  async forgetUser() {
    try {
      //empty async storage
      await AsyncStorage.removeItem("EMAIL");
      await AsyncStorage.removeItem("PASSWORD");
    } catch (error) {
      console.log("async forgetUser error: " + error);
    }
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
              text="Sign Up"
              icon="adduser"
              type="antdesign"
              onPress={() => this.props.navigation.navigate("UserRegistration")}
            />

            <View>
              <TouchableOpacity
                style={styles.button}
                onPress={() => this.props.navigation.navigate("LoginScreen")}
              >
                <Text style={styles.text}>Login</Text>
                <Icon name="arrowright" type="antdesign" color="#2E6CB5" />
              </TouchableOpacity>
            </View>
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
