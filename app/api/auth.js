import client from "./client";

const login = (email, password) => {
  const result = client.post("/auth/login", { email, password });
  return result;
};

// called after updating our user
const refresh = (userId) => {
  console.log("refresh: ", userId);
  const result = client.post("/auth/refresh", { userId });
  return result;
};

export default {
  login,
  refresh,
};
