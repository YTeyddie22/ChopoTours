/**
 * Alert is either success or error;
 */

export const showAlert = function (type, message) {
  hideAlertMessage();
  const markup = `<div class = "alert alert--${type}">${message}</div>`;
  document.querySelector("body").insertAdjacentHTML("afterbegin", markup);

  window.setTimeout(hideAlertMessage, 6000);
};

/**
 * Hide Alert message
 */

export const hideAlertMessage = function () {
  const el = document.querySelector(".alert");
  if (el) el.parentElement.removeChild(el);
};
