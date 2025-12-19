export interface User {
  token: string;
  usuario: string;
  rol: 'Admin' | 'Cliente' | 'Empleado' | 'SuperUsuario';
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
}

export interface Genero {
  id: number;
  nombre: string;
}

export interface Clasificacion {
  id: number;
  nombre: string;
}

export interface Pelicula {
  id: number;
  titulo: string;
  sinopsis: string;
  imagenUrl: string;
  duracionMinutos: number;
  genero: Genero;
  clasificacion: Clasificacion;
}

export interface Sala {
  id: number;
  nombre: string;
  capacidad: number;
}

export interface Funcion {
  id: number;
  peliculaId: number;
  salaId: number;
  fechaHora: string;
  precio: number;
  sala: Sala;
  pelicula?: Pelicula;
}

export interface Usuario {
  id: number;
  nombreCompleto: string;
  email: string;
}

export interface MetodoPago {
  id: number;
  nombre: string;
  tipo: 'Online' | 'Presencial';
}

export interface Compra {
  id: number;
  usuarioId: number;
  fechaCompra: string;
  total: number;
  metodoPagoId: number;
  usuario: Usuario;
  metodoPago: MetodoPago;
}

export interface CompraRequest {
  usuarioId: number;
  metodoPagoId: number;
  total: number;
}

export interface DetalleCompraRequest {
  compraId: number;
  funcionId: number;
  cantidad: number;
  precioUnitario: number;
}

export interface EmployeePurchaseRequest {
  usuarioId: number;
  metodoPagoId: number;
  total: number;
  detallesCompra: {
    funcionId: number;
    productoId?: number;
    cantidad: number;
    precioUnitario: number;
  }[];
}

// --- Types for Profile Module ---

export interface ActiveTicket {
  id: string;
  movieTitle: string;
  movieFormat: '2D' | '3D' | 'IMAX';
  imagenUrl: string;
  time: string;
  room: string;
  seats: string[];
  qrCodeValue: string;
  alphanumericCode: string;
}

export interface PurchaseHistoryItem {
  id: string;
  date: string;
  details: {
    movie: string;
    confectionery: string[];
  };
  location: string;
  total: number;
  status: 'Pagado' | 'Reembolsado';
  invoiceId: string;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  phone: string;
  birthDate: string;
  email: string;
  posterUrl?: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  receivePremiereEmails: boolean;
  receiveOfferAlerts: boolean;
  favoriteGenres: string[];
}

export interface UpdatePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

// --- Types for User Management (Admin) ---

export interface Rol {
  id: number;
  nombre: string;
}

export interface UsuarioCompleto {
  id: number;
  nombreCompleto: string;
  email: string;
  rolId: number;
  rol: Rol;
}

export interface CreateUserRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  rolId: number;
}

export interface UpdateUserRequest {
  nombreCompleto?: string;
  email?: string;
  password?: string;
  rolId?: number;
}

// --- Types for SuperUsuario User Management (UsuariosAdmin) ---

export interface CreateAdminUserRequest {
  nombre: string;
  apellido: string;
  email: string;
  password: string;
  celular: string | null;
  avatarUrl: string | null;
  rolId: number; // Solo 1 (Admin) o 3 (Empleado)
}

export interface UpdateAdminUserRequest {
  nombre?: string;
  apellido?: string;
  email?: string;
  password?: string; // Opcional, vacío = no cambiar
  celular?: string | null;
  avatarUrl?: string | null;
  rolId?: number;
}

export interface AdminUsuarioCompleto {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  celular: string | null;
  avatarUrl: string | null;
  rolId: number;
  rol: Rol;
}

