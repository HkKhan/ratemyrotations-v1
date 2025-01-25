// api.js
import config from "../config";

export const searchRotations = async (query) => {
  const response = await fetch(
    `${config.apiBaseUrl}/search?q=${encodeURIComponent(query)}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};

export const submitRotationReview = async (formData) => {
  console.log("formdata", formData);
  const response = await fetch(`${config.apiBaseUrl}/submit-review`, {
    // Changed from /rotations
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  return response.json();
};
