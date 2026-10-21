CREATE TABLE sucursales (
    id_sucursal INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(255)
);

CREATE TABLE almacenes (
    id_almacen INT IDENTITY(1,1) PRIMARY KEY,
    id_sucursal INT NOT NULL,
    nombre_almacen VARCHAR(100) NOT NULL,
    FOREIGN KEY (id_sucursal) REFERENCES sucursales(id_sucursal)
);

CREATE TABLE usuarios (
    id_usuario INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    credenciales VARCHAR(255) NOT NULL,
    rol VARCHAR(50) NOT NULL, -- Opciones: SUPER_ADMIN, GERENTE, CAPTURISTA
    id_almacen INT, -- Puede ser NULL para el Super Admin
    FOREIGN KEY (id_almacen) REFERENCES almacenes(id_almacen)
);

CREATE TABLE productos (
    id_producto INT IDENTITY(1,1) PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    categoria VARCHAR(100),
    unidad_medida VARCHAR(20) DEFAULT 'kg'
);

CREATE TABLE movimientos (
    id_movimiento INT IDENTITY(1,1) PRIMARY KEY,
    tipo VARCHAR(20) NOT NULL, -- Opciones: ENTRADA, SALIDA
    cantidad_kg DECIMAL(10,2) NOT NULL,
    fecha_hora DATETIME NOT NULL,
    id_producto INT NOT NULL,
    id_almacen INT NOT NULL,
    id_usuario INT NOT NULL,
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto),
    FOREIGN KEY (id_almacen) REFERENCES almacenes(id_almacen),
    FOREIGN KEY (id_usuario) REFERENCES usuarios(id_usuario)
);

CREATE TABLE inventario (
    id_almacen INT NOT NULL,
    id_producto INT NOT NULL,
    stock_actual_kg DECIMAL(10,2) DEFAULT 0.00,
    PRIMARY KEY (id_almacen, id_producto),
    FOREIGN KEY (id_almacen) REFERENCES almacenes(id_almacen),
    FOREIGN KEY (id_producto) REFERENCES productos(id_producto)
);