export interface User {
  token: string;
  nombre: string;
  apellido: string;
  rol: 'Admin' | 'Cliente' | 'Empleado' | 'SuperUsuario';
  id?: number;
}

// Butacas (Asientos)
export type EstadoButaca = 'DISPONIBLE' | 'BLOQUEADA' | 'VENDIDA';

export interface Butaca {
  id: number;
  fila: string;
  numero: number;
  salaId: number;
  identificador: string;
  estado: EstadoButaca;
  disponible: boolean;
}

export interface ButacasDisponiblesResponse {
  funcionId: number;
  salaId: number;
  salaNombre: string;
  pelicula: string;
  fechaHora: string;
  precio: number;
  totalButacas: number;
  disponibles: number;
  bloqueadas: number;
  vendidas: number;
  butacas: Butaca[];
}

// Sistema de Reservas
export interface BloquearReservaRequest {
  funcionId: number;
  butacaIds: number[];
  usuarioId?: number;
  sessionId?: string;
}

export interface FuncionInfo {
  pelicula: string;
  sala: string;
  fechaHora: string;
  precio: number;
}

export interface ReservaButaca {
  id: number;
  fila: string;
  numero: number;
  identificador: string;
}

export interface ReservaResponse {
  reservaId: string;
  funcionId: number;
  funcion: FuncionInfo;
  butacas: ReservaButaca[];
  butacasSeleccionadas: string[];
  cantidad: number;
  total: number;
  fechaReserva: string;
  expiraEn: string;
  tiempoRestanteSegundos: number;
  mensaje?: string;
  estado?: 'BLOQUEADA' | 'CONFIRMADA' | 'EXPIRADA' | 'CANCELADA';
  expirada?: boolean;
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

// NUEVO FORMATO según backend 2025-12-20
export interface DetalleCompraRequest {
  funcionId: number;
  cantidad: number;
  precioUnitario: number;
  butacaIds: number[]; // Obligatorio
}

export interface CompraRequest {
  metodoPagoId: number;
  reservaId?: string; // Opcional pero recomendado
  detalles: DetalleCompraRequest[];
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

// Historial de Compras - NUEVO FORMATO Backend 2025-12-20
export interface ButacaDetalle {
  id: number;
  fila: string;
  numero: number;
  identificador: string;
}

export interface EntradaDetalle {
  ticketId: string;
  codigoQR: string;
  estado: 'ACTIVO' | 'USADO' | 'EXPIRADO';
  butacas: ButacaDetalle[];
}

export interface DetalleHistorial {
  tipo: 'entrada' | 'producto';
  // Para entradas de cine
  pelicula?: string;
  sala?: string;
  fechaHora?: string;
  entrada?: EntradaDetalle;
  // Para productos
  nombreProducto?: string;
  cantidad?: number;
  precio?: number;
}

export interface CompraHistorial {
  compraId: number;
  fechaCompra: string;
  total: number;
  metodoPago: string;
  detalles: DetalleHistorial[];
}

// FORMATO LEGACY (para compatibilidad con componentes actuales)
export interface PurchaseHistoryItem {
  id: number;
  date: string;
  details: { movie?: string; confectionery?: string[] };
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

