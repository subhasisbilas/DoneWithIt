import client from "./client";

const register = (userInfo) => {
  const data = new FormData();
  data.append("email", userInfo.email);
  data.append("name", userInfo.name);
  data.append("password", userInfo.password);
  if (userInfo.iconUrl) {
    data.append("userIcon", {
      name: "userIcon",
      type: "image/jpeg",
      uri: userInfo.iconUrl,
    });
  }

  const result = client.post("/users", data);
  return result;
};

// return the 'user'  or null
const getUser = async (userId) => {
  console.log("getUser: ", userId);
  const result = await client.get(`/user/${userId}`);
  if (result.ok) {
    return result.data;
  }
  return null;
};

// get the user for this listing, and count of their listings
const getListingUser = async (userId) => {
  console.log("getListingUser: ", userId);
  const result = await client.get(`/user/listings/${userId}`);
  if (result.ok) {
    return result.data;
  }
  return null;
};

const updateUser = (userInfo, user, onUploadProgress) => {
  console.log("updateUser api: ", userInfo, user);
  let endpoint = `/users/${user.id}`;
  // only change the form data fields
  const data = new FormData();
  data.append("name", userInfo.name);
  data.append("email", userInfo.email);

  // deleted  existing icon.
  if (user.iconUrl && user.iconUrl !== userInfo.iconUrl) {
    console.log("delteing original icon", userInfo.iconUrl, user.iconUrl);
    data.append("deleteOrigIcon", true);
  } else {
    console.log("not deleting original icon: ", userInfo.iconUrl, user.iconUrl);
    data.append("deleteOrigIcon", false);
  }

  // if the icon is the same don't reload
  if (userInfo.iconUrl && userInfo.iconUrl != user.iconUrl) {
    // adding/replacing icon
    console.log("adding new icon: ", userInfo.userIcon, user.iconUrl);
    data.append("userIcon", {
      name: "userIcon",
      type: "image/jpeg",
      uri: userInfo.iconUrl,
    });
  } else {
    console.log("NOT adding icon: ", userInfo.userIcon, user.iconUrl);
  }
  const config = {
    onUploadProgress: (progressEvent) =>
      onUploadProgress(Math.trunc(progressEvent.loaded / progressEvent.total)),
  };

  return client.put(endpoint, data, config);
};

const deleteUser = (user, onDownloadProgress) => {
  let endpoint = `/user/${user.id}`;
  let data = {};
  const config = {
    onDownloadProgress: (progressEvent) => {
      onDownloadProgress(
        Math.trunc(progressEvent.loaded / progressEvent.total)
      );
    },
  };
  const resp = client.delete(endpoint, data, config);
  return resp;
};

export default { register, deleteUser, updateUser, getUser, getListingUser };
