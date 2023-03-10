import React, { Component } from "react";
import { Text, View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Button } from "react-native-paper";
import FormInput from "../../components/FormInput";
import FormInputText from "../../components/FormInputTextArea";
import { database } from "../../../firebase";

export default class DriverCompensationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cid: this.props.navigation.getParam("cid"),
      description: "",
      compensation: "",
    };
  }
  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    await database
      .ref(`/compensation/${this.state.cid}`)
      .on("value", async (snapshot) => {
        this.setState({
          description: snapshot.val().description,
          compensation: snapshot.val().compensation,
        });
      });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require("../../../assets/gps.png")}
            alignSelf="center"
            style={styles.image}
          />
          <Text style={styles.logo}>Claim Compensation</Text>

          <FormInputText
            icon="car"
            type="antdesign"
            onChangeText={(val) => {
              this.setState({ description: val });
            }}
            placeholder="Description"
            value={this.state?.description}
            editable={false}
          />
          <FormInput
            icon="car"
            type="antdesign"
            onChangeText={(val) => {
              this.setState({ compensation: val });
            }}
            placeholder="Estimated compensation"
            value={this.state?.compensation}
            editable={false}
          />
        </View>
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
    marginBottom: 40,
    textAlign: "center",
  },
  back: {
    color: "#373E45",
    fontSize: 15,
    textAlign: "center",
  },
  image: {
    // flex: 2,
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  modalView: {
    position: "absolute",
    bottom: 2,
    width: "100%",
    height: "70%",
    backgroundColor: "#b8e6ff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
