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
import { FAB, Avatar, Card, IconButton } from "react-native-paper";
import { auth, database } from "../../../firebase";

export default class UserApprovalScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pendingUsers: [],
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
  }
  async approveUser() {
    /* await database
      .ref(`/users/`)
      .once("value")
      .then((snapshot) => {
        var temp_list = [];
        snapshot.forEach((element) => {
          if (element.valid == false) {
            const data = {
              uid: element.key,
              firstname: element.val().model,
              lastname: element.val().owner,
              type: element.val().date,
            };
            temp_list.push(data);
          }
        });

        this.setState({
          vehicles: temp_list,
        });
      })
      .catch((error) => console.log(error));*/
  }
  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>New User List </Text>
        <FlatList
          data={this.state.pendingUsers}
          renderItem={({ item, index }) => (
            <TouchableOpacity
              onPress={() => {
                Alert.alert("Confirmation", "Do you want to approve user?", [
                  {
                    text: "NO",
                    style: "cancel",
                  },
                  { text: "YES", onPress: () => this.approveUser() },
                ]);
              }}
            >
              <Card
                style={{
                  marginBottom: 15,
                  marginTop: 50,
                  elevation: 0,
                  paddingVertical: 15,
                  backgroundColor: "white",
                }}
              >
                {console.log(item)}
                <Card.Title
                  title={`${item?.firstname} ${item?.lastname}`}
                  subtitle={`${item?.type}`}
                  left={(props) => <Avatar.Icon {...props} icon="car" />}
                  right={(props) => {}}
                />
              </Card>
            </TouchableOpacity>
          )}
        />
        <Text>New User List </Text>
      </View>
    );
  }
}
