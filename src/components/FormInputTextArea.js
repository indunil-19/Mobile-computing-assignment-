import React, { Component } from "react";
import { View, Text, TextInput, StyleSheet } from "react-native";
import { Icon } from "react-native-elements";

const FormInputText = (props) => {
  const {
    icon,
    placeholder,
    onChangeText,
    type,
    ref,
    keyboardType,
    secureTextEntry,
    onSubmitEditing,
    value,
    default_value,
    editable,
  } = props;
  return (
    <View style={styles.inputContainer}>
      <View style={styles.iconTextContainer}>
        <Icon
          name={icon}
          type={type}
          style={styles.inputIcon}
          color="#2E6CB5"
        />
        <TextInput
          ref={ref}
          style={styles.inputs}
          placeholder={placeholder}
          keyboardType={keyboardType}
          underlineColorAndroid="transparent"
          onChangeText={onChangeText}
          secureTextEntry={secureTextEntry}
          onSubmitEditing={onSubmitEditing}
          required
          value={value}
          defaultValue={default_value}
          multiline={true}
          editable={editable}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    borderBottomColor: "#EFC066",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 2,
    height: 50,
    marginBottom: 20,
    flexDirection: "row",
    // alignItems: "center",
    borderRadius: 10,
    height: 200,
    paddingTop: 5,
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
  inputs: {
    height: 50,
    marginLeft: 10,
    width: "80%",
    height: 200,
    textAlignVertical: "top",
  },
});

export default FormInputText;
