export interface User {
  token: string;
  usuario: string;
  rol: 'Admin' | 'Cliente' | 'Empleado'; // Added 'Empleado' role
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  nombreCompleto: string;
  email: string;
  password: string;
  rolId: number;
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
