function generarMatrices() {
    const filas = parseInt(document.getElementById("filas").value, 10);
    const cols = parseInt(document.getElementById("columnas").value, 10);
    const contenedor = document.getElementById("contenedor-matrices");
    contenedor.innerHTML = ""; // Limpiar

    if (!filas || !cols || filas < 1 || cols < 1) {
        alert("Error: Filas y columnas deben ser mayores que 0");
        return;
    }

    for (let m = 1; m <= 2; m++) {
        const tabla = document.createElement("table");
        tabla.id = "matriz" + m;
        tabla.border = "1";
        
        for (let i = 0; i < filas; i++) {
            const filaTr = document.createElement("tr");
            for (let j = 0; j < cols; j++) {
                const celdaTd = document.createElement("td");
                const input = document.createElement("input");
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
    const inputs = document.getElementsByClassName(clase);
    const filas = parseInt(document.getElementById("filas").value, 10);
    const cols = parseInt(document.getElementById("columnas").value, 10);
    const matriz = [];
    let k = 0;

    if (inputs.length !== filas * cols) {
        alert("Primero hacé clic en 'Generar Matrices'");
        return null;
    }

    for (let i = 0; i < filas; i++) {
        const filaArray = [];
        for (let j = 0; j < cols; j++) {
            const valor = inputs[k].value;
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
    const radios = document.getElementsByName("operacion");

    for (let i = 0; i < radios.length; i++) {
        if (radios[i].checked) {
            return radios[i].value;
        }
    }

    return "suma";
}

function obtenerUrlCalculo() {
    const selectorPuerto = document.getElementById("puerto-backend");
    let puerto = "5000";

    if (selectorPuerto && selectorPuerto.value !== "") {
        puerto = selectorPuerto.value;
    }

    return "http://localhost:" + puerto + "/calcular";
}

function enviarAlServidor() {
    const m1 = obtenerDatosMatriz("m1-dato");
    const m2 = obtenerDatosMatriz("m2-dato");
    const operacion = obtenerOperacion();
    const urlCalculo = obtenerUrlCalculo();

    if (m1 && m2) {
        const xhr = new XMLHttpRequest();
        xhr.open("POST", urlCalculo, true);
        xhr.setRequestHeader("Content-Type", "text/plain");
        
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4) {
                if (xhr.status === 200) {
                    const res = JSON.parse(xhr.responseText);
                    mostrarResultado(res.resultado);
                    return;
                }

                alert("Error del servidor (" + xhr.status + "): " + (xhr.responseText || "No se pudo calcular"));
            }
        };

        xhr.onerror = function() {
            alert("No se pudo conectar con el servidor. Verificá que esté corriendo.");
        };

        const datos = JSON.stringify({ matriz1: m1, matriz2: m2, operacion: operacion });
        xhr.send(datos);
    }
}

function mostrarResultado(matriz) {
    const div = document.getElementById("resultado");
    div.innerHTML = "";
    const tabla = document.createElement("table");
    tabla.border = "1";

    for (let i = 0; i < matriz.length; i++) {
        const tr = document.createElement("tr");
        for (let j = 0; j < matriz[i].length; j++) {
            const td = document.createElement("td");
            td.innerHTML = matriz[i][j];
            tr.appendChild(td);
        }
        tabla.appendChild(tr);
    }
    div.appendChild(tabla);
}