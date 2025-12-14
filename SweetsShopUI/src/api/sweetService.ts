import api from "./axiosInstance";

/* ---------- Types ---------- */

export interface Sweet {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface CreateSweetRequest {
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface UpdateSweetRequest {
  name?: string;
  category?: string;
  price?: number;
}

export interface SweetResponse {
  id: number;
  name: string;
  category: string;
  price: number;
  quantity: number;
}

export interface SearchSweetsParams {
  name?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
}

/* ---------- API Method ---------- */

export const getSweets = async (): Promise<Sweet[]> => {
  try {
    const response = await api.get<Sweet[]>("/sweets");
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // FastAPI server error
      throw error.response.data;
    }
    throw error;
  }
};

export const createSweet = async (
  data: CreateSweetRequest
): Promise<SweetResponse> => {
  try {
    const response = await api.post<SweetResponse>(
      "/sweets",
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const updateSweet = async (
  sweetId: number,
  data: UpdateSweetRequest
): Promise<SweetResponse> => {
  try {
    const response = await api.put<SweetResponse>(
      `/sweets/${sweetId}`,
      data
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const deleteSweet = async (
  sweetId: number
): Promise<{ message: string }> => {
  try {
    const response = await api.delete<{ message: string }>(
      `/sweets/${sweetId}`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      // FastAPI server error
      throw error.response.data;
    }
    throw error;
  }
};

export const restockSweet = async (
  sweetId: number,
  quantity: number
): Promise<Sweet> => {
  try {
    const response = await api.post<Sweet>(
      `/sweets/${sweetId}/restock`,
      null, // 👈 no body
      {
        params: { quantity },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};


export const purchaseSweet = async (
  sweetId: number
): Promise<Sweet> => {
  try {
    const response = await api.post<Sweet>(
      `/sweets/${sweetId}/purchase`
    );
    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

export const searchSweets = async (
  params: SearchSweetsParams
): Promise<Sweet[]> => {
  try {
    const response = await api.get<Sweet[]>(
      "/sweets/search",
      {
        params,
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response) {
      throw error.response.data;
    }
    throw error;
  }
};