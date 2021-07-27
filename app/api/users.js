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

export default { register };
