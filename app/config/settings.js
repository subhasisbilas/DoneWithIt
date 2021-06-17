import Constants from "expo-constants";

const settings = {
  dev: {
    // apiURL: "http://192.168.1.10:8080/api", // donna
    apiURL: "http://192.168.1.146:8080/api",
    // apiURL: "https://backend-donewithit.ue.r.appspot.com/api",
  },
  staging: {
    apiURL: "https://backend-donewithit.ue.r.appspot.com/api",
  },
  prod: {
    apiURL: "https://backend-donewithit.ue.r.appspot.com/api",
  },
};

const getCurrentSettings = () => {
  if (__DEV__) return settings.dev;
  if (Constants.manifest.releaseChannel === "staging") return settings.staging;
  return settings.prod;
};

export default getCurrentSettings();
