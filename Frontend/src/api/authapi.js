const BASE_URL = import.meta.env.VITE_API_URL;

const extractErrorMessage = async (res) => {
  try {
    const data = await res.json();
    return data?.message || data?.detail;
  } catch {
    try {
      const text = await res.text();
      return text;
    } catch {
      return null;
    }
  }
};

export const registerUser = async (data) => {
  const res = await fetch(`${BASE_URL}/create-user`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const message = (await extractErrorMessage(res)) || "Registration failed";
    throw new Error(message);
  }

  return res.json();
};

export const loginUser = async (data) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const message = (await extractErrorMessage(res)) || "Login failed";
    throw new Error(message);
  }

  return res.json();
};