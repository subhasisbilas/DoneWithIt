import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import Checkbox from "../components/Checkbox";

function App() {
  const [checked, onChange] = useState(false);

  return (
    <View style={styles.appContainer}>
      <Text style={styles.appTitle}>Checkbox Example</Text>

      <View style={styles.checkboxContainer}>
        <Checkbox
          checked={checked}
          onChange={onChange}
          buttonStyle={styles.checkboxBase}
          activeButtonStyle={styles.checkboxChecked}
        />
        <Text style={styles.checkboxLabel}>Use Camera</Text>
      </View>
    </View>
  );
}

export default App;

const styles = StyleSheet.create({
  checkboxBase: {
    width: 24,
    height: 24,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "green",
    backgroundColor: "transparent",
  },

  checkboxChecked: {
    backgroundColor: "green",
  },

  appContainer: {
    flex: 1,
    alignItems: "center",
  },

  appTitle: {
    marginVertical: 16,
    fontWeight: "bold",
    fontSize: 24,
  },

  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
  },

  checkboxLabel: {
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 18,
  },
});
