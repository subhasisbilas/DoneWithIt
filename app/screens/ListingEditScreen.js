import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
} from "react-native";
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
import UploadScreen from "./UploadScreen";
import routes from "../navigation/routes";

const validationSchema = Yup.object().shape({
  title: Yup.string().required().min(1).label("Title"),
  price: Yup.number().required().min(1).max(10000).label("Price"),
  description: Yup.string().label("Description"),
  category: Yup.object().required().nullable().label("Category"),
  images: Yup.array().min(1, "Please select at least one image."),
});

const categories = [
  {
    backgroundColor: "#fc5c65",
    icon: "floor-lamp",
    label: "Furniture",
    value: 1,
  },
  {
    backgroundColor: "#fd9644",
    icon: "car",
    label: "Cars",
    value: 2,
  },
  {
    backgroundColor: "#fed330",
    icon: "camera",
    label: "Cameras",
    value: 3,
  },
  {
    backgroundColor: "#26de81",
    icon: "cards",
    label: "Games",
    value: 4,
  },
  {
    backgroundColor: "#2bcbba",
    icon: "shoe-heel",
    label: "Clothing",
    value: 5,
  },
  {
    backgroundColor: "#45aaf2",
    icon: "basketball",
    label: "Sports",
    value: 6,
  },
  {
    backgroundColor: "#4b7bec",
    icon: "headphones",
    label: "Movies & Music",
    value: 7,
  },
  {
    backgroundColor: "#a55eea",
    icon: "book-open-variant",
    label: "Books",
    value: 8,
  },
  {
    backgroundColor: "#778ca3",
    icon: "application",
    label: "Other",
    value: 9,
  },
];

function ListingEditScreen({ navigation, route }) {
  const location = useLocation();
  const [uploadVisible, setUploadVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isAddMode, setIsAddMode] = useState(false);

  useEffect(() => {
    console.log("route", route.params);

    navigation.setOptions({
      headerTitle: route.params.isAddMode ? "Add Listing" : "Edit Listing",
    });
    setIsAddMode(route.params.isAddMode);
  }, [route.params]);

  React.useLayoutEffect(() => {
    console.log("useLayoutEffect: ", isAddMode);
  });

  const handleSubmit = async (listing, { resetForm }) => {
    setProgress(0);
    setUploadVisible(true);
    const result = await listingsApi.addListing(
      { ...listing, location },
      (progress) => setProgress(progress)
    );
    logger.log("addListing: ", result);
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

  const getInitialValues = () => {
    let values = {
      title: "",
      price: "",
      description: "",
      category: null,
      images: [],
    };
    if (!isAddMode) {
      const listing = route.params.listing ? route.params.listing : values;
      values.title = listing.title;
      values.price = listing.price.toString();
      values.description = listing.description;
      values.category = categories[listing.categoryId - 1];
      const imageUris = listing.images.map((image) => image.url);
      values.images = imageUris;
    }
    return values;
  };

  return (
    <Screen style={styles.container}>
      <ScrollView>
        <UploadScreen
          onDone={() => setUploadVisible(false)}
          progress={progress}
          visible={uploadVisible}
        />

        <Form
          initialValues={getInitialValues()}
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
          <SubmitButton title="Post" />
        </Form>
      </ScrollView>
    </Screen>
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
