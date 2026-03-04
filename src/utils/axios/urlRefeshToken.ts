const backendEndpoint = import.meta.env.VITE_BACKEND_ENDPOINT;
const urlRefreshTokenDefault: string  = `${backendEndpoint}/auth/refresh-token`;
export default urlRefreshTokenDefault;
