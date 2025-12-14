import api from "./axiosInstance";

/* ---------- Types ---------- */

export interface RegisterRequest {
  username: string;
  full_name:string;
  email: string;
  password: string;
}

export interface RegisterResponse {
  message: string;
  user_id?: number;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string; // usually "bearer"
  user: any;
}

/* ---------- API Method ---------- */

export const registerUser = async (
  data: RegisterRequest
): Promise<RegisterResponse> => {
  try {
    const response = await api.post<RegisterResponse>(
      "/auth/register",
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // FastAPI validation / server error
      throw error.response.data;
    }
    throw error;
  }
};


export const loginUser = async (
  data: LoginRequest
): Promise<LoginResponse> => {

  try {
    const formData = new URLSearchParams();
  formData.append("username", data.username);
  formData.append("password", data.password);

  const response = await api.post<LoginResponse>(
    "/auth/login",
    formData,
    {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }
  );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // FastAPI auth / validation error
      throw error.response.data;
    }
    throw error;
  }
};

