import { useEffect } from "react";
import * as Notifications from "expo-notifications";
import expoPushTokensApi from "../api/expoPushTokens";
import logger from "../utility/logger";

export default useNotifications = (notificationListener) => {
  useEffect(() => {
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
    } catch (error) {
      logger.log("Error getting a push token", error);
    }
  };
};
