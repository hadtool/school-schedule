/* ============================================================
   SCHEDULE GENERATOR — app.js
   All React components + algorithm + translations
   ============================================================ */
const { useState, useEffect, useMemo, useRef } = React;

// ===================== ПЕРЕВОДЫ =====================
// nameKey — нейтральный ключ предмета (не зависит от языка)
// Названия предметов хранятся как { tg, ru, en } и рендерятся по текущему языку

const TYPE_KEYS = ['Точный','Гуманитарный','Творческий','Физкультура','Другое'];

const T = {
  tg: {
    appTitle:'Ҷадвали дарсӣ', appSub:'Барномаи автоматии ташкили ҷадвал',
    step1:'Синфҳо', step2:'Фанҳо', step3:'Муаллимон', step4:'Ҷадвал', step5:'Танзимот',
    classes:'Синфҳо', parallels:'Параллелҳо', addParallel:'+ Параллел',
    gradeFrom:'Аз синф', gradeTo:'То синф', applyRange:'Татбиқ',
    totalClasses:'Ҳамагӣ', classCount:'синф',
    subjects:'Фанҳо', addSubject:'+ Фан', addDefault:'📚 Фанҳои асосӣ', copyFrom:'Нусха аз...',
    subjectName:'Ном', hours:'Соат/ҳафта', type:'Намуд', teacher:'Муаллим',
    typeLabels:['Дақиқ','Гуманитарӣ','Эҷодӣ','Варзиш','Дигар'],
    teachers:'Муаллимон', syncTeachers:'🔄 Навкунии рӯйхати муаллимон',
    addTeacherManual:'+ Иловаи дастӣ', teacherName:'Номи муаллим (ФИО)',
    teacherNamePlaceholder:'Алиев А.А.', addTeacherBtn:'Иловаи муаллим', cancelBtn:'Бекор кардан',
    workDays:'Рӯзҳои корӣ', load:'Бор', lessonsWeek:'дарс/ҳафта', assignments:'Дарсҳо',
    syncHint:'Барои ҷамъоварии муаллимон аз фанҳо тугмаи болоро пахш кунед.',
    addManualHint:'Номи муаллимро нависед ва рӯзҳои корӣ интихоб кунед.',
    generate:'⚡ Тартиб додан', regenerate:'🔄 Аз нав',
    forStudents:'👧 Барои хонандагон', forTeachers:'👩‍🏫 Барои муаллимон',
    warnings:'Огоҳиҳо', noWarnings:'Ҷадвал бидуни хато тартиб ёфт!',
    print:'🖨️ Чоп', exportXlsx:'📊 Excel', exportPdf:'📄 PDF',
    reset:'Тоза кардан', confirm:'Тасдиқ',
    timings:'Вақти дарсҳо', shifts:'Навбатҳо', shift:'Навбат',
    lessonDuration:'Дарозии дарс (дақ)', breakDuration:'Дарозии танаффус (дақ)',
    startTime:'Вақти оғоз', addSlot:'+ Хона',
    assignMode:'Таъини муаллим баъди ҷадвал',
    unassigned:'Бе муаллим', assignTeacher:'Таъин кунед',
    back:'← Бозгашт', next:'Идома →', stepOf:'Қадам', of:'аз',
    moveMode:'🔄 Кӯчонидан', moveModeOn:'✓ Кӯчонидан',
    assignModeBtn:'👩‍🏫 Таъини муаллим', assignModeOn:'✓ Таъин',
    swapHint:'Хонаи аввалро пахш кунед, сипас хонаи дуввумро интихоб кунед.',
    swapSrcChosen:'Манбаъ интихоб шуд. Акнун хонаи ҳадафро пахш кунед.',
    conflict:'Муаллим ба ду дарс афтод!',
    noSolution:'Ҷойгиркунӣ мумкин нест',
    time:'Вақт', all:'Ҳама',
    generationCount:'Шумораи тартибдиҳӣ', generationCountLabel:'маротиба тартиб дода шуд',
    days:['Дш','Сш','Чш','Пш','Ҷм','Шб'],
    testMode:'🧪 Озмоиши автоматӣ', testModeDesc:'Намунаи тайёр бо як тугма',
    testModeOn:'Ҳолати озмоиш фаъол аст',
  },
  ru: {
    appTitle:'Генератор расписания', appSub:'Автоматическое составление расписания уроков',
    step1:'Классы', step2:'Предметы', step3:'Учителя', step4:'Расписание', step5:'Настройки',
    classes:'Классы', parallels:'Параллели', addParallel:'+ Параллель',
    gradeFrom:'От класса', gradeTo:'До класса', applyRange:'Применить',
    totalClasses:'Всего', classCount:'кл',
    subjects:'Предметы', addSubject:'+ Предмет', addDefault:'📚 Основные предметы', copyFrom:'Скопировать из...',
    subjectName:'Предмет', hours:'Ч/нед', type:'Тип', teacher:'Учитель',
    typeLabels:['Точный','Гуманитарный','Творческий','Физкультура','Другое'],
    teachers:'Учителя', syncTeachers:'🔄 Синхронизировать учителей',
    addTeacherManual:'+ Добавить вручную', teacherName:'ФИО учителя',
    teacherNamePlaceholder:'Иванов И.И.', addTeacherBtn:'Добавить учителя', cancelBtn:'Отмена',
    workDays:'Рабочие дни', load:'Нагрузка', lessonsWeek:'ур/нед', assignments:'Предметы',
    syncHint:'Нажмите кнопку выше, чтобы автоматически собрать учителей из введённых предметов.',
    addManualHint:'Введите ФИО учителя и отметьте рабочие дни.',
    generate:'⚡ Сгенерировать расписание', regenerate:'🔄 Перегенерировать',
    forStudents:'👧 Для учеников', forTeachers:'👩‍🏫 Для учителей',
    warnings:'Предупреждения', noWarnings:'Расписание сгенерировано без нарушений!',
    print:'🖨️ Печать', exportXlsx:'📊 Excel', exportPdf:'📄 PDF',
    reset:'Сбросить', confirm:'Подтвердить',
    timings:'Время уроков', shifts:'Потоки', shift:'Поток',
    lessonDuration:'Длина урока (мин)', breakDuration:'Длина перемены (мин)',
    startTime:'Начало', addSlot:'+ Урок',
    assignMode:'Назначение учителей после генерации',
    unassigned:'Без учителя', assignTeacher:'Назначить',
    back:'← Назад', next:'Далее →', stepOf:'Шаг', of:'из',
    moveMode:'🔄 Переместить', moveModeOn:'✓ Режим переноса',
    assignModeBtn:'👩‍🏫 Назначить учителей', assignModeOn:'✓ Режим назначения',
    swapHint:'Нажмите на первую ячейку (источник), затем — на целевую. Работает между разными днями.',
    swapSrcChosen:'Источник выбран. Теперь нажмите на целевую ячейку.',
    conflict:'Учитель ведёт два урока одновременно!',
    noSolution:'Не удалось разместить урок',
    time:'Время', all:'Все',
    generationCount:'Счётчик генераций', generationCountLabel:'раз сгенерировано',
    days:['Пн','Вт','Ср','Чт','Пт','Сб'],
    testMode:'🧪 Тестовое заполнение', testModeDesc:'Автозаполнение демо-данными одной кнопкой',
    testModeOn:'Тестовый режим активен',
  },
  en: {
    appTitle:'Schedule Generator', appSub:'Automatic school timetable builder',
    step1:'Classes', step2:'Subjects', step3:'Teachers', step4:'Schedule', step5:'Settings',
    classes:'Classes', parallels:'Parallels', addParallel:'+ Parallel',
    gradeFrom:'From grade', gradeTo:'To grade', applyRange:'Apply',
    totalClasses:'Total', classCount:'cls',
    subjects:'Subjects', addSubject:'+ Subject', addDefault:'📚 Default subjects', copyFrom:'Copy from...',
    subjectName:'Subject', hours:'Hrs/wk', type:'Type', teacher:'Teacher',
    typeLabels:['Exact','Humanities','Creative','PE','Other'],
    teachers:'Teachers', syncTeachers:'🔄 Sync teachers from subjects',
    addTeacherManual:'+ Add manually', teacherName:'Teacher name',
    teacherNamePlaceholder:'Smith J.', addTeacherBtn:'Add teacher', cancelBtn:'Cancel',
    workDays:'Working days', load:'Load', lessonsWeek:'les/wk', assignments:'Subjects',
    syncHint:'Click the button above to automatically collect teachers from entered subjects.',
    addManualHint:'Enter teacher name and select working days.',
    generate:'⚡ Generate Schedule', regenerate:'🔄 Regenerate',
    forStudents:'👧 For students', forTeachers:'👩‍🏫 For teachers',
    warnings:'Warnings', noWarnings:'Schedule generated without conflicts!',
    print:'🖨️ Print', exportXlsx:'📊 Excel', exportPdf:'📄 PDF',
    reset:'Reset', confirm:'Confirm',
    timings:'Lesson timings', shifts:'Shifts', shift:'Shift',
    lessonDuration:'Lesson length (min)', breakDuration:'Break length (min)',
    startTime:'Start time', addSlot:'+ Lesson',
    assignMode:'Assign teachers after schedule creation',
    unassigned:'No teacher', assignTeacher:'Assign',
    back:'← Back', next:'Next →', stepOf:'Step', of:'of',
    moveMode:'🔄 Move lessons', moveModeOn:'✓ Move mode',
    assignModeBtn:'👩‍🏫 Assign teachers', assignModeOn:'✓ Assign mode',
    swapHint:'Click the source cell, then the target cell. Works across different days.',
    swapSrcChosen:'Source selected. Now click the target cell.',
    conflict:'Teacher has two simultaneous lessons!',
    noSolution:'Could not place lesson',
    time:'Time', all:'All',
    generationCount:'Generation counter', generationCountLabel:'times generated',
    days:['Mo','Tu','We','Th','Fr','Sa'],
    testMode:'🧪 Test fill', testModeDesc:'Auto-fill demo data with one click',
    testModeOn:'Test mode active',
  }
};

// ===================== ПРЕДМЕТЫ ПО УМОЛЧАНИЮ =====================
// Каждый предмет хранит названия на трёх языках: tg / ru / en
// type — внутренний ключ из TYPE_KEYS
const DEFAULT_SUBJECTS = {
  1:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:5, type:'Гуманитарный'},
    {tg:'Хониш',            ru:'Чтение',             en:'Reading',           hours:4, type:'Гуманитарный'},
    {tg:'Математика',       ru:'Математика',          en:'Mathematics',       hours:4, type:'Точный'},
    {tg:'Расм',             ru:'Рисование',           en:'Art',               hours:1, type:'Творческий'},
    {tg:'Мусиқӣ',           ru:'Музыка',              en:'Music',             hours:1, type:'Творческий'},
    {tg:'Тарбияи ҷисмонӣ', ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
    {tg:'Меҳнат',           ru:'Труд',                en:'Labour',            hours:1, type:'Творческий'},
  ],
  2:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:5, type:'Гуманитарный'},
    {tg:'Адабиёт',          ru:'Литература',          en:'Literature',        hours:3, type:'Гуманитарный'},
    {tg:'Математика',       ru:'Математика',          en:'Mathematics',       hours:5, type:'Точный'},
    {tg:'Дунёшиносӣ',       ru:'Окружающий мир',      en:'World Studies',     hours:2, type:'Другое'},
    {tg:'Расм',             ru:'Рисование',           en:'Art',               hours:1, type:'Творческий'},
    {tg:'Мусиқӣ',           ru:'Музыка',              en:'Music',             hours:1, type:'Творческий'},
    {tg:'Тарбияи ҷисмонӣ', ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
  ],
  3:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:5, type:'Гуманитарный'},
    {tg:'Адабиёт',          ru:'Литература',          en:'Literature',        hours:3, type:'Гуманитарный'},
    {tg:'Математика',       ru:'Математика',          en:'Mathematics',       hours:5, type:'Точный'},
    {tg:'Дунёшиносӣ',       ru:'Окружающий мир',      en:'World Studies',     hours:2, type:'Другое'},
    {tg:'Забони русӣ',      ru:'Русский язык',        en:'Russian Language',  hours:2, type:'Гуманитарный'},
    {tg:'Тарбияи ҷисмонӣ', ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
  ],
  4:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:4, type:'Гуманитарный'},
    {tg:'Адабиёт',          ru:'Литература',          en:'Literature',        hours:3, type:'Гуманитарный'},
    {tg:'Математика',       ru:'Математика',          en:'Mathematics',       hours:5, type:'Точный'},
    {tg:'Дунёшиносӣ',       ru:'Окружающий мир',      en:'World Studies',     hours:2, type:'Другое'},
    {tg:'Забони русӣ',      ru:'Русский язык',        en:'Russian Language',  hours:3, type:'Гуманитарный'},
    {tg:'Забони хориҷӣ',   ru:'Иностранный язык',   en:'Foreign Language',  hours:2, type:'Гуманитарный'},
    {tg:'Тарбияи ҷисмонӣ', ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
  ],
  5:[
    {tg:'Забони тоҷикӣ',      ru:'Таджикский язык',      en:'Tajik Language',      hours:4, type:'Гуманитарный'},
    {tg:'Адабиёти тоҷик',     ru:'Таджикская лит.',       en:'Tajik Literature',    hours:3, type:'Гуманитарный'},
    {tg:'Математика',          ru:'Математика',             en:'Mathematics',         hours:5, type:'Точный'},
    {tg:'Таърихи Тоҷикистон', ru:'История Таджикистана',  en:'History of Tajikistan',hours:2,type:'Гуманитарный'},
    {tg:'Ҷуғрофия',            ru:'География',              en:'Geography',           hours:2, type:'Другое'},
    {tg:'Биология',            ru:'Биология',               en:'Biology',             hours:2, type:'Другое'},
    {tg:'Забони русӣ',         ru:'Русский язык',           en:'Russian Language',    hours:3, type:'Гуманитарный'},
    {tg:'Забони хориҷӣ',      ru:'Иностранный язык',      en:'Foreign Language',    hours:3, type:'Гуманитарный'},
    {tg:'Расм',                ru:'Рисование',              en:'Art',                 hours:1, type:'Творческий'},
    {tg:'Мусиқӣ',              ru:'Музыка',                 en:'Music',               hours:1, type:'Творческий'},
    {tg:'Тарбияи ҷисмонӣ',   ru:'Физкультура',            en:'PE',                  hours:2, type:'Физкультура'},
  ],
  6:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:4, type:'Гуманитарный'},
    {tg:'Адабиёти тоҷик',  ru:'Таджикская лит.',    en:'Tajik Literature',  hours:3, type:'Гуманитарный'},
    {tg:'Математика',       ru:'Математика',          en:'Mathematics',       hours:5, type:'Точный'},
    {tg:'Таърих',           ru:'История',             en:'History',           hours:2, type:'Гуманитарный'},
    {tg:'Ҷуғрофия',         ru:'География',           en:'Geography',         hours:2, type:'Другое'},
    {tg:'Биология',         ru:'Биология',            en:'Biology',           hours:2, type:'Другое'},
    {tg:'Забони русӣ',     ru:'Русский язык',        en:'Russian Language',  hours:3, type:'Гуманитарный'},
    {tg:'Забони хориҷӣ',  ru:'Иностранный язык',   en:'Foreign Language',  hours:3, type:'Гуманитарный'},
    {tg:'Мусиқӣ',           ru:'Музыка',              en:'Music',             hours:1, type:'Творческий'},
    {tg:'Тарбияи ҷисмонӣ',ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
    {tg:'Технология',       ru:'Технология',          en:'Technology',        hours:2, type:'Творческий'},
  ],
  7:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:3, type:'Гуманитарный'},
    {tg:'Адабиёти тоҷик',  ru:'Таджикская лит.',    en:'Tajik Literature',  hours:3, type:'Гуманитарный'},
    {tg:'Алгебра',          ru:'Алгебра',             en:'Algebra',           hours:3, type:'Точный'},
    {tg:'Геометрия',        ru:'Геометрия',           en:'Geometry',          hours:2, type:'Точный'},
    {tg:'Физика',           ru:'Физика',              en:'Physics',           hours:2, type:'Точный'},
    {tg:'Химия',            ru:'Химия',               en:'Chemistry',         hours:2, type:'Другое'},
    {tg:'Биология',         ru:'Биология',            en:'Biology',           hours:2, type:'Другое'},
    {tg:'Таърих',           ru:'История',             en:'History',           hours:2, type:'Гуманитарный'},
    {tg:'Ҷуғрофия',         ru:'География',           en:'Geography',         hours:2, type:'Другое'},
    {tg:'Забони русӣ',     ru:'Русский язык',        en:'Russian Language',  hours:2, type:'Гуманитарный'},
    {tg:'Забони хориҷӣ',  ru:'Иностранный язык',   en:'Foreign Language',  hours:3, type:'Гуманитарный'},
    {tg:'Информатика',      ru:'Информатика',         en:'Informatics',       hours:1, type:'Точный'},
    {tg:'Тарбияи ҷисмонӣ',ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
  ],
  8:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:3, type:'Гуманитарный'},
    {tg:'Адабиёти тоҷик',  ru:'Таджикская лит.',    en:'Tajik Literature',  hours:2, type:'Гуманитарный'},
    {tg:'Алгебра',          ru:'Алгебра',             en:'Algebra',           hours:3, type:'Точный'},
    {tg:'Геометрия',        ru:'Геометрия',           en:'Geometry',          hours:2, type:'Точный'},
    {tg:'Физика',           ru:'Физика',              en:'Physics',           hours:3, type:'Точный'},
    {tg:'Химия',            ru:'Химия',               en:'Chemistry',         hours:3, type:'Другое'},
    {tg:'Биология',         ru:'Биология',            en:'Biology',           hours:2, type:'Другое'},
    {tg:'Таърих',           ru:'История',             en:'History',           hours:2, type:'Гуманитарный'},
    {tg:'Ҷуғрофия',         ru:'География',           en:'Geography',         hours:2, type:'Другое'},
    {tg:'Забони хориҷӣ',  ru:'Иностранный язык',   en:'Foreign Language',  hours:3, type:'Гуманитарный'},
    {tg:'Информатика',      ru:'Информатика',         en:'Informatics',       hours:2, type:'Точный'},
    {tg:'Тарбияи ҷисмонӣ',ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
  ],
  9:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:3, type:'Гуманитарный'},
    {tg:'Адабиёти тоҷик',  ru:'Таджикская лит.',    en:'Tajik Literature',  hours:2, type:'Гуманитарный'},
    {tg:'Алгебра',          ru:'Алгебра',             en:'Algebra',           hours:3, type:'Точный'},
    {tg:'Геометрия',        ru:'Геометрия',           en:'Geometry',          hours:2, type:'Точный'},
    {tg:'Физика',           ru:'Физика',              en:'Physics',           hours:3, type:'Точный'},
    {tg:'Химия',            ru:'Химия',               en:'Chemistry',         hours:3, type:'Другое'},
    {tg:'Биология',         ru:'Биология',            en:'Biology',           hours:2, type:'Другое'},
    {tg:'Таърих',           ru:'История',             en:'History',           hours:2, type:'Гуманитарный'},
    {tg:'Ҷуғрофия',         ru:'География',           en:'Geography',         hours:1, type:'Другое'},
    {tg:'Забони хориҷӣ',  ru:'Иностранный язык',   en:'Foreign Language',  hours:3, type:'Гуманитарный'},
    {tg:'Информатика',      ru:'Информатика',         en:'Informatics',       hours:2, type:'Точный'},
    {tg:'Ҳуқуқ',            ru:'Право',               en:'Law',               hours:1, type:'Гуманитарный'},
    {tg:'Тарбияи ҷисмонӣ',ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
  ],
  10:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:2, type:'Гуманитарный'},
    {tg:'Адабиёти тоҷик',  ru:'Таджикская лит.',    en:'Tajik Literature',  hours:3, type:'Гуманитарный'},
    {tg:'Алгебра',          ru:'Алгебра',             en:'Algebra',           hours:3, type:'Точный'},
    {tg:'Геометрия',        ru:'Геометрия',           en:'Geometry',          hours:2, type:'Точный'},
    {tg:'Физика',           ru:'Физика',              en:'Physics',           hours:3, type:'Точный'},
    {tg:'Химия',            ru:'Химия',               en:'Chemistry',         hours:2, type:'Другое'},
    {tg:'Биология',         ru:'Биология',            en:'Biology',           hours:2, type:'Другое'},
    {tg:'Таърих',           ru:'История',             en:'History',           hours:2, type:'Гуманитарный'},
    {tg:'Забони хориҷӣ',  ru:'Иностранный язык',   en:'Foreign Language',  hours:3, type:'Гуманитарный'},
    {tg:'Информатика',      ru:'Информатика',         en:'Informatics',       hours:2, type:'Точный'},
    {tg:'Иқтисодиёт',       ru:'Экономика',           en:'Economics',         hours:1, type:'Гуманитарный'},
    {tg:'Ҳуқуқ',            ru:'Право',               en:'Law',               hours:1, type:'Гуманитарный'},
    {tg:'Тарбияи ҷисмонӣ',ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
  ],
  11:[
    {tg:'Забони тоҷикӣ',   ru:'Таджикский язык',    en:'Tajik Language',    hours:2, type:'Гуманитарный'},
    {tg:'Адабиёти тоҷик',  ru:'Таджикская лит.',    en:'Tajik Literature',  hours:3, type:'Гуманитарный'},
    {tg:'Алгебра',          ru:'Алгебра',             en:'Algebra',           hours:3, type:'Точный'},
    {tg:'Геометрия',        ru:'Геометрия',           en:'Geometry',          hours:2, type:'Точный'},
    {tg:'Физика',           ru:'Физика',              en:'Physics',           hours:3, type:'Точный'},
    {tg:'Химия',            ru:'Химия',               en:'Chemistry',         hours:2, type:'Другое'},
    {tg:'Биология',         ru:'Биология',            en:'Biology',           hours:1, type:'Другое'},
    {tg:'Таърихи ҷаҳон',   ru:'Всемирная история',  en:'World History',     hours:2, type:'Гуманитарный'},
    {tg:'Забони хориҷӣ',  ru:'Иностранный язык',   en:'Foreign Language',  hours:3, type:'Гуманитарный'},
    {tg:'Информатика',      ru:'Информатика',         en:'Informatics',       hours:2, type:'Точный'},
    {tg:'Иқтисодиёт',       ru:'Экономика',           en:'Economics',         hours:2, type:'Гуманитарный'},
    {tg:'Ҳуқуқ',            ru:'Право',               en:'Law',               hours:1, type:'Гуманитарный'},
    {tg:'Тарбияи ҷисмонӣ',ru:'Физкультура',         en:'PE',                hours:2, type:'Физкультура'},
  ],
};

// Получить отображаемое имя предмета по объекту предмета и языку
// Предмет может быть старым (string name) или новым (объект {tg,ru,en,nameKey})
function getSubjName(subj, lang) {
  if (subj.names) return subj.names[lang] || subj.names.ru || subj.names.tg || '';
  return subj.name || '';
}

// ===================== УТИЛИТЫ =====================
function uid() { return Math.random().toString(36).slice(2, 9); }
function getInitials(n) { return n.trim().split(/\s+/).slice(0,2).map(w=>w[0]).join('').toUpperCase(); }
const COLORS = ['#dbeafe','#d1fae5','#fef3c7','#ede9fe','#fce7f3','#fee2e2','#e0f2fe','#f0fdf4','#fff7ed','#f5f3ff','#ecfdf5','#fdf2f8','#eff6ff','#f7fee7','#fef9c3'];
function subjColor(name) { let h=0; for(let i=0;i<name.length;i++) h=(h*31+name.charCodeAt(i))|0; return COLORS[Math.abs(h)%COLORS.length]; }
const TYPE_TEXT = {'Точный':'#1d4ed8','Гуманитарный':'#9d174d','Творческий':'#92400e','Физкультура':'#991b1b','Другое':'#475569'};

function loadState() { try { return JSON.parse(localStorage.getItem('sched_v4') || 'null'); } catch { return null; } }
function saveState(s) { try { localStorage.setItem('sched_v4', JSON.stringify(s)); } catch {} }

function defaultShifts() {
  return [{ id:uid(), name:'1', startTime:'08:00', slots:[
    {id:uid(),lesson:45,breakAfter:10},
    {id:uid(),lesson:45,breakAfter:10},
    {id:uid(),lesson:45,breakAfter:10},
    {id:uid(),lesson:45,breakAfter:20},
    {id:uid(),lesson:45,breakAfter:10},
    {id:uid(),lesson:45,breakAfter:10},
    {id:uid(),lesson:45,breakAfter:0},
  ]}];
}

function computeTimes(shift) {
  const [hh,mm] = shift.startTime.split(':').map(Number);
  let cur = hh*60 + mm;
  return shift.slots.map(sl => {
    const start = `${String(Math.floor(cur/60)).padStart(2,'0')}:${String(cur%60).padStart(2,'0')}`;
    cur += sl.lesson;
    const end = `${String(Math.floor(cur/60)).padStart(2,'0')}:${String(cur%60).padStart(2,'0')}`;
    cur += sl.breakAfter;
    return { start, end };
  });
}

// ===================== ТЕСТОВЫЕ ДАННЫЕ =====================
// Генерируем демо-данные для быстрой проверки
function buildTestData() {
  const grades = [5, 6, 7];
  const lettersMap = { 5:['А','Б'], 6:['А','Б'], 7:['А'] };
  const teacherPool = [
    'Иванов И.И.','Петрова А.С.','Сидоров В.М.','Алиева Г.Р.',
    'Каримов Б.Т.','Рахимова Н.О.','Усмонов Д.Х.','Зубайдова Ф.А.',
    'Назаров С.К.','Турсунов З.Ю.','Мирзоева Л.Р.','Хасанов П.Г.',
  ];
  let tIdx = 0;

  const classes = grades.map(g => ({
    grade: g,
    parallels: lettersMap[g].map(l => ({ letter:l, id:uid() }))
  }));

  // Назначаем учителей предметам
  const subjTeacherMap = {}; // "subj_ru" -> teacher name
  function getTeacher(subjRu) {
    if (!subjTeacherMap[subjRu]) {
      subjTeacherMap[subjRu] = teacherPool[tIdx++ % teacherPool.length];
    }
    return subjTeacherMap[subjRu];
  }

  const classesWithSubjs = classes.map(cls => ({
    ...cls,
    parallels: cls.parallels.map(par => ({
      ...par,
      subjects: (DEFAULT_SUBJECTS[cls.grade] || DEFAULT_SUBJECTS[5]).map(d => ({
        id: uid(),
        names: { tg: d.tg, ru: d.ru, en: d.en },
        name: d.ru, // fallback
        hours: d.hours,
        type: d.type,
        teacher: getTeacher(d.ru),
      }))
    }))
  }));

  const teachers = Object.entries(subjTeacherMap).reduce((arr, [, name]) => {
    if (!arr.find(t => t.name === name)) arr.push({ name, days:[0,1,2,3,4,5], id:uid() });
    return arr;
  }, []);

  return { classes: classesWithSubjs, teachers };
}

// ===================== АЛГОРИТМ ГЕНЕРАЦИИ =====================
function generateSchedule(classes, teachers, shifts) {
  const DAYS_COUNT = 6;
  const MAX_PER_DAY = 7;
  const warnings = [];
  const slotCount = (shifts && shifts[0]) ? shifts[0].slots.length : 7;

  const schedule = {};
  const teacherSchedule = {};

  for (const cls of classes) {
    for (const par of (cls.parallels || [])) {
      const key = `${cls.grade}${par.letter}`;
      schedule[key] = Array.from({length:DAYS_COUNT}, () => Array(slotCount).fill(null));
    }
  }
  // Инициализируем всех учителей
  for (const t of teachers) {
    teacherSchedule[t.name] = Array.from({length:DAYS_COUNT}, () => Array(slotCount).fill(null));
  }

  // Задачи размещения
  const tasks = [];
  for (const cls of classes) {
    for (const par of (cls.parallels || [])) {
      const key = `${cls.grade}${par.letter}`;
      for (const subj of (par.subjects || [])) {
        const displayName = subj.names ? (subj.names.ru || subj.names.tg) : (subj.name || '');
        if (!displayName || (subj.hours||0) <= 0) continue;
        const tname = subj.teacher || null;
        const tobj = tname ? teachers.find(t => t.name === tname) : null;
        const dayAvail = tobj ? tobj.days : [0,1,2,3,4,5];
        for (let h = 0; h < (subj.hours||0); h++) {
          tasks.push({ classKey:key, subj, displayName, teacherName:tname, type:subj.type||'Другое', dayAvail });
        }
      }
    }
  }

  // Сортируем: жёсткие ограничения первыми
  tasks.sort((a,b) => a.dayAvail.length - b.dayAvail.length);

  for (const task of tasks) {
    let placed = false;
    const dayCount = {};
    for (let d = 0; d < DAYS_COUNT; d++) {
      dayCount[d] = (schedule[task.classKey][d] || []).filter(Boolean).length;
    }
    const sortedDays = [...task.dayAvail].sort((a,b) => dayCount[a] - dayCount[b]);

    for (const day of sortedDays) {
      if (dayCount[day] >= MAX_PER_DAY) continue;
      for (let slot = 0; slot < slotCount; slot++) {
        if (schedule[task.classKey][day][slot]) continue;
        if (task.teacherName && teacherSchedule[task.teacherName]?.[day]?.[slot]) continue;

        // Не более 2 одинаковых предметов в день
        const sameCnt = schedule[task.classKey][day].filter(l => l && l.displayName === task.displayName).length;
        if (sameCnt >= 2) continue;

        // Не 3 подряд одного типа
        if (slot >= 2) {
          const p1 = schedule[task.classKey][day][slot-1];
          const p2 = schedule[task.classKey][day][slot-2];
          if (p1 && p2 && p1.type === task.type && p2.type === task.type &&
              (task.type === 'Гуманитарный' || task.type === 'Точный')) continue;
        }

        // Размещаем
        schedule[task.classKey][day][slot] = {
          displayName: task.displayName,
          names: task.subj.names || null,
          teacher: task.teacherName,
          type: task.type,
        };
        if (task.teacherName) {
          if (!teacherSchedule[task.teacherName]) {
            teacherSchedule[task.teacherName] = Array.from({length:DAYS_COUNT}, () => Array(slotCount).fill(null));
          }
          teacherSchedule[task.teacherName][day][slot] = { displayName: task.displayName, classKey: task.classKey };
        }
        placed = true;
        break;
      }
      if (placed) break;
    }
    if (!placed) warnings.push(`[${task.classKey}] "${task.displayName}"${task.teacherName ? ' ('+task.teacherName+')' : ''}`);
  }

  return { schedule, teacherSchedule, warnings };
}

// Перестройка расписания учителей из расписания классов (ИСПРАВЛЕНО: перебираем все уроки, не только known teachers)
function rebuildTeacherSchedule(schedule, slotCount) {
  const ts = {};
  for (const key in schedule) {
    schedule[key].forEach((dayArr, d) => {
      dayArr.forEach((l, sl) => {
        if (!l || !l.teacher) return;
        const tname = l.teacher;
        if (!ts[tname]) ts[tname] = Array.from({length:6}, () => Array(slotCount).fill(null));
        ts[tname][d][sl] = { displayName: l.displayName, names: l.names, classKey: key };
      });
    });
  }
  return ts;
}

// Обнаружение конфликтов
function detectConflicts(schedule) {
  const conflictSet = new Set();
  // Для каждого учителя считаем сколько уроков в слот
  const teacherSlotCount = {}; // "teacher|day|slot" -> count
  for (const key in schedule) {
    schedule[key].forEach((dayArr, d) => {
      dayArr.forEach((l, sl) => {
        if (!l || !l.teacher) return;
        const k = `${l.teacher}|${d}|${sl}`;
        teacherSlotCount[k] = (teacherSlotCount[k] || 0) + 1;
      });
    });
  }
  for (const [k, cnt] of Object.entries(teacherSlotCount)) {
    if (cnt > 1) conflictSet.add(k);
  }
  return conflictSet;
}

// ===================== STEPPER =====================
function Stepper({ step, t }) {
  const labels = [t.step1, t.step2, t.step3, t.step5, t.step4];
  return (
    <div className="stepper no-print">
      {labels.map((lab, i) => (
        <React.Fragment key={i}>
          <div className="step-item">
            <div className={`step-circle ${i < step ? 'done' : i === step ? 'active' : ''}`}>
              {i < step ? '✓' : i+1}
            </div>
            <span className={`step-label ${i < step ? 'done' : i === step ? 'active' : ''}`}>{lab}</span>
          </div>
          {i < labels.length-1 && <div className={`step-connector ${i < step ? 'done' : ''}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// ===================== ШАГ 1: КЛАССЫ =====================
function Step1({ classes, setClasses, t }) {
  const [rangeFrom, setRangeFrom] = useState(1);
  const [rangeTo, setRangeTo] = useState(11);
  const LETTERS = 'АБВГДЕЁЖЗИЙК'.split('');

  function nextLetter(cls) {
    const used = cls.parallels.map(p => p.letter);
    for (const l of LETTERS) if (!used.includes(l)) return l;
    return '';
  }

  function applyRange() {
    const f = parseInt(rangeFrom), to = parseInt(rangeTo);
    if (isNaN(f) || isNaN(to) || f > to) return;
    const ex = {}; classes.forEach(c => { ex[c.grade] = c.parallels; });
    setClasses(Array.from({length: to-f+1}, (_,i) => ({
      grade: f+i,
      parallels: ex[f+i] || [{ letter:'А', id:uid() }]
    })));
  }

  function addParallel(gi) {
    const nl = nextLetter(classes[gi]);
    if (!nl) return;
    setClasses(classes.map((c,i) => i===gi ? {...c, parallels:[...c.parallels,{letter:nl,id:uid()}]} : c));
  }
  function removeParallel(gi, pid) {
    const up = classes.map((c,i) => i===gi ? {...c, parallels:c.parallels.filter(p=>p.id!==pid)} : c);
    setClasses(up.filter(c => c.parallels.length > 0));
  }
  function editLetter(gi, pid, val) {
    setClasses(classes.map((c,i) => i===gi ? {...c, parallels:c.parallels.map(p=>p.id===pid?{...p,letter:val.toUpperCase().slice(0,2)}:p)} : c));
  }

  return (
    <div>
      <div className="card">
        <div className="card-title">📚 {t.classes}</div>
        <div className="flex gap-3 items-center flex-wrap">
          <div><label>{t.gradeFrom}</label><input className="input" style={{width:70}} type="number" min={1} max={12} value={rangeFrom} onChange={e=>setRangeFrom(e.target.value)}/></div>
          <div><label>{t.gradeTo}</label><input className="input" style={{width:70}} type="number" min={1} max={12} value={rangeTo} onChange={e=>setRangeTo(e.target.value)}/></div>
          <div style={{paddingTop:20}}><button className="btn btn-primary" onClick={applyRange}>{t.applyRange}</button></div>
        </div>
        {classes.length > 0 && <p className="text-muted mt-2">{t.totalClasses}: {classes.reduce((a,c)=>a+c.parallels.length,0)} {t.classCount}</p>}
      </div>

      {classes.length > 0 && (
        <div className="card">
          <div className="card-title">🏫 {t.parallels}</div>
          <div className="class-grid">
            {classes.map((cls, gi) => (
              <div className="class-card" key={cls.grade}>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-bold">{cls.grade} {t.classCount}</span>
                  <button className="btn btn-xs btn-danger" onClick={()=>setClasses(classes.filter((_,i)=>i!==gi))}>✕</button>
                </div>
                <div style={{display:'flex',flexWrap:'wrap',gap:4,marginBottom:8}}>
                  {cls.parallels.map(par => (
                    <div key={par.id} className="parallel-badge">
                      <input value={par.letter} style={{width:28,background:'transparent',border:'none',fontWeight:700,fontSize:'.78rem',color:'inherit',outline:'none',padding:0}}
                        onChange={e=>editLetter(gi,par.id,e.target.value)}/>
                      <button onClick={()=>removeParallel(gi,par.id)}>✕</button>
                    </div>
                  ))}
                </div>
                <button className="btn btn-sm btn-ghost w-full" onClick={()=>addParallel(gi)}>
                  {t.addParallel} ({nextLetter(cls)||'—'})
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ===================== ШАГ 2: ПРЕДМЕТЫ =====================
function Step2({ classes, setClasses, t, lang }) {
  const allKeys = useMemo(() => {
    const k = [];
    for (const c of classes) for (const p of c.parallels) k.push(`${c.grade}${p.letter}`);
    return k;
  }, [classes]);

  const [sel, setSel] = useState(null);
  useEffect(() => { if (!sel && allKeys.length > 0) setSel(allKeys[0]); }, [allKeys]);

  function findRef(key) {
    for (const c of classes) for (const p of c.parallels) if (`${c.grade}${p.letter}` === key) return {cls:c,par:p};
    return null;
  }
  function updSubjs(key, subjs) {
    setClasses(prev => prev.map(c => ({...c, parallels:c.parallels.map(p => `${c.grade}${p.letter}`===key ? {...p,subjects:subjs} : p)})));
  }
  function addSubj(key) {
    const ref = findRef(key); if (!ref) return;
    updSubjs(key, [...(ref.par.subjects||[]), {id:uid(), names:{tg:'',ru:'',en:''}, name:'', hours:1, type:'Другое', teacher:''}]);
  }
  function remSubj(key, sid) {
    const ref = findRef(key); if (!ref) return;
    updSubjs(key, (ref.par.subjects||[]).filter(s=>s.id!==sid));
  }
  function updSubj(key, sid, field, val) {
    const ref = findRef(key); if (!ref) return;
    updSubjs(key, (ref.par.subjects||[]).map(s => {
      if (s.id !== sid) return s;
      if (field === 'name') {
        // Обновляем имя в текущем языке + fallback name
        const names = {...(s.names||{tg:'',ru:'',en:''})};
        names[lang] = val;
        return {...s, names, name: names.ru || names.tg || names.en || val};
      }
      return {...s, [field]:val};
    }));
  }
  function addDefaults(key) {
    const ref = findRef(key); if (!ref) return;
    const grade = ref.cls.grade;
    const defs = (DEFAULT_SUBJECTS[grade] || DEFAULT_SUBJECTS[5]).map(d => ({
      id:uid(),
      names: {tg:d.tg, ru:d.ru, en:d.en},
      name: d.ru,
      hours: d.hours, type: d.type, teacher:''
    }));
    const existing = ref.par.subjects || [];
    const existRu = existing.map(s => (s.names?.ru || s.name||'').toLowerCase());
    const toAdd = defs.filter(d => !existRu.includes(d.names.ru.toLowerCase()));
    updSubjs(key, [...existing, ...toAdd]);
  }
  function copyFrom(fromKey) {
    const ref = findRef(fromKey); if (!ref) return;
    updSubjs(sel, (ref.par.subjects||[]).map(s => ({...s, id:uid()})));
  }

  const ref = sel ? findRef(sel) : null;
  const subjs = ref?.par?.subjects || [];
  const totalH = subjs.reduce((s,x) => s+(parseInt(x.hours)||0), 0);

  return (
    <div>
      <div className="card">
        <div className="card-title">📋 {t.subjects}</div>
        <div className="flex gap-2 flex-wrap mb-3">
          {allKeys.map(k => (
            <button key={k} className={`btn btn-sm ${sel===k?'btn-primary':'btn-ghost'}`} onClick={()=>setSel(k)}>{k}</button>
          ))}
        </div>
        {sel && (
          <>
            <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <span className="font-bold" style={{fontSize:'1.05rem'}}>{sel}</span>
                <span className="chip chip-blue">{totalH} {t.hours}</span>
              </div>
              <div className="flex gap-2 flex-wrap">
                <select className="select" style={{width:'auto',fontSize:'.8rem'}} onChange={e=>e.target.value&&copyFrom(e.target.value)} value="">
                  <option value="">{t.copyFrom}</option>
                  {allKeys.filter(k=>k!==sel).map(k=><option key={k} value={k}>{k}</option>)}
                </select>
                <button className="btn btn-warning btn-sm" onClick={()=>addDefaults(sel)}>{t.addDefault}</button>
                <button className="btn btn-primary btn-sm" onClick={()=>addSubj(sel)}>{t.addSubject}</button>
              </div>
            </div>
            {subjs.length === 0 ? (
              <div className="alert alert-info"><span>ℹ️</span><span>{t.addDefault} → {t.addSubject}</span></div>
            ) : (
              <div className="schedule-wrap">
                <table className="subj-table">
                  <thead><tr>
                    <th>{t.subjectName}</th>
                    <th style={{width:70}}>{t.hours}</th>
                    <th style={{width:150}}>{t.type}</th>
                    <th style={{width:200}}>{t.teacher}</th>
                    <th style={{width:36}}></th>
                  </tr></thead>
                  <tbody>
                    {subjs.map(s => (
                      <tr key={s.id}>
                        <td>
                          <input className="input input-sm"
                            value={s.names ? (s.names[lang]||'') : (s.name||'')}
                            placeholder={lang==='tg'?'Математика':lang==='en'?'Mathematics':'Математика'}
                            onChange={e=>updSubj(sel,s.id,'name',e.target.value)}/>
                        </td>
                        <td><input className="input input-sm" type="number" min={1} max={15} value={s.hours} onChange={e=>updSubj(sel,s.id,'hours',parseInt(e.target.value)||1)}/></td>
                        <td>
                          <select className="select input-sm" value={s.type} onChange={e=>updSubj(sel,s.id,'type',e.target.value)}>
                            {TYPE_KEYS.map((key,i) => <option key={key} value={key}>{(t.typeLabels||TYPE_KEYS)[i]}</option>)}
                          </select>
                        </td>
                        <td><input className="input input-sm" value={s.teacher||''} placeholder={t.unassigned} onChange={e=>updSubj(sel,s.id,'teacher',e.target.value)}/></td>
                        <td><button className="btn btn-icon btn-danger btn-sm" onClick={()=>remSubj(sel,s.id)}>✕</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ===================== ШАГ 3: УЧИТЕЛЯ =====================
function Step3({ classes, teachers, setTeachers, t }) {
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDays, setNewDays] = useState([0,1,2,3,4,5]);
  const nameRef = useRef(null);
  const DAYS = t.days || ['Пн','Вт','Ср','Чт','Пт','Сб'];

  function sync() {
    const map = {};
    for (const c of classes) for (const p of c.parallels) for (const s of (p.subjects||[])) {
      if (s.teacher && s.teacher.trim()) {
        if (!map[s.teacher]) map[s.teacher] = {name:s.teacher, days:[0,1,2,3,4,5], id:uid()};
      }
    }
    const exMap = {}; teachers.forEach(tt => { exMap[tt.name] = tt; });
    setTeachers(Object.values(map).map(tt => exMap[tt.name] || tt));
  }

  function openForm() {
    setShowForm(true); setNewName(''); setNewDays([0,1,2,3,4,5]);
    setTimeout(() => nameRef.current && nameRef.current.focus(), 80);
  }
  function submitForm() {
    const name = newName.trim(); if (!name) return;
    if (teachers.find(tt => tt.name === name)) return;
    setTeachers([...teachers, {name, days:[...newDays].sort(), id:uid()}]);
    setShowForm(false); setNewName('');
  }
  function toggleDay(name, d) {
    setTeachers(prev => prev.map(tt => {
      if (tt.name !== name) return tt;
      const days = tt.days.includes(d) ? tt.days.filter(x=>x!==d) : [...tt.days,d].sort();
      return {...tt, days};
    }));
  }
  function getLoad(name) {
    let tot = 0;
    for (const c of classes) for (const p of c.parallels) for (const s of (p.subjects||[]))
      if (s.teacher === name) tot += (parseInt(s.hours)||0);
    return tot;
  }
  function getAssignments(name) {
    const res = [];
    for (const c of classes) for (const p of c.parallels) for (const s of (p.subjects||[]))
      if (s.teacher === name) res.push(`${c.grade}${p.letter}: ${s.names ? (s.names.ru||s.names.tg) : s.name}`);
    return res;
  }

  return (
    <div>
      <div className="card">
        <div className="card-title">👩‍🏫 {t.teachers}</div>
        <div className="flex gap-2 flex-wrap mb-3" style={{justifyContent:'center'}}>
          <button className="btn btn-primary" style={{fontSize:'1rem',padding:'11px 28px'}} onClick={sync}>{t.syncTeachers}</button>
          {!showForm && <button className="btn btn-ghost" style={{padding:'11px 20px'}} onClick={openForm}>{t.addTeacherManual}</button>}
        </div>

        {showForm && (
          <div style={{border:'1.5px solid var(--accent)',borderRadius:10,padding:18,background:'var(--accent-light)',marginBottom:16}}>
            <div className="card-title" style={{marginBottom:12,color:'var(--accent-dark)'}}>👤 {t.addTeacherManual}</div>
            <p className="text-muted mb-3">{t.addManualHint}</p>
            <div className="mb-3">
              <label>{t.teacherName}</label>
              <input ref={nameRef} className="input" placeholder={t.teacherNamePlaceholder}
                value={newName} onChange={e=>setNewName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&submitForm()}/>
            </div>
            <div className="mb-3">
              <label>{t.workDays}</label>
              <div className="flex gap-2 flex-wrap">
                {DAYS.map((day,di) => (
                  <React.Fragment key={di}>
                    <input type="checkbox" id={`new-d-${di}`} className="day-check" checked={newDays.includes(di)} onChange={()=>setNewDays(p=>p.includes(di)?p.filter(x=>x!==di):[...p,di])}/>
                    <label htmlFor={`new-d-${di}`} className="day-check-label">{day}</label>
                  </React.Fragment>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" onClick={submitForm} disabled={!newName.trim()}>✓ {t.addTeacherBtn}</button>
              <button className="btn btn-ghost" onClick={()=>setShowForm(false)}>{t.cancelBtn}</button>
            </div>
          </div>
        )}

        {teachers.length === 0 && !showForm ? (
          <div className="alert alert-info" style={{justifyContent:'center',textAlign:'center'}}>
            <span>ℹ️</span><span>{t.syncHint}</span>
          </div>
        ) : teachers.map(tt => {
          const load = getLoad(tt.name);
          const assignments = getAssignments(tt.name);
          return (
            <div className="teacher-card" key={tt.name}>
              <div className="flex justify-between items-center mb-2">
                <div className="flex items-center gap-2">
                  <div className="avatar">{getInitials(tt.name)}</div>
                  <div>
                    <div className="font-bold">{tt.name}</div>
                    <div style={{fontSize:'.73rem',color:'var(--text-muted)'}}>{t.load}: <strong>{load}</strong> {t.lessonsWeek}</div>
                  </div>
                </div>
                <button className="btn btn-xs btn-danger" onClick={()=>setTeachers(teachers.filter(x=>x.name!==tt.name))}>✕</button>
              </div>
              <div className="mb-2">
                <label>{t.workDays}</label>
                <div className="flex gap-2 flex-wrap">
                  {DAYS.map((day,di) => (
                    <React.Fragment key={di}>
                      <input type="checkbox" id={`d-${tt.id||tt.name}-${di}`} className="day-check" checked={tt.days.includes(di)} onChange={()=>toggleDay(tt.name,di)}/>
                      <label htmlFor={`d-${tt.id||tt.name}-${di}`} className="day-check-label">{day}</label>
                    </React.Fragment>
                  ))}
                </div>
              </div>
              {assignments.length > 0 && (
                <div>
                  <div style={{fontSize:'.73rem',color:'var(--text-muted)',marginBottom:4,fontWeight:600}}>{t.assignments}:</div>
                  <div className="flex flex-wrap" style={{gap:4}}>
                    {assignments.map((a,i) => <span key={i} className="chip chip-gray">{a}</span>)}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== ШАГ 4: НАСТРОЙКИ ВРЕМЕНИ =====================
function Step4Settings({ shifts, setShifts, t }) {
  function addShift() {
    setShifts([...shifts, {id:uid(), name:`${shifts.length+1}`, startTime:'13:30',
      slots: defaultShifts()[0].slots.map(s=>({...s,id:uid()}))}]);
  }
  function updShift(sid, f, v) { setShifts(shifts.map(s=>s.id===sid?{...s,[f]:v}:s)); }
  function addSlot(sid) { setShifts(shifts.map(s=>s.id===sid?{...s,slots:[...s.slots,{id:uid(),lesson:45,breakAfter:10}]}:s)); }
  function remSlot(sid, slid) { setShifts(shifts.map(s=>s.id===sid?{...s,slots:s.slots.filter(sl=>sl.id!==slid)}:s)); }
  function updSlot(sid, slid, f, v) { setShifts(shifts.map(s=>s.id===sid?{...s,slots:s.slots.map(sl=>sl.id===slid?{...sl,[f]:parseInt(v)||0}:sl)}:s)); }

  return (
    <div>
      <div className="card">
        <div className="card-title">⏱️ {t.timings} / {t.shifts}</div>
        <div className="flex gap-2 mb-3">
          <button className="btn btn-primary btn-sm" onClick={addShift}>+ {t.shift}</button>
        </div>
        {shifts.map(sh => {
          const times = computeTimes(sh);
          return (
            <div className="shift-card" key={sh.id}>
              <div className="flex justify-between items-center mb-3 flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <span className="font-bold">{t.shift}</span>
                  <input className="input input-sm" value={sh.name} style={{width:60}} onChange={e=>updShift(sh.id,'name',e.target.value)}/>
                </div>
                <div className="flex gap-2 items-center flex-wrap">
                  <div><label>{t.startTime}</label><input className="input input-sm" type="time" value={sh.startTime} onChange={e=>updShift(sh.id,'startTime',e.target.value)}/></div>
                  {shifts.length > 1 && <button className="btn btn-xs btn-danger mt-2" onClick={()=>setShifts(shifts.filter(s=>s.id!==sh.id))}>✕</button>}
                </div>
              </div>
              {sh.slots.map((sl, sli) => (
                <div className="time-slot-row" key={sl.id}>
                  <span style={{width:22,color:'var(--text-muted)',fontSize:'.78rem',fontWeight:700}}>{sli+1}</span>
                  <span style={{width:110,fontSize:'.78rem',color:'var(--accent-dark)',fontWeight:600}}>{times[sli]?.start}–{times[sli]?.end}</span>
                  <label style={{marginBottom:0,width:'auto'}}>{t.lessonDuration}:</label>
                  <input className="input input-sm" type="number" min={30} max={90} style={{width:60}} value={sl.lesson} onChange={e=>updSlot(sh.id,sl.id,'lesson',e.target.value)}/>
                  <label style={{marginBottom:0,width:'auto'}}>{t.breakDuration}:</label>
                  <input className="input input-sm" type="number" min={0} max={60} style={{width:60}} value={sl.breakAfter} onChange={e=>updSlot(sh.id,sl.id,'breakAfter',e.target.value)}/>
                  {sh.slots.length > 3 && <button className="btn btn-xs btn-ghost" onClick={()=>remSlot(sh.id,sl.id)}>✕</button>}
                </div>
              ))}
              <button className="btn btn-ghost btn-sm mt-2" onClick={()=>addSlot(sh.id)}>+ {t.addSlot}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ===================== ШАГ 5: РАСПИСАНИЕ =====================
function Step5Schedule({ classes, teachers, shifts, t, lang, genCount, setGenCount }) {
  const [result, setResult] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [schedule, setSchedule] = useState(null);
  const [teacherSch, setTeacherSch] = useState(null);
  const [viewTab, setViewTab] = useState('students');
  const [filterClass, setFilterClass] = useState('all');
  const [filterTeacher, setFilterTeacher] = useState('all');
  const [swapMode, setSwapMode] = useState(false);
  const [swapSrc, setSwapSrc] = useState(null);
  const [assignMode, setAssignMode] = useState(false);

  const DAYS = t.days || ['Пн','Вт','Ср','Чт','Пт','Сб'];
  const shift = shifts && shifts[0];
  const slotCount = shift?.slots?.length || 7;
  const times = shift ? computeTimes(shift) : Array.from({length:7}, (_,i) => ({start:`0${8+i}:00`.slice(-5), end:''}));

  const allClassKeys = useMemo(() => {
    const k = [];
    for (const c of classes) for (const p of c.parallels) k.push(`${c.grade}${p.letter}`);
    return k;
  }, [classes]);

  const hasUnassigned = useMemo(() => {
    for (const c of classes) for (const p of c.parallels) for (const s of (p.subjects||[]))
      if (!s.teacher || !s.teacher.trim()) return true;
    return false;
  }, [classes]);

  // ВАЖНО: все useMemo ДО условных return (Rules of Hooks)
  const allTeacherNames = useMemo(() => {
    const names = new Set();
    if (teacherSch) Object.keys(teacherSch).forEach(n => names.add(n));
    teachers.forEach(tt => names.add(tt.name));
    return [...names];
  }, [teacherSch, teachers]);

  function doGenerate() {
    setGenerating(true); setResult(null); setSchedule(null); setTeacherSch(null);
    setSwapMode(false); setSwapSrc(null); setAssignMode(false);
    setTimeout(() => {
      try {
        const r = generateSchedule(classes, teachers, shifts);
        setResult(r);
        const sch = JSON.parse(JSON.stringify(r.schedule));
        setSchedule(sch);
        // ИСПРАВЛЕНИЕ #4: используем новую rebuildTeacherSchedule
        setTeacherSch(rebuildTeacherSchedule(sch, slotCount));
        setGenCount(n => n + 1);
      } catch(e) {
        setResult({schedule:{}, teacherSchedule:{}, warnings:[e.message]});
      }
      setGenerating(false);
    }, 400);
  }

  // При любом изменении schedule перестраиваем teacherSch
  function applyScheduleChange(newSch) {
    setSchedule(newSch);
    setTeacherSch(rebuildTeacherSchedule(newSch, slotCount));
  }

  // Конфликты из текущего расписания
  const conflicts = useMemo(() => schedule ? detectConflicts(schedule) : new Set(), [schedule]);

  function handleCellClick(classKey, day, slot) {
    if (!swapMode) return;
    if (!swapSrc) {
      if (schedule[classKey]?.[day]?.[slot]) setSwapSrc({classKey, day, slot});
    } else {
      const ns = JSON.parse(JSON.stringify(schedule));
      const a = ns[swapSrc.classKey]?.[swapSrc.day]?.[swapSrc.slot];
      const b = ns[classKey]?.[day]?.[slot];
      if (ns[swapSrc.classKey]) ns[swapSrc.classKey][swapSrc.day][swapSrc.slot] = b || null;
      if (ns[classKey]) ns[classKey][day][slot] = a || null;
      applyScheduleChange(ns);
      setSwapSrc(null);
    }
  }

  function moveSlot(classKey, day, fromSlot, toSlot) {
    const ns = JSON.parse(JSON.stringify(schedule));
    const tmp = ns[classKey][day][fromSlot];
    ns[classKey][day][fromSlot] = ns[classKey][day][toSlot];
    ns[classKey][day][toSlot] = tmp;
    applyScheduleChange(ns);
  }

  function assignTeacher(classKey, day, slot) {
    const tname = prompt(`${t.assignTeacher}: ${classKey} ${DAYS[day]} #${slot+1}`, '');
    if (tname === null) return;
    const ns = JSON.parse(JSON.stringify(schedule));
    if (ns[classKey]?.[day]?.[slot]) ns[classKey][day][slot].teacher = tname.trim();
    applyScheduleChange(ns);
  }

  function exportXlsx() {
    if (!schedule) return;
    const wb = XLSX.utils.book_new();
    const wsData = [[t.classCount, t.time, ...DAYS]];
    for (const key of allClassKeys) {
      const dayArr = schedule[key] || [];
      for (let sl = 0; sl < slotCount; sl++) {
        const row = [key, `${sl+1} (${times[sl]?.start||''})`];
        for (let d = 0; d < 6; d++) {
          const l = dayArr[d]?.[sl];
          const name = l ? (l.names ? (l.names[lang]||l.names.ru||l.names.tg||l.displayName) : l.displayName) : '';
          row.push(l ? `${name}${l.teacher?' ('+l.teacher+')':''}` : '');
        }
        wsData.push(row);
      }
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(wsData), t.forStudents.replace(/[^\w]/g,'').slice(0,15)||'Students');

    if (teacherSch) {
      const wsT = [[t.teachers, t.time, ...DAYS]];
      for (const tt of teachers) {
        const td = teacherSch[tt.name] || [];
        for (let sl = 0; sl < slotCount; sl++) {
          const row = [tt.name, `${sl+1}`];
          for (let d = 0; d < 6; d++) {
            const l = td[d]?.[sl];
            const name = l ? (l.names ? (l.names[lang]||l.names.ru||l.names.tg||l.displayName) : l.displayName) : '';
            row.push(l ? `${l.classKey}: ${name}` : '');
          }
          wsT.push(row);
        }
      }
      XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(wsT), t.forTeachers.replace(/[^\w]/g,'').slice(0,15)||'Teachers');
    }
    XLSX.writeFile(wb, 'schedule.xlsx');
  }

  if (!result && !generating) {
    return (
      <div className="card" style={{textAlign:'center', padding:'48px 24px'}}>
        <div style={{fontSize:'3rem',marginBottom:14}}>🗓️</div>
        <h2 style={{fontSize:'1.2rem',fontWeight:700,marginBottom:8}}>{t.generate}</h2>
        <p className="text-muted mb-3">{t.classes}: <strong>{allClassKeys.length}</strong> · {t.teachers}: <strong>{teachers.length}</strong></p>
        {hasUnassigned && (
          <div className="alert alert-warn" style={{marginBottom:16,textAlign:'left'}}>
            <span>⚠️</span><span>{t.assignMode}</span>
          </div>
        )}
        <button className="btn btn-success" style={{fontSize:'1rem',padding:'13px 34px'}} onClick={doGenerate}>{t.generate}</button>
      </div>
    );
  }

  if (generating) {
    return (
      <div className="card" style={{textAlign:'center',padding:'48px 24px'}}>
        <div className="spinner" style={{margin:'0 auto 16px'}}></div>
        <p className="font-bold">{t.generate}...</p>
      </div>
    );
  }

  const filteredClasses = filterClass === 'all' ? allClassKeys : [filterClass];
  const filteredTeachers = filterTeacher === 'all' ? allTeacherNames : [filterTeacher];

  return (
    <div>
      {/* Счётчик генераций */}
      <div className="stats-bar no-print">
        <div className="stat-pill">
          <span className="val">{genCount}</span>
          <span className="lbl">{t.generationCountLabel}</span>
        </div>
        <div className="stat-pill">
          <span className="val">{allClassKeys.length}</span>
          <span className="lbl">{t.classes}</span>
        </div>
        <div className="stat-pill">
          <span className="val">{result.warnings.length}</span>
          <span className="lbl">{t.warnings}</span>
        </div>
        <div className="stat-pill">
          <span className="val" style={{color: conflicts.size > 0 ? 'var(--danger)' : 'var(--success)'}}>
            {conflicts.size}
          </span>
          <span className="lbl">{t.conflict.replace('!','')}</span>
        </div>
      </div>

      {result.warnings.length > 0 && (
        <div className="card">
          <div className="card-title">⚠️ {t.warnings} ({result.warnings.length})</div>
          {result.warnings.map((w,i) => (
            <div key={i} className="alert alert-warn"><span>⚠️</span><span>{t.noSolution}: {w}</span></div>
          ))}
        </div>
      )}
      {conflicts.size > 0 && (
        <div className="alert alert-danger mb-2"><span>🚨</span><span>{t.conflict} ({conflicts.size})</span></div>
      )}
      {result.warnings.length === 0 && conflicts.size === 0 && (
        <div className="alert alert-success mb-2"><span>✅</span><span>{t.noWarnings}</span></div>
      )}

      <div className="card">
        <div className="flex justify-between items-center flex-wrap gap-2 mb-3 no-print">
          <div className="tab-bar" style={{borderBottom:'none',marginBottom:0}}>
            <button className={`tab-btn ${viewTab==='students'?'active':''}`} onClick={()=>setViewTab('students')}>{t.forStudents}</button>
            <button className={`tab-btn ${viewTab==='teachers'?'active':''}`} onClick={()=>setViewTab('teachers')}>{t.forTeachers}</button>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button className={`btn btn-sm ${swapMode?'btn-warning':'btn-ghost'}`} onClick={()=>{setSwapMode(!swapMode);setSwapSrc(null);}}>
              {swapMode ? t.moveModeOn : t.moveMode}
            </button>
            <button className={`btn btn-sm ${assignMode?'btn-warning':'btn-ghost'}`} onClick={()=>setAssignMode(!assignMode)}>
              {assignMode ? t.assignModeOn : t.assignModeBtn}
            </button>
            <button className="btn btn-ghost btn-sm" onClick={doGenerate}>{t.regenerate}</button>
            <button className="btn btn-ghost btn-sm" onClick={exportXlsx}>{t.exportXlsx}</button>
            <button className="btn btn-ghost btn-sm" onClick={()=>window.print()}>{t.exportPdf}</button>
          </div>
        </div>

        {swapMode && (
          <div className="alert alert-info no-print mb-2">
            <span>ℹ️</span>
            <span>{swapSrc ? `${t.swapSrcChosen} (${swapSrc.classKey} ${DAYS[swapSrc.day]} #${swapSrc.slot+1})` : t.swapHint}</span>
          </div>
        )}

        {/* ===== РАСПИСАНИЕ ДЛЯ УЧЕНИКОВ ===== */}
        {viewTab === 'students' && schedule && (
          <>
            <div className="flex gap-2 flex-wrap mb-3 no-print">
              <button className={`btn btn-sm ${filterClass==='all'?'btn-primary':'btn-ghost'}`} onClick={()=>setFilterClass('all')}>{t.all}</button>
              {allClassKeys.map(k => (
                <button key={k} className={`btn btn-sm ${filterClass===k?'btn-primary':'btn-ghost'}`} onClick={()=>setFilterClass(k)}>{k}</button>
              ))}
            </div>
            {filteredClasses.map(key => {
              const dayArr = schedule[key] || Array(6).fill([]);
              return (
                <div key={key} style={{marginBottom:24}}>
                  <h3 style={{fontWeight:700,fontSize:'1rem',marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
                    <span style={{background:'var(--accent)',color:'#fff',borderRadius:7,padding:'3px 12px'}}>{key}</span>
                    <span className="text-muted text-sm">
                      {dayArr.reduce((s,d)=>s+(Array.isArray(d)?d.filter(Boolean).length:0),0)} {t.lessonsWeek}
                    </span>
                  </h3>
                  <div className={`schedule-wrap ${swapMode?'swap-active':''}`}>
                    <table className="sched-table">
                      <thead><tr>
                        <th className="rh">№</th>
                        {DAYS.map(d=><th key={d}>{d}</th>)}
                      </tr></thead>
                      <tbody>
                        {Array.from({length:slotCount}, (_,sl) => {
                          const hasAny = dayArr.some(d => Array.isArray(d) && d[sl]);
                          if (!hasAny) return null;
                          return (
                            <tr key={sl}>
                              <td className="rh" style={{textAlign:'center',fontSize:'.78rem'}}>
                                <div style={{fontWeight:700}}>{sl+1}</div>
                                <div style={{color:'var(--text-light)',fontSize:'.68rem'}}>{times[sl]?.start}</div>
                              </td>
                              {dayArr.map((d, di) => {
                                const l = Array.isArray(d) ? d[sl] : null;
                                const isConflict = l?.teacher && conflicts.has(`${l.teacher}|${di}|${sl}`);
                                const isSrc = swapSrc && swapSrc.classKey===key && swapSrc.day===di && swapSrc.slot===sl;
                                // Имя предмета на текущем языке
                                const dispName = l ? (l.names ? (l.names[lang]||l.names.ru||l.names.tg||l.displayName) : l.displayName) : '';
                                return (
                                  <td key={di} className={isSrc?'swap-source':''} onClick={()=>handleCellClick(key,di,sl)} style={{cursor:swapMode?'pointer':'default'}}>
                                    {l && (
                                      <div className={`lesson-pill ${isConflict?'conflict-pill':''}`} style={{background:subjColor(l.names?.ru||l.displayName||''), color:TYPE_TEXT[l.type]||'#1e293b'}}>
                                        <span className="subj">{dispName}</span>
                                        <span className="meta">
                                          {l.teacher && l.teacher !== '—'
                                            ? l.teacher.split(' ')[0]
                                            : assignMode
                                              ? <span className="assign-badge" onClick={e=>{e.stopPropagation();assignTeacher(key,di,sl);}}>+ {t.assignTeacher}</span>
                                              : <span style={{color:'var(--danger)',fontSize:'.65rem'}}>⚠ {t.unassigned}</span>
                                          }
                                        </span>
                                        {!swapMode && !assignMode && (
                                          <div className="cell-controls">
                                            {sl > 0 && <button className="ctrl-btn" onClick={e=>{e.stopPropagation();moveSlot(key,di,sl,sl-1);}}>↑</button>}
                                            {sl < slotCount-1 && <button className="ctrl-btn" onClick={e=>{e.stopPropagation();moveSlot(key,di,sl,sl+1);}}>↓</button>}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </>
        )}

        {/* ===== РАСПИСАНИЕ ДЛЯ УЧИТЕЛЕЙ ===== */}
        {viewTab === 'teachers' && teacherSch && (
          <>
            <div className="flex gap-2 flex-wrap mb-3 no-print">
              <button className={`btn btn-sm ${filterTeacher==='all'?'btn-primary':'btn-ghost'}`} onClick={()=>setFilterTeacher('all')}>{t.all}</button>
              {allTeacherNames.map(name => (
                <button key={name} className={`btn btn-sm ${filterTeacher===name?'btn-primary':'btn-ghost'}`} onClick={()=>setFilterTeacher(name)}>
                  {name.split(' ')[0]}
                </button>
              ))}
            </div>
            {filteredTeachers.map(tname => {
              const td = teacherSch[tname] || Array(6).fill(Array(slotCount).fill(null));
              const total = td.reduce((s,d)=>s+(Array.isArray(d)?d.filter(Boolean).length:0),0);
              return (
                <div key={tname} style={{marginBottom:24}}>
                  <h3 style={{fontWeight:700,fontSize:'1rem',marginBottom:8,display:'flex',alignItems:'center',gap:8}}>
                    <span style={{background:'linear-gradient(135deg,var(--accent),#8b5cf6)',color:'#fff',borderRadius:7,padding:'3px 12px'}}>{tname}</span>
                    <span className="text-muted text-sm">{total} {t.lessonsWeek}</span>
                  </h3>
                  <div className="schedule-wrap">
                    <table className="sched-table">
                      <thead><tr>
                        <th className="rh">{t.time}</th>
                        {DAYS.map(d=><th key={d}>{d}</th>)}
                      </tr></thead>
                      <tbody>
                        {Array.from({length:slotCount}, (_,sl) => {
                          const hasAny = td.some(d=>Array.isArray(d)&&d[sl]);
                          if (!hasAny) return null;
                          return (
                            <tr key={sl}>
                              <td className="rh" style={{fontSize:'.78rem',fontWeight:700}}>
                                {times[sl]?.start}{times[sl]?.end?`–${times[sl].end}`:''}
                              </td>
                              {td.map((d, di) => {
                                const l = Array.isArray(d) ? d[sl] : null;
                                const isConflict = l && conflicts.has(`${tname}|${di}|${sl}`);
                                const dispName = l ? (l.names ? (l.names[lang]||l.names.ru||l.names.tg||l.displayName) : l.displayName) : '';
                                return (
                                  <td key={di}>
                                    {l && (
                                      <div className={`lesson-pill ${isConflict?'conflict-pill':''}`} style={{background:subjColor(l.names?.ru||l.displayName||'')}}>
                                        <span className="subj">{l.classKey}</span>
                                        <span className="meta">{dispName}</span>
                                        {isConflict && <span style={{color:'var(--danger)',fontSize:'.65rem',fontWeight:700}}>⚠ {t.conflict}</span>}
                                      </div>
                                    )}
                                  </td>
                                );
                              })}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}

// ===================== ГЛАВНОЕ ПРИЛОЖЕНИЕ =====================
function App() {
  const saved = loadState() || {};
  const [lang, setLang] = useState(saved.lang || 'tg');
  const [step, setStep] = useState(0);
  const [classes, setClasses] = useState(saved.classes || []);
  const [teachers, setTeachers] = useState(saved.teachers || []);
  const [shifts, setShifts] = useState(saved.shifts || defaultShifts());
  const [genCount, setGenCount] = useState(saved.genCount || 0);

  const t = T[lang] || T.ru;

  useEffect(() => { saveState({lang, classes, teachers, shifts, genCount, step}); }, [lang,classes,teachers,shifts,genCount,step]);

  // ===== ТЕСТ-РЕЖИМ: заполнить всё одной кнопкой =====
  function runTestFill() {
    const { classes: tc, teachers: tt } = buildTestData();
    setClasses(tc);
    setTeachers(tt);
    setStep(4); // Сразу на шаг расписания
  }

  function canNext() {
    if (step === 0) return classes.length > 0 && classes.some(c => c.parallels.length > 0);
    if (step === 1) return classes.some(c => c.parallels.some(p => (p.subjects||[]).some(s => s.names?.ru || s.name)));
    return true;
  }

  function clear() {
    if (!confirm(`${t.confirm} — ${t.reset}?`)) return;
    setClasses([]); setTeachers([]); setShifts(defaultShifts()); setStep(0); setGenCount(0);
    localStorage.removeItem('sched_v4');
  }

  const STEPS = [Step1, Step2, Step3, Step4Settings, Step5Schedule];
  const StepComp = STEPS[step];

  return (
    <div>
      <header className="app-header no-print">
        <span style={{fontSize:'2rem'}}>🏫</span>
        <div>
          <h1>{t.appTitle}</h1>
          <div className="sub">{t.appSub}</div>
        </div>
        <div className="lang-btns">
          {['tg','ru','en'].map(l => (
            <button key={l} className={`lang-btn ${lang===l?'active':''}`} onClick={()=>setLang(l)}>
              {l==='tg'?'ТҶ':l==='ru'?'РУ':'EN'}
            </button>
          ))}
        </div>
        <div className="flex gap-2" style={{marginLeft:8}}>
          {/* Кнопка тест-режима */}
          <button className="btn btn-xs btn-purple no-print" onClick={runTestFill} title={t.testModeDesc}>
            🧪
          </button>
          <button className="btn btn-xs no-print" style={{background:'rgba(255,255,255,.15)',color:'#fff',border:'1px solid rgba(255,255,255,.3)'}} onClick={clear}>
            🗑️
          </button>
        </div>
      </header>

      <div className="app-body">
        {/* Тест-баннер */}
        {classes.length > 0 && classes[0]?.parallels?.[0]?.subjects?.[0]?.teacher === 'Иванов И.И.' && step === 4 && (
          <div className="demo-banner no-print">
            <span className="icon">🧪</span>
            <div>
              <div style={{fontWeight:700}}>{t.testModeOn}</div>
              <div style={{fontSize:'.8rem',opacity:.85}}>{t.testModeDesc}</div>
            </div>
          </div>
        )}

        <Stepper step={step} t={t} />

        <StepComp
          classes={classes} setClasses={setClasses}
          teachers={teachers} setTeachers={setTeachers}
          shifts={shifts} setShifts={setShifts}
          t={t} lang={lang}
          genCount={genCount} setGenCount={setGenCount}
        />

        <div className="step-nav no-print">
          <button className="btn btn-ghost" disabled={step===0} onClick={()=>setStep(s=>s-1)}>{t.back}</button>
          <div className="flex items-center gap-3">
            <span className="text-muted text-sm">{t.stepOf} {step+1} {t.of} 5</span>
            {/* Счётчик в навигации */}
            {genCount > 0 && (
              <span className="chip chip-purple" title={t.generationCount}>⚡ ×{genCount}</span>
            )}
          </div>
          {step < 4
            ? <button className="btn btn-primary" disabled={!canNext()} onClick={()=>setStep(s=>s+1)}>{t.next}</button>
            : <span/>}
        </div>
      </div>
    </div>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
