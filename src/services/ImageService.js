import { auth, storage } from "../../firebase";

export const uriToBlob = (uri) => {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onload = function () {
      // return the blob
      resolve(xhr.response);
    };

    xhr.onerror = function () {
      // something went wrong
      reject(new Error("uriToBlob failed"));
    };

    xhr.responseType = "blob";
    xhr.open("GET", uri, true);

    xhr.send(null);
  });
};

export const uploadToFirebase = (blob, id) => {
  return new Promise((resolve, reject) => {
    var storageRef = storage.ref();
    storageRef
      .child(`uploads/${auth.currentUser.uid}/${id}.jpeg`)
      .put(blob, {
        contentType: "image/jpeg",
      })
      .then((snapshot) => {
        blob.close();
        resolve(snapshot);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAndLoadHttpUrl = (id) => {
  return new Promise((resolve, reject) => {
    var ref = storage.ref(`uploads/${auth.currentUser.uid}/${id}.jpeg`);
    ref
      .getDownloadURL()
      .then((data) => {
        resolve(data);
      })
      .catch((error) => {
        reject("../../assets/icon.png");
      });
  });
};
