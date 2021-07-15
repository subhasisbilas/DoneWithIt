import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet } from "react-native";

import ActivityIndicator from "../components/ActivityIndicator";
import Button from "../components/Button";
import Card from "../components/Card";
import colors from "../config/colors";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import Screen from "../components/Screen";
import AppText from "../components/Text";
import useApi from "../hooks/useApi";
import useAuth from "../auth/useAuth";
import logger from "../utility/logger";

function ListingsScreen({ navigation, route }) {
  const { user } = useAuth();
  const getListingsApi = useApi(
    route.params?.filterUser
      ? listingsApi.getUserListings
      : listingsApi.getListings
  );
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    logger.log("reloadData useEffect", route.params);
    const reloadData = route.params.reloadData;

    if (reloadData) {
      getListings(route);
    }
  }, [route.params]);

  const getListings = (route) => {
    const filterUser = route.params.filterUser;

    if (!filterUser) {
      logger.log("getListings: ", filterUser);
      getListingsApi.request();
    } else {
      logger.log("getUserListings: ", user);
      getListingsApi.request(user.id);
    }
  };

  return (
    <>
      <ActivityIndicator visible={getListingsApi.loading} />
      <Screen style={styles.screen}>
        {getListingsApi.error && (
          <>
            <AppText>Couldn't retrieve the listings.</AppText>
            <Button title="Retry" onPress={getListingsApi.request} />
          </>
        )}
        <AppText>data: {getListingsApi.data.length}</AppText>
        <FlatList
          data={getListingsApi.data}
          keyExtractor={(item) => `key${item.id}`}
          renderItem={({ item }) => (
            <Card
              title={item.title}
              subTitle={"$" + item.price}
              imageUrl={item.images.length > 0 ? item.images[0].url : null}
              onPress={() => navigation.navigate(routes.LISTING_DETAILS, item)}
              thumbnailUrl={
                item.images.length > 0 ? item.images[0].thumbnailUrl : null
              }
            />
          )}
          refreshing={refreshing}
          onRefresh={() => {
            getListings(route);
          }}
        />
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  screen: {
    padding: 20,
    backgroundColor: colors.light,
  },
});

export default ListingsScreen;
