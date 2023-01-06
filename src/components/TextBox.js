import React, { Component } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Icon } from "react-native-elements";

const TextField = (props) => {
  const { text, icon, type, value, sub } = props;
  return (
    <View style={styles.inputContainer}>
      <View style={styles.iconTextContainer}>
        <Icon
          name={icon}
          type={type}
          style={styles.inputIcon}
          color="#2E6CB5"
        />
        <View
          style={{
            flexDirection: "row",
            alignSelf: "center",
          }}
        >
          <Text style={{ marginRight: 5, fontWeight: "bold" }}>{text}</Text>
          <Text style={{ marginRight: 5, fontWeight: "bold" }}>-----</Text>
          <Text>{value}</Text>
        </View>
      </View>
      {sub}
    </View>
  );
};

export default TextField;

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomColor: "#EFC066",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 2,
    height: 50,
    marginBottom: 20,
    // flexDirection: "row",
    // alignItems: "center",
    borderRadius: 10,
  },
  iconTextContainer: {
    marginLeft: 10,
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
  },
  inputIcon: {
    marginTop: 10,
    width: 100,
    height: 100,
  },
});
