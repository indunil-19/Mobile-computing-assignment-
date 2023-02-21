import React, { Component } from "react";
import { Alert } from "react-native";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  AsyncStorage,
} from "react-native";
import { FAB, Avatar, Card, IconButton, Button } from "react-native-paper";
import { auth, database } from "../../../firebase";
import ButtonComponent from "../../components/ButtonComponent";
import AsyncImage from "../../components/AsyncImage";
import { Icon } from "react-native-elements";

export default class ClaimListScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      allClaims: [],
      refreshing: false,
    };
  }
  async componentDidMount() {
    this.loadData();
  }
  async loadData() {
    await database
      .ref(`/claims/`)
      .once("value")
      .then((snapshot) => {
        var temp_list = [];
        snapshot.forEach((vehicle) => {
          vehicle.forEach((claim) => {
            if (claim.val().status != "finished") {
              const data = {
                vid: vehicle.key,
                cid: claim.key,
                uid: claim.val().uid,
                date: claim.val().date,
                description: claim.val().description,
                image: claim.val().image,
                status: claim.val().status,
                title: claim.val().title,
              };
              temp_list.push(data);
            }
          });
        });
        this.setState({
          allClaims: temp_list,
        });
      })
      .catch((error) => console.log(error));
    this.setState({ refreshing: false });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require("../../../assets/agent.png")}
            alignSelf="center"
            style={styles.image}
          />
          <FlatList
            data={this.state.allClaims}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.setState({ refreshing: true });
                  this.loadData();
                }}
              />
            }
            renderItem={({ item, index }) => (
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate("AgentClaimScreen", item);
                }}
              >
                <View
                  style={{
                    marginTop: 5,
                    marginBottom: 5,
                    marginHorizontal: 10,
                    elevation: 5,
                    backgroundColor: "white",
                    borderRadius: 10,
                  }}
                >
                  <View style={styles.maincontainer}>
                    <View style={styles.uppercontainer}>
                      <View style={styles.leftContainer}>
                        <View>
                          <Text style={styles.date}>{item.date}</Text>
                          <Text style={{ color: "#84828C" }}>{item.title}</Text>
                          {/* <Text style={{ color: "#84828C" }}>
                              {"vehiclename"}
                            </Text> */}
                        </View>
                      </View>
                    </View>
                    <View style={styles.lowercontainer}>
                      <View style={styles.icon_text_view}>
                        <Icon
                          name="document-outline"
                          type="ionicon"
                          color="#84828C"
                        />
                        {/* <Text style={{ color: "#84828C" }}>
                            {" "}
                            {"distance"} Km
                          </Text> */}
                      </View>

                      {item.status == "approved" ? (
                        <View style={styles.icon_text_view}>
                          {/* <Icon name="moon" type="feather" color="green" /> */}
                          <Text style={{ color: "green" }}> Approved</Text>
                        </View>
                      ) : (
                        <View style={styles.icon_text_view}>
                          {/* <Icon name="circle" type="feather" color="red" /> */}
                          <Text style={{ color: "red" }}> Pending</Text>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "column",
  },
  uppercontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  lowercontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingBottom: 15,
    width: "80%",
    alignSelf: "center",
  },
  leftContainer: {},
  rightContainer: {},
  cost: {
    fontSize: 25,
    color: "#2E6CB5",
  },
  date: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#373E45",
  },

  icon_text_view: {
    flexDirection: "row",
    justifyContent: "space-between",
    textAlignVertical: "bottom",
  },
  container: {
    flex: 1,
    backgroundColor: "#EFF1F3",
  },
  content: {
    flex: 1,
    alignSelf: "center",
    width: "95%",
  },
  fab: {
    position: "absolute",
    margin: 10,
    right: 0,
    bottom: 0,
    borderRadius: 50,
  },
  logo: {
    fontWeight: "bold",
    fontSize: 35,
    color: "#2E6CB5",
    marginBottom: 35,
    textAlign: "center",
  },
  back: {
    color: "#373E45",
    fontSize: 15,
    textAlign: "center",
  },
  image: {
    marginTop: 50,
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
});
