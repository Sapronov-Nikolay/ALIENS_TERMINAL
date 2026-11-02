package tests;

import java.io.File;
import java.io.IOException;
import java.net.InetSocketAddress;
import java.net.Socket;

public class ServerManager {
    private Process process;
    private int serverPort = 8000;
    
    public void start() throws IOException, InterruptedException {
        File projectRoot = findProjectRoot();
        String pythonPath = findPython(projectRoot);
        File serverDir = new File(projectRoot, "server");
        ProcessBuilder pb = new ProcessBuilder(pythonPath, "server.py");
        pb.directory(serverDir);
        pb.inheritIO();
        process = pb.start();
        waitForPort(serverPort, 30);
        System.out.println("[ServerManager] Python-сервер запущен и доступен на порту " + serverPort);
    }
    
    public void stop() {
        if (process != null && process.isAlive()) {
            process.destroy();
            System.out.println("[ServerManager] Python-сервер остановлен.");
        }
    }
    
    private  void waitForPort(int port, int timeoutSeconds) throws InterruptedException {
        long startTime = System.currentTimeMillis();
        long timeoutMillis = timeoutSeconds * 1000L;
        int checkIntervalMs = 200;  // Проверяем каждые 200 мс
        
        while (true) {
            if (isPortOpen(port)) {
                return;
            }
            // проверяем, не прошло ли слишком много времени
            long elapsed = System.currentTimeMillis() - startTime;
            if (elapsed >= timeoutMillis) {
                throw new IllegalStateException(
                    "Сервер не запустился в течение " + timeoutSeconds + " сек на порту " + port +
                    ". Проверь, установлен ли Python и нет ли ошибок в server.py (смотри логи выше)."
                );
            }
            Thread.sleep(checkIntervalMs);
        }
    }
    
    private boolean isPortOpen(int port) {
        try (Socket socket = new Socket()) {
            socket.connect(new InetSocketAddress("127.0.0.1", port), 500);
            return true;
        } catch (IOException e) {
            return false;
        }
    }
    
    private static File findProjectRoot() {
        File dir = new File(System.getProperty("user.dir"));
        
        while (dir != null) {
            File serverFile = new File(dir, "server" + File.separator + "server.py");
            File staticDir = new File(dir, "static");
            if (serverFile.exists() && staticDir.isDirectory()) {
                return dir;
            }
            dir = dir.getParentFile();
        }
        throw new IllegalStateException("Не удалось найти корень папки ALIENS_TERMINAL. " +
            "Проверь, что ты запускаешь тесты из папки проекта, где есть папки server и static."
        );
    }
    
    private static String findPython(File projectRoot) {
        boolean isWindows = System.getProperty("os.name").toLowerCase().contains("win");
        File venv = new File(projectRoot, ".venv");
        if (venv.exists()) {
            File pythonInVenv = isWindows
                ? new File(venv, "Scripts" + File.separator + "python.exe")
                : new File(venv, "bin" + File.separator + "python");
            if (pythonInVenv.exists()) {
                return pythonInVenv.getAbsolutePath();
            }
        }
        return isWindows ? "python" : "python3";
    }
}
