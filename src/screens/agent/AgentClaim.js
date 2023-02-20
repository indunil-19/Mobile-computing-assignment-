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
      report: "",
      payment: "",
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
          report: snapshot.val().report,
          payment: snapshot.val().payment,
          refreshing: false,
        });
      })
      .catch((error) => console.log(error));
  }

  async submit() {
    this.valid = false;

    // check if all required fields are filled
    if (this.state?.report) {
      this.valid = true;
    } else {
      alert("Damage Report is required👋");
    }

    if (this.valid) {
      const id = uuid.v4();
      uriToBlob(this.state?.report).then((blob) => {
        uploadToFirebase(blob, id);
      });

      await database
        .ref(`/claims/${this.state.vid}/${this.state.cid}`)
        .update({
          status: "checked",
          payment: this.state.payment,
          report: id,
        })
        .then(() => {});
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
                onPress={() => {}}
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
              onChangeText={(val) => {
                this.setState({ title: val });
              }}
              placeholder="title"
              value={this.state?.title}
            />
            <FormInputText
              editable={false}
              icon="car"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ description: val });
              }}
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

            {this.state.status == "started" && (
              <>
                <Button
                  icon={"upload"}
                  mode=""
                  style={{ marginBottom: 10 }}
                  onPress={() => this.setState({ modal: true })}
                >
                  Upload Damage Report
                </Button>

                <ImageGallarySingle
                  modal={this.state.modal}
                  closeModal={() => {
                    this.setState({ modal: false });
                  }}
                  setImage={(val) => {
                    this.setState({ report: val });
                  }}
                  image={this.state.report}
                />
              </>
            )}
            {/* {this.state?.status != "started" && (
              <AsyncImage
                id={this.state?.report}
                style={{ width: 200, height: 200, marginBottom: 5 }}
                showDelete={false}
              />
            )} */}
            <FormInput
              icon="payments"
              type="material"
              keyboardType="phone-pad"
              onChangeText={(val) => {
                this.setState({ payment: val });
              }}
              placeholder="payment"
              value={this.state?.payment}
              editable={this.state.status == "started"}
            />
            <Button
              icon={"file"}
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
