import React from "react";
import { StyleSheet, View, FlatList, Alert } from "react-native";

import { ListItem, ListItemSeparator } from "../components/lists";
import colors from "../config/colors";
import Icon from "../components/Icon";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import useAuth from "../auth/useAuth";
import logger from "../utility/logger";

const menuItems = [
  {
    title: "My Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.LISTINGS,
    params: {
      reloadData: true,
      filterUser: true,
    },
  },
  {
    title: "All Listings",
    icon: {
      name: "format-list-bulleted",
      backgroundColor: colors.primary,
    },
    targetScreen: routes.LISTINGS,
    params: {
      reloadData: true,
      filterUser: false,
    },
  },
  {
    title: "My Messages",
    icon: {
      name: "email",
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.MESSAGES,
  },
  {
    title: "Test Screen",
    icon: {
      name: "alpha-t-box",
      backgroundColor: colors.secondary,
    },
    targetScreen: routes.TESTING,
  },
];

function AccountScreen({ navigation }) {
  const { user, logOut } = useAuth();
  const initializeListingsApi = useApi(listingsApi.initializeListings);

  const navigateTo = (item) => {
    logger.log("navigateTo: ", item);
    if (item.params === undefined) {
      navigation.navigate(item.targetScreen);
    } else {
      navigation.navigate(item.targetScreen, item.params);
    }
  };

  const initializeListings = () => {
    Alert.alert(
      "Install Sample Listings",
      "This will log you out; remove all current listings and users, and replace with sample data!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Sample Listings Cancelled"),
          style: "cancel",
        },
        { text: "Install Samples", onPress: () => initListings() },
      ],
      { cancelable: false }
    );
  };

  const initListings = async () => {
    console.log("initialize Listings");
    const resp = await initializeListingsApi.request();
    const navItem = {
      targetScreen: routes.LISTINGS,
      params: {
        reloadData: true,
        filterUser: false,
      },
    };
    logOut();
  };

  return (
    <Screen style={styles.screen}>
      <View style={styles.container}>
        <ListItem
          title={user.name}
          subTitle={user.email}
          image={require("../assets/mosh.jpg")}
        />
      </View>
      <View style={styles.container}>
        <FlatList
          data={menuItems}
          keyExtractor={(menuItem) => menuItem.title}
          ItemSeparatorComponent={ListItemSeparator}
          renderItem={({ item }) => (
            <ListItem
              title={item.title}
              IconComponent={
                <Icon
                  name={item.icon.name}
                  backgroundColor={item.icon.backgroundColor}
                />
              }
              onPress={() => navigateTo(item)}
            />
          )}
        />
      </View>
      <ListItem
        title="Initialize Sample Listings"
        IconComponent={
          <Icon name="alert-outline" backgroundColor={colors.primary} />
        }
        onPress={() => initializeListings()}
      />
      <ListItem
        title="Log Out"
        IconComponent={<Icon name="logout" backgroundColor="#ffe66d" />}
        onPress={() => logOut()}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  screen: {
    backgroundColor: colors.light,
  },
  container: {
    marginVertical: 20,
  },
});

export default AccountScreen;
