# Suma y Multiplicacion de Matrices - Seminario

Proyecto web para trabajar con dos matrices, validarlas y calcular:

- Suma de matrices
- Multiplicacion de matrices

El frontend es un solo sitio web y permite elegir que backend usar:

- Node.js (puerto 3000)
- Python (puerto 5000)

## 1. Que hace el proyecto

1. El usuario elige filas y columnas.
2. Se dibujan dos matrices para cargar datos.
3. Se validan los datos (que no esten vacios y sean numericos).
4. El usuario elige la operacion (suma o multiplicacion).
5. El sitio envia los datos al servidor.
6. El servidor calcula y devuelve la matriz resultado.
7. El resultado se muestra en pantalla.

## 2. Estructura de archivos

- index.html: interfaz web.
- script.js: logica del cliente (generar matrices, validar, enviar al servidor, mostrar resultado).
- servidor.js: backend Node.js.
- servidor.py: backend Python (sin frameworks externos).

## 3. Requisitos

Necesitas tener instalado al menos una de estas opciones:

- Node.js (si vas a usar servidor.js)
- Python 3 (si vas a usar servidor.py)

No hace falta base de datos ni librerias adicionales para la version de Python.

## 4. Como ejecutar con Node.js

1. Abrir una terminal en la carpeta del proyecto.
2. Ejecutar:

```bash
node servidor.js
```

3. Abrir en el navegador:

http://localhost:3000

4. En la web, en "Puerto backend", elegir:

3000 (Node)

## 5. Como ejecutar con Python

1. Abrir una terminal en la carpeta del proyecto.
2. Ejecutar:

```bash
python servidor.py
```

3. Abrir en el navegador:

http://localhost:5000

4. En la web, en "Puerto backend", elegir:

5000 (Python)

## 6. Uso de la aplicacion

1. Elegir cantidad de filas y columnas.
2. Presionar "Generar Matrices".
3. Cargar todos los valores numericos en Matriz 1 y Matriz 2.
4. Elegir operacion:
	 - Suma
	 - Multiplicacion
5. Elegir backend en "Puerto backend".
6. Presionar "Calcular en Servidor".
7. Ver el resultado en la seccion "Resultado".

## 7. Reglas de calculo

### Suma

Las dos matrices deben tener la misma cantidad de filas y columnas.

### Multiplicacion

La cantidad de columnas de la primera matriz debe ser igual a la cantidad de filas de la segunda.

## 8. Endpoints del servidor

Tanto en Node como en Python se usa la misma idea:

- GET / -> devuelve index.html
- GET /script.js -> devuelve el JS del cliente
- POST /calcular -> recibe matrices y operacion, devuelve resultado

### Ejemplo de body JSON

```json
{
	"matriz1": [[1, 2], [3, 4]],
	"matriz2": [[5, 6], [7, 8]],
	"operacion": "suma"
}
```

## 9. Errores comunes y solucion

### Error 405: No se pudo calcular

Suele pasar cuando el HTML se abre desde otro servidor y el POST va al servidor equivocado.

Solucion:

1. Levantar uno de los backends de este proyecto (Node o Python).
2. Abrir la pagina desde ese backend.
3. Elegir bien el "Puerto backend" en la web.

### Puerto ocupado

Si un puerto ya esta en uso, cerrá el proceso anterior o ejecuta el otro backend/puerto.

### No calcula nada

Verificar:

- Que hayas presionado "Generar Matrices".
- Que todos los campos tengan valores numericos.
- Que las dimensiones sean compatibles para la operacion elegida.

## 10. Resumen rapido

- Frontend: index.html + script.js
- Backend opcion 1: servidor.js (Node, puerto 3000)
- Backend opcion 2: servidor.py (Python, puerto 5000)
- Operaciones: suma y multiplicacion
