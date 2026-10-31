
"""
ALIENS - TERMINAL - серверная часть.
Отдаёт статические файлы и транслирует сообщения из консоли в окно вывода вбраузере.
"""

import asyncio, http.server, socketserver, threading, websockets, os

# --- Настройки ---
HTTP_PORT = 8000
WS_PORT = 8765
STATIC_DIR = os.path.join(os.path.dirname(__file__), "..", 'static')

# --- Список подключённых браузеров ---
clients = set()


# ========================================================
#  WebSocket-сервер: принимает подключения и рассылает текст
# ========================================================
async def ws_hadler(websocket):
    """Обработчик одного подключения из браузера."""
    clients.add(websocket)
    print(f"[WS] Браузер подключился. Всего {len(clients)}")
    try:
        async for message in websocket:
            # ECHO: рассылаем входящее сообщение всем клиентам
            # (это нужно для автотестов, чтобы отправить текст из браузера)
            await ws_broadcast(message)
    finally:
        clients.remove(websocket)
        print(f"[WS] Браузер отключился. Всего: {len(clients)}")

async def ws_broadcast(message: str):
    """Отправить строку всем подключённым браузерам."""
    if not clients:
        print("[WS] Нет подключённых браузеров.")
        return
    # Копируем set, чтобы не менять его во время итерации
    for client in list(clients):
        try:
            await client.send(message)
        except websockets.ConnectionClosed:
            clients.discard(client)


# ========================================================
#  Чтение ввода из консоли Python
# ========================================================
async def console_reader():
    """Ассинхронно читает строки из stdin и рассылает их."""
    loop = asyncio.get_event_loop()
    while True:
        # input() - блокирующая функция, поэтому запускаем её в отдельном потоке
        line = await loop.run_in_executor(None, input, "> ")
        await ws_broadcast(line)

# ========================================================
#  HTTP-сервер: отдаёт файлы из static/
# ========================================================
def start_http_server():
    """Запускает простой HTTP-сервер в одном потоке."""
    os.chdir(STATIC_DIR)    # Теперь отдаём файл из static/
    handler = http.server.SimpleHTTPRequestHandler
    with socketserver.TCPServer(("", HTTP_PORT), handler) as httpd:
        print(f"[HTTP] Раздача файлов: http://localhost:{HTTP_PORT}")
        httpd.serve_forever()


# ========================================================
#  Точка входа
# ========================================================
async def main():
    # HTTP-сервер крутится в фоне отдельным потоком
    threading.Thread(target=start_http_server, daemon=True).start()

    # WebSocket-сервер
    async with websockets.serve(ws_hadler, "127.0.0.1", WS_PORT):
        print(f"[WS] Сервер запущен на ws://localhost:{WS_PORT}")
        print(f"[INFO] открой в браузере: http://localhost:{HTTP_PORT}")
        print(f"[INFO] Пиши сюда текст и жми Enter - он отобразится на экране.\n")
        await  console_reader()

if __name__ == "__main__":
    try:
        asyncio.run(main())
    except KeyboardInterrupt:
        print("\n[INFO] Сервер остановлен.")
