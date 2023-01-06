import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ScrollView,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import Gallery from "react-native-image-gallery";
import { Icon } from "react-native-elements";
import { Button } from "react-native-paper";
import AsyncImage from "./AsyncImage";

const ImageGallary = (props) => {
  const { images, modal, closeModal, setImages } = props;

  const pickFromGallery = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (granted) {
      let data = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [1, 1],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!data.cancelled) {
        data.assets.forEach((i) => {
          setImages([...images, i.uri]);
        });
      }
    } else {
      Alert.alert("you need to give permissions to upload an image");
    }
  };

  const pickFromCamera = async () => {
    const { granted } = await Permissions.askAsync(Permissions.CAMERA);
    if (granted) {
      let data = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
        allowsMultipleSelection: true,
      });

      if (!data.canceled) {
        data.assets.forEach((i) => {
          setImages([...images, i.uri]);
        });
      }
    } else {
      Alert.alert("you need to give permissions to upload an image");
    }
  };

  return (
    <View>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modal}
        onRequestClose={() => {}}
      >
        <View style={styles.modalView}>
          <ScrollView
            style={{
              marginVertical: 20,
            }}
            horizontal={true}
            showsHorizontalScrollIndicator={false}
          >
            {images?.map((image, index) => {
              return (
                <View>
                  <AsyncImage
                    uri={image}
                    style={{ width: 200, height: 200 }}
                    showDelete={true}
                    onDeleteImage={() => {
                      let imgArr = [];
                      images.forEach((image, index1) => {
                        if (index1 != index) imgArr.push(image);
                      });
                      setImages(imgArr);
                    }}
                  />
                </View>
              );
            })}
          </ScrollView>
          <View style={styles.modalButtonView}>
            <Button
              icon="camera"
              mode="contained"
              onPress={() => pickFromCamera()}
            >
              camera
            </Button>

            <Button
              icon="image-area"
              mode="contained"
              onPress={() => pickFromGallery()}
            >
              gallery
            </Button>
          </View>
          <Button onPress={closeModal}>cancle</Button>
        </View>
      </Modal>
    </View>
  );
};

export default ImageGallary;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EFF1F3",
  },
  content: {
    flex: 1,
    alignSelf: "center",
    width: "90%",
    paddingTop: "10%",
  },
  logo: {
    fontWeight: "bold",
    fontSize: 35,
    color: "#2E6CB5",
    marginBottom: 40,
    textAlign: "center",
  },
  back: {
    color: "#373E45",
    fontSize: 15,
    textAlign: "center",
  },
  image: {
    // flex: 2,
    width: 150,
    height: 150,
    resizeMode: "contain",
  },
  modalView: {
    position: "absolute",
    bottom: 2,
    width: "100%",
    // height: "70%",
    backgroundColor: "#b8e6ff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalButtonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 10,
  },
});
