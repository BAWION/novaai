/**
 * Расширенный шаблон курса Python с интеграцией Skills DNA
 * Каждый урок и задание связаны с конкретными навыками
 */

export const pythonBasicsWithSkillsDnaTemplate = {
  // Основная информация о курсе
  courseInfo: {
    title: "Python для начинающих - с развитием Skills DNA",
    slug: "python-basics-skills-dna",
    description: "Комплексный курс Python с динамическим развитием навыков. Каждый урок влияет на ваш профиль Skills DNA в реальном времени.",
    difficulty: 3,
    level: "basic" as const,
    estimatedDuration: 2400, // 40 часов
    category: "tech" as const,
    objectives: [
      "Освоить базовый синтаксис Python и развить навык программирования до 45%",
      "Понимать структуры данных и достичь 35% в работе с данными", 
      "Создавать функции и повысить аналитическое мышление до 40%",
      "Работать с файлами и развить навыки решения проблем до 50%",
      "Основы ООП и применение в практических проектах"
    ],
    prerequisites: [
      "Базовые навыки работы с компьютером",
      "Понимание логических операций", 
      "Желание изучать программирование"
    ]
  },

  // Связи курса с Skills DNA (какие навыки развивает курс)
  skillsMappings: [
    {
      dnaId: 5, // Python программирование
      targetProgressGain: 35, // Курс поднимет Python с 20% до 55%
      importance: 5 // Основной навык курса
    },
    {
      dnaId: 9, // Работа с данными  
      targetProgressGain: 20, // Дополнительное развитие
      importance: 3
    },
    {
      dnaId: 8, // Аналитическое мышление
      targetProgressGain: 15, // Развивается через решение задач
      importance: 2
    },
    {
      dnaId: 10, // Решение проблем
      targetProgressGain: 25, // Сильное развитие через практику
      importance: 4
    }
  ],

  // Модули курса с привязкой к навыкам
  modules: [
    {
      title: "Введение в Python",
      description: "Знакомство с языком, установка среды и первые программы",
      orderIndex: 1,
      estimatedDuration: 300,
      
      // Связи модуля с Skills DNA
      skillsMappings: [
        {
          dnaId: 5, // Python программирование
          progressContribution: 15, // Модуль дает 15% от общего прогресса Python
          bloomLevel: "awareness" as const
        }
      ],

      lessons: [
        {
          title: "Что такое Python и зачем его изучать",
          description: "История языка, области применения и преимущества Python",
          content: `# Добро пожаловать в мир Python!

Python — это высокоуровневый язык программирования, созданный Гвидо ван Россумом в 1991 году.

## Почему Python популярен?

1. **Простота синтаксиса** - код читается почти как обычный английский
2. **Универсальность** - веб-разработка, анализ данных, ИИ, автоматизация
3. **Большое сообщество** - миллионы разработчиков по всему миру
4. **Богатая экосистема** - сотни тысяч готовых библиотек

## Области применения Python

- **Веб-разработка**: Django, Flask
- **Анализ данных**: Pandas, NumPy, Matplotlib  
- **Машинное обучение**: TensorFlow, PyTorch, Scikit-learn
- **Автоматизация**: скрипты для повседневных задач
- **Научные вычисления**: моделирование, симуляции

Python используют Google, Netflix, Instagram, Spotify и тысячи других компаний.`,
          type: "text",
          orderIndex: 1,
          estimatedDuration: 60,

          // Влияние урока на Skills DNA
          skillsImpacts: [
            {
              dnaId: 5, // Python программирование
              impactWeight: 1.0,
              progressPoints: 3, // 3% прогресса за изучение теории
              bloomLevel: "awareness" as const,
              learningOutcome: "Понимание области применения Python и его возможностей"
            },
            {
              dnaId: 8, // Аналитическое мышление
              impactWeight: 0.5,
              progressPoints: 2, // Развитие понимания технологий
              bloomLevel: "awareness" as const, 
              learningOutcome: "Анализ преимуществ различных технологий"
            }
          ],

          assignments: [
            {
              title: "Викторина: Основы Python",
              description: "Проверьте свои знания о языке Python",
              type: "quiz",
              points: 10,
              content: {
                questions: [
                  {
                    question: "В каком году был создан Python?",
                    options: ["1989", "1991", "1995", "2000"],
                    correct: 1
                  },
                  {
                    question: "Кто создал язык Python?",
                    options: ["Линус Торвальдс", "Гвидо ван Россум", "Деннис Ритчи", "Джеймс Гослинг"],
                    correct: 1
                  },
                  {
                    question: "Какая из областей НЕ является типичной для Python?",
                    options: ["Машинное обучение", "Веб-разработка", "Разработка операционных систем", "Анализ данных"],
                    correct: 2
                  }
                ]
              },

              // Влияние задания на Skills DNA
              skillsImpacts: [
                {
                  dnaId: 5, // Python программирование  
                  maxProgressPoints: 2, // Максимум 2% за отличное выполнение
                  minRequiredScore: 70, // Минимум 70% для засчитывания
                  bloomLevel: "knowledge" as const,
                  skillApplication: "Проверка базовых знаний о Python"
                }
              ]
            }
          ]
        },

        {
          title: "Установка Python и настройка среды",
          description: "Установка Python, знакомство с IDLE и настройка редактора кода",
          content: `# Установка Python и настройка среды

В этом уроке мы изучим, как установить Python на ваш компьютер и настроить среду разработки.

## Шаг 1: Скачивание Python

1. Перейдите на официальный сайт: [python.org](https://python.org)
2. Нажмите "Download Python" (скачается последняя версия)
3. Запустите установщик

## Шаг 2: Установка

**Windows:**
- ✅ Отметьте "Add Python to PATH"
- Выберите "Install Now"

**macOS:**
- Запустите .pkg файл
- Следуйте инструкциям установщика

**Linux:**
Python обычно уже установлен. Проверьте командой:
\`\`\`bash
python3 --version
\`\`\`

## Шаг 3: Проверка установки

Откройте терминал/командную строку и выполните:
\`\`\`bash
python --version
\`\`\`

Должно появиться что-то вроде: \`Python 3.11.2\`

## Среды разработки

**Для начинающих:**
- **IDLE** - встроенная среда Python
- **Thonny** - простая и понятная IDE

**Для продвинутых:**
- **PyCharm** - мощная профессиональная IDE
- **VS Code** - популярный редактор с расширениями`,
          type: "text",
          orderIndex: 2,
          estimatedDuration: 90,

          skillsImpacts: [
            {
              dnaId: 5, // Python программирование
              impactWeight: 1.2, // Практические навыки весят больше
              progressPoints: 4,
              bloomLevel: "application" as const,
              learningOutcome: "Настройка рабочей среды для программирования на Python"
            },
            {
              dnaId: 10, // Решение проблем
              impactWeight: 0.8,
              progressPoints: 3,
              bloomLevel: "application" as const,
              learningOutcome: "Решение технических проблем установки и настройки"
            }
          ],

          assignments: [
            {
              title: "Практическое задание: Первая программа",
              description: "Создайте свою первую программу на Python",
              type: "coding",
              points: 15,
              content: {
                task: "Создайте программу, которая выводит 'Hello, World!' и ваше имя",
                template: `# Ваш первый код на Python
print('Hello, World!')
# Добавьте строку с вашим именем
print('Меня зовут: ')`,
                expectedOutput: "Hello, World!\nМеня зовут: [Ваше имя]",
                hints: [
                  "Используйте функцию print() для вывода текста",
                  "Текст должен быть в кавычках: 'текст' или \"текст\"",
                  "Каждый print() выводит текст на новой строке"
                ]
              },

              skillsImpacts: [
                {
                  dnaId: 5, // Python программирование
                  maxProgressPoints: 5, // Первая программа - важная веха
                  minRequiredScore: 80,
                  bloomLevel: "application" as const,
                  skillApplication: "Создание первой работающей программы на Python"
                },
                {
                  dnaId: 10, // Решение проблем
                  maxProgressPoints: 3,
                  minRequiredScore: 80,
                  bloomLevel: "application" as const,
                  skillApplication: "Отладка и исправление ошибок в коде"
                }
              ]
            }
          ]
        }
      ]
    },

    {
      title: "Переменные и типы данных",
      description: "Изучение переменных, основных типов данных и операций с ними",
      orderIndex: 2,
      estimatedDuration: 420,

      skillsMappings: [
        {
          dnaId: 5, // Python программирование
          progressContribution: 25, // Ключевой модуль для Python
          bloomLevel: "knowledge" as const
        },
        {
          dnaId: 8, // Аналитическое мышление
          progressContribution: 15, // Логическое мышление при работе с данными
          bloomLevel: "application" as const
        }
      ],

      lessons: [
        {
          title: "Переменные и присваивание",
          description: "Понятие переменных, правила именования и операции присваивания",
          content: `# Переменные в Python

Переменная — это "ящик" с именем, в котором мы храним данные.

## Создание переменных

\`\`\`python
name = "Анна"           # Строка (текст)
age = 25                # Целое число
height = 1.75           # Десятичное число
is_student = True       # Логическое значение
\`\`\`

## Правила именования переменных

✅ **Правильно:**
- \`user_name\` 
- \`total_price\`
- \`age2\`
- \`isVisible\`

❌ **Неправильно:**
- \`2name\` (не может начинаться с цифры)
- \`user-name\` (нельзя использовать дефис)
- \`class\` (зарезервированное слово)

## Основные типы данных

### 1. Строки (str)
\`\`\`python
first_name = "Иван"
last_name = 'Петров'
full_name = first_name + " " + last_name
print(full_name)  # Иван Петров
\`\`\`

### 2. Числа
\`\`\`python
# Целые числа (int)
population = 146000000
year = 2024

# Десятичные числа (float)  
temperature = 23.5
pi = 3.14159
\`\`\`

### 3. Логические значения (bool)
\`\`\`python
is_sunny = True
is_raining = False
\`\`\`

## Проверка типа данных

\`\`\`python
name = "Python"
print(type(name))      # <class 'str'>

age = 30
print(type(age))       # <class 'int'>
\`\`\``,
          type: "text",
          orderIndex: 1,
          estimatedDuration: 120,

          skillsImpacts: [
            {
              dnaId: 5, // Python программирование
              impactWeight: 1.5, // Фундаментальная тема
              progressPoints: 6,
              bloomLevel: "knowledge" as const,
              learningOutcome: "Понимание переменных и основных типов данных в Python"
            },
            {
              dnaId: 8, // Аналитическое мышление
              impactWeight: 1.0,
              progressPoints: 4,
              bloomLevel: "knowledge" as const,
              learningOutcome: "Логическое структурирование данных в программе"
            }
          ],

          assignments: [
            {
              title: "Работа с переменными",
              description: "Практические задания по созданию и использованию переменных",
              type: "coding",
              points: 20,
              content: {
                task: "Создайте программу для расчета площади прямоугольника",
                template: `# Расчет площади прямоугольника
length = 10      # длина
width = 5        # ширина

# Вычислите площадь
area = # ваш код здесь

# Выведите результат
print(f"Площадь прямоугольника: {area}")`,
                expectedOutput: "Площадь прямоугольника: 50",
                hints: [
                  "Площадь = длина × ширина", 
                  "Используйте оператор * для умножения",
                  "Присвойте результат переменной area"
                ]
              },

              skillsImpacts: [
                {
                  dnaId: 5, // Python программирование
                  maxProgressPoints: 8,
                  minRequiredScore: 75,
                  bloomLevel: "application" as const,
                  skillApplication: "Применение переменных для решения математических задач"
                },
                {
                  dnaId: 8, // Аналитическое мышление
                  maxProgressPoints: 5,
                  minRequiredScore: 75,
                  bloomLevel: "application" as const,
                  skillApplication: "Разложение задачи на логические шаги"
                },
                {
                  dnaId: 10, // Решение проблем
                  maxProgressPoints: 4,
                  minRequiredScore: 80,
                  bloomLevel: "application" as const,
                  skillApplication: "Решение практической задачи программирования"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};

export default pythonBasicsWithSkillsDnaTemplate;