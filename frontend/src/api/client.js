const configuredOrigin = (process.env.REACT_APP_API_URL || '').replace(/\/$/, '');

export const API_ORIGIN = configuredOrigin;

export const apiUrl = (path) => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${API_ORIGIN}${path.startsWith('/') ? path : `/${path}`}`;
};

export const apiFetch = (path, options) => fetch(apiUrl(path), options);
