import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import FormInput from "../components/FormInput";
import ButtonComponent from "../components/ButtonComponent";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Gallery from "react-native-image-gallery";
import { auth, database } from "../../firebase";

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

  async pickFromGallery() {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: true,
      });
      console.log(data);

      if (!data.cancelled) {
        data.assets.forEach((i) => {
          console.log(i.uri);
          this.setState({
            images: [...this.state.images, { source: { uri: i.uri } }],
          });
        });
      }
    } else {
      Alert.alert("you need to give permissions to upload an image");
    }
  }

  async pickFromCamera() {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
      });
      console.log(data);

      if (!data.canceled) {
        data.assets.forEach((i) => {
          console.log(i.uri);
          //   this.setState({ image: [this.state.images, i.uri] });
        });
      }
    } else {
      Alert.alert("you need to give permissions to upload an image");
    }
  }

  async submit() {
    this.valid = false;

    // check if all required fields are filled
    if (
      this.state.regId != "" &&
      this.state.owner != "" &&
      this.state.model != ""
      //   this.state.images.length != 0
    ) {
      this.valid = true;
    } else {
      alert("All fields are required👋");
    }

    if (this.valid) {
      await database
        .ref(`users/${auth.currentUser.uid}/vehicles/`)
        .push({
          regId: this.state.regId,
          model: this.state.model,
          owner: this.state.owner,
        })
        .then(() => {
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

            <Gallery
              style={{
                flex: 1,
                backgroundColor: "black",
                height: 200,
                marginBottom: 10,
                borderRadius: 10,
              }}
              images={this.state.images}
            />

            <ButtonComponent
              icon="arrowright"
              type="antdesign"
              text="Submit"
              onPress={() => {
                this.submit();
              }}
            />

            <Modal
              animationType="slide"
              transparent={true}
              visible={this.state.modal}
              onRequestClose={() => {}}
            >
              <View style={styles.modalView}>
                <View style={styles.modalButtonView}>
                  <Button
                    icon="camera"
                    mode="contained"
                    onPress={() => this.pickFromCamera()}
                  >
                    camera
                  </Button>

                  <Button
                    icon="image-area"
                    mode="contained"
                    onPress={() => this.pickFromGallery()}
                  >
                    gallery
                  </Button>
                </View>

                <Button onPress={() => this.setState({ modal: false })}>
                  cancle
                </Button>
              </View>
            </Modal>
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
    backgroundColor: "#b8e6ff",
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
