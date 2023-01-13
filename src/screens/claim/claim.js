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

  async loadData() {
    await database
      .ref(
        `/users/${this.uid}/vehicles/${this.state.vid}/claims/${this.state.cid}`
      )
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
        .ref(
          `/users/${this.uid}/vehicles/${this.state.vid}/claims/${this.state.cid}`
        )
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
          // Toast.show("Updated sucessfully");
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

            <Button
              icon={"upload"}
              mode=""
              style={{ marginBottom: 10 }}
              onPress={() => this.setState({ modal: true })}
            >
              Upload Damage Images
            </Button>

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
              {this.state?.damages.map((image, index) => {
                return (
                  <View>
                    <AsyncImage
                      id={image}
                      style={{ width: 200, height: 200 }}
                      onDeleteImage={() => {
                        this.state.damages.splice(index, 1);
                        this.setState({
                          images: this.state.damages,
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
