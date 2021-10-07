import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import expoPushTokensApi from "../api/expoPushTokens";
import Constants from "expo-constants";
import { Platform } from "react-native";
import logger from "../utility/logger";

export default useNotifications = (notificationListener) => {
  useEffect(() => {
    if (!Constants.isDevice) {
      logger.log("pushTokens require a device not simulator");
      return;
    }
    registerForPushNotifications();

    if (notificationListener)
      Notifications.addNotificationReceivedListener(notificationListener);
  }, []);

  const registerForPushNotifications = async () => {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== "granted") return;

      const tokenObject = await Notifications.getExpoPushTokenAsync();
      const token = tokenObject.data;
      logger.log("expo push'token: ", token);
      expoPushTokensApi.register(token);

      if (Platform.OS === "android") {
        Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }
    } catch (error) {
      logger.log("Error getting a push token", error);
    }
  };
};
