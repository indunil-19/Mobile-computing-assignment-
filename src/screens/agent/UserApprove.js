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

export default class UserApprovalScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingUsers: [],
      refreshing: false,
    };
  }
  async componentDidMount() {
    this.loadData();
  }
  async loadData() {
    await database
      .ref(`/users/`)
      .once("value")
      .then((snapshot) => {
        var temp_list = [];
        snapshot.forEach((element) => {
          if (element.val().valid == false) {
            const data = {
              uid: element.key,
              firstname: element.val().firstname,
              lastname: element.val().lastname,
              type: element.val().type,
            };
            temp_list.push(data);
          }
        });

        this.setState({
          pendingUsers: temp_list,
        });
      })
      .catch((error) => console.log(error));
    this.setState({ refreshing: false });
  }
  async approveUser(userID) {
    await database
      .ref(`/users/${userID}`)
      .update({ valid: true })
      .then(() => {
        console.log("success");
        //Toast.show("approved sucessfully");
      })
      .catch((error) => console.log(error));
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
              data={this.state.pendingUsers}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => {}}>
                  <Card
                    style={{
                      marginBottom: 5,
                      marginTop: 5,
                      elevation: 50,
                      paddingVertical: 0,
                      backgroundColor: "white",
                    }}
                  >
                    <Card.Title
                      title={`${item.firstname} ${item.lastname} `}
                      subtitle={`${item.type}`}
                      left={(props) => <Avatar.Icon {...props} icon="car" />}
                      right={(props) => {}}
                    />
                    <Card.Actions>
                      <Button
                        onPress={() => {
                          Alert.alert(
                            "Confirmation",
                            "Do you want to approve",
                            [
                              {
                                text: "NO",
                                style: "cancel",
                              },
                              {
                                text: "YES",
                                onPress: () => {
                                  this.approveUser(item?.uid);
                                },
                              },
                            ]
                          );
                        }}
                      >
                        Approve
                      </Button>
                    </Card.Actions>
                  </Card>
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
