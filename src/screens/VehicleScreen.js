import React, { Component } from "react";
import { Text, View, StyleSheet, Image, Alert } from "react-native";
import ButtonComponent from "../components/ButtonComponent";
import { auth, database } from "../../firebase";
export default class VehicleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vid: this.props.navigation.getParam("vid"),
    };
  }

  async deleteVehicle() {
    await database
      .ref(`/claims/${this.state.vid}`)
      .once("value")
      .then((snapshot) => {
        if (snapshot != null) {
          database
            .ref(`/vehicles/${auth.currentUser.uid}/${this.state.vid}`)
            .remove()
            .then(() => {
              this.props.navigation.navigate("HomeScreen");
            })
            .catch((e) => console.warn(e));
        } else {
          alert(
            "You can't remove this vehicle, since you already have got claims"
          );
        }
      })
      .catch((error) => console.log(error));
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 3 }}>
          <Image
            source={require("../../assets/driver.png")}
            style={styles.image}
            alignSelf="center"
          />
        </View>

        <View style={{ flex: 4 }}>
          <ButtonComponent
            text="Vehicle Profile"
            icon="user"
            type="antdesign"
            onPress={() =>
              this.props.navigation.navigate("VehicleProfileScreen", {
                vid: this.state.vid,
              })
            }
          />

          <ButtonComponent
            icon="menuunfold"
            type="antdesign"
            text="My Claims"
            onPress={() =>
              this.props.navigation.navigate("ClaimsScreen", {
                vid: this.state.vid,
              })
            }
          />

          <ButtonComponent
            icon="addfile"
            type="antdesign"
            text="Make A Claim"
            onPress={() =>
              this.props.navigation.navigate("ClaimFormScreen", {
                vid: this.state.vid,
              })
            }
          />

          <ButtonComponent
            icon="delete"
            type="antdesign"
            text="Delete vechicle profile"
            onPress={() => {
              Alert.alert("Confirmation", "Do you want to submit?", [
                {
                  text: "NO",
                  style: "cancel",
                },
                { text: "YES", onPress: () => this.deleteVehicle() },
              ]);
            }}
          />
        </View>
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
