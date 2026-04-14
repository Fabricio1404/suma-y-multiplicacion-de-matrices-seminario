const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;

function obtenerDimensiones(matriz) {
    return {
        filas: matriz.length,
        columnas: matriz[0].length
    };
}

function esMatrizValida(matriz) {
    if (!Array.isArray(matriz) || matriz.length === 0 || !Array.isArray(matriz[0]) || matriz[0].length === 0) {
        return false;
    }

    const columnas = matriz[0].length;

    for (let i = 0; i < matriz.length; i++) {
        if (!Array.isArray(matriz[i]) || matriz[i].length !== columnas) {
            return false;
        }

        for (let j = 0; j < matriz[i].length; j++) {
            if (typeof matriz[i][j] !== 'number' || Number.isNaN(matriz[i][j])) {
                return false;
            }
        }
    }

    return true;
}

function ponerEncabezadosCors(res, contentType) {
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (contentType) {
        headers['Content-Type'] = contentType;
    }

    res.writeHead(200, headers);
}

const servidor = http.createServer(function(req, res) {
    if (req.method === 'OPTIONS') {
        res.writeHead(204, {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type'
        });
        res.end();
        return;
    }

    if (req.method === 'GET' && req.url === '/') {
        const rutaIndex = path.join(__dirname, 'index.html');
        fs.readFile(rutaIndex, function(err, contenido) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end('Error al cargar index.html');
                return;
            }
            ponerEncabezadosCors(res, 'text/html; charset=utf-8');
            res.end(contenido);
        });
        return;
    }

    if (req.method === 'GET' && req.url === '/script.js') {
        const rutaScript = path.join(__dirname, 'script.js');
        fs.readFile(rutaScript, function(err, contenido) {
            if (err) {
                res.writeHead(500, {'Content-Type': 'text/plain; charset=utf-8'});
                res.end('Error al cargar script.js');
                return;
            }
            ponerEncabezadosCors(res, 'application/javascript; charset=utf-8');
            res.end(contenido);
        });
        return;
    }

    if (req.method === 'POST' && req.url === '/calcular') {
        let cuerpo = '';
        req.on('data', function(chunk) {
            cuerpo += chunk;
        });

        req.on('end', function() {
            let datos;
            try {
                datos = JSON.parse(cuerpo);
            } catch (e) {
                res.writeHead(400, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ error: 'JSON inválido' }));
                return;
            }

            const m1 = datos.matriz1;
            const m2 = datos.matriz2;
            const operacion = datos.operacion || 'suma';

            if (!esMatrizValida(m1) || !esMatrizValida(m2)) {
                res.writeHead(400, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ error: 'Matrices inválidas' }));
                return;
            }

            const resultado = [];
            const dim1 = obtenerDimensiones(m1);
            const dim2 = obtenerDimensiones(m2);

            if (operacion === 'multiplicacion') {
                if (dim1.columnas !== dim2.filas) {
                    res.writeHead(400, {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({ error: 'Dimensiones incompatibles para multiplicación' }));
                    return;
                }

                for (let i = 0; i < dim1.filas; i++) {
                    const filaMultiplicacion = [];
                    for (let j = 0; j < dim2.columnas; j++) {
                        let suma = 0;
                        for (let k = 0; k < dim2.filas; k++) {
                            suma = suma + (m1[i][k] * m2[k][j]);
                        }
                        filaMultiplicacion.push(suma);
                    }
                    resultado.push(filaMultiplicacion);
                }
            } else {
                if (dim1.filas !== dim2.filas || dim1.columnas !== dim2.columnas) {
                    res.writeHead(400, {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({ error: 'Dimensiones incompatibles para suma' }));
                    return;
                }

                for (let i = 0; i < dim1.filas; i++) {
                    const filaRes = [];
                    for (let j = 0; j < dim1.columnas; j++) {
                        filaRes.push(m1[i][j] + m2[i][j]);
                    }
                    resultado.push(filaRes);
                }
            }

            res.writeHead(200, {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            });
            res.end(JSON.stringify({ resultado: resultado }));
        });
        return;
    }

    res.writeHead(404, {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'text/plain; charset=utf-8'
    });
    res.end('Ruta no encontrada');
});

servidor.on('error', function(err) {
    if (err.code === 'EADDRINUSE') {
        console.error('El puerto ' + PORT + ' ya está en uso. Cerrá el proceso anterior o usá otro puerto.');
        process.exit(1);
    }

    console.error('Error del servidor:', err.message);
    process.exit(1);
});

servidor.listen(PORT, function() {
    console.log('Servidor corriendo en puerto ' + PORT);
});