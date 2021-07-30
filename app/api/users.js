import client from "./client";

const register = (userInfo) => {
  const data = new FormData();
  data.append("email", userInfo.email);
  data.append("name", userInfo.name);
  data.append("password", userInfo.password);
  data.append("userIcon", {
    name: "userIcon",
    type: "image/jpeg",
    uri: userInfo.userIcon,
  });
  const result = client.post("/users", data);
  return result;
};

// return the user data or null
const getUser = async (userId) => {
  const result = await client.get(`/user/${userId}`);
  if (result.ok) {
    return result.data;
  }
  return null;
};

export default { register, getUser };
