import React, { Component } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import ButtonComponent from "../components/ButtonComponent";

export default class VehicleScreen extends Component {
  constructor(props) {
    super(props);
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
              this.props.navigation.navigate("VehicleProfileScreen")
            }
          />

          <ButtonComponent
            icon="menuunfold"
            type="antdesign"
            text="My Claims"
            onPress={() => this.props.navigation.navigate("ClaimsScreen")}
          />

          <ButtonComponent
            icon="addfile"
            type="antdesign"
            text="Make A Claim"
            onPress={() => this.props.navigation.navigate("ClaimFormScreen")}
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
