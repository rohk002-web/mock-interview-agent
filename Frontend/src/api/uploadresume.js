const BASE_URL = import.meta.env.VITE_API_URL;

export const uploadResume = async (formData) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/upload-documents`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  });

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({}));
    throw new Error(errorData?.message || "Upload failed");
  }

  return await res.json();
};