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
import { Button } from "react-native-paper";
import FormInput from "../../components/FormInput";
import FormInputText from "../../components/FormInputTextArea";
import ImageGallarySingle from "../../components/ImagePickerSingle";
import uuid from "react-native-uuid";
import { uploadToFirebase, uriToBlob } from "../../services/ImageService";
import { auth, database } from "../../../firebase";
// import Toast from "react-native-simple-toast";
import AsyncImage from "../../components/AsyncImage";
import TextField from "../../components/TextBox";
import ImageGallary from "../../components/ImagePicker";
export default class AgentClaimScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cid: this.props.navigation.getParam("cid"),
      vid: this.props.navigation.getParam("vid"),
      uid: this.props.navigation.getParam("uid"),
      title: "",
      description: "",
      modal: false,
      image: "",
      status: "",
      damages: [],
      damagesNew: [],
      lastUpdate: "",
      comdesc: "",
      compensation: "",
    };
    this.uid = auth.currentUser.uid;
  }

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    await database
      .ref(`/claims/${this.state.vid}/${this.state.cid}`)
      .once("value")
      .then((snapshot) => {
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
      })
      .catch((error) => console.log(error));
    await database
      .ref(`/compensation/${this.state.cid}`)
      .once("value")
      .then((snapshot) => {
        this.setState({
          compensation: snapshot.val().compensation,
          comdesc: snapshot.val().description,
        });
      });
  }

  // async submit() {
  //   this.valid = false;

  //   // check if all required fields are filled
  //   if (this.state?.report) {
  //     this.valid = true;
  //   } else {
  //     alert("Damage Report is required👋");
  //   }

  //   if (this.valid) {
  //     const id = uuid.v4();
  //     uriToBlob(this.state?.report).then((blob) => {
  //       uploadToFirebase(blob, id);
  //     });

  //     await database
  //       .ref(`/claims/${this.state.vid}/${this.state.cid}`)
  //       .update({
  //         status: "checked",
  //         payment: this.state.payment,
  //         report: id,
  //       })
  //       .then(() => {});
  //   }
  // }
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
            <Text style={styles.logo}>Claim Details</Text>
            <View style={styles.rowView}>
              <Button
                icon={"car"}
                mode="contained"
                style={{ marginBottom: 10, width: "45%", alignSelf: "center" }}
                onPress={() =>
                  this.props.navigation.navigate("AgentVehicleProfileScreen", {
                    vid: this.state.vid,
                    uid: this.state.uid,
                  })
                }
              >
                Vehicle
              </Button>
              <Button
                icon={"map"}
                mode="contained"
                style={{ marginBottom: 10, width: "45%", alignSelf: "center" }}
                onPress={() =>
                  this.props.navigation.navigate("DriverTrackScreen", {
                    cid: this.state.cid,
                  })
                }
              >
                Track
              </Button>
              {/* <Button
                icon={"cash"}
                mode="contained"
                style={{ marginBottom: 10, width: "32%", alignSelf: "center" }}
                onPress={() => {
                  this.submit();
                }}
              >
                Payment
              </Button> */}
            </View>
            <FormInput
              editable={false}
              icon="car"
              type="antdesign"
              placeholder="title"
              value={this.state?.title}
            />
            <FormInputText
              editable={false}
              icon="car"
              type="antdesign"
              placeholder="Description"
              value={this.state?.description}
            />

            <TextField
              icon="camera"
              type="antdesign"
              text={"Accident Image"}
              // value={this.state.model}
            />

            {this.state?.image ? (
              <AsyncImage
                id={this.state?.image}
                uid={this.state.uid}
                style={{ width: 200, height: 200, marginBottom: 5 }}
                showDelete={false}
              />
            ) : null}

            <TextField
              icon="camera"
              type="antdesign"
              text={"Damage Images"}
              // value={this.state.model}
            />

            {/* {this.state.status == "started" && (
              <>
                <Button
                  icon={"upload"}
                  mode=""
                  style={{ marginBottom: 10 }}
                  onPress={() => this.setState({ modal: true })}
                >
                  Upload Damage Report
                </Button> */}

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
                      uid={this.state?.uid}
                      style={{ width: 200, height: 200 }}
                      showDelete={false}
                    />
                  </View>
                );
              })}
            </ScrollView>
            {/* </>
            )} */}
            {/* {this.state?.status != "started" && (
              <AsyncImage
                id={this.state?.report}
                style={{ width: 200, height: 200, marginBottom: 5 }}
                showDelete={false}
              />
            )} */}
            {this.state?.status == "finished" && (
              <>
                <FormInputText
                  icon="payments"
                  type="material"
                  keyboardType="phone-pad"
                  placeholder="description"
                  value={this.state?.comdesc}
                  editable={false}
                />
                <FormInput
                  icon="payments"
                  type="material"
                  keyboardType="phone-pad"
                  placeholder="compensation"
                  value={this.state?.compensation}
                  editable={false}
                />
              </>
            )}
            <Button
              icon={"file"}
              mode="contained"
              style={{ marginBottom: 10, width: 200, alignSelf: "center" }}
              onPress={() => {
                // Alert.alert("Confirmation", "Do you want to submit?", [
                //   {
                //     text: "NO",
                //     style: "cancel",
                //   },
                //   { text: "YES", onPress: () => this.submit() },
                // ]);
                this.props.navigation.navigate("CompensationScreen", {
                  cid: this.state.cid,
                  title: this.state.title,
                  uid: this.state.uid,
                  vid: this.state.vid,
                });
              }}
            >
              Add Compensation
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
  rowView: {
    flexDirection: "row",
    justifyContent: "space-between",
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
