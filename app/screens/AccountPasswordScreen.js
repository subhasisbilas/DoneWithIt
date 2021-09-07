import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import Button from "../components/Button";
import usersApi from "../api/users";
import useAuth from "../auth/useAuth";
import authApi from "../api/auth";
import useApi from "../hooks/useApi";
import routes from "../navigation/routes";
import UploadScreen from "./UploadScreen";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";

const validationSchema = Yup.object().shape({
  originalPassword: Yup.string().required().label("OriginalPassword"),
  newPassword: Yup.string().required().min(4).label("NewPassword"),
  verifyPassword: Yup.string().required().label("VerifyPassword"),
});

function AccountPasswordScreen({ navigation }) {
  const { user, logOut } = useAuth();
  const [error, setError] = useState();
  const changePasswordApi = useApi(usersApi.changePassword);

  const [formValues] = useState({
    originalPassword: "",
    newPassword: "",
    verifyPassword: "",
  });

  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (passwordInfo) => {
    try {
      setProgress(0);
      setUploadVisible(true);
      const ret = await authApi.login(
        user.email,
        passwordInfo.originalPassword
      );
      if (!ret.ok) {
        setUploadVisible(false);
        setError("The original password is incorrect");
        return;
      }

      if (passwordInfo.newPassword !== passwordInfo.verifyPassword) {
        setUploadVisible(false);
        setError("New passord does not match Verify passord");
        return;
      }

      const result = await changePasswordApi.request(
        user.id,
        passwordInfo.newPassword,
        (progress) => {
          console.log("progress: ", progress);
          setProgress(progress);
        }
      );
      console.log("changePassword result: ", result);
      if (!result.ok) {
        console.log("update refresh failed: ", result.data.error);
        setError(result.data.error);
        setUploadVisible(false);
        return;
      }
      setProgress(1);
      setUploadVisible(false);
      logOut();
    } catch (error) {
      console.log("handleSubmit: ", error);
      setError(error.message);
      setUploadVisible(false);
    }
  };

  return (
    <>
      <Screen style={styles.container}>
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />
        <Form
          initialValues={formValues}
          onSubmit={handleSubmit}
          validationSchema={validationSchema}
        >
          <ErrorMessage error={error} visible={error} />

          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="originalPassword"
            placeholder="Original Password"
            secureTextEntry
            textContentType="password"
          />

          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="newPassword"
            placeholder="New Password"
            secureTextEntry
            textContentType="password"
          />

          <FormField
            autoCapitalize="none"
            autoCorrect={false}
            icon="lock"
            name="verifyPassword"
            placeholder="Verify Password"
            secureTextEntry
            textContentType="password"
          />

          <SubmitButton title="Change Password" />
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

export default AccountPasswordScreen;
