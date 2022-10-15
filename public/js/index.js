/**
 * Base of all modules
 */

import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login, logout } from "./login";
import { updateSettings } from "./updateSettings";

//! DOM Elements

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");

//! Check for mapbox;

if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);

  displayMap(locations);
}

/**
 * !Submit login form handler
 */
if (loginForm) {
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    login(email, password);
  });
}

if (logOutBtn) logOutBtn.addEventListener("click", logout);

/**
 * ! Update the User Data;
 */

if (userDataForm)
  userDataForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;

    updateSettings(name, email);
  });
/**
 *
 * TODO ~ Sign Up;
 */
