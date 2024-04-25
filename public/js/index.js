/**
 * Base of all modules
 */

import "@babel/polyfill";
import { displayMap } from "./mapbox";
import { login, logout, signup } from "./login";
import { updateSettings } from "./updateSettings";
import { bookTour } from "./stripe";

//! DOM Elements

const mapBox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const signupForm = document.querySelector(".form--signup");
const logOutBtn = document.querySelector(".nav__el--logout");
const userDataForm = document.querySelector(".form-user-data");
const userPasswordForm = document.querySelector(".form-user-password");
const bookBtn = document.getElementById("book-tour");

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
/**
 * !Submit Signup form handler
 */
if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const name = document.getElementById("name").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        signup(name, email, password, confirmPassword);
    });
}

if (logOutBtn) logOutBtn.addEventListener("click", logout);

/**
 * ! Update the User Data;
 */

if (userDataForm)
    userDataForm.addEventListener("submit", (e) => {
        e.preventDefault();

        /**
         * Creating a multipart form data to work with API
         */
        const form = new FormData();
        form.append("name", document.getElementById("name").value);
        form.append("email", document.getElementById("email").value);
        form.append("photo", document.getElementById("photo").files[0]);

        console.log(form);

        /**
 *  const email = document.getElementById("email").value;
    const name = document.getElementById("name").value;
 */

        updateSettings(form, "data");
    });

/**
 * ! Update the User Password;
 */

if (userPasswordForm)
    userPasswordForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        document.querySelector(".btn--save-password ").textContent =
            "Updating...";
        const currentPassword =
            document.getElementById("password-current").value;
        const password = document.getElementById("password").value;
        const confirmPassword =
            document.getElementById("confirmPassword").value;

        await updateSettings(
            { currentPassword, password, confirmPassword },
            "password"
        );
        document.querySelector(".btn--save-password ").textContent =
            "save password".toUpperCase();
        document.getElementById("password-current").value = "";
        document.getElementById("password").value = "";
        document.getElementById("confirmPassword").value = "";
    });

/**
 * ! Checking for the book button;
 * Will create a checkout session on Click
 */

if (bookBtn)
    bookBtn.addEventListener("click", (e) => {
        e.target.textContent = "Processing...";
        const { tourId } = e.target.dataset;

        bookTour(tourId);
    });

/**
 *
 * TODO ~ Sign Up;
 */
