import React, { useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Screen from "../components/Screen";
import ImageInput from "../components/ImageInput";
import colors from "../config/colors";

function TestingScreen() {
  const [imageUri, setImageUri] = useState();
  const onAddImage = (uri) => {
    setImageUri(uri);
    console.log("onAddImage: ", uri);
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.imageContainer}>
        <ImageInput
          imageUri={imageUri}
          style={styles.image}
          onChangeImage={(uri) => onAddImage(uri)}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  imageContainer: {
    // backgroundColor: colors.light,
    borderRadius: 50,
    height: 100,
    justifyContent: "center",
    marginVertical: 10,
    overflow: "hidden",
    width: 100,
  },
});

export default TestingScreen;
