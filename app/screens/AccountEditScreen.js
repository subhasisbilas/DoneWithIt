import React, { useState } from "react";
import { StyleSheet, View, Text, Alert } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import Button from "../components/Button";
import usersApi from "../api/users";
import useAuth from "../auth/useAuth";
import useApi from "../hooks/useApi";
import authApi from "../api/auth";
import routes from "../navigation/routes";
import UploadScreen from "./UploadScreen";

import {
  ErrorMessage,
  Form,
  FormField,
  SubmitButton,
} from "../components/forms";
import FormUserIconPicker from "../components/forms/FormUserIconPicker";
import Checkbox from "../components/Checkbox";
import auth from "../api/auth";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().label("Name"),
  email: Yup.string().required().email().label("Email"),
  // userIcon: Yup.string().optional(),
});

function AccountEditScreen({ navigation }) {
  const { user, logIn, logOut } = useAuth();
  const [error, setError] = useState();
  const deleteUserApi = useApi(usersApi.deleteUser);
  const updateUserApi = useApi(usersApi.updateUser);

  const [formValues] = useState({
    name: user.name,
    email: user.email,
    iconUrl: user.iconUrl,
  });
  const [checked, onChange] = useState(false);
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleSubmit = async (userInfo) => {
    try {
      console.log("handleSubmit: ", userInfo);
      setProgress(0);
      setUploadVisible(true);
      const result = await updateUserApi.request(userInfo, user, (progress) => {
        console.log("progress: ", progress);
        setProgress(progress);
      });

      if (!result.ok) {
        console.log("update refresh failed: ", result.data);
        return;
      }
      logOut();
    } catch (error) {
      console.log("handleSubmit: ", error);
    }
  };

  const deleteUser = async () => {
    try {
      setProgress(0);
      setUploadVisible(true);
      console.log("delete user: ", user.name);
      const result = await deleteUserApi.request(user, (progress) =>
        setProgress(progress)
      );
      if (!result.ok) {
        console.log("finished: ", result.data);
      }
      console.log("deleteOk: ", result.data);
      logOut();
    } catch (error) {
      console.log("deleteUser error: ", error);
    }
  };

  const deleteUserAlert = () => {
    Alert.alert(
      "Delete Yourself",
      "This will remove all data relevant to the your inluding any listings!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete User Cancelled"),
          style: "cancel",
        },
        { text: "Delete Yourself", onPress: () => deleteUser() },
      ],
      { cancelable: false }
    );
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

          <View style={styles.iconContainer}>
            <FormUserIconPicker name="iconUrl" />
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

          <SubmitButton title="Update" />
          <Button
            title="Delete Myself"
            color="secondary"
            onPress={() => deleteUserAlert()}
          />
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

export default AccountEditScreen;
