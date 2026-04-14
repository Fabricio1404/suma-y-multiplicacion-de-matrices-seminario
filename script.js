function obtenerDimensiones() {
    const filas1 = parseInt(document.getElementById("filas1").value, 10);
    const columnas1 = parseInt(document.getElementById("columnas1").value, 10);
    const filas2 = parseInt(document.getElementById("filas2").value, 10);
    const columnas2 = parseInt(document.getElementById("columnas2").value, 10);

    return {
        filas1: filas1,
        columnas1: columnas1,
        filas2: filas2,
        columnas2: columnas2
    };
}

function generarTablaMatriz(idMatriz, claseInputs, filas, cols) {
    const tabla = document.createElement("table");
    tabla.id = idMatriz;
    tabla.border = "1";

    for (let i = 0; i < filas; i++) {
        const filaTr = document.createElement("tr");
        for (let j = 0; j < cols; j++) {
            const celdaTd = document.createElement("td");
            const input = document.createElement("input");
            input.type = "text";
            input.size = "4";
            input.className = claseInputs;
            celdaTd.appendChild(input);
            filaTr.appendChild(celdaTd);
        }
        tabla.appendChild(filaTr);
    }

    return tabla;
}

function generarMatrices() {
    const dimensiones = obtenerDimensiones();
    const contenedor = document.getElementById("contenedor-matrices");
    contenedor.innerHTML = "";

    if (
        !dimensiones.filas1 || !dimensiones.columnas1 ||
        !dimensiones.filas2 || !dimensiones.columnas2 ||
        dimensiones.filas1 < 1 || dimensiones.columnas1 < 1 ||
        dimensiones.filas2 < 1 || dimensiones.columnas2 < 1
    ) {
        alert("Error: Todas las filas y columnas deben ser mayores que 0");
        return;
    }

    const tabla1 = generarTablaMatriz("matriz1", "m1-dato", dimensiones.filas1, dimensiones.columnas1);
    const tabla2 = generarTablaMatriz("matriz2", "m2-dato", dimensiones.filas2, dimensiones.columnas2);

    contenedor.appendChild(document.createTextNode("Matriz 1"));
    contenedor.appendChild(tabla1);
    contenedor.appendChild(document.createElement("br"));
    contenedor.appendChild(document.createTextNode("Matriz 2"));
    contenedor.appendChild(tabla2);
}

function obtenerDatosMatriz(clase, filas, cols) {
    const inputs = document.getElementsByClassName(clase);
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

function validarCompatibilidad(dimensiones, operacion) {
    if (operacion === "suma") {
        return dimensiones.filas1 === dimensiones.filas2 && dimensiones.columnas1 === dimensiones.columnas2;
    }

    if (operacion === "multiplicacion") {
        return dimensiones.columnas1 === dimensiones.filas2;
    }

    return false;
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
    const dimensiones = obtenerDimensiones();
    const operacion = obtenerOperacion();
    const urlCalculo = obtenerUrlCalculo();

    if (!validarCompatibilidad(dimensiones, operacion)) {
        if (operacion === "suma") {
            alert("Para sumar, ambas matrices deben tener la misma cantidad de filas y columnas");
        } else {
            alert("Para multiplicar, las columnas de la Matriz 1 deben ser iguales a las filas de la Matriz 2");
        }
        return;
    }

    const m1 = obtenerDatosMatriz("m1-dato", dimensiones.filas1, dimensiones.columnas1);
    const m2 = obtenerDatosMatriz("m2-dato", dimensiones.filas2, dimensiones.columnas2);

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
