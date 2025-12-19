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
  Genero,
  Clasificacion,
  MetodoPago,
  UserProfile,
  ActiveTicket,
  PurchaseHistoryItem,
  UpdatePasswordRequest,
  UserPreferences,
  UsuarioCompleto,
  CreateUserRequest,
  UpdateUserRequest,
  EmployeePurchaseRequest,
  AdminUsuarioCompleto,
  CreateAdminUserRequest,
  UpdateAdminUserRequest,
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
    const { data } = await axiosInstance.get('/api/Clasificacions'); // ← Nombre correcto del backend
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

  createEmployeePurchase: async (purchaseData: EmployeePurchaseRequest): Promise<Compra> => {
    const { data } = await axiosInstance.post('/api/compras/empleado', purchaseData);
    return data;
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

// NEW: Profile Service
export const profileService = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await axiosInstance.get('/api/user/profile');
    return data;
  },
  getActiveTickets: async (): Promise<ActiveTicket[]> => {
    const { data } = await axiosInstance.get('/api/user/tickets/active');
    return data;
  },
  getPurchaseHistory: async (): Promise<PurchaseHistoryItem[]> => {
    const { data } = await axiosInstance.get('/api/user/orders/history');
    return data;
  },
  updateProfile: async (profileData: UserProfile): Promise<UserProfile> => {
    const { data } = await axiosInstance.put('/api/user/profile', profileData);
    return data;
  },
  updatePassword: async (passwordData: UpdatePasswordRequest): Promise<void> => {
    await axiosInstance.post('/api/user/security/password', passwordData);
  },
  updatePreferences: async (preferencesData: UserPreferences): Promise<UserPreferences> => {
    const { data } = await axiosInstance.put('/api/user/preferences', preferencesData);
    return data;
  },
};

// NEW: Usuarios Service (User Management for Admin)
export const usuariosService = {
  getAll: async (): Promise<UsuarioCompleto[]> => {
    const { data } = await axiosInstance.get('/api/Usuarios');
    return data;
  },

  create: async (userData: CreateUserRequest): Promise<UsuarioCompleto> => {
    const { data } = await axiosInstance.post('/api/Usuarios', userData);
    return data;
  },

  update: async (id: number, userData: UpdateUserRequest): Promise<UsuarioCompleto> => {
    const { data } = await axiosInstance.put(`/api/Usuarios/${id}`, userData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/Usuarios/${id}`);
  },
};

// NEW: UsuariosAdmin Service (SuperUsuario manages only Admin/Empleado)
export const usuariosAdminService = {
  getAll: async (): Promise<AdminUsuarioCompleto[]> => {
    const { data } = await axiosInstance.get('/api/UsuariosAdmin');
    return data;
  },

  create: async (userData: CreateAdminUserRequest): Promise<AdminUsuarioCompleto> => {
    const { data } = await axiosInstance.post('/api/UsuariosAdmin', userData);
    return data;
  },

  update: async (id: number, userData: UpdateAdminUserRequest): Promise<AdminUsuarioCompleto> => {
    const { data } = await axiosInstance.put(`/api/UsuariosAdmin/${id}`, userData);
    return data;
  },

  delete: async (id: number): Promise<void> => {
    await axiosInstance.delete(`/api/UsuariosAdmin/${id}`);
  },
};
