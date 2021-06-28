import logger from "../utility/logger";
import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get("/listings");
const getUserListings = () => client.get("/my/listings");

const addListing = (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.id);
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
  const config = {
    onUploadProgress: (progressEvent) =>
      onUploadProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      ),
  };
  return client.post(endpoint, data, config);
};

const deleteListing = (listing, onUploadProgress) => {
  let endpoint = `/listing/${listing.id}`;
  let data = {};
  const config = {
    onDownloadProgress: function (progressEvent) {
      onUploadProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      );
    },
  };
  return client.delete(endpoint, data, config);
};

const initializeListings = () => client.get("/initialize");

export default {
  addListing,
  deleteListing,
  getListings,
  getUserListings,
  initializeListings,
};
