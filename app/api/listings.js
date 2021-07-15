import logger from "../utility/logger";
import client from "./client";

const endpoint = "/listings";

const getListings = () => client.get("/listings");
const getUserListings = (userId) => client.get(`/my/listings/${userId}`);

const addListing = (listing, onUploadProgress) => {
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.id);
  data.append("description", listing.description);

  for (const index in listing.images) {
    const image = listing.images[index];
    data.append("images", {
      name: "image" + index,
      type: "image/jpeg",
      uri: image,
    });
  }

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

const urlFilename = (url) => {
  const fullname = url.split("/").pop();
  const filename = fullname.substr(0, fullname.lastIndexOf("."));
  return filename;
};

const updateListing = (listing, listingOrig, onUploadProgress) => {
  console.log("updateListing: ");
  // console.log(listingOrig.images);
  const data = new FormData();
  data.append("title", listing.title);
  data.append("price", listing.price);
  data.append("categoryId", listing.category.id);
  data.append("description", listing.description);

  let deletedFilenames = []; // orig images user has deleted.
  let existingFilenames = []; // orig images not to be uploaded again

  // if orig exists in new remove from new. dont duplicate
  // if orig does NOT exist, delete from images
  for (const index in listingOrig.images) {
    const image = listingOrig.images[index];
    const foundIndex = listing.images.indexOf(image.url);
    const fullname = urlFilename(image.url);
    // remove _full or _thumb
    const nofull = fullname.replace("_full", "");
    const fileName = nofull.replace("_thumb", "");

    if (foundIndex === -1) {
      // delete this image from storage only
      deletedFilenames.push(fileName);
    } else {
      // existing image has been uploaded, just add reference to image
      existingFilenames.push(fileName);
      listing.images.splice(foundIndex, 1);
    }
  }

  data.append("existingFilenames", JSON.stringify(existingFilenames));
  data.append("deletedFilenames", JSON.stringify(deletedFilenames));

  for (const index in listing.images) {
    const imageUri = listing.images[index];
    data.append("images", {
      name: "image" + index,
      type: "image/jpeg",
      uri: imageUri,
    });
  }

  if (listing.location)
    data.append("location", JSON.stringify(listing.location));

  let endpoint = `/listings/${listingOrig.id}`;
  const config = {
    onUploadProgress: (progressEvent) =>
      onUploadProgress(
        Math.round((progressEvent.loaded * 100) / progressEvent.total)
      ),
  };
  console.log("data: ", data);
  return client.put(endpoint, data, config);
};

const initializeListings = () => client.get("/initialize");

export default {
  addListing,
  deleteListing,
  updateListing,
  getListings,
  getUserListings,
  initializeListings,
};
