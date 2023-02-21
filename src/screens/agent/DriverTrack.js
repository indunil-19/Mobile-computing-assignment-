import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { database } from "../../../firebase";
import MapView, {
  Marker,
  AnimatedRegion,
  Polyline,
  PROVIDER_GOOGLE,
  Callout,
} from "react-native-maps";
import * as Location from "expo-location";
const LATITUDE_DELTA = 0.009;
const LONGITUDE_DELTA = 0.009;
const LATITUDE = 37.78825;
const LONGITUDE = -122.4324;
export default class DriverTrackScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cid: this.props.navigation.getParam("cid"),
      locations: [],
      place_list: [],
    };
  }
  async componentDidMount() {
    this.loadData();
  }
  async loadData() {
    await database
      .ref(`location/${this.state.cid}/locations`)
      .once("value")
      .then(async (snapshot) => {
        var temp_list = [];
        var places = [];
        snapshot.forEach((element) => {
          temp_list.push(element.val());
        });
        // temp_list.forEach(async (ele, i) => {
        //   let ret = await Location.reverseGeocodeAsync(ele);
        //   places.push({
        //     location_title: ret[0].name,
        //     location_description:
        //       (ret[0].street ? ret[0].street + "," : "") + ret[0].city,
        //   });
        // });
        this.setState({
          locations: temp_list,
          place_list: places,
        });
      });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <MapView
          style={styles.map}
          provider={PROVIDER_GOOGLE}
          showUserLocation
          followUserLocation
          loadingEnabled
          showsCompass={true}
          zoomEnabled
          region={{
            latitude: this.state?.locations[0]?.latitude
              ? this.state.locations[0].latitude
              : LATITUDE,
            longitude: this.state?.locations[0]?.longitude
              ? this.state.locations[0].longitude
              : LONGITUDE,
            latitudeDelta: LATITUDE_DELTA,
            longitudeDelta: LONGITUDE_DELTA,
          }}
        >
          <Polyline coordinates={this.state.locations} strokeWidth={5} />
          {this.state.locations.map((location, index) => (
            <Marker
              coordinate={location}
              pinColor={index == 0 ? "red" : "blue"}
              //   title={this.state.place_list[index].location_title}
            />
          ))}
        </MapView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
