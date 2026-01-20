export interface Benefit {
  label: string;
}

export interface KeyBenefitsProps {
  benefits?: Benefit[];
}

// Auth API Types
export interface RegisterRequest {
  firstName: string;
  lastName?: string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  status: boolean;
  message: string;
}

export interface VerifyOtpRequest {
  email: string;
  otp: string;
}

export interface VerifyOtpResponse {
  status: boolean;
  message: string;
  orgId: string;
  userId: string;
  token: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginSuccessResponse {
  status: boolean;
  message: string;
  token: string;
  user: {
    userId: string;
    orgId: string;
    fullName: string;
    email: string;
    appRole: string;
    orgRole: string;
    activeCompany: string;
  };
}

export interface LoginRedirectResponse {
  status: boolean;
  message: string;
  token: string;
  redirectUrl: string;
}

export type LoginResponse = LoginSuccessResponse | LoginRedirectResponse;
