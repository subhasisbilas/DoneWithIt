import React, { useState } from "react";
import {
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { Image } from "react-native-expo-image-cache";

import colors from "../config/colors";
import ContactSellerForm from "../components/ContactSellerForm";
import ListItem from "../components/lists/ListItem";
import Icon from "../components/Icon";
import Text from "../components/Text";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import listingsApi from "../api/listings";
import routes from "../navigation/routes";
import usersApi from "../api/users";

function ListingDetailsScreen({ navigation, route }) {
  const listing = route.params;
  const { user } = useAuth();
  const [listingUser, setListingUser] = useState(null);

  React.useLayoutEffect(() => {
    setListingUser(getListingUser(listing.userId));
    navigation.setOptions({
      headerTitle: "Details",
    });
    if (user.id == listing.userId) {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              navigation.navigate(routes.LISTING_EDIT, {
                listing,
              });
            }}
          >
            <Text style={{ color: "blue" }}>Edit</Text>
          </TouchableOpacity>
        ),
      });
    }
  }, [navigation]);

  const getListingUser = async () => {
    const listingUser = await usersApi.getUser(listing.userId);
    setListingUser(listingUser);
  };

  return (
    <ScrollView>
      <KeyboardAvoidingView
        behavior="position"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 100}
      >
        <Image
          style={styles.image}
          preview={{ uri: listing.images[0].thumbnailUrl }}
          tint="light"
          uri={listing.images[0].url}
        />
        <View style={styles.detailsContainer}>
          <Text style={styles.title}>{listing.title}</Text>
          <Text style={styles.price}>${listing.price}</Text>
          {listingUser && (
            <View style={styles.userContainer}>
              <ListItem
                image={
                  listingUser.iconUrl ? { uri: listingUser.iconUrl } : null
                }
                IconComponent={
                  listingUser.iconUrl ? null : (
                    <Icon
                      name={"account-alert"}
                      size={70}
                      backgroundColor={colors.secondary}
                    />
                  )
                }
                title={listingUser.name}
                subTitle={`${listingUser.listings} Listings`}
              />
            </View>
          )}
          <ContactSellerForm listing={listing} />
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  button: {
    color: colors.secondary,
    alignItems: "center",
    padding: 10,
  },
  detailsContainer: {
    padding: 20,
  },
  image: {
    width: "100%",
    height: 300,
  },
  price: {
    color: colors.secondary,
    fontWeight: "bold",
    fontSize: 20,
    marginVertical: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "500",
  },
  userContainer: {
    marginVertical: 40,
  },
});

export default ListingDetailsScreen;
