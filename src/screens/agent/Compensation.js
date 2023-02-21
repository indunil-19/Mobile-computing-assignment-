import React, { Component } from "react";
import { Text, View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Button } from "react-native-paper";
import FormInput from "../../components/FormInput";
import FormInputText from "../../components/FormInputTextArea";
import { database } from "../../../firebase";
export default class CompensationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cid: this.props.navigation.getParam("cid"),
      title: this.props.navigation.getParam("title"),
      uid: this.props.navigation.getParam("uid"),
      vid: this.props.navigation.getParam("vid"),
      description: "",
      compensation: "",
      pushToken: "",
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

    await database
      .ref(`/users/${this.state.uid}`)
      .on("value", async (snapshot) => {
        this.setState({
          pushToken: snapshot.val().token,
        });
      });
  }

  async sendPushNotification(expoPushToken) {
    var title = "Compensation Added";
    var body = `Compensation to your claim ${this.state.title} was added`;

    await database.ref(`/notiifications/${this.state.uid}/`).push({
      title: title,
      body: body,
    });
    const message = {
      to: expoPushToken,
      title: title,
      body: body,
    };

    await fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Accept-encoding": "gzip, deflate",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(message),
    });
  }

  async submit() {
    this.valid = false;

    // // check if all required fields are filled
    if (this.state.compensation != "" && this.state.description != "") {
      this.valid = true;
    } else {
      alert("All fields are required👋");
    }

    if (this.valid) {
      await database
        .ref(`/compensation/${this.state.cid}`)
        .set({
          description: this.state.description,
          compensation: this.state.compensation,
        })
        .then(async () => {
          await database
            .ref(`/claims/${this.state.vid}/${this.state.cid}`)
            .update({
              status: "finished",
            });
          this.sendPushNotification(this.state.pushToken);
        });
    }
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
          <Text style={styles.logo}>Add Compensation</Text>

          <FormInputText
            icon="payments"
            type="material"
            onChangeText={(val) => {
              this.setState({ description: val });
            }}
            placeholder="Description"
            value={this.state?.description}
          />
          <FormInput
            icon="payments"
            type="material"
            onChangeText={(val) => {
              this.setState({ compensation: val });
            }}
            placeholder="Estimated compensation"
            value={this.state?.compensation}
          />

          <Button
            icon={"content-save-all-outline"}
            mode="contained"
            style={{ marginBottom: 10, width: 200, alignSelf: "center" }}
            onPress={() => {
              Alert.alert("Confirmation", "Do you want to submit?", [
                {
                  text: "NO",
                  style: "cancel",
                },
                { text: "YES", onPress: () => this.submit() },
              ]);
            }}
          >
            Submit
          </Button>
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
