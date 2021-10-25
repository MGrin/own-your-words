import { API_URL } from "./constants";

export const getAccessToken = async ({ oauthToken, oauthVerifier }) => {
  const res = await fetch(`${API_URL}/twitter/accessToken`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      oauthToken,
      oauthVerifier,
    }),
  });

  if (res.status !== 200 && res.status !== 201) {
    const err = new Error(await res.text());
    throw err;
  }

  const body = await res.json();

  return body;
};

export const getAuthLink = async (callbackUrl) => {
  const res = await fetch(`${API_URL}/twitter/authUrl`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
    },
    body: JSON.stringify({
      callbackUrl,
    }),
  });

  if (res.status !== 200 && res.status !== 201) {
    const err = new Error(await res.text());
    throw err;
  }

  const body = await res.json();
  return body.authUrl;
};
