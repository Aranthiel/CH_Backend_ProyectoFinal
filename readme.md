# API REST para Gestionar Productos y Carritos de Compras

Esta API REST proporciona servicios para gestionar productos y carritos de compras en un e-commerce. A continuación, se describen las rutas disponibles y se incluyen ejemplos de uso.

## Rutas Disponibles

### Productos

#### Obtener todos los productos
```
GET /api/products/
```
Obtiene una lista de todos los productos disponibles.

**Ejemplo de Uso:**
```
GET http://localhost:8080/api/products/
```

#### Obtener un producto por su ID
```
GET /api/products/:productId
```
Obtiene un producto específico según su ID (Tipo number).

**Ejemplo de Uso:**
```
GET http://localhost:8080/api/products/1
```

#### Agregar un nuevo producto
```
POST /api/products/
```
Permite agregar un nuevo producto.  El ID se genera automáticamente y es autoincremental. El cuerpo de la solicitud debe contener los siguientes campos en formato JSON:

- `title` (string, obligatorio): Título del producto.
- `code` (string, obligatorio y único): Código único del producto.
- `price` (number, obligatorio): Precio del producto.
- `status` (booleano, opcional, predeterminado: `true`): Estado del producto.
- `stock` (number, obligatorio): Cantidad en stock del producto.
- `category` (string, obligatorio): Categoría del producto.
- `thumbnails` (array, opcional): Lista de URLs de imágenes del producto.

**Ejemplo de Uso:**
```
POST http://localhost:8080/api/products/
{
  "title": "Producto de Ejemplo",
  "code": "P123",
  "price": 19.99,
  "status": true,
  "stock": 50,
  "category": "Electrónica",
  "thumbnails": ["http://example.com/image1.jpg", "http://example.com/image2.jpg"]
}
```

#### Actualizar un producto por su ID
```
PUT /api/products/:productId
```
Permite actualizar un producto existente según su ID (Tipo number). El cuerpo de la solicitud debe contener los campos que deseas modificar en formato JSON.

**Ejemplo de Uso:**
```
PUT http://localhost:8080/api/products/1
{
  "price": 29.99,
  "stock": 60
}
```

#### Eliminar un producto por su ID
```
DELETE /api/products/:productId
```
Elimina un producto específico según su ID (Tipo number).

**Ejemplo de Uso:**
```
DELETE http://localhost:8080/api/products/1
```

### Carritos de Compras

#### Obtener un carrito por su ID
```
GET /api/carts/:cartId
```
Obtiene un carrito de compras específico según su ID (Tipo number).

**Ejemplo de Uso:**
```
GET http://localhost:8080/api/carts/1
```

#### Crear un nuevo carrito de compras
```
POST /api/carts/
```
Crea un nuevo carrito de compras. El ID se genera automáticamente y es autoincremental. No se requiere ningún campo en el cuerpo de la solicitud.


**Ejemplo de Uso:**
```
POST http://localhost:8080/api/carts/
```

#### Agregar un producto a un carrito
```
POST /api/carts/:cartId/product/:productId
```
Permite agregar un producto al carrito especificado por su ID (Tipo number). Si el carrito no existe, se creará automáticamente. El cuerpo de la solicitud debe contener los siguientes campos en formato JSON:

- `quantity` (number, opcional, predeterminado: 1): Cantidad de ejemplares del producto a agregar. El producto se agrega de uno en uno si no se especifica la cantidad.
Ejemplo de Uso:
```
POST http://localhost:8080/api/carts/1/product/2
{
  "quantity": 3
}
```

