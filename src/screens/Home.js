import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { FAB, Avatar, Card, IconButton } from "react-native-paper";
import { auth, database } from "../../firebase";
import { createStackNavigator } from "react-navigation-stack";

import VehicleScreen from "./VehicleScreen";
import VehicleProfileScreen from "./claim/vehicleProfile";
import ClaimsScreen from "./claim/clams";
import ClaimFormScreen from "./claim/claimForm";

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
    };
    this.uid = auth.currentUser.uid;
  }

  async componentDidMount() {
    await database
      .ref(`/users/${this.uid}/vehicles/`)
      .once("value")
      .then((snapshot) => {
        var temp_list = [];
        snapshot.forEach((element) => {
          const data = {
            uid: element.key,
            regId: element.val().regId,
            model: element.val().model,
            owner: element.val().model,
          };
          this.setState({ vehicles: [...this.state.vehicles, data] });
        });
      })
      .catch((error) => console.log(error));
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.content}>
          <Image
            source={require("../../assets/driver.png")}
            alignSelf="center"
            style={styles.image}
          />
          <Text style={styles.logo}>Welcome Drivia</Text>
          <ScrollView>
            <FlatList
              data={this.state.vehicles}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => {
                    this.props.navigation.navigate("VehicleScreen", item);
                  }}
                >
                  <Card
                    style={{
                      marginBottom: 15,
                      elevation: 50,
                      paddingVertical: 15,
                      backgroundColor: "white",
                    }}
                  >
                    <Card.Title
                      title="Card Title"
                      subtitle="Card Subtitle"
                      left={(props) => <Avatar.Icon {...props} icon="folder" />}
                      right={(props) => {}}
                    />
                  </Card>
                </TouchableOpacity>
              )}
            />
          </ScrollView>
          <FAB
            icon="plus"
            style={styles.fab}
            onPress={() => {
              this.props.navigation.navigate("VehicleRegistration");
            }}
          />
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

export const HomeNavigator = createStackNavigator(
  {
    HomeScreen: {
      screen: HomeScreen,
      navigationOptions: {
        title: "Home Screen",
        headerShown: false,
      },
    },
    VehicleProfileScreen: {
      screen: VehicleProfileScreen,
      navigationOptions: {
        title: "VehicleProfile Screen",
        headerShown: false,
      },
    },
    VehicleScreen: {
      screen: VehicleScreen,
      navigationOptions: {
        title: "Vehicle Screen",
        headerShown: false,
      },
    },
    ClaimsScreen: {
      screen: ClaimsScreen,
      navigationOptions: {
        title: "Claims Screen",
        headerShown: false,
      },
    },
    ClaimFormScreen: {
      screen: ClaimFormScreen,
      navigationOptions: {
        title: "ClaimForm Screen",
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "HomeScreen",
  }
);
