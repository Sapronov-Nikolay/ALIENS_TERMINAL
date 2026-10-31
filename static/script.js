// ============================================================
//  Терминал ALIENS - TERMINAL — клиентская часть
// ============================================================

const screenEl = document.getElementById("screen");
const cursorEl = document.getElementById("cursor");
const statusEl = document.getElementById("status");
const presetSelect = document.getElementById("preset-select");

const WS_URL = "ws://127.0.0.1:8765";
let ws = null;


// ============================================================
//  ТЕКУЩИЕ НАСТРОЙКИ ЗВУКА
//  Берём первый пресет из библиотеки (soundPresets.js)
// ============================================================
let currentSound = { ...SOUND_PRESETS.nostromo };


// ============================================================
//  Аудио-контекст
// ============================================================
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
window.audioCtx = audioCtx; // 🔑 Делаем глобальным для автотестов

function initAudio()  {
    if (audioCtx.state === "suspended") {
        audioCtx.resume().then(() => console.log("🔊 Звук активирован!"));
    }
}
document.addEventListener("click", initAudio);
document.addEventListener("keydown", initAudio);


// ============================================================
//  ГЕНЕРАТОР ЗВУКА (3 режима)
// ============================================================
function beep() {
    // // Проверка: не заблокировал ли браузер звук?
    if (audioCtx.state === "suspended") return;

    const now = audioCtx.currentTime;

    // ---------- РЕЖИМ 1: НОСТРОМО (Сложный звук: реле + принтер + мотор) ----------
    if (currentSound.isNostromo) {
        // Реле
        const clickOsc = audioCtx.createOscillator();
        const clickGain = audioCtx.createGain();
        clickOsc.type = "square";
        clickOsc.frequency.value = 1500 + Math.random() * 300;
        clickGain.gain.setValueAtTime(0.04, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.01);
        clickOsc.connect(clickGain).connect(audioCtx.destination);
        clickOsc.start(now);
        clickOsc.stop(now + 0.01);

        // Принтер (стрекот бумаги) — делаем через буфер (шум + фильтр)
        const bufferSize = audioCtx.sampleRate * 0.08;
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
            const modulator = Math.sin((i / audioCtx.sampleRate) * 2 * Math.PI * 80);
            data[i] = (Math.random() * 2 - 1) * (modulator > 0 ? 1 : 0.3);
        }
        const printerSource = audioCtx.createBufferSource();
        printerSource.buffer = buffer;
        const printerFilter = audioCtx.createBiquadFilter();
        printerFilter.type = "bandpass";
        printerFilter.frequency.value = 1000;
        printerFilter.Q.value = 2.0;
        const printerGain = audioCtx.createGain();
        printerGain.gain.setValueAtTime(0.12, now);
        printerGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        printerSource.connect(printerFilter).connect(printerGain).connect(audioCtx.destination);
        printerSource.start(now);

        // 3. Звук мотора (низкий гул)
        const motorOsc = audioCtx.createOscillator();
        const motorGain = audioCtx.createGain();
        motorOsc.type = "sawtooth";
        motorOsc.frequency.value = 70 + Math.random() * 10;
        motorGain.gain.setValueAtTime(0.05, now);
        motorGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
        motorOsc.connect(motorGain).connect(audioCtx.destination);
        motorOsc.start(now);
        motorOsc.stop(now + 0.1);

        // 4. Случайные эффекты (лязг, скрип) - чтобы не было скучно
        
        // Лязн (20% шанс): если случайное число < 0.2 - проигрываем лязг
        if (Math.random() < 0.2) {
            const clangOsc = audioCtx.createOscillator();
            const clangGain = audioCtx.createGain();
            clangOsc.type = "triangle";
            clangOsc.frequency.value = 400 + Math.random() * 200;
            clangGain.gain.setValueAtTime(0.08, now);
            clangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);
            clangOsc.connect(clangGain).connect(audioCtx.destination);
            clangOsc.start(now);
            clangOsc.stop(now + 0.03);
        }

        // Скрип (10% шанс)
        if (Math.random() < 0.1) {
            const creakSize = audioCtx.sampleRate * 0.05;
            const creakBuf = audioCtx.createBuffer(1, creakSize, audioCtx.sampleRate);
            const creakData = creakBuf.getChannelData(0);

            // Заполняем буфер случайным шумом (от -1 до +1)
            for (let i = 0; i < creakSize; i++) creakData[i] = Math.random() * 2 - 1;

            const creakSrc = audioCtx.createBufferSource();
            creakSrc.buffer = creakBuf;
            const creakFilter = audioCtx.createBiquadFilter();
            creakFilter.type = "lowpass";

            creakFilter.frequency.value = 300;
            const creakGain = audioCtx.createGain();
            creakGain.gain.setValueAtTime(0.05, now);
            creakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.05);

            creakSrc.connect(creakFilter).connect(creakGain).connect(audioCtx.destination);
            creakSrc.start(now);
        }

        return; // Выходим из функции isNostromo, чтобы эти звуки не звучали в других режимах.
    }
    
    // ---------- РЕЖИМ 2: ПЕЧАТНАЯ МАШИНКА (Металлический клик + деревянный стук) ----------
    if(currentSound.isTypewriter) {
        // Делаем один общий буфер шума - его будем использовать для всех трёх звуков
        const bufferSize = audioCtx.sampleRate * 0.1;   // Длина: 0,1 сек
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        // Заполняем шумом: каждое значение от -1 до +1 - это громкость в конкретный момент
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        // Металлический щелчок
        const clickSrc = audioCtx.createBufferSource();
        clickSrc.buffer = buffer;
        const clickFilter = audioCtx.createBiquadFilter();
        clickFilter.type = "highpass";

        clickFilter.frequency.value = 2500 + Math.random() * 500;
        const clickGain = audioCtx.createGain();
        clickGain.gain.setValueAtTime(0.08, now);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.008);

        clickSrc.connect(clickFilter).connect(clickGain).connect(audioCtx.destination);
        clickSrc.start(now);

        // Деревянный стук
        const thudSrc = audioCtx.createBufferSource();
        thudSrc.buffer = buffer;
        const thudFilter = audioCtx.createBiquadFilter();
        thudFilter.type = "lowpass";    // Низкочастотный: оставляем глухой звук

        thudFilter.frequency.value = 150 + Math.random() * 50;
        const thudGain = audioCtx.createGain();
        thudGain.gain.setValueAtTime(0.25, now);
        thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

        thudSrc.connect(thudFilter).connect(thudGain).connect(audioCtx.destination);
        thudSrc.start(now);

        // Шорох бумаги
        const rustleSrc = audioCtx.createBufferSource();
        rustleSrc.buffer = buffer;
        const rustleFilter = audioCtx.createBiquadFilter();
        rustleFilter.type = "bandpass"; // Оставляем среднюю полосу частот

        rustleFilter.frequency.value = 800 + Math.random() * 400;
        rustleFilter.Q.value = 1.0; // Умеренно широкая полоса
        const rustleGain = audioCtx.createGain();
        rustleGain.gain.setValueAtTime(0.12, now);  // Громкость 0,12
        rustleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.025);   // Короткое затухание: 0.025 сек

        rustleSrc.connect(rustleFilter).connect(rustleGain).connect(audioCtx.destination);
        rustleSrc.start(now);

        return; // Режим печатной машинки обработан - выходим
    }

    // ---------- РЕЖИМ 3: ОБЫЧНЫЕ ТЕРМИНАЛЫ (Простой «бип») ----------
    // Используем настройки из SOUND_PRESETS (частота, громкость, длительность)
    const clickOsc = audioCtx.createOscillator();
    const clickGain = audioCtx.createGain();
    clickOsc.type = currentSound.clickWave;

    clickOsc.frequency.value = currentSound.clickFreq + (Math.random() - 0.5) * currentSound.clickVariation;
    clickGain.gain.setValueAtTime(currentSound.clickVolume, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + currentSound.clickDuration);

    clickOsc.connect(clickGain).connect(audioCtx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + currentSound.clickDuration);    // Останавливаем по таймеру

    // Шум (если есть в настройках пресета)
    if (currentSound.clickNoise && currentSound.clickNoise > 0) {
        const bufferSize = audioCtx.sampleRate * 0.02;  // Длина шума: 0,02 сек
        const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) data[i] = Math.random() * 2 - 1;

        const noiseSrc = audioCtx.createBufferSource();
        noiseSrc.buffer = buffer;
        const noiseFilter = audioCtx.createBiquadFilter();
        noiseFilter.type = "bandpass";

        noiseFilter.frequency.value = 1200 + Math.random() * 600;
        noiseFilter.Q.value = 0.8;
        const noiseGain = audioCtx.createGain();
        noiseGain.gain.setValueAtTime(currentSound.clickNoise, now);    // Громкость шума из настроек
        noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.015);

        noiseSrc.connect(noiseFilter).connect(noiseGain).connect(audioCtx.destination);
        noiseSrc.start(now);

        // Глухой удар (если есть)
        if (currentSound.thudFreq && currentSound.thudFreq > 0) {
            const thudOsc = audioCtx.createOscillator();
            const thudGain = audioCtx.createGain();
            thudOsc.type = "sine";

            thudOsc.frequency.setValueAtTime(currentSound.thudFreq, now);
            thudOsc.frequency.exponentialRampToValueAtTime(50, now + 0.08);
            thudGain.gain.setValueAtTime(currentSound.thudVolume, now);
            thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

            thudOsc.connect(thudGain).connect(audioCtx.destination);
            thudOsc.start(now);
            thudOsc.stop(now + 0.1);
        }

        // Гул (фон)
        if (currentSound.humFreq > 0) {
            const humOsc = audioCtx.createOscillator();
            const humGain = audioCtx.createGain();
            humOsc.type = "sine";

            humOsc.frequency.value = currentSound.humFreq;
            humGain.gain.setValueAtTime(currentSound.humVolume, now);
            humGain.gain.exponentialRampToValueAtTime(0.001, now + currentSound.humDuration);

            humOsc.connect(humGain).connect(audioCtx.destination);
            humOsc.start(now);
            humOsc.stop(now + currentSound.humDuration);
        }
    }
}


// ============================================================
//  ЗВУК ПЕРЕНОСА КАРЕТКИ (скрип + лязг)
//  Эффект состоит из двух частей: сначала глухой скрип, потом короткий лязг
// ============================================================
function playCarriageReturn() {
    if (audioCtx.state === "suspended") return;
    const now = audioCtx.currentTime;

    // ---- ЧАСТЬ 1: СКРИП (глухой, деревянно-металический) ----
    const bufferSize = audioCtx.sampleRate * 0.15;
    const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {data[i] = Math.random() * 2 - 1;}

    const creakSrc = audioCtx.createBufferSource();
    creakSrc.buffer = buffer;

    const creakFilter = audioCtx.createBiquadFilter();
    creakFilter.type = "lowpass";
    creakFilter.frequency.value = 400;
    const creakGain = audioCtx.createGain();
    creakGain.gain.setValueAtTime(0.1, now);
    creakGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

    creakSrc.connect(creakFilter).connect(creakGain).connect(audioCtx.destination);
    creakSrc.start(now);

    // ---- ЧАСТЬ 2: ЛЯЗГ (короткий металлический удар) ----
    const clangOsc = audioCtx.createOscillator();
    const clangGain = audioCtx.createGain();
    clangOsc.type = "triangle";

    clangOsc.frequency.value = 180;
    clangGain.gain.setValueAtTime(0.15, now + 0.18);
    clangGain.gain.exponentialRampToValueAtTime(0.001, now + 0.26);

    clangOsc.connect(clangGain).connect(audioCtx.destination);
    clangOsc.start(now + 0.18);
    clangOsc.stop(now + 0.26);
}

// ============================================================
//  ВИЗУАЛЬНЫЙ ЭФФЕКТ: летящая каретка
//  Идея: каретка мгновенно встаёт на одну строку с курсором,
//  а потом «пролетает» по горизонтали за счёт CSS-класса .flying.
//  Плюс короткая вспышка терминала для акцента.
// ============================================================
function playCarriageAnimation() {
    const terminal = document.getElementById("terminal");
    const cursor = document.getElementById("cursor");
    const carriage = document.getElementById("carriage");
    const terminalRect = terminal.getBoundingClientRect();
    const cursorRect = cursor.getBoundingClientRect();

    carriage.style.top = (cursorRect.top - terminalRect.top) + "px";

    // Перезапуск CSS-анимации
    carriage.classList.remove("flying");
    void carriage.offsetWidth;
    carriage.classList.add("flying");

    // Вспышка терминала
    terminal.classList.add("flash-effect");
    setTimeout(() => terminal.classList.remove("flash-effect"), 400);
}

// ============================================================
//  ПОСИМВОЛЬНАЯ ПЕЧАТЬ ТЕКСТА
//  Скорость берётся из currentSound.printSpeed
// ============================================================
async function typeText(text) {
    if (currentSound.isNostromo) {
        playCarriageReturn();
        playCarriageAnimation();
        await new Promise((r) => setTimeout(r, 250));
    }

    for (const ch of text) {
        screenEl.textContent += ch;

        // Писк только на буквенных символах, не на пробелах
        if (ch !== " " && ch !== "\n") beep();
        await new Promise((r) => setTimeout(r, currentSound.printSpeed));
    }
    screenEl.textContent += "\n";
}


// ============================================================
//  ОЧЕРЕДЬ СООБЩЕНИЙ (чтобы ничего не терялось)
// ============================================================
let messageQueue = [];
let isTyping = false;

async function processQueue() {
    if (isTyping || messageQueue.length === 0) return;
    isTyping = true;
    const text = messageQueue.shift();  // Берем первое сообщение из очереди
    await typeText(text);

    isTyping = false;
    await new Promise((r) => setTimeout(r, 300));  // Пауза между сообщениями
    processQueue(); // Проверяем, есть ли ещё сообщения
}


// ============================================================
//  WebSocket-соединение
// ============================================================
function connect() {
    ws = new WebSocket(WS_URL);

    ws.onopen = () => {
        statusEl.textContent = "ONLINE - ALIENS - TERMINAL";
        statusEl.className = "online";
    };

    ws.onmessage = (event) => {
        // Блокируем приём, пока печатается предыдущее сообщение
        messageQueue.push(event.data);
        processQueue();
    };

    ws.onclose = () => {
        statusEl.textContent = "CONNECTION LOST - RECONNECTING...";
        statusEl.className = "offline";
        setTimeout(connect, 2000);
    };

    ws.onerror = () => {
        statusEl.textContent = "ERROR";
        statusEl.className = "offline";
    };
}


// ============================================================
//  МЕНЮ ВЫБОРА ПРЕСЕТА
//  Заполняет <select> опциями из SOUND_PRESETS и меняет звук при выборе.
// ============================================================
function initPresetMenu() {
    // 1. Проверяем выпадающий список
    for (const [id, preset] of Object.entries(SOUND_PRESETS)) {
        const option = document.createElement("option");
        option.value = id;
        option.textContent = preset.name;
        presetSelect.appendChild(option);
    }

    // 2. Устанавливаем новый пресет активным
    const firstId = Object.keys(SOUND_PRESETS)[0];
    presetSelect.value = firstId;
    applyPreset(firstId);

    // 3. Слушаем изменение выбора
    presetSelect.addEventListener("change", (e) => {
        applyPreset(e.target.value);
    });
}

// Применяем пресет по его ID
function applyPreset(id) {
    const preset = SOUND_PRESETS[id];
    if (!preset) return;

    // Копируем все свойства, кроме name
    const { name, ...settings } = preset;
    currentSound = settings;
    console.log(`🎵 Применяем пресет: ${name}`);
}


// ============================================================
//  Запуск
// ============================================================
initPresetMenu();   // Сначала меню
connect();          // Потом соединение
