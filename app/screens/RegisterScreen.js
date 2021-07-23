import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import usersApi from "../api/users";
import authApi from "../api/auth";
import useAuth from "../auth/useAuth";
import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import FormUserIconPicker from "../components/forms/FormUserIconPicker";
import Checkbox from "../components/Checkbox";
import useApi from "../hooks/useApi";
import ActivityIndicator from "../components/ActivityIndicator";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
  userIcon: Yup.string().optional(),
});

function RegisterScreen() {
  const registerApi = useApi(usersApi.register);
  const loginApi = useApi(authApi.login);
  const auth = useAuth();
  const [error, setError] = useState();
  const [formValues] = useState({
    name: "",
    email: "",
    password: "",
    userIcon: null,
  });
  const [checked, onChange] = useState(false);

  const handleSubmit = async (userInfo) => {
    const result = await registerApi.request(userInfo);
    console.log("register result", result);
    if (!result.ok) {
      if (result.data) setError(result.data.error);
      else {
        setError("An unexpected error occurred.");
        console.log(result);
      }
      return;
    }

    const { data: authToken } = await loginApi.request(
      userInfo.email,
      userInfo.password
    );
    auth.logIn(authToken);
  };

  return (
    <>
      <ActivityIndicator visible={registerApi.loading || loginApi.loading} />
      <Screen style={styles.container}>
        <Form
          initialValues={formValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={error} visible={error} />

          <View style={styles.iconContainer}>
            <FormUserIconPicker name="userIcon" />
            <View style={styles.checkbox}>
              <Checkbox checked={checked} onChange={onChange} />
              <Text style={styles.checkboxLabel}>Use Camera</Text>
            </View>
          </View>

          <FormField
            autoCorrect={false}
            icon="account"
            name="name"
            placeholder="Name"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="email"
            keyboardType="email-address"
            name="email"
            placeholder="Email"
            textContentType="emailAddress"
          />
          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="password"
            placeholder="Password"
            secureTextEntry
            textContentType="password"
          />
          <SubmitButton title="Register" />
        </Form>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  iconContainer: {
    alignItems: "center",
    flexDirection: "row",
  },
  checkbox: {
    flexDirection: "row",
    marginLeft: 20,
  },
  checkboxLabel: {
    marginLeft: 8,
    fontWeight: "500",
    fontSize: 18,
  },
});

export default RegisterScreen;
