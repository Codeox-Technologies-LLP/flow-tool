import Cookies from "js-cookie";

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export const cookieStorage = {
  // Auth token
  setAuthToken: (token: string) => {
    Cookies.set("auth_token", token, COOKIE_OPTIONS);
  },

  getAuthToken: (): string | undefined => {
    return Cookies.get("auth_token");
  },

  removeAuthToken: () => {
    Cookies.remove("auth_token");
  },

  // User info
  setUserInfo: (userInfo: object) => {
    Cookies.set("user_info", JSON.stringify(userInfo), COOKIE_OPTIONS);
  },

  getUserInfo: <T = unknown>(): T | null => {
    const userInfo = Cookies.get("user_info");
    if (!userInfo) return null;
    try {
      return JSON.parse(userInfo);
    } catch {
      return null;
    }
  },

  removeUserInfo: () => {
    Cookies.remove("user_info");
  },

  // Registration data (temporary)
  setTempRegisterData: (data: object) => {
    Cookies.set("temp_register_data", JSON.stringify(data), {
      expires: 1 / 24, // 1 hour
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax" as const,
    });
  },

  getTempRegisterData: <T = unknown>(): T | null => {
    const data = Cookies.get("temp_register_data");
    if (!data) return null;
    try {
      return JSON.parse(data);
    } catch {
      return null;
    }
  },

  removeTempRegisterData: () => {
    Cookies.remove("temp_register_data");
  },

  // Clear all auth-related cookies
  clearAll: () => {
    Cookies.remove("auth_token");
    Cookies.remove("user_info");
    Cookies.remove("temp_register_data");
  },
};
