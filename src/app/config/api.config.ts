import { environment } from "../../environments/environment";

export const API_CONFIG = {
  baseUrl:"https://localhost:7071",
  apiUrl: environment.production
    ? 'https://server.com/api/v1'
    : 'https://localhost:7071/api/v1',
  version: 'v1',
  timeout: 30000
};
