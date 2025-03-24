import { Injectable } from '@angular/core';
import { Producto } from '../models/producto';
@Injectable({
  providedIn: 'root'
})
export class CarritoService {
  private carrito:Producto[]=[];
  agregarProducto(producto:Producto){
    this.carrito.push(producto);
  }
  
  obtenerCarrito():Producto[]{
    return this.carrito;
  }
  eliminarProducto(index: number): void {
    this.carrito.splice(index, 1); 
  }
  // constructor() { }
  generarXML(): string {
    let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<Factura>\n`;
  xml += `  <Encabezado>\n`;
  xml += `    <Emisor>\n`;
  xml += `      <Nombre>TIENDA ZARA</Nombre>\n`;
  xml += `      <RFC>MT123456789</RFC>\n`;
  xml += `      <Direccion>Calle Nueva Escocia #123</Direccion>\n`;
  xml += `    </Emisor>\n`;
  xml += `    <Receptor>\n`;
  xml += `      <Nombre>Zara Huízar</Nombre>\n`;
  xml += `    </Receptor>\n`;
  xml += `    <Fecha>${new Date().toISOString().split('T')[0]}</Fecha>\n`;
  xml += `    <NoFactura>F001-000001</NoFactura>\n`;
  xml += `  </Encabezado>\n`;
  xml += `  <Detalles>\n`;
  let totalSubtotal = 0;
  this.carrito.forEach(producto => {
    const cantidad = 1; 
    const subtotal = producto.precio * cantidad;
    totalSubtotal += subtotal;
    xml += `    <Item>\n`;
    xml += `      <Descripcion>${producto.nombre}</Descripcion>\n`;
    xml += `      <Cantidad>${cantidad}</Cantidad>\n`;
    xml += `      <Precio_unitario>${producto.precio.toFixed(2)}</Precio_unitario>\n`;
    xml += `      <Subtotal>${subtotal.toFixed(2)}</Subtotal>\n`;
    xml += `    </Item>\n`;
  });

  xml += `  </Detalles>\n`;

  const impuestos = totalSubtotal * 0.16;
  const total = totalSubtotal + impuestos;

  xml += `  <Totales>\n`;
  xml += `    <Subtotal>${totalSubtotal.toFixed(2)}</Subtotal>\n`;
  xml += `    <Impuestos>${impuestos.toFixed(2)}</Impuestos>\n`;
  xml += `    <Total>${total.toFixed(2)}</Total>\n`;
  xml += `  </Totales>\n`;
  xml += `</Factura>`;
  return xml;
}
  descargarXML(){
    const xml = this.generarXML();
    const blob = new Blob([xml], 
      {type:'application/xml'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'recibo.xml';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

