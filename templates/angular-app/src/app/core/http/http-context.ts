import { HttpContextToken } from '@angular/common/http';

export const SKIP_AUTH = new HttpContextToken(() => false);
export const SKIP_LOADING = new HttpContextToken(() => false);
export const SKIP_GLOBAL_ERROR = new HttpContextToken(() => false);
