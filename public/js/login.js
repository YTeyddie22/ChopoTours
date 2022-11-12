/**
 * ?Login Module
 * Introducing axios instead of using fetch.
 *? It will throw an error when we get an error from the api endpoint.
 */

import axios from "axios";
import { showAlert } from "./alerts";

/**
 * TODO ~ Sign Up;
 */

export const signup = async function (name, email, password, confirmPassword) {
  try {
    const result = await axios({
      method: "POST",
      url: "http://127.0.0.1:3000/api/v1/users/signup",
      data: {
        name,
        email,
        password,
        confirmPassword,
      },
    });

    if (result.data.status === "success") {
      showAlert("success", "Signed up successfully");
      window.setTimeout(() => {
        location.assign("/");
      }, 1500);
    }
    console.log(result);
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message);
  }
};

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
  } catch (err) {
    console.log(err);
    showAlert("error", err.response.data.message.trim());
  }
};

/**
 * !Logging out;
 */
export const logout = async function () {
  try {
    const response = await axios({
      method: "GET",
      url: "http://127.0.0.1:3000/api/v1/users/logout",
    });

    if (response.data.status === "success") location.reload(true);
  } catch (err) {
    console.log(err);
    showAlert("error", "Error Logging out! Please try again");
  }
};
