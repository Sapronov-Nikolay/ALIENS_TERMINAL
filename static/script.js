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
function initAudio()  {
    if (audioCtx.state === "suspended") {
        audioCtx.resume().then(() => console.log("🔊 Звук активирован!"));
    }
}
document.addEventListener("click", initAudio);
document.addEventListener("keydown", initAudio);


// ============================================================
//  Генератор звука: щелчок + гул
//  Использует currentSound (меняется при смене пресета)
// ============================================================
function beep() {
    // Некоторые браузеры блокируют звук до первого клика пользователя.
    if (audioCtx.state === "suspended") return;

    const now = audioCtx.currentTime;

    // --- 1.Щелчок ---
    const clickOsc = audioCtx.createOscillator();
    const clickGain = audioCtx.createGain();

    clickOsc.type = currentSound.clickWave;
    // Каждый щелчок звучит немного по разному (для реалистичности)
    clickOsc.frequency.value = currentSound.clickFreq + (Math.random() - 0.5) * currentSound.clickVariation;

    clickGain.gain.setValueAtTime(currentSound.clickVolume, now);
    clickGain.gain.exponentialRampToValueAtTime(0.001, now + currentSound.clickDuration);

    clickOsc.connect(clickGain).connect(audioCtx.destination);
    clickOsc.start(now);
    clickOsc.stop(now + currentSound.clickDuration);

    // --- 2. Гул (если humFreq > 0) ---
    if (currentSound.humFreq >0) {
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


// ============================================================
//  Посимвольная печать текста
//  Скорость берётся из currentSound.printSpeed
// ============================================================
async function typeText(text) {
    for (const ch of text) {
        screenEl.textContent += ch;

        // Писк только на буквенных символах, не на пробелах
        if (ch !== " " && ch !== "\n") {
            // Случайная высота тона - чтобы было реалистичнее
            beep();
        }
        await new Promise((r) => setTimeout(r, currentSound.printSpeed));
    }
    screenEl.textContent += "\n";
}


// ============================================================
//  Очередь сообщений (чтобы ничего не терялось)
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
