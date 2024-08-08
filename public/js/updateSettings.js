/**
 * Update data function with API and not html.
 *
 * ? Type is either password or user data
 */

import axios from "axios";
import { showAlert } from "./alerts";

export const updateSettings = async function (data, type) {
    try {
        const url =
            type === "password"
                ? "/api/v1/users/updateMyPassword"
                : "/api/v1/users/updateMe";

        const response = await axios({
            method: "PATCH",
            url,
            data,
        });

        if (response.data.status === "success") {
            showAlert("success", `${type.toUpperCase()} updated successfully!`);
        }
    } catch (err) {
        showAlert("error", err.response.data.message);
    }
};
