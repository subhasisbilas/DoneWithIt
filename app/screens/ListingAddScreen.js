import React, { useState, useEffect } from "react";
import { StyleSheet, ScrollView, Alert } from "react-native";
import * as Yup from "yup";
import logger from "../utility/logger";

import {
  Form,
  FormField,
  FormPicker as Picker,
  SubmitButton,
} from "../components/forms";
import CategoryPickerItem from "../components/CategoryPickerItem";
import Screen from "../components/Screen";
import FormImagePicker from "../components/forms/FormImagePicker";
import listingsApi from "../api/listings";
import useLocation from "../hooks/useLocation";
import useCategories from "../hooks/useCategories";
import UploadScreen from "./UploadScreen";
import routes from "../navigation/routes";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

function ListingAddScreen({ navigation }) {
  const location = useLocation();
  const [categories, categoriesLoading] = useCategories();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formValues] = useState({
    title: "",
    price: "",
    description: "",
    category: null,
    images: [],
  });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Add Listing",
    });
  }, []);

  const handleSubmit = async (listing, { resetForm }) => {
    console.log("addListing handleSubmit");
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.addListing(
      { ...listing, location },
      (progress) => setProgress(progress)
    );
    logger.log("addListing done: ", result.data);
    if (!result.ok) {
      setUploadVisible(false);
      return alert("Could not save the listing");
    }

    resetForm();
    navigation.navigate(routes.LISTINGS, {
      reloadData: true,
      filterUser: false,
    });
  };

  return (
    <>
      <Screen style={styles.container}>
        <ScrollView>
          <UploadScreen
            onDone={() => setUploadVisible(false)}
            progress={progress}
            visible={uploadVisible}
          />

          <Form
            enableReinitialize={true}
            initialValues={formValues}
            onSubmit={handleSubmit}
            validationSchema={validationSchema}
          >
            <FormImagePicker name="images" />
            <FormField maxLength={255} name="title" placeholder="Title" />
            <FormField
              keyboardType="numeric"
              maxLength={8}
              name="price"
              placeholder="Price"
              width={120}
            />
            <Picker
              items={categories}
              name="category"
              numberOfColumns={3}
              PickerItemComponent={CategoryPickerItem}
              placeholder="Category"
              width="50%"
            />
            <FormField
              maxLength={255}
              multiline
              name="description"
              numberOfLines={3}
              autoCorrect={false}
              placeholder="Description"
            />
            <SubmitButton title="Add Listing" />
          </Form>
        </ScrollView>
      </Screen>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    // flexDirection: "row",
    flex: 1,
    padding: 10,
  },
});
export default ListingAddScreen;
