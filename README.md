# DoneWithIt

A React-Native tutorial app running under the **Expo** framework. This is a good app to understand the basic principals of React-Native. It will run under iOS or Android. The backend server for this app can be found at: [Server](https://github.com/artgravina/DoneWithIt-Service.git)

- login/register
- JSON Web Token Authorization for secure api access
- UI Components build from base React-Native
- Notifications to users (both Android and iOS)
- Backend server to support data storage. Config either of the following
  -- local JSON data and Image Storage for simple clear project learning
  -- Google Cloud using Gcloud Storage and Firebase Collections. Requires Google Cloud account and familiarity.
- Full Crud for data (add, edit, delete, show)
- Easy configurable structure to add your own Server support, such as Amazon AWS, Mongo, etc.
- Expo will easily provide mechanism to distribute app to Apple's App Store or Google Play

## Packages used

- _expo_. Main framework to provide support for iOS/Adroid build, test and deploy.
- _expo-secure-store_. Local secure storage for jwt tokenized user
- _jwt-decode_. Supprt tokenize user for security
- _expo-status-bar_. Provides the bottom status bar.
- _formik_. Form support.
- _expo-image-picker_. Provides fast flexible image support. Includes cache.
- _expo-notifications_. Provide common notification code to both platforms.
- _expo-location_. GPS support to both platforms.
- _expo-image-picker_. Common support for device photo library and camera.
- _lottie-react-native_. Dynamic graphics such as in progress, complete images.
- _Yup_. Schema support
- _react native packages_
  -- gesture-handler
  -- expo-image-cache
  -- progress
  -- reanimated
  -- safe-area-context
  -- svg
  -- web

## Installation instructions to follow
