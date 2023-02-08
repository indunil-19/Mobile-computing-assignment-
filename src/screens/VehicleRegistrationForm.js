import React, { Component } from "react";
import { Text, View, StyleSheet, Image, ScrollView } from "react-native";
import { Button } from "react-native-paper";
import FormInput from "../components/FormInput";
import ImageGallary from "../components/ImagePicker";
import { auth, database } from "../../firebase";
import uuid from "react-native-uuid";
import { uploadToFirebase, uriToBlob } from "../services/ImageService";
// import Toast from "react-native-simple-toast";

export default class VehicleRegistration extends Component {
  constructor(props) {
    super(props);
    this.state = {
      regId: "",
      model: "",
      owner: "",
      modal: false,
      images: [],
    };
  }

  async submit() {
    this.valid = false;

    // check if all required fields are filled
    if (
      this.state.regId != "" &&
      this.state.owner != "" &&
      this.state.model != "" &&
      this.state.images.length != 0
    ) {
      this.valid = true;
    } else {
      alert("All fields are required👋");
    }

    if (this.valid) {
      const files = [];

      this.state.images.forEach(async (image) => {
        const id = uuid.v4();
        files.push(id);

        uriToBlob(image).then((blob) => {
          uploadToFirebase(blob, id);
        });
      });

      const day = new Date().getDate();
      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      const date = day + "/" + month + "/" + year;

      await database
        .ref(`/vehicles/${auth.currentUser.uid}/`)
        .push({
          regId: this.state.regId,
          model: this.state.model,
          owner: this.state.owner,
          images: files,
          date: date,
          lastUpdated: date,
        })
        .then(() => {
          // Toast.show("Vehicle Registration sucessfull.", Toast.LONG);
          this.props.navigation.navigate("BottomTab");
        });
    }
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.container}>
          <View style={styles.content}>
            <Image
              source={require("../../assets/gps.png")}
              alignSelf="center"
              style={styles.image}
            />
            <Text style={styles.logo}>Add Your Vehicle</Text>
            <FormInput
              icon="car"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ regId: val });
              }}
              placeholder="Registration number"
            />
            <FormInput
              icon="user"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ model: val });
              }}
              placeholder="Model Name"
            />
            <FormInput
              icon="mail"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ owner: val });
              }}
              placeholder="Owner Name"
            />
            <Button
              icon={"upload"}
              mode="contained"
              style={{ marginBottom: 10 }}
              onPress={() => this.setState({ modal: true })}
            >
              Upload Vehicle Images
            </Button>

            <Button
              icon={""}
              mode="contained"
              style={{ marginBottom: 10, width: 200, alignSelf: "center" }}
              onPress={() => {
                this.submit();
              }}
            >
              Submit
            </Button>

            <ImageGallary
              modal={this.state.modal}
              closeModal={() => {
                this.setState({ modal: false });
              }}
              images={this.state.images}
              setImages={(val) => {
                this.setState({ images: val });
              }}
            />
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
