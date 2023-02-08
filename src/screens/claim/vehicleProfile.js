import React, { Component } from "react";
import {
  Text,
  View,
  Image,
  StyleSheet,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Button } from "react-native-paper";
import TextField from "../../components/TextBox";
import { database, auth } from "../../../firebase";
import AsyncImage from "../../components/AsyncImage";
export default class VehicleProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vid: this.props.navigation.getParam("vid"),
      regId: "",
      model: "",
      owner: "",
      modal: false,
      images: [],
      date: "",
      lastUpdated: "",
      refreshing: false,
    };
    this.uid = auth.currentUser.uid;
  }
  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    await database
      .ref(`/vehicles/${this.uid}/${this.state.vid}`)
      .once("value")
      .then((snapshot) => {
        // console.log(snapshot.val());
        this.setState({
          regId: snapshot.val().regId,
          model: snapshot.val().model,
          owner: snapshot.val().owner,
          images: snapshot.val().images,
          date: snapshot.val().date,
          lastUpdated: snapshot.val().lastUpdated,
          refreshing: false,
        });
      })
      .catch((error) => console.log(error));
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
            <Text style={styles.logo}>Your Vehicle</Text>
            <Text style={{ alignSelf: "center", marginBottom: 30 }}>
              Last Update: {this.state?.lastUpdated}
            </Text>
            <TextField
              icon="car"
              type="antdesign"
              text={"Reg Id"}
              value={this.state.regId}
            />
            <TextField
              icon="car"
              type="antdesign"
              text={"Model"}
              value={this.state.model}
            />
            <TextField
              icon="user"
              type="antdesign"
              text={"Owner"}
              value={this.state.owner}
            />
            <TextField
              icon="calendar"
              type="antdesign"
              text={"Reg. Date"}
              value={this.state?.date}
            />

            <TextField icon="camera" type="antdesign" text={"Images"} />

            <ScrollView
              style={{
                marginVertical: 10,
              }}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
            >
              {this.state?.images?.map((image) => {
                return (
                  <View>
                    <AsyncImage
                      id={image}
                      style={{ width: 200, height: 200 }}
                      showDelete={false}
                    />
                  </View>
                );
              })}
            </ScrollView>

            <Button
              icon={"car-settings"}
              mode="contained"
              style={{ marginBottom: 10, width: 200, alignSelf: "center" }}
              onPress={() => {
                this.props.navigation.navigate("VehicleProfileEdit", {
                  vid: this.state.vid,
                  regId: this.state.regId,
                  model: this.state.model,
                  owner: this.state.owner,
                  images: this.state.images,
                  date: this.state.date,
                  lastUpdated: this.state.lastUpdated,
                });
              }}
            >
              edit
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
    marginBottom: 5,
    textAlign: "center",
  },
  image: {
    // flex: 2,
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});

// "drivia-4412d.appspot.com/uploads/T49WEjCoiKMYmKxJkCGS4wUKqvv2/aa1ae3cc-da21-40e3-bc93-9c399fc207b2.jpeg";
