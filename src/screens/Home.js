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
  AsyncStorage,
} from "react-native";
import { FAB, Avatar, Card, IconButton } from "react-native-paper";
import { auth, database } from "../../firebase";
import { createStackNavigator } from "react-navigation-stack";

import VehicleScreen from "./VehicleScreen";
import VehicleProfileScreen from "./claim/vehicleProfile";
import ClaimsScreen from "./claim/clams";
import ClaimFormScreen from "./claim/claimForm";
import VehicleProfileEdit from "./claim/VehicleProfileEdit";
import ClaimScreen from "./claim/claim";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      vehicles: [],
      refreshing: false,
    };

    this.uid = auth.currentUser.uid;
  }
  async componentDidMount() {
    // await AsyncStorage.setItem("badge", 0);
    // registerForPushNotificationsAsync().then((token) => {});
    // // This listener is fired whenever a notification is received while the app is foregrounded
    // Notifications.addNotificationReceivedListener(async (notification) => {
    //   // console.log(await Notifications.getBadgeCountAsync());
    //   // await Notifications.setBadgeCountAsync(1);
    // });

    // // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    // Notifications.addNotificationResponseReceivedListener((response) => {});

    this.loadData();
  }

  async loadData() {
    await database
      .ref(`/vehicles/${this.uid}`)
      .once("value")
      .then((snapshot) => {
        var temp_list = [];
        snapshot.forEach((element) => {
          const data = {
            vid: element.key,
            regId: element.val().regId,
            model: element.val().model,
            owner: element.val().owner,
            date: element.val().date,
          };
          temp_list.push(data);
        });

        this.setState({
          vehicles: temp_list,
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
            source={require("../../assets/driver.png")}
            alignSelf="center"
            style={styles.image}
          />
          <Text style={styles.logo}>Welcome Drivia</Text>
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
                      title={`${item.regId}`}
                      subtitle={`${item?.date}`}
                      left={(props) => <Avatar.Icon {...props} icon="car" />}
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
            onPress={async () => {
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
    ClaimProfileScreen: {
      screen: ClaimScreen,
      navigationOptions: {
        title: "Claim Screen",
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
    VehicleProfileEdit: {
      screen: VehicleProfileEdit,
      navigationOptions: {
        title: "Vehicle ProfileEdit",
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "HomeScreen",
  }
);

async function registerForPushNotificationsAsync() {
  let token;
  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== "granted") {
      alert("Failed to get push token for push notification!");
      return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
  } else {
    alert("Must use physical device for Push Notifications");
  }

  if (Platform.OS === "android") {
    Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FF231F7C",
    });
  }

  await database
    .ref(`/users/${auth.currentUser.uid}/`)
    .update({ token: token });

  return token;
}
