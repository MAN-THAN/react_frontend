let accessToken = null;
let onTokenChange = null;

export const getAccessToken = () => accessToken;

export const setAccessToken = (token) => {
  accessToken = token;

  if (onTokenChange) {
    onTokenChange(token);
  }
};

export const clearAccessToken = () => {
  accessToken = null;

  if (onTokenChange) {
    onTokenChange(null);
  }
};

export const subscribeToTokenChange = (callback) => {
  onTokenChange = callback;

  return () => {
    onTokenChange = null;
  };
};