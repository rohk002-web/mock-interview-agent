const BASE_URL = import.meta.env.VITE_API_URL;

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    throw new Error(
      responseData?.detail ||
      responseData?.error ||
      responseData?.message ||
      "Registration failed"
    );
  }

  return responseData;
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  const responseData = await res.json();

  if (!res.ok) {
    // ✅ same fix here
    throw new Error(
      responseData?.detail ||
      responseData?.error ||
      responseData?.message ||
      "Login failed"
    );
  }

  return responseData;
};