import React, { useState } from "react";
import useAuth from "../auth/useAuth";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItem from "../components/lists/ListItem";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Text>{`${user.name} \n ${user.iconUrl}\n ${user.icon}`}</Text>
    </>
  );
}

export default App;

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  container: {
    marginVertical: 20,
  },
});
