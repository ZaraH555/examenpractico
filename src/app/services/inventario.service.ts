import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { Producto } from '../models/producto';
import { BehaviorSubject } from 'rxjs';
import { ProductoService } from './producto.service';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class InventarioService {
  private productos: Producto[] = [];
  private productosSubject = new BehaviorSubject<Producto[]>([]);
  productos$ = this.productosSubject.asObservable();

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    private productoService: ProductoService
  ) {
    this.productoService.productos$.subscribe(productos => {
      this.productos = productos;
      this.productosSubject.next(productos);
    });
  }

  modificarProducto(id: number, productoActualizado: Producto): void {
    const productos = [...this.productos];
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
      productos[index] = productoActualizado;
      this.productoService.actualizarProductos(productos);
    }
  }

  eliminarProducto(id: number): void {
    const productos = this.productos.filter(p => p.id !== id);
    this.productoService.actualizarProductos(productos);
  }

  agregarProducto(producto: Producto): void {
    const productos = [...this.productos];
    producto.id = Math.max(...productos.map(p => p.id), 0) + 1;
    productos.push(producto);
    this.productoService.actualizarProductos(productos);
  }

  descargarXML(): void {
    if (isPlatformBrowser(this.platformId)) {
      try {
        const xmlString = this.generarXMLDesdeProductos(this.productos);
        const blob = new Blob([xmlString], { type: 'application/xml' });
        const url = window.URL.createObjectURL(blob);
        
        const a = document.createElement('a');
        a.href = url;
        a.download = 'productos.xml';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        this.productoService.actualizarProductos(this.productos);
      } catch (error) {
        console.error('Error al descargar el XML:', error);
      }
    }
  }

  private generarXMLDesdeProductos(productos: Producto[]): string {
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>';
    const productosXML = productos.map(prod => `
      <producto>
        <id>${prod.id}</id>
        <nombre>${this.escapeXML(prod.nombre)}</nombre>
        <precio>${prod.precio}</precio>
        <cantidad>${prod.cantidad}</cantidad>
        <imagen>${this.escapeXML(prod.imagen)}</imagen>
      </producto>
    `).join('');
    
    return `${xmlHeader}\n<productos>${productosXML}</productos>`;
  }

  private escapeXML(str: string): string {
    return str.toString().replace(/[<>&'"]/g, c => {
      switch (c) {
        case '<': return '&lt;';
        case '>': return '&gt;';
        case '&': return '&amp;';
        case "'": return '&apos;';
        case '"': return '&quot;';
        default: return c;
      }
    });
  }
}
