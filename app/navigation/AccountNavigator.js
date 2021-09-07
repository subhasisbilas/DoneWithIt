import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import AccountScreen from "../screens/AccountScreen";
import AccountEditScreen from "../screens/AccountEditScreen";
import AccountPasswordScreen from "../screens/AccountPasswordScreen";
import MessagesScreen from "../screens/MessagesScreen";
import TestingScreen from "../screens/TestingScreen";

const Stack = createStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Messages" component={MessagesScreen} />
    <Stack.Screen name="Testing" component={TestingScreen} />
    <Stack.Screen name="AccountEdit" component={AccountEditScreen} />
    <Stack.Screen name="AccountPassword" component={AccountPasswordScreen} />
  </Stack.Navigator>
);

export default AccountNavigator;
