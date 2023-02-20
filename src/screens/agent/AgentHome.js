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
import ButtonComponent from "../../components/ButtonComponent";
import { FAB, Avatar, Card, IconButton } from "react-native-paper";
import { auth, database } from "../../../firebase";
import * as Notifications from "expo-notifications";
import UserApprovalScreen from "./UserApprove";
import ClaimListScreen from "./ClaimList";
import AgentClaimScreen from "./AgentClaim";
import AgentVehicleProfileScreen from "./AgentVehicleProfile";
import { createStackNavigator } from "react-navigation-stack";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export default class AgentHomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
    };

    this.uid = auth.currentUser.uid;
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={{ flex: 3 }}>
          <Image
            source={require("../../../assets/agent.png")}
            style={styles.image}
            alignSelf="center"
          />
        </View>

        <View style={{ flex: 4 }}>
          <ButtonComponent
            text="Claim List"
            icon="user"
            type="antdesign"
            onPress={() =>
              this.props.navigation.navigate("ClaimListScreen", {
                vid: this.state.vid,
              })
            }
          />

          <ButtonComponent
            icon="menuunfold"
            type="antdesign"
            text="User Approve"
            onPress={() =>
              this.props.navigation.navigate("UserApprovalScreen", {
                vid: this.state.vid,
              })
            }
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
export const AgentHomeNavigator = createStackNavigator(
  {
    AgentHomeScreen: {
      screen: AgentHomeScreen,
      navigationOptions: {
        title: "Home Screen",
        headerShown: false,
      },
    },
    UserApprovalScreen: {
      screen: UserApprovalScreen,
      navigationOptions: {
        title: "User Approval Screen",
        headerShown: false,
      },
    },
    ClaimListScreen: {
      screen: ClaimListScreen,
      navigationOptions: {
        title: "Claim List Screen",
        headerShown: false,
      },
    },
    AgentClaimScreen: {
      screen: AgentClaimScreen,
      navigationOptions: {
        title: "Agent Claim Screen",
        headerShown: false,
      },
    },
    AgentVehicleProfileScreen: {
      screen: AgentVehicleProfileScreen,
      navigationOptions: {
        title: "Agent Vehicle Profile Screen",
        headerShown: false,
      },
    },
  },
  {
    initialRouteName: "AgentHomeScreen",
  }
);
