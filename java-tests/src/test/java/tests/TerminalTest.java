package tests;

// Подключаем аннотации Allure (красивые отчёты)
import io.qameta.allure.*;

// JUnit 5 — фреймворк для написания тестов
import org.junit.jupiter.api.*;

// Selenium WebDriver — управляет браузером
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.WebDriverWait;

// Для таймаутов и времени
import java.time.Duration;

@Epic("Терминал")
@Feature("Связь, звук и визуальное оформление")
public class TerminalTest {

    private static ServerManager server;
    private WebDriver driver;
    private WebDriverWait wait;
    
    @BeforeAll
    static void startServer() throws Exception {
        server = new ServerManager();
        server.start();
    }
    
    @AfterAll
    static void stopServer() {
        if (server != null) {
            server.stop();
        }
    }
    
    @BeforeEach
    void setUp() {
        ChromeOptions options = new ChromeOptions();
        options.addArguments("--autoplay-policy=no-user-gesture-required");
        driver = new ChromeDriver(options);
        wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(5));
        driver.get("http://127.0.0.1:8000");
    }
    
    @AfterEach
    void tearDown() {
        if (driver != null) {
            driver.quit();
        }
    }
    
    @Test
    @Story("Статус соединения")
    @Severity(SeverityLevel.CRITICAL)
    void testConnectionStatus() {
        WebElement status = driver.findElement(By.id("status"));
        String currentStatusText = status.getText();
        
        Allure.addAttachment("Текущий статус соединения", currentStatusText);
        
        Assertions.assertTrue(
            currentStatusText.contains("ONLINE"),
            "Статус должен быть ONLINE, но был: '" + currentStatusText + "'." +
                "Это означает, что сервер не запустился или соединение разорвано."
        );
    }
    
    @Test
    @Story("Аудио-контекст активен")
    @Severity(SeverityLevel.CRITICAL)
    void testAudioContextIsRunning() {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        Object state = js.executeScript("return window.audioCtx ? window.audioCtx.state : 'undefined';");
        Allure.addAttachment("Состояние audioCtx", String.valueOf(state));
        Assertions.assertEquals(
            "running", state, "AudioContext должен быть активен (running), но сейчас он: '" + state + "'. " +
                "Возможно, браузер заблокировал звук (проверь флаг autoplay-policy) или JS не инициализировал аудио."
        );
    }
}

