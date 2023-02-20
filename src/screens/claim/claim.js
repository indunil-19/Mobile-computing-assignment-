import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Alert,
  RefreshControl,
} from "react-native";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
  Callout,
} from "react-native-maps";
import { Button } from "react-native-paper";
import FormInput from "../../components/FormInput";
import FormInputText from "../../components/FormInputTextArea";
import ImageGallarySingle from "../../components/ImagePickerSingle";
import * as Location from "expo-location";
import uuid from "react-native-uuid";
import { uploadToFirebase, uriToBlob } from "../../services/ImageService";
import { auth, database } from "../../../firebase";
// import Toast from "react-native-simple-toast";
import AsyncImage from "../../components/AsyncImage";
import TextField from "../../components/TextBox";
import ImageGallary from "../../components/ImagePicker";
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
export default class ClaimScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cid: this.props.navigation.getParam("cid"),
      vid: this.props.navigation.getParam("vid"),
      title: "",
      description: "",
      modal: false,
      image: "",
      status: "",
      damages: [],
      damagesNew: [],
      lastUpdate: "",
      location: {},
      location_title: "",
      location_description: "",
    };
    this.uid = auth.currentUser.uid;
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

  async componentDidMount() {
    this.loadData();
  }

  isLocked() {
    let date = this.state.date;
    if (date) {
      var tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      if (tomorrow < new Date()) return true;
      return false;
    }
    return false;
  }

  async loadData() {
    await database
      .ref(`/claims/${this.state.vid}/${this.state.cid}`)
      .on("value", async (snapshot) => {
        this.setState({
          cid: snapshot.key,
          title: snapshot.val().title,
          description: snapshot.val().description,
          image: snapshot.val().image,
          date: snapshot.val().date,
          status: snapshot.val().status,
          lastUpdate: snapshot.val().lastUpdate,
          damages: snapshot.val().damages,
          refreshing: false,
        });

        await database
          .ref(`location/${snapshot.key}/locations`)
          .once("value")
          .then(async (snapshot) => {
            var temp_list = [];
            snapshot.forEach((element) => {
              temp_list.push(element.val());
            });
            console.log(temp_list);
            this.setState({
              location: temp_list[0],
            });
            let ret = await Location.reverseGeocodeAsync(temp_list[0]);
            console.log(ret);
            this.setState({
              location_title: ret[0].name,
              location_description:
                (ret[0].street ? ret[0].street + "," : "") + ret[0].city,
            });
          });
      });
    // .then()
    // .catch((error) => console.log(error));
  }

  async submit() {
    this.valid = true;

    // // check if all required fields are filled
    // if (
    //   this.state.regId != "" &&
    //   this.state.owner != "" &&
    //   this.state.model != "" &&
    //   (this.state.images.length != 0 || this.state?.imagesNew?.length)
    // ) {
    //   this.valid = true;
    // } else {
    //   alert("All fields are required👋");
    // }

    if (this.valid) {
      var files = [];
      var itemsProcessed = 0;

      this.state?.damagesNew?.forEach(async (image) => {
        const id = uuid.v4();
        files.push(id);

        uriToBlob(image).then((blob) => {
          uploadToFirebase(blob, id);
        });
      });

      this.state?.damages?.forEach(async (image) => {
        files.push(image);
      });

      const day = new Date().getDate();
      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      const UpdatedDate = day + "/" + month + "/" + year;

      await database
        .ref(`/claims/${this.state.vid}/${this.state.cid}`)
        .set({
          title: this.state.title,
          description: this.state.description,
          image: this.state.image,
          date: this.state.date,
          status: this.state.status,
          lastUpdate: UpdatedDate,
          damages: files,
        })
        .then(() => {
          // this.props.navigation.navigate("VehicleProfileScreen");
          // Toast().show("Updated sucessfully");
        });
    }
  }
  render() {
    return (
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={() => {
              this.setState({ refreshing: true });
              this.loadData();
            }}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.content}>
            <Image
              source={require("../../../assets/gps.png")}
              alignSelf="center"
              style={styles.image}
            />
            <Text style={styles.logo}>Your Claim</Text>
            <FormInput
              icon="car"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ title: val });
              }}
              placeholder="title"
              value={this.state?.title}
              editable={false}
            />
            <FormInputText
              icon="car"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ description: val });
              }}
              placeholder="Description"
              value={this.state?.description}
              editable={!this.isLocked()}
            />
            {/* <Button
              icon={"upload"}
              mode="contained"
              style={{ marginBottom: 10 }}
              onPress={() => this.setState({ modal: true })}
            >
              Upload Accident Image
            </Button> */}
            <TextField
              icon="camera"
              type="antdesign"
              text={"Accident Image"}
              // value={this.state.model}
            />
            {this.state?.image ? (
              <AsyncImage
                id={this.state?.image}
                style={{ width: 200, height: 200, marginBottom: 5 }}
                showDelete={false}
              />
            ) : null}
            {/* <ImageGallarySingle
              modal={this.state.modal}
              closeModal={() => {
                this.setState({ modal: false });
              }}
              setImage={(val) => {
                this.setState({ imageNew: val });
              }}
              image={this.state.imageNew}
            /> */}
            <TextField
              icon="camera"
              type="antdesign"
              text={"Damage Images"}
              // value={this.state.model}
            />
            {!this.isLocked() ? (
              <Button
                icon={"upload"}
                mode=""
                style={{ marginBottom: 10 }}
                onPress={() => this.setState({ modal: true })}
              >
                Upload Damage Images
              </Button>
            ) : null}
            <ImageGallary
              modal={this.state.modal}
              closeModal={() => {
                this.setState({ modal: false });
              }}
              images={this.state?.damagesNew}
              setImages={(val) => {
                this.setState({ damagesNew: val });
              }}
            />
            <ScrollView
              style={{
                marginVertical: 10,
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {this.state?.damages?.map((image, index) => {
                return (
                  <View>
                    <AsyncImage
                      id={image}
                      style={{ width: 200, height: 200 }}
                      // onDeleteImage={() => {
                      //   this.state.damages.splice(index, 1);
                      //   this.setState({
                      //     images: this.state.damages,
                      //   });
                      // }}
                      showDelete={true}
                    />
                  </View>
                );
              })}
            </ScrollView>
            {this.state?.location ? (
              <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                showUserLocation
                followUserLocation
                loadingEnabled
                showsCompass={true}
                zoomEnabled
                region={{
                  latitude: this.state.location.latitude,
                  longitude: this.state.location.longitude,
                  latitudeDelta: LATITUDE_DELTA,
                  longitudeDelta: LONGITUDE_DELTA,
                }}
              >
                {this.state?.location?.latitude &&
                this.state?.location?.longitude ? (
                  <Marker
                    coordinate={{
                      latitude: this.state.location.latitude,
                      longitude: this.state.location.longitude,
                    }}
                    title={this.state.location_title}
                    description={this.state.location_description}
                  />
                ) : null}
              </MapView>
            ) : null}
            {!this.isLocked() ? (
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
                Save changes
              </Button>
            ) : (
              <Button
                icon={"folder-open"}
                mode="contained"
                style={{ marginBottom: 10, width: 200, alignSelf: "center" }}
                onPress={() => {
                  this.props.navigation.navigate("DriverCompensationScreen");
                }}
              >
                View Compensation
              </Button>
            )}
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
  map: {
    height: 250,
    marginBottom: 10,
  },
  bubble: {
    flex: 1,
    backgroundColor: "rgba(255,255,255,0.7)",
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 20,
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
