export interface Producto {
  id: number;  // Remove the optional '?' operator
  nombre: string;
  precio: number;
  cantidad: number;
  imagen: string;
}