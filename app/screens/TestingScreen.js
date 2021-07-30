import React, { useState } from "react";
import useAuth from "../auth/useAuth";
import { StyleSheet, Text, View } from "react-native";
import colors from "../config/colors";
import Icon from "../components/Icon";
import ListItem from "../components/lists/ListItem";

function App() {
  const { user, logOut } = useAuth();

  return (
    <>
      <Text>{`${user.name} ${user.iconUrl}`}</Text>
      <View style={styles.container}>
        <ListItem
          title={user.name}
          subTitle={user.email}
          image={user.iconUrl ? { uri: user.iconUrl } : null}
          IconComponent={
            user.iconUrl ? null : (
              <Icon
                name={"account-alert"}
                size={70}
                backgroundColor={colors.secondary}
              />
            )
          }
        />
      </View>
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
