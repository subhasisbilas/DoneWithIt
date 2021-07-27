import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import AppText from "../Text";
import { useFormikContext } from "formik";
import ImageInput from "../ImageInput";

function FormUserIconPicker({ name, useCamera = false }) {
  const { errors, setFieldValue, touched, values } = useFormikContext();
  const imageUri = values[name];

  const handleChangeImage = (uri) => {
    setFieldValue(name, uri);
  };

  const selection = (value) => {
    console.log("camera selection: ", value);
    setCameraSelected(value);
  };

  return (
    <ImageInput
      imageUri={imageUri}
      onChangeImage={(uri) => handleChangeImage(uri)}
      useCamera={useCamera}
    />
  );
}

export default FormUserIconPicker;
