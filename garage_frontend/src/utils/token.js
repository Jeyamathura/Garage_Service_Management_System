export const setTokens = (access, refresh) => {
  localStorage.setItem("access", access);
  localStorage.setItem("refresh", refresh);
};

export const getAccessToken = () =>
  localStorage.getItem("access");

export const clearTokens = () => {
  localStorage.clear();
};

export const getRefreshToken = () =>
  localStorage.getItem("refresh");
