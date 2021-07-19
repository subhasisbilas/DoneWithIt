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
import Button from "../components/Button";
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

function ListingEditScreen({ navigation, route }) {
  const location = useLocation();
  const [categories] = useCategories();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [formValues] = useState({
    title: "",
    price: "",
    description: "",
    category: null,
    images: [],
  });

  let originalImages = [];

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "Edit Listing",
    });

    const listing = route.params.listing ? route.params.listing : values;
    formValues.title = listing.title;
    formValues.price = listing.price.toString();
    formValues.description = listing.description;
    formValues.category = null; // set when categories arrive
    const imageUris = listing.images.map((image) => image.url);
    formValues.images = imageUris;
    originalImages = imageUris; // save copy
  }, [route.params]);

  useEffect(() => {
    const listing = route.params.listing;
    if (categories) {
      formValues.category = categories.find((c) => c.id === listing.categoryId);
    }
  }, [categories]);

  const handleSubmit = async (formData, { resetForm }) => {
    try {
      setProgress(0);
      setUploadVisible(true);
      const listing = route.params.listing;
      const result = await listingsApi.updateListing(
        { ...formData, location },
        listing,
        (progress) => setProgress(progress)
      );
      // logger.log("updateListing: ", result);
      if (!result.ok) {
        setUploadVisible(false);
        return alert("Could not update the listing");
      }
    } catch (error) {
      console.log("handleSubmit error: ", error.message);
    }

    resetForm();
    navigation.navigate(routes.LISTINGS, {
      reloadData: true,
      filterUser: undefined,
    });
  };

  const deleteListingApi = useApi(listingsApi.deleteListing);

  const deleteListing = async () => {
    try {
      setProgress(0);
      setUploadVisible(true);
      const listing = route.params.listing;
      console.log("delete listing: ", listing.title);
      const result = await deleteListingApi.request(listing, (progress) =>
        setProgress(progress)
      );
      if (!result.ok) {
        console.log("finished: ", result.data);
      }
      navigation.navigate(routes.LISTINGS, {
        reloadData: true,
        filterUser: false,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const deleteListingAlert = () => {
    Alert.alert(
      "Delete Listing",
      "This will remove all data relevant to the current listing!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Delete Listings Cancelled"),
          style: "cancel",
        },
        { text: "Delete Listing", onPress: () => deleteListing() },
      ],
      { cancelable: false }
    );
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
            <SubmitButton title={"Update Listing"} />
            <Button
              title="Delete Listing"
              color="secondary"
              onPress={() => deleteListingAlert()}
            />
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
export default ListingEditScreen;
