import React from "react";
import { auth, storage } from "../../firebase";
import {
  View,
  ActivityIndicator,
  Image,
  Text,
  Dimensions,
  Alert,
  TouchableOpacity,
} from "react-native";
import { Icon } from "react-native-elements";
import ImageView from "react-native-image-viewing";
import DoubleClick from "react-native-double-tap";
export default class AsyncImage extends React.Component {
  //The constructor for your component
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      mounted: true,
      image: "../../assets/icon.png",
      url: "",
      zoom: false,
    };
  }

  componentDidMount() {
    this.setState({ isMounted: true });
    // this.getAndLoadHttpUrl();
    if (!this.props.uri) {
      this.getAndLoadHttpUrl();
    } else {
      this.setState({
        url: this.props.uri,
      });
      this.setState({ loading: false });
    }
  }

  async getAndLoadHttpUrl() {
    if (this.state.mounted == true) {
      const ref = storage.ref(
        `uploads/${auth.currentUser.uid}/${this.props.id}.jpeg`
      );
      ref
        .getDownloadURL()
        .then((data) => {
          this.setState({ url: data });
          this.setState({ loading: false });
        })
        .catch((error) => {
          this.setState({
            url: "",
          });
          this.setState({ loading: false });
        });
    }
  }

  componentWillUnmount() {
    this.setState({ isMounted: false });
  }

  componentWillReceiveProps(props) {
    this.props = props;
    if (this.props.refresh == true) {
    }
  }

  render() {
    if (this.state.mounted == true) {
      if (this.state.loading == true) {
        return (
          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <ActivityIndicator style={{ alignSelf: "center" }} />
          </View>
        );
      } else {
        if (this.state.url) {
          return (
            <View
              style={{
                width: Dimensions.get("window").width,
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <ImageView
                images={[
                  {
                    uri: this.state.url,
                  },
                ]}
                imageIndex={0}
                visible={this.state.zoom}
                onRequestClose={() => this.setState({ zoom: false })}
              />

              <DoubleClick
                doubleTap={() => {
                  this.setState({ zoom: true });
                }}
                delay={200}
              >
                <Image
                  style={this.props.style}
                  source={{ uri: this.state.url }}
                  resizeMode="contain"
                />
              </DoubleClick>

              {this.props?.showDelete ? (
                <TouchableOpacity
                  onPress={() => {
                    Alert.alert("Confirmation", "Do you want to delete", [
                      {
                        text: "NO",
                        style: "cancel",
                      },
                      {
                        text: "YES",
                        onPress: () => {
                          this.props.onDeleteImage();
                        },
                      },
                    ]);
                  }}
                >
                  <Icon name={"delete"} style={{ marginLeft: 5 }} />
                </TouchableOpacity>
              ) : null}
            </View>
          );
        } else {
          return null;
        }
      }
    } else {
      return null;
    }
  }
}
