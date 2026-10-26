// ============================================================
//  БИБЛИОТЕКА ЗВУКОВЫХ ПРЕСЕТОВ
//  Каждый пресет — это набор цифр, которые описывают звук.
//  Меняй их, чтобы создать собственный терминал!
// ============================================================

const SOUND_PRESETS = {
    // 1 Классика: "Чужой" (1979) Ностромо
    nostromo: {
        name: "Ностромо (Чужой, 1979)",  // Название пункта меню
        clickFreq: 850,         // Высота щелчка (Гц)
        clickVariation: 150,    // Разброс высоты (каждый щелчок чуть другой)
        clickVolume: 0.02,      // Громкость щелчка (0.01 - 0.3)
        clickDuration: 0.02,    // Длительность щелчка (сек)
        clickWave: "square",    // Форма волны: square, sawtooth, triangle, sine
        humFreq: 110,           // Частота фонового гула (Гц)
        humVolume: 0.04,        // Громкость гула (0 - 0.2)
        humDuration: 0.06,      // Длительность гула (сек)
        printSpeed: 100         // Скорость печать (1 мс на символ, чем меньше, тем быстрее)
    },

    // 2. "Чужие" (1986) - Колония Хадли
    hedly: {
        name: "Xадли (Чужие, 1986)",
        clickFreq: 1200,        // Высота щелчка (Гц)
        clickVariation: 50,     // Разброс высоты (каждый щелчок чуть другой)
        clickVolume: 0.06,      // Громкость щелчка (0.01 - 0.3)
        clickDuration: 0.015,   // Длительность щелчка (сек)
        clickWave: "triangle",  // Форма волны: square, sawtooth, triangle, sine
        humFreq: 90,            // Частота фонового гула (Гц)
        humVolume: 0.05,        // Громкость гула (0 - 0.2)
        humDuration: 0.04,      // Длительность гула (сек)
        printSpeed: 80,         // Скорость печать (1 мс на символ, чем меньше, тем быстрее)
    },

    // 3. «Чужой 3» (1992) — Тюрьма Фиорина 161
    fury161: {
        name: "Фиорина 161 (Чужой 3, 1992)",
        clickFreq: 500,
        clickVariation: 200,
        clickVolume: 0.07,
        clickDuration: 0.04,
        clickWave: "sawtooth",
        humFreq: 80,
        humVolume: 0.06,
        humDuration: 0.1,
        printSpeed: 140
    },

    // 4. «Бегущий по лезвию» (1982) — Эспер
    esper: {
        name: "Эспер (Бегущий по лезвию, 1982)",
        clickFreq: 1800,
        clickVariation: 400,
        clickVolume: 0.05,
        clickDuration: 0.03,
        clickWave: "sawtooth",
        humFreq: 60,
        humVolume: 0.02,
        humDuration: 0.05,
        printSpeed: 110
    },

    // 5. «2001: Космическая одиссея» (1968) — HAL 9000
    hal9000: {
        name: "HAL 9000 (2001, 1968)",
        clickFreq: 1000,
        clickVariation: 0,
        clickVolume: 0.04,
        clickDuration: 0.02,
        clickWave: "sine",
        humFreq: 200,
        humVolume: 0.01,
        humDuration: 0.03,
        printSpeed: 120
    },

    // 6. «Звёздные войны» (1977) — R2-D2
    r2d2: {
        name: "R2-D2 (Звёздные войны, 1977)",
        clickFreq: 1500,
        clickVariation: 800,
        clickVolume: 0.06,
        clickDuration: 0.08,
        clickWave: "square",
        humFreq: 0,
        humVolume: 0,
        humDuration: 0,
        printSpeed: 150
    }
};
