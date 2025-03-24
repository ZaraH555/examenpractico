import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { InventarioService } from '../../services/inventario.service';
import { Producto } from '../../models/producto';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inventario.component.html',
  styleUrls: ['./inventario.component.css']
})
export class InventarioComponent implements OnInit, OnDestroy {
  productos: Producto[] = [];
  nuevoProducto: Producto = {
    id: 0,
    nombre: '',
    precio: 0,
    imagen: '',
    cantidad: 0
  };
  productoSeleccionado: Producto | null = null;
  private subscription: Subscription = new Subscription();

  constructor(private inventarioService: InventarioService, private router: Router) {}

  ngOnInit(): void {
    this.subscription = this.inventarioService.productos$.subscribe({
      next: (productos) => {
        this.productos = productos;
      },
      error: (error) => {
        console.error('Error al obtener productos:', error);
      }
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  agregarProducto(): void {
    if (this.nuevoProducto.cantidad < 0) {
      alert('La cantidad no puede ser negativa');
      return;
    }
    this.inventarioService.agregarProducto(this.nuevoProducto);
    this.nuevoProducto = {
      id: 0,
      nombre: '',
      precio: 0,
      imagen: '',
      cantidad: 0
    };
  }

  editarProducto(producto: Producto): void {
    this.productoSeleccionado = { ...producto };
  }

  guardarCambios(): void {
    if (this.productoSeleccionado) {
      if (this.productoSeleccionado.cantidad < 0) {
        alert('La cantidad no puede ser negativa');
        return;
      }
      this.inventarioService.modificarProducto(this.productoSeleccionado.id, this.productoSeleccionado);
      this.cancelarEdicion();
    }
  }

  cancelarEdicion(): void {
    this.productoSeleccionado = null;
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.inventarioService.eliminarProducto(id);
    }
  }

  descargarXML(): void {
    this.inventarioService.descargarXML();
  }

  volverAProductos(): void {
    this.router.navigate(['/productos']);
  }
}