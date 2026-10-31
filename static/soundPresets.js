// ============================================================
//  БИБЛИОТЕКА ЗВУКОВЫХ ПРЕСЕТОВ
//  Каждый пресет — это набор цифр, которые описывают звук.
//  Меняй их, чтобы создать собственный терминал!
// ============================================================

const SOUND_PRESETS = {
    // 1 Классика: "Чужой" (1979) Ностромо
    nostromo: {
        name: "Ностромо (Чужой, 1979)",  // Название пункта меню
        isNostromo: true,       // Обогащённый букет звуков
        clickFreq: 600,         // Высота щелчка (Гц)
        clickVariation: 100,    // Разброс высоты (каждый щелчок чуть другой)
        clickVolume: 0.08,      // Громкость щелчка (0.01 - 0.3)
        clickDuration: 0.03,    // Длительность щелчка (сек)
        clickWave: "square",    // Форма волны: square, sawtooth, triangle, sine
        clickNoise: 0.08,       // Громкость шума (0 - 0.2)
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
        clickNoise: 0.09,       // Громкость шума (0 - 0.2)
        humFreq: 90,            // Частота фонового гула (Гц)
        humVolume: 0.05,        // Громкость гула (0 - 0.2)
        humDuration: 0.04,      // Длительность гула (сек)
        printSpeed: 80,         // Скорость печать (1 мс на символ, чем меньше, тем быстрее)
        thudFreq: 90,           // Низкая частота (глухой удар)
        thudVolume: 0.2,        // Громкость удара
    },

    // 3. «Чужой 3» (1992) — Тюрьма Фиорина 161
    fury161: {
        name: "Фиорина 161 (Чужой 3, 1992)",
        clickFreq: 450,
        clickVariation: 180,
        clickVolume: 0.07,
        clickDuration: 0.04,
        clickWave: "sawtooth",  // Скрежещущий
        clickNoise: 0.12,       // Больше шума — «ржавость»
        humFreq: 80,
        humVolume: 0.06,
        humDuration: 0.1,
        printSpeed: 140
    },

    // 4. «Бегущий по лезвию» (1982) — Эспер
    esper: {
        name: "Эспер (Бегущий по лезвию, 1982)",
        clickFreq: 1800,
        clickVariation: 500,    // Большой разброс — хаос
        clickVolume: 0.05,
        clickDuration: 0.03,
        clickWave: "sawtooth",
        clickNoise: 0.15,
        humFreq: 60,
        humVolume: 0.02,
        humDuration: 0.05,
        printSpeed: 110
    },

    // 5. «2001: Космическая одиссея» (1968) — HAL 9000
    hal9000: {
        name: "HAL 9000 (2001, 1968)",
        clickFreq: 1000,
        clickVariation: 0,      // Ноль разброса — идеальный робот
        clickVolume: 0.04,
        clickDuration: 0.02,
        clickWave: "sine",      // Гладкий, без эмоций
        clickNoise: 0,          // Без шума - стерильно
        humFreq: 200,
        humVolume: 0.01,
        humDuration: 0.03,
        printSpeed: 120
    },

    // 6. «Звёздные войны» (1977) — R2-D2
    r2d2: {
        name: "R2-D2 (Звёздные войны, 1977)",
        clickFreq: 1500,
        clickVariation: 800,    // Огромный разброс
        clickVolume: 0.06,
        clickDuration: 0.08,    // Длинные "блупы"
        clickWave: "square",    // Мягкий, но с характером
        clickNoise: 0.05,
        humFreq: 0,             // Без гула
        humVolume: 0,
        humDuration: 0,
        printSpeed: 150
    },

    // 7. Кастомная версия
    my_custom_sound: {
    name: "Мой звук (Кастом)",
        clickFreq: 2200,         // Высота щелчка (Гц)
        clickVariation: 100,     // Разброс высоты
        clickVolume: 0.04,       // Громкость щелчка
        clickDuration: 0.015,    // Длительность (сек)
        clickWave: "square",     // Форма волны (square, sawtooth, triangle, sine)
        clickNoise: 0.1,         // Громкость механического шума (эффект реле)
        humFreq: 300,            // Частота фонового гула (0 = выключить)
        humVolume: 0.015,        // Громкость гула
        humDuration: 0.04,       // Длительность гула
        printSpeed: 60           // Скорость печати (мс на символ)
    },

    // 8. "Чужой: Завет" (2017) - Терминал "Завета" (современный, минималистичный)
    covenant: {
        name: "Завет (Чужой: Завет, 2017",
        clickFreq: 1300,
        clickVariation: 80,
        clickVolume: 0.03,      // тихий
        clickDuration: 0.018,
        clickWave: "sine",      // Гладкий
        clickNoise: 0.04,
        humFreq: 150,
        humVolume: 0.12,
        humDuration: 0.05,
        printSpeed: 90
    },

    // 9. Классическая механическая печатная машинка (1900-е)
    typewriter_classic: {
        name: "Печатная машинка (классика)",
        clickFreq: 1200,        // Средняя высота "удара"
        clickVariation: 80,     // Клавиши не идеальны, каждая чуть отличается
        clickVolume: 0.05,      // Громко - это механический удар.
        clickDuration: 0.01,    // Чуть длиннее, чтобы был "деревянный стук"
        clickWave: "triangle",  // Мягче, чем square -  звучит "по дереву"
        clickNoise: 0.3,        // Много шума - это удар металла о бумагу
        thudFreq: 90,           // Низкая частота (глухой удар)
        thudVolume: 0.2,        // Громкость удара
        humFreq: 0,             // Без гула - машинка молчит между ударами
        humVolume: 0,
        humDuration: 0,
        printSpeed: 100,        // Стандартная скорость печати
        isTypewriter: true      // Этот флаг включает особый "механический" режим
    },

    // 10. Электронная печатная машинка (1970-е, IBM Selectric)
    typewriter_electronic: {
        name: "Печатная машинка (электронная)",
        clickFreq: 1400,        // Выше - "электронный" оттенок
        clickVariation: 60,     // Более ровная, "механизм точный"
        clickVolume: 0.06,      // тише - не бьёт, а "печатает"
        clickDuration: 0.025,   // Короче - "электронный" щелчок
        clickWave: "square",    // Резче, "цифровое"
        clickNoise: 0.08,       // Меньше шума - нет удара "по бумаге"
        humFreq: 220,           // Высокий электронный гул двигателя
        humVolume: 0.025,       // Еле слышный
        humDuration: 0.04,
        printSpeed: 75          // Быстрее - электроника не устаёт
    }
};
