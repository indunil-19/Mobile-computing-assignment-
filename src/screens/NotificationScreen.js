import React, { Component } from "react";
import { View, FlatList, ScrollView } from "react-native";
import { Avatar, Button, Card, Text, Appbar } from "react-native-paper";
import { database, auth } from "../../firebase";
export default class NotificationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      notifications: [],
    };
  }
  async componentDidMount() {
    this.loadData();
  }

  async loadData() {
    await database
      .ref(`/notiifications/${auth.currentUser.uid}`)
      .on("value", (snapshot) => {
        var temp_list = [];
        snapshot.forEach((element) => {
          if (element.val().title && element.val().body) {
            console.log(element);
            temp_list.push({
              title: element.val().title,
              body: element.val().body,
            });
          }
        });

        this.setState({
          notifications: temp_list,
        });
      });
  }
  render() {
    return (
      <>
        <Appbar.Header>
          <Appbar.Content title="Notifications" />
        </Appbar.Header>
        <ScrollView>
          <FlatList
            data={this.state.notifications}
            renderItem={({ item, index }) => (
              <Card style={{ margin: 10 }}>
                <Card.Content>
                  <Text variant="titleLarge">{item.title}</Text>
                  <Text variant="bodyMedium">{item.body}</Text>
                </Card.Content>
              </Card>
            )}
          />
        </ScrollView>
      </>
    );
  }
}
