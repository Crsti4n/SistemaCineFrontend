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
