from http.server import BaseHTTPRequestHandler, HTTPServer
import json
import os


PORT = 5000


class MiServidor(BaseHTTPRequestHandler):
    def _poner_encabezados_cors(self, codigo, tipo="text/plain; charset=utf-8"):
        self.send_response(codigo)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.send_header("Content-Type", tipo)
        self.end_headers()

    def _enviar_texto(self, codigo, texto, tipo="text/plain; charset=utf-8"):
        self._poner_encabezados_cors(codigo, tipo)
        self.wfile.write(texto.encode("utf-8"))

    def _cargar_archivo(self, nombre_archivo, tipo):
        try:
            with open(nombre_archivo, "rb") as archivo:
                contenido = archivo.read()
            self._poner_encabezados_cors(200, tipo)
            self.wfile.write(contenido)
        except OSError:
            self._enviar_texto(500, "No se pudo cargar el archivo")

    def do_OPTIONS(self):
        self.send_response(204)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        if self.path == "/":
            self._cargar_archivo("index.html", "text/html; charset=utf-8")
            return

        if self.path == "/script.js":
            self._cargar_archivo("script.js", "application/javascript; charset=utf-8")
            return

        self._enviar_texto(404, "Ruta no encontrada")

    def do_POST(self):
        if self.path != "/calcular":
            self._enviar_texto(404, "Ruta no encontrada")
            return

        largo = int(self.headers.get("Content-Length", 0))
        cuerpo = self.rfile.read(largo).decode("utf-8")

        try:
            datos = json.loads(cuerpo)
        except json.JSONDecodeError:
            self._enviar_json(400, {"error": "JSON inválido"})
            return

        matriz1 = datos.get("matriz1")
        matriz2 = datos.get("matriz2")
        operacion = datos.get("operacion", "suma")

        if not isinstance(matriz1, list) or not isinstance(matriz2, list):
            self._enviar_json(400, {"error": "Matrices inválidas"})
            return

        if operacion == "multiplicacion":
            resultado = self._multiplicar(matriz1, matriz2)
            if resultado is None:
                self._enviar_json(400, {"error": "Dimensiones incompatibles para multiplicación"})
                return
        else:
            resultado = self._sumar(matriz1, matriz2)
            if resultado is None:
                self._enviar_json(400, {"error": "Dimensiones incompatibles para suma"})
                return

        self._enviar_json(200, {"resultado": resultado})

    def _enviar_json(self, codigo, datos):
        contenido = json.dumps(datos)
        self._poner_encabezados_cors(codigo, "application/json; charset=utf-8")
        self.wfile.write(contenido.encode("utf-8"))

    def _sumar(self, matriz1, matriz2):
        if len(matriz1) != len(matriz2):
            return None

        resultado = []
        for i in range(len(matriz1)):
            if not isinstance(matriz1[i], list) or not isinstance(matriz2[i], list):
                return None
            if len(matriz1[i]) != len(matriz2[i]):
                return None

            fila = []
            for j in range(len(matriz1[i])):
                fila.append(matriz1[i][j] + matriz2[i][j])
            resultado.append(fila)

        return resultado

    def _multiplicar(self, matriz1, matriz2):
        if len(matriz1) == 0 or len(matriz2) == 0:
            return None
        if not isinstance(matriz1[0], list) or not isinstance(matriz2[0], list):
            return None
        if len(matriz1[0]) != len(matriz2):
            return None

        resultado = []
        for i in range(len(matriz1)):
            fila = []
            for j in range(len(matriz2[0])):
                suma = 0
                for k in range(len(matriz2)):
                    suma = suma + (matriz1[i][k] * matriz2[k][j])
                fila.append(suma)
            resultado.append(fila)

        return resultado


def main():
    servidor = HTTPServer(("localhost", PORT), MiServidor)
    print("Servidor corriendo en puerto " + str(PORT))
    servidor.serve_forever()


if __name__ == "__main__":
    main()
