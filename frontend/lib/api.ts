const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://finpilot-backend-jodg.onrender.com";

export async function uploadPDF(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  try {
    const response = await fetch(`${BASE_URL}/api/upload`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson.detail || errJson.message || `Upload failed with status ${response.status}`;
      throw new Error(errMsg);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Connecting to backend... Render free-tier instance takes ~30s to wake up. Please wait 15 seconds and try again!");
    }
    throw error;
  }
}

export async function chatWithAI(
  question: string,
  profile: Record<string, unknown>
) {
  try {
    const response = await fetch(`${BASE_URL}/api/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question,
        profile,
      }),
    });

    if (!response.ok) {
      const errJson = await response.json().catch(() => ({}));
      const errMsg = errJson.detail || errJson.message || `Chat failed with status ${response.status}`;
      throw new Error(errMsg);
    }

    return await response.json();
  } catch (error: unknown) {
    if (error instanceof TypeError && error.message.includes("fetch")) {
      throw new Error("Unable to reach backend server. Please wait a moment while the server warms up.");
    }
    throw error;
  }
}