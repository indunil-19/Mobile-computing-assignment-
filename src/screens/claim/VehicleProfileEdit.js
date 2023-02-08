import React, { Component } from "react";
import { Text, View, StyleSheet, Image, ScrollView, Alert } from "react-native";
import { Button } from "react-native-paper";
import FormInput from "../../components/FormInput";
import ImageGallary from "../../components/ImagePicker";
import { auth, database } from "../../../firebase";
import uuid from "react-native-uuid";
import { uploadToFirebase, uriToBlob } from "../../services/ImageService";
import AsyncImage from "../../components/AsyncImage";
export default class VehicleProfileEdit extends Component {
  constructor(props) {
    super(props);
    // console.log(this.props.navigation.getParam("images"));
    this.state = {
      vid: this.props.navigation.getParam("vid"),
      regId: this.props.navigation.getParam("regId"),
      model: this.props.navigation.getParam("model"),
      owner: this.props.navigation.getParam("owner"),
      modal: false,
      images: this.props.navigation.getParam("images"),
      imagesNew: [],
      date: this.props.navigation.getParam("date"),
    };
    this.uid = auth.currentUser.uid;
  }

  async submit() {
    this.valid = false;

    // check if all required fields are filled
    if (
      this.state.regId != "" &&
      this.state.owner != "" &&
      this.state.model != "" &&
      (this.state.images.length != 0 || this.state?.imagesNew?.length)
    ) {
      this.valid = true;
    } else {
      alert("All fields are required👋");
    }

    if (this.valid) {
      var files = [];
      var itemsProcessed = 0;

      this.state?.imagesNew?.forEach(async (image) => {
        const id = uuid.v4();
        files.push(id);

        uriToBlob(image).then((blob) => {
          uploadToFirebase(blob, id);
        });
      });

      this.state?.images?.forEach(async (image) => {
        files.push(image);
      });

      const day = new Date().getDate();
      const month = new Date().getMonth();
      const year = new Date().getFullYear();
      const UpdatedDate = day + "/" + month + "/" + year;

      await database
        .ref(`/vehicles/${auth.currentUser.uid}/${this.state.vid}`)
        .set({
          regId: this.state.regId,
          model: this.state.model,
          owner: this.state.owner,
          images: files,
          lastUpdated: UpdatedDate,
          date: this.state.date,
        })
        .then(() => {
          this.props.navigation.navigate("VehicleProfileScreen");
          // Toast.show("Updated sucessfully");
        });
    }
  }

  async componentDidMount() {}

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
            <Text style={styles.logo}>Edit Your Vehicle</Text>
            <FormInput
              icon="car"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ regId: val });
              }}
              placeholder="Registration number"
              value={this.state?.regId}
            />
            <FormInput
              icon="user"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ model: val });
              }}
              placeholder="Model Name"
              value={this.state?.model}
            />
            <FormInput
              icon="mail"
              type="antdesign"
              onChangeText={(val) => {
                this.setState({ owner: val });
              }}
              placeholder="Owner Name"
              value={this.state?.owner}
            />
            <Button
              icon={"upload"}
              mode="contained"
              style={{ marginBottom: 10 }}
              onPress={() => this.setState({ modal: true })}
            >
              Upload Vehicle Images
            </Button>

            <ImageGallary
              modal={this.state.modal}
              closeModal={() => {
                this.setState({ modal: false });
              }}
              images={this.state?.imagesNew}
              setImages={(val) => {
                this.setState({ imagesNew: val });
              }}
            />

            <ScrollView
              style={{
                marginVertical: 10,
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {this.state?.images.map((image, index) => {
                return (
                  <View>
                    <AsyncImage
                      id={image}
                      style={{ width: 200, height: 200 }}
                      onDeleteImage={() => {
                        this.state.images.splice(index, 1);
                        this.setState({
                          images: this.state.images,
                        });
                      }}
                      showDelete={true}
                    />
                  </View>
                );
              })}
            </ScrollView>

            <Button
              icon={"user"}
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
