import axios from "axios";
import { showAlert } from "./alerts";

const stripe = Stripe(
    "pk_test_51LwdjmEMxU7yGtcvw35aUuITwXj6Dgq1zC94sb40xykxKdjIAbCCj9Tbjq501vrMfBOWCmZ6JwZunzB5jpDVLyIZ004HpDAv60"
);

export const bookTour = async function (tourId) {
    /**
		* 1 Get session from server;
		* 2 Create checkout form and charge the credit card;

	 */
    try {
        //* 1 Get session from server;s

        const session = await axios(
            `http://127.0.0.1:3000/api/v1/booking/checkout-session/${tourId}`
        );

        console.log(session);

        //* 2 Create checkout form and charge the credit card;

        await stripe.redirectToCheckout({
            sessionId: session.data.session.id,
        });
    } catch (err) {
        console.log(err);
        showAlert("error", err);
    }
};
