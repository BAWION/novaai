/**
 * Comprehensive Assessment System
 * Creates quizzes, practical assessments, and certification framework
 */

const assessmentFramework = {
  quiz_types: {
    knowledge_check: {
      description: "Быстрая проверка понимания концепций",
      duration: "5-10 minutes",
      questions: "5-10",
      format: "multiple_choice, true_false"
    },
    module_assessment: {
      description: "Комплексная оценка по завершении модуля",
      duration: "20-30 minutes", 
      questions: "15-25",
      format: "mixed_format"
    },
    final_exam: {
      description: "Итоговый экзамен по курсу",
      duration: "60-90 minutes",
      questions: "40-60",
      format: "comprehensive"
    },
    practical_assessment: {
      description: "Практическое задание с кодом",
      duration: "2-4 hours",
      format: "coding_challenge"
    }
  },

  sample_quizzes: [
    {
      course: "machine-learning-complete",
      module: "introduction",
      title: "Основы машинного обучения - Проверка знаний",
      type: "knowledge_check",
      duration: 10,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "Какой тип машинного обучения используется, когда у нас есть размеченные данные?",
          options: [
            "Обучение с учителем (Supervised Learning)",
            "Обучение без учителя (Unsupervised Learning)", 
            "Обучение с подкреплением (Reinforcement Learning)",
            "Полуконтролируемое обучение (Semi-supervised Learning)"
          ],
          correct_answer: 0,
          explanation: "Обучение с учителем использует размеченные данные, где для каждого примера известен правильный ответ.",
          difficulty: "beginner",
          tags: ["supervised-learning", "fundamentals"]
        },
        {
          id: 2,
          type: "multiple_choice",
          question: "Что такое переобучение (overfitting) в машинном обучении?",
          options: [
            "Модель плохо работает на обучающих данных",
            "Модель хорошо работает на обучающих данных, но плохо на новых",
            "Модель слишком простая для задачи",
            "Модель обучается слишком быстро"
          ],
          correct_answer: 1,
          explanation: "Переобучение происходит, когда модель слишком хорошо запоминает обучающие данные и плохо обобщает на новые.",
          difficulty: "beginner",
          tags: ["overfitting", "model-evaluation"]
        },
        {
          id: 3,
          type: "true_false",
          question: "Чем больше данных, тем всегда лучше качество модели машинного обучения.",
          correct_answer: false,
          explanation: "Качество данных важнее количества. Плохие или нерелевантные данные могут ухудшить модель.",
          difficulty: "intermediate",
          tags: ["data-quality", "model-performance"]
        },
        {
          id: 4,
          type: "multiple_select",
          question: "Какие из перечисленных задач относятся к обучению с учителем? (Выберите все правильные)",
          options: [
            "Классификация email как спам/не спам",
            "Кластеризация клиентов по поведению",
            "Прогнозирование цен на акции",
            "Поиск аномалий в данных",
            "Распознавание рукописных цифр"
          ],
          correct_answers: [0, 2, 4],
          explanation: "Классификация, прогнозирование и распознавание - задачи с размеченными данными. Кластеризация и поиск аномалий - обычно без учителя.",
          difficulty: "intermediate",
          tags: ["supervised-learning", "task-types"]
        },
        {
          id: 5,
          type: "fill_blank",
          question: "Процесс разделения данных на обучающую, валидационную и тестовую выборки называется _____ данных.",
          correct_answer: "разделение",
          alternatives: ["split", "splitting", "деление"],
          explanation: "Разделение данных критически важно для объективной оценки модели.",
          difficulty: "beginner",
          tags: ["data-splitting", "validation"]
        }
      ],
      passing_score: 70,
      max_attempts: 3,
      feedback_immediate: true
    },
    {
      course: "deep-learning-fundamentals", 
      module: "neural-networks-basics",
      title: "Нейронные сети - Углубленная проверка",
      type: "module_assessment",
      duration: 25,
      questions: [
        {
          id: 1,
          type: "multiple_choice",
          question: "Какая функция активации решает проблему затухающих градиентов лучше всего?",
          options: [
            "Sigmoid",
            "Tanh", 
            "ReLU",
            "Linear"
          ],
          correct_answer: 2,
          explanation: "ReLU не насыщается для положительных значений, что помогает избежать затухания градиентов.",
          difficulty: "intermediate",
          tags: ["activation-functions", "gradient-vanishing"]
        },
        {
          id: 2,
          type: "calculation",
          question: "Рассчитайте выход нейрона с входами [2, 3, 1], весами [0.5, -0.2, 0.3] и смещением 0.1, используя функцию активации ReLU.",
          correct_answer: 1.0,
          tolerance: 0.01,
          solution_steps: [
            "z = 2*0.5 + 3*(-0.2) + 1*0.3 + 0.1 = 1.0 - 0.6 + 0.3 + 0.1 = 0.8",
            "ReLU(0.8) = max(0, 0.8) = 0.8"
          ],
          explanation: "Сначала вычисляем линейную комбинацию, затем применяем ReLU.",
          difficulty: "intermediate",
          tags: ["forward-propagation", "calculations"]
        },
        {
          id: 3,
          type: "code_completion",
          question: "Дополните код для обучения нейронной сети:",
          code_template: `
def train_epoch(model, data_loader, optimizer, criterion):
    model.train()
    total_loss = 0
    for inputs, targets in data_loader:
        optimizer.zero_grad()
        outputs = model(inputs)
        loss = criterion(outputs, targets)
        # Ваш код здесь
        _____.backward()
        optimizer.step()
        total_loss += loss.item()
    return total_loss / len(data_loader)
          `,
          correct_completion: "loss",
          explanation: "Нужно вызвать backward() на loss для вычисления градиентов.",
          difficulty: "intermediate",
          tags: ["pytorch", "training-loop"]
        }
      ],
      passing_score: 75,
      max_attempts: 2,
      feedback_immediate: false
    }
  ],

  practical_assessments: [
    {
      course: "machine-learning-complete",
      title: "Создание модели классификации",
      description: "Постройте модель для классификации ирисов с использованием scikit-learn",
      duration: 120,
      requirements: [
        "Загрузите датасет Iris",
        "Выполните исследовательский анализ данных",
        "Обучите 3 разные модели",
        "Сравните их производительность",
        "Выберите лучшую модель и обоснуйте выбор"
      ],
      starter_code: `
import pandas as pd
import numpy as np
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score

# Загрузка данных
iris = load_iris()
X, y = iris.data, iris.target

# Ваш код здесь...
      `,
      evaluation_criteria: [
        {
          criterion: "Правильность кода",
          weight: 30,
          description: "Код выполняется без ошибок"
        },
        {
          criterion: "Качество анализа",
          weight: 25,
          description: "Содержательный EDA с визуализациями"
        },
        {
          criterion: "Сравнение моделей",
          weight: 25,
          description: "Корректное сравнение нескольких алгоритмов"
        },
        {
          criterion: "Объяснение результатов",
          weight: 20,
          description: "Понятное объяснение выбора модели"
        }
      ],
      expected_outputs: [
        "Jupyter notebook с анализом",
        "Обученные модели",
        "Отчет с выводами"
      ]
    },
    {
      course: "computer-vision-complete",
      title: "Классификация изображений с CNN",
      description: "Создайте сверточную нейронную сеть для классификации изображений CIFAR-10",
      duration: 180,
      requirements: [
        "Загрузите и подготовьте данные CIFAR-10",
        "Создайте архитектуру CNN",
        "Обучите модель с правильными параметрами",
        "Достигните точности не менее 70%",
        "Проанализируйте ошибки модели"
      ],
      starter_code: `
import tensorflow as tf
from tensorflow.keras import layers, models
from tensorflow.keras.datasets import cifar10

# Загрузка данных
(x_train, y_train), (x_test, y_test) = cifar10.load_data()

# Ваша архитектура и обучение здесь...
      `,
      evaluation_criteria: [
        {
          criterion: "Архитектура сети",
          weight: 30,
          description: "Разумная архитектура CNN"
        },
        {
          criterion: "Достигнутая точность",
          weight: 30,
          description: "Точность >= 70% на тестовых данных"
        },
        {
          criterion: "Предобработка данных",
          weight: 20,
          description: "Правильная нормализация и аугментация"
        },
        {
          criterion: "Анализ результатов",
          weight: 20,
          description: "Анализ ошибок и confusion matrix"
        }
      ]
    }
  ],

  certification_framework: {
    certificates: [
      {
        name: "NovaAI Certified ML Practitioner",
        level: "beginner",
        requirements: [
          "Завершить курс 'Машинное обучение: От основ к практике'",
          "Набрать 80%+ в финальном экзамене",
          "Выполнить 2 практических проекта",
          "Пройти peer review"
        ],
        validity_period: "2 years",
        skills_verified: [
          "Основы машинного обучения",
          "Python и scikit-learn",
          "Анализ данных",
          "Оценка моделей"
        ]
      },
      {
        name: "NovaAI Certified Deep Learning Specialist",
        level: "intermediate",
        requirements: [
          "Иметь ML Practitioner сертификат",
          "Завершить курс 'Глубокое обучение и нейронные сети'",
          "Набрать 85%+ в специализированном экзамене",
          "Создать оригинальный проект с нейронными сетями"
        ],
        validity_period: "2 years",
        skills_verified: [
          "Архитектуры нейронных сетей",
          "TensorFlow/PyTorch",
          "Computer Vision или NLP",
          "MLOps basics"
        ]
      },
      {
        name: "NovaAI Certified AI Business Consultant",
        level: "advanced",
        requirements: [
          "Завершить курс 'AI для бизнеса'",
          "Провести анализ AI стратегии реальной компании",
          "Защитить бизнес-кейс перед экспертами",
          "3+ года опыта в области"
        ],
        validity_period: "3 years",
        skills_verified: [
          "AI стратегия",
          "ROI анализ",
          "Управление AI проектами",
          "Этика и регулирование"
        ]
      }
    ],

    exam_structure: {
      multiple_choice: {
        weight: 40,
        description: "Теоретические знания"
      },
      practical_coding: {
        weight: 30,
        description: "Практические навыки программирования"
      },
      case_study: {
        weight: 20,
        description: "Анализ реальных ситуаций"
      },
      project_presentation: {
        weight: 10,
        description: "Защита собственного проекта"
      }
    }
  },

  adaptive_learning: {
    difficulty_adjustment: {
      description: "Система автоматически подстраивает сложность на основе производительности",
      parameters: [
        "Скорость ответов",
        "Процент правильных ответов",
        "Время изучения материала",
        "Количество попыток"
      ]
    },
    personalization: {
      learning_paths: [
        "Visual learner - больше диаграмм и схем",
        "Hands-on learner - больше практических заданий", 
        "Theory-first - подробные объяснения перед практикой",
        "Fast track - ускоренное прохождение для опытных"
      ]
    }
  }
};

// Функция генерации квизов для каждого урока
function generateLessonQuizzes(courses) {
  const generatedQuizzes = [];
  
  courses.forEach(course => {
    course.modules.forEach(module => {
      module.lessons.forEach(lesson => {
        const quiz = {
          course_slug: course.slug,
          module_title: module.title,
          lesson_title: lesson.title,
          quiz_type: "knowledge_check",
          questions: generateQuestionsForLesson(lesson),
          passing_score: 70,
          max_attempts: 3
        };
        generatedQuizzes.push(quiz);
      });
    });
  });
  
  return generatedQuizzes;
}

function generateQuestionsForLesson(lesson) {
  // Базовые вопросы на основе контента урока
  const baseQuestions = [
    {
      type: "multiple_choice",
      question: `Какая основная тема рассматривается в уроке "${lesson.title}"?`,
      difficulty: "beginner"
    },
    {
      type: "true_false", 
      question: "Урок содержит практические примеры кода",
      correct_answer: lesson.type === "interactive",
      difficulty: "beginner"
    }
  ];
  
  return baseQuestions;
}

export {
  assessmentFramework,
  generateLessonQuizzes
};

console.log('✅ Comprehensive assessment system created!');
console.log('📊 Assessment types: knowledge checks, module tests, final exams, practical assessments');
console.log('🏆 Certification framework with 3 levels');
console.log('🎯 Adaptive learning and personalization features');