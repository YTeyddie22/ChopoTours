/**
 * ?Login Module
 * Introducing axios instead of using fetch.
 *? It will throw an error when we get an error from the api endpoint.
 */

import axios from "axios";
import { showAlert } from "./alerts";

export const login = async function (email, password) {
  try {
    const result = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/login",
      data: {
        email,
        password,
      },
    });

    if (result.data.status === "success") {
      showAlert("success", "Logged successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
    console.log(result);
  } catch (err) {
    showAlert("error", err.response.data.message);
  }
};
