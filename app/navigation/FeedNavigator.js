import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import ListingDetailsScreen from "../screens/ListingDetailsScreen";
import ListingsScreen from "../screens/ListingsScreen";
import ListingAddScreen from "../screens/ListingAddScreen";
import ListingEditScreen from "../screens/ListingEditScreen";

const Stack = createStackNavigator();

const FeedNavigator = () => (
  <Stack.Navigator initialRouteName="Listings">
    <Stack.Screen
      name="Listings"
      component={ListingsScreen}
      initialParams={{ reloadData: true, filterUser: false }}
    />
    <Stack.Screen name="ListingDetails" component={ListingDetailsScreen} />
    <Stack.Screen name="ListingEdit" component={ListingEditScreen} />
    <Stack.Screen name="ListingAdd" component={ListingAddScreen} />
  </Stack.Navigator>
);

export default FeedNavigator;
