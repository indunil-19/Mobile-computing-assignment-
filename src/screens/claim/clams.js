import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import { FAB, Avatar, Card, IconButton } from "react-native-paper";
import { auth, database } from "../../../firebase";
import { Icon } from "react-native-elements";

export default class ClaimsScreen extends Component {
  nightdrive = false;
  constructor(props) {
    super(props);
    this.state = {
      claims: [],
      refreshing: false,
      vid: this.props.navigation.getParam("vid"),
    };

    this.uid = auth.currentUser.uid;
  }

  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    await database.ref(`/claims/${this.state.vid}`).on("value", (snapshot) => {
      // console.log(snapshot);
      var temp_list = [];
      snapshot.forEach((element) => {
        const data = {
          cid: element.key,
          title: element.val().title,
          description: element.val().description,
          imageNew: element.val().imageNew,
          date: element.val().date,
          status: element.val().status,
        };
        temp_list.push(data);
      });

      this.setState({
        claims: temp_list,
      });
    });

    this.setState({ refreshing: false });
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require("../../../assets/driver.png")}
            alignSelf="center"
            style={styles.image}
          />
          <Text style={styles.logo}>Your Claims</Text>
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
            <FlatList
              data={this.state.claims}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("ClaimProfileScreen", {
                      ...item,
                      vid: this.state.vid,
                    });
                  }}
                >
                  <View
                    style={{
                      marginTop: 15,
                      marginBottom: 15,
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
                            <Text style={{ color: "#84828C" }}>
                              {item.title}
                            </Text>
                            {/* <Text style={{ color: "#84828C" }}>
                              {"vehiclename"}
                            </Text> */}
                          </View>
                        </View>
                      </View>
                      <View style={styles.lowercontainer}>
                        <View style={styles.icon_text_view}>
                          <Icon name="car" type="antdesign" color="#84828C" />
                          {/* <Text style={{ color: "#84828C" }}>
                            {" "}
                            {"distance"} Km
                          </Text> */}
                        </View>

                        {item.status == "Finished" ? (
                          <View style={styles.icon_text_view}>
                            {/* <Icon name="moon" type="feather" color="green" /> */}
                            <Text style={{ color: "green" }}> Finished</Text>
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
          </ScrollView>
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
