var http = require('http');
var fs = require('fs');
var path = require('path');

var PORT = process.env.PORT || 3000;

function ponerEncabezadosCors(res, contentType) {
    var headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
    };

    if (contentType) {
        headers['Content-Type'] = contentType;
    }

    res.writeHead(200, headers);
}

var servidor = http.createServer(function(req, res) {
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
        var rutaIndex = path.join(__dirname, 'index.html');
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
        var rutaScript = path.join(__dirname, 'script.js');
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
        var cuerpo = '';
        req.on('data', function(chunk) {
            cuerpo += chunk;
        });

        req.on('end', function() {
            var datos;
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

            var m1 = datos.matriz1;
            var m2 = datos.matriz2;
            var operacion = datos.operacion || 'suma';

            if (!Array.isArray(m1) || !Array.isArray(m2)) {
                res.writeHead(400, {
                    'Access-Control-Allow-Origin': '*',
                    'Content-Type': 'application/json'
                });
                res.end(JSON.stringify({ error: 'Matrices inválidas' }));
                return;
            }

            var resultado = [];

            if (operacion === 'multiplicacion') {
                if (!Array.isArray(m1[0]) || !Array.isArray(m2[0]) || m1[0].length !== m2.length) {
                    res.writeHead(400, {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({ error: 'Dimensiones incompatibles para multiplicación' }));
                    return;
                }

                for (var i = 0; i < m1.length; i++) {
                    var filaMultiplicacion = [];
                    for (var j = 0; j < m2[0].length; j++) {
                        var suma = 0;
                        for (var k = 0; k < m2.length; k++) {
                            suma = suma + (m1[i][k] * m2[k][j]);
                        }
                        filaMultiplicacion.push(suma);
                    }
                    resultado.push(filaMultiplicacion);
                }
            } else {
                if (m1.length !== m2.length) {
                    res.writeHead(400, {
                        'Access-Control-Allow-Origin': '*',
                        'Content-Type': 'application/json'
                    });
                    res.end(JSON.stringify({ error: 'Dimensiones incompatibles para suma' }));
                    return;
                }

                // Lógica de suma arcaica
                for (var i = 0; i < m1.length; i++) {
                    if (!Array.isArray(m1[i]) || !Array.isArray(m2[i]) || m1[i].length !== m2[i].length) {
                        res.writeHead(400, {
                            'Access-Control-Allow-Origin': '*',
                            'Content-Type': 'application/json'
                        });
                        res.end(JSON.stringify({ error: 'Dimensiones incompatibles' }));
                        return;
                    }
                    var filaRes = [];
                    for (var j = 0; j < m1[i].length; j++) {
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