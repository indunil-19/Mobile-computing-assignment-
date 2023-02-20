import React, { Component } from "react";
import { Text, View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Button } from "react-native-paper";
import FormInput from "../../components/FormInput";
import FormInputText from "../../components/FormInputTextArea";
import ImageGallarySingle from "../../components/ImagePickerSingle";
import uuid from "react-native-uuid";
import { uploadToFirebase, uriToBlob } from "../../services/ImageService";
import { auth, database } from "../../../firebase";
// import Toast from "react-native-simple-toast";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import * as TaskManager from "expo-task-manager";
const LOCATION_TRACKING = "location-tracking";
let vid = "";
let cid = "";
export default class ClaimFormScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vid: this.props.navigation.getParam("vid"),
      title: `Claim at ${this.getDate()}`,
      description: "",
      modal: false,
      imageNew: "",
      status: "started",
    };
    vid = this.state.vid;
  }

  async startLocationTracking() {
    await Location.startLocationUpdatesAsync(LOCATION_TRACKING, {
      accuracy: Location.Accuracy.Highest,
      timeInterval: 360000,
      distanceInterval: 0,
    });
    const hasStarted = await Location.hasStartedLocationUpdatesAsync(
      LOCATION_TRACKING
    );
    console.log("tracking started?", hasStarted);
  }

  getDate() {
    var currentdate = new Date();
    var datetime =
      currentdate.getDate() +
      "/" +
      (currentdate.getMonth() + 1) +
      "/" +
      currentdate.getFullYear() +
      " @ " +
      currentdate.getHours() +
      ":" +
      currentdate.getMinutes() +
      ":" +
      currentdate.getSeconds();
    return datetime;
  }

  async config() {
    let res = await Permissions.askAsync(Permissions.LOCATION);
    if (res.status !== "granted") {
      console.log("Permission to access location was denied");
    } else {
      console.log("Permission to access location granted");
    }
  }

  async submit() {
    //location permission
    this.config();

    this.valid = false;

    // check if all required fields are filled
    if (this.state?.imageNew) {
      this.valid = true;
    } else {
      alert("Accident Image is required👋");
    }

    if (this.valid) {
      const id = uuid.v4();
      uriToBlob(this.state?.imageNew).then((blob) => {
        uploadToFirebase(blob, id);
      });

      await database
        .ref(`claims/${this.state.vid}/`)
        .push({
          title: this.state.title,
          description: this.state.description,
          image: id,
          date: new Date().toString(),
          status: "started",
          uid: auth.currentUser.uid,
        })
        .then((r) => {
          cid = r.key;
          this.startLocationTracking();
          // Toast.show("Claim is added sucessfull.", Toast.LONG);
          this.props.navigation.navigate("ClaimsScreen", {
            vid: this.state.vid,
          });
        });
    }
  }
  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.content}>
            <Image
              source={require("../../../assets/gps.png")}
              alignSelf="center"
              style={styles.image}
            />
            <Text style={styles.logo}>Make Your Claim</Text>
            <FormInput
              icon="car"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ title: val });
              }}
              placeholder="title"
              value={this.state?.title}
            />
            <FormInputText
              icon="car"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ description: val });
              }}
              placeholder="Description"
              value={this.state?.description}
            />
            <Button
              icon={"upload"}
              mode="contained"
              style={{ marginBottom: 10 }}
              onPress={() => this.setState({ modal: true })}
            >
              Upload Accident Image
            </Button>

            <ImageGallarySingle
              modal={this.state.modal}
              closeModal={() => {
                this.setState({ modal: false });
              }}
              setImage={(val) => {
                this.setState({ imageNew: val });
              }}
              image={this.state.imageNew}
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
      </ScrollView>
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

TaskManager.defineTask(LOCATION_TRACKING, async ({ data, error }) => {
  if (error) {
    console.log("LOCATION_TRACKING task ERROR:", error);
    return;
  }
  if (data) {
    const { locations } = data;

    const newCoordinate = {
      latitude: locations[0].coords.latitude,
      longitude: locations[0].coords.longitude,
    };

    console.log(vid, cid);
    await database
      .ref(`/location/${cid}`)
      .once("value")
      .then(async (snapshot) => {
        if (snapshot.val()?.locations?.length) {
          const locations = snapshot.val()?.locations;
          locations.push(newCoordinate);
          if (snapshot.val()?.locations?.length < 30) {
            await database
              .ref(`/location/${cid}`)
              .update({ locations: locations });
          } else {
            await Location.stopLocationUpdatesAsync("location-tracking");
          }
        } else {
          await database
            .ref(`/location/${cid}`)
            .update({ locations: [newCoordinate] });
        }
      })
      .catch((error) => console.log(error));
  }
});
