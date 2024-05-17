/**
 * @format
 */

import {AppRegistry, Platform} from "react-native";
import App from "./App";
import {name as appName} from "./app.json";
import PushNotification from "react-native-push-notification";

AppRegistry.registerComponent(appName.toLocaleLowerCase(), () => App);

PushNotification.configure({
  onRegister: function (token) {
    console.log("TOKEN:", token);
  },

  onNotification: function (notification) {
    console.log("NOTIFICATION:", notification);
  },

  permissions: {
    alert: true,
    badge: true,
    sound: true,
  },

  popInitialNotification: true,
  requestPermissions: Platform.OS === "ios",
});

PushNotification.createChannel(
  {
    channelId: "your-channel-id",
    channelName: "My channel",
    playSound: true,
    soundName: "default",
    vibrate: true,
  },
  created => console.log(`createChannel returned '${created}'`),
);
