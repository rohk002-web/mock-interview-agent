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

export const sendInterviewMessage = async (interviewId, text) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/interview-conversation/${interviewId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        user_answer: text,
      }),
    }
  );
  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "Failed to send message"
    );
  }

  return data;
};

export const endInterviewApi = async (interviewId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(
    `${BASE_URL}/end-interview/${interviewId}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }
  );

  const data = await res.json();

  if (!res.ok) {
    throw new Error(
      data?.detail ||
      data?.message ||
      "Failed to end interview"
    );
  }

  return data;
};
