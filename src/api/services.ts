import axiosInstance from './axios';
import type {
  LoginRequest,
  RegisterRequest,
  User,
  Pelicula,
  Funcion,
  Compra,
  CompraRequest,
  DetalleCompraRequest,
  Genero, // Added
  Clasificacion, // Added
  MetodoPago, // Added
} from '../types';

export const authService = {
  login: async (credentials: LoginRequest): Promise<User> => {
    const { data } = await axiosInstance.post('/api/Auth/login', credentials);
    return data;
  },

  register: async (userData: RegisterRequest): Promise<User> => {
    const { data } = await axiosInstance.post('/api/Auth/registro', userData);
    return data;
  },
};

export const peliculasService = {
  getAll: async (): Promise<Pelicula[]> => {
    const { data } = await axiosInstance.get('/api/Peliculas');
    return data;
  },

  getById: async (id: number): Promise<Pelicula> => {
    const { data } = await axiosInstance.get(`/api/Peliculas/${id}`);
    return data;
  },

  search: async (texto: string): Promise<Pelicula[]> => {
    const { data } = await axiosInstance.get(`/api/Peliculas/buscar/${texto}`);
    return data;
  },

  // NEW: CRUD operations for Peliculas
  create: async (pelicula: Omit<Pelicula, 'id' | 'genero' | 'clasificacion'> & { generoId: number; clasificacionId: number }): Promise<Pelicula> => {
    const { data } = await axiosInstance.post('/api/Peliculas', pelicula);
    return data;
  },

  update: async (id: number, pelicula: Omit<Pelicula, 'id' | 'genero' | 'clasificacion'> & { generoId: number; clasificacionId: number }): Promise<Pelicula> => {
    const { data } = await axiosInstance.put(`/api/Peliculas/${id}`, pelicula);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/Peliculas/${id}`);
  },
};

// NEW: Generos Service
export const generosService = {
  getAll: async (): Promise<Genero[]> => {
    const { data } = await axiosInstance.get('/api/Generoes');
    return data;
  },
};

// NEW: Clasificaciones Service
export const clasificacionesService = {
  getAll: async (): Promise<Clasificacion[]> => {
    const { data } = await axiosInstance.get('/api/Clasificaciones');
    return data;
  },
};

export const funcionesService = {
  getAll: async (): Promise<Funcion[]> => {
    const { data } = await axiosInstance.get('/api/Funcions');
    return data;
  },

  getByPelicula: async (peliculaId: number): Promise<Funcion[]> => {
    const { data } = await axiosInstance.get('/api/Funcions');
    return data.filter((f: Funcion) => f.peliculaId === peliculaId);
  },
};

export const comprasService = {
  getAll: async (): Promise<Compra[]> => {
    const { data } = await axiosInstance.get('/api/Compras');
    return data;
  },

  create: async (compra: CompraRequest): Promise<Compra> => {
    const { data } = await axiosInstance.post('/api/Compras', compra);
    return data;
  },

  createDetalle: async (detalle: DetalleCompraRequest): Promise<void> => {
    await axiosInstance.post('/api/DetalleCompras', detalle);
  },
};

// NEW: MetodoPago Service
export const metodoPagoService = {
  getAll: async (): Promise<MetodoPago[]> => {
    const { data } = await axiosInstance.get('/api/MetodoPagoes');
    return data;
  },

  create: async (metodoPago: Omit<MetodoPago, 'id'>): Promise<MetodoPago> => {
    const { data } = await axiosInstance.post('/api/MetodoPagoes', metodoPago);
    return data;
  },

  update: async (id: number, metodoPago: Omit<MetodoPago, 'id'>): Promise<MetodoPago> => {
    const { data } = await axiosInstance.put(`/api/MetodoPagoes/${id}`, metodoPago);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/MetodoPagoes/${id}`);
  },
};
