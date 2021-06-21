import useAuth from "../auth/useAuth";
import logger from "../utility/logger";
import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get("/listings");
const getUserListings = () => client.get("/my/listings");

const addListing = (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.value);
  data.append("description", listing.description);

  listing.images.forEach((image, index) =>
    data.append("images", {
      name: "image" + index,
      type: "image/jpeg",
      uri: image,
    })
  );

  if (listing.location)
    data.append("location", JSON.stringify(listing.location));
  console.log("addListing: ", data);
  return client.post(endpoint, data, {
    onUploadProgress: (progress) =>
      onUploadProgress(progress.loaded / progress.total),
  });
};

const deleteListing = (listing) => {
  let url = `/listing/${listing.id}`;
  return client.delete(url);
};

const initializeListings = () => client.get("/initialize");

export default {
  addListing,
  deleteListing,
  getListings,
  getUserListings,
  initializeListings,
};
