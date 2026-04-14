function generarMatrices() {
    var filas = parseInt(document.getElementById("filas").value, 10);
    var cols = parseInt(document.getElementById("columnas").value, 10);
    var contenedor = document.getElementById("contenedor-matrices");
    contenedor.innerHTML = ""; // Limpiar

    if (!filas || !cols || filas < 1 || cols < 1) {
        alert("Error: Filas y columnas deben ser mayores que 0");
        return;
    }

    for (var m = 1; m <= 2; m++) {
        var tabla = document.createElement("table");
        tabla.id = "matriz" + m;
        tabla.border = "1";
        
        for (var i = 0; i < filas; i++) {
            var filaTr = document.createElement("tr");
            for (var j = 0; j < cols; j++) {
                var celdaTd = document.createElement("td");
                var input = document.createElement("input");
                input.type = "text";
                input.size = "4";
                input.className = "m" + m + "-dato";
                celdaTd.appendChild(input);
                filaTr.appendChild(celdaTd);
            }
            tabla.appendChild(filaTr);
        }
        contenedor.appendChild(document.createTextNode("Matriz " + m));
        contenedor.appendChild(tabla);
    }
}

function obtenerDatosMatriz(clase) {
    var inputs = document.getElementsByClassName(clase);
    var filas = parseInt(document.getElementById("filas").value, 10);
    var cols = parseInt(document.getElementById("columnas").value, 10);
    var matriz = [];
    var k = 0;

    if (inputs.length !== filas * cols) {
        alert("Primero hacé clic en 'Generar Matrices'");
        return null;
    }

    for (var i = 0; i < filas; i++) {
        var filaArray = [];
        for (var j = 0; j < cols; j++) {
            var valor = inputs[k].value;
            // Validación manual
            if (valor === "" || isNaN(valor)) {
                alert("Error: Todos los campos deben ser numéricos");
                return null;
            }
            filaArray.push(Number(valor));
            k++;
        }
        matriz.push(filaArray);
    }
    return matriz;
}

function obtenerOperacion() {
    var radios = document.getElementsByName("operacion");

    for (var i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }

    return "suma";
}

function obtenerUrlCalculo() {
    var selectorPuerto = document.getElementById("puerto-backend");
    var puerto = "5000";

    if (selectorPuerto && selectorPuerto.value !== "") {
        puerto = selectorPuerto.value;
    }

    return "http://localhost:" + puerto + "/calcular";
}

function enviarAlServidor() {
    var m1 = obtenerDatosMatriz("m1-dato");
    var m2 = obtenerDatosMatriz("m2-dato");
    var operacion = obtenerOperacion();
    var urlCalculo = obtenerUrlCalculo();

    if (m1 && m2) {
        var xhr = new XMLHttpRequest();
        xhr.open("POST", urlCalculo, true);
        xhr.setRequestHeader("Content-Type", "text/plain");
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    var res = JSON.parse(xhr.responseText);
                    mostrarResultado(res.resultado);
                    return;
                }

                alert("Error del servidor (" + xhr.status + "): " + (xhr.responseText || "No se pudo calcular"));
            }
        };

        xhr.onerror = function() {
            alert("No se pudo conectar con el servidor. Verificá que esté corriendo.");
        };

        var datos = JSON.stringify({ matriz1: m1, matriz2: m2, operacion: operacion });
        xhr.send(datos);
    }
}

function mostrarResultado(matriz) {
    var div = document.getElementById("resultado");
    div.innerHTML = "";
    var tabla = document.createElement("table");
    tabla.border = "1";

    for (var i = 0; i < matriz.length; i++) {
        var tr = document.createElement("tr");
        for (var j = 0; j < matriz[i].length; j++) {
            var td = document.createElement("td");
            td.innerHTML = matriz[i][j];
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }
    div.appendChild(tabla);
}