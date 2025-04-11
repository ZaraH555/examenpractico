import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Mascota } from '../../models/mascota';

@Component({
  selector: 'app-mascota-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="modal" [style.display]="visible ? 'flex' : 'none'">
      <div class="modal-content">
        <div class="card">
          <div class="card-header">
            <h3 class="card-title">{{mascota?.id ? 'Editar' : 'Agregar'}} Mascota</h3>
            <button class="btn btn-outline" (click)="cerrar()">✕</button>
          </div>
          <form (ngSubmit)="guardar()">
            <div class="form-group">
              <label for="nombre">Nombre</label>
              <input type="text" id="nombre" class="form-control" [(ngModel)]="mascotaForm.nombre" name="nombre" required>
            </div>
            <div class="form-group">
              <label for="raza">Raza</label>
              <input type="text" id="raza" class="form-control" [(ngModel)]="mascotaForm.raza" name="raza" required>
            </div>
            <div class="form-group">
              <label for="edad">Edad</label>
              <input type="number" id="edad" class="form-control" [(ngModel)]="mascotaForm.edad" name="edad" required>
            </div>
            <button type="submit" class="btn btn-primary">Guardar</button>
          </form>
        </div>
      </div>
    </div>
  `
})
export class MascotaModalComponent {
  @Input() visible = false;
  @Input() mascota?: Mascota;
  @Output() guardarMascota = new EventEmitter<Mascota>();
  @Output() cerrarModal = new EventEmitter<void>();

  mascotaForm: Partial<Mascota> = {
    nombre: '',
    raza: '',
    edad: 0
  };

  ngOnChanges() {
    if (this.mascota) {
      this.mascotaForm = { ...this.mascota };
    }
  }

  guardar() {
    if (this.mascotaForm.nombre && this.mascotaForm.raza && this.mascotaForm.edad) {
      this.guardarMascota.emit(this.mascotaForm as Mascota);
      this.cerrar();
    }
  }

  cerrar() {
    this.mascotaForm = { nombre: '', raza: '', edad: 0 };
    this.cerrarModal.emit();
  }
}
