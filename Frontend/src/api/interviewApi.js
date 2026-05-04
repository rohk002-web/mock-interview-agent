const BASE_URL = import.meta.env.VITE_API_URL;

export const addInterviewDetails = async (data) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/add-interview-details`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(
      responseData?.detail ||
      responseData?.error ||
      responseData?.message ||
      "Failed to save interview details"
    );
  }

  return responseData;
};
