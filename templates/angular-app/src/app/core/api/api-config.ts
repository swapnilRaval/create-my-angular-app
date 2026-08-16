import { environment } from '../../../environments/environment';

export const apiConfig = {
  baseUrl: environment.apiUrl.replace(/\/+$/, ''),
  appName: environment.appName,
};
