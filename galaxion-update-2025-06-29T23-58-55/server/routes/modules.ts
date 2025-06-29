import { Router } from "express";
import { db } from "../db";
import { storage } from "../storage";

// Типы для модулей и уроков
interface Lesson {
  id: number;
  title: string;
  description: string;
  content: string;
  type: string;
  orderIndex: number;
  moduleId: number;
  estimatedDuration: number;
  completed?: boolean;
  progress?: number;
}

interface Module {
  id: number;
  title: string;
  description: string;
  orderIndex: number;
  courseId: number;
  lessons: Lesson[];
}

// Тестовые данные для модуля
const getTestModule = (moduleId: number): Module => {
  return {
    id: moduleId,
    title: "Основы ИИ — что такое искусственный интеллект?",
    description: "Понимание базовых концепций и терминологии искусственного интеллекта",
    orderIndex: 1,
    courseId: 101,
    lessons: [
      {
        id: 1,
        title: "Определение искусственного интеллекта",
        description: "Введение в базовые концепции ИИ",
        content: `
          <h2>Определение искусственного интеллекта</h2>
          <p>
            <strong>Искусственный интеллект (ИИ)</strong> — это область компьютерных наук, 
            которая фокусируется на создании систем, способных выполнять задачи, 
            традиционно требующие человеческого интеллекта.
          </p>
          <p>
            Согласно классическому определению, предложенному Джоном Маккарти в 1956 году, 
            искусственный интеллект — это "наука и инженерия создания интеллектуальных машин".
          </p>
          <h3>Ключевые характеристики ИИ:</h3>
          <ul>
            <li><strong>Обучаемость</strong> — способность улучшать производительность на основе данных</li>
            <li><strong>Рассуждение</strong> — способность делать выводы на основе неполной информации</li>
            <li><strong>Решение проблем</strong> — способность формулировать решения сложных задач</li>
            <li><strong>Восприятие</strong> — способность интерпретировать сенсорные данные</li>
            <li><strong>Понимание языка</strong> — способность понимать и генерировать естественный язык</li>
          </ul>
          <blockquote>
            "ИИ — это новое электричество. Подобно тому, как 100 лет назад электричество преобразило практически все отрасли, 
            сегодня мы с трудом можем представить отрасль, которая не изменится благодаря ИИ в ближайшие несколько лет." 
            — Эндрю Нг
          </blockquote>
        `,
        type: "text",
        orderIndex: 1,
        moduleId: moduleId,
        estimatedDuration: 60,
        completed: true
      },
      {
        id: 2,
        title: "Отличие ИИ от других технологий",
        description: "Как ИИ отличается от других компьютерных технологий",
        content: `
          <h2>Отличие ИИ от других технологий</h2>
          <p>
            Искусственный интеллект существенно отличается от традиционных компьютерных программ и других технологий по ряду ключевых аспектов.
          </p>
          <h3>Основные отличия ИИ:</h3>
          <ol>
            <li>
              <strong>Адаптивность vs статичность</strong>
              <p>Традиционные программы следуют чётко заданным инструкциям и не меняют своё поведение со временем. ИИ-системы могут обучаться на данных и адаптировать своё поведение.</p>
            </li>
            <li>
              <strong>Обработка неопределённости</strong>
              <p>ИИ способен работать с неполными или противоречивыми данными, принимая обоснованные решения в условиях неопределённости.</p>
            </li>
            <li>
              <strong>Распознавание образов</strong>
              <p>В отличие от традиционных алгоритмов, ИИ имеет продвинутые возможности распознавания сложных образов и закономерностей в данных.</p>
            </li>
            <li>
              <strong>Обобщение опыта</strong>
              <p>ИИ-системы могут обобщать полученный опыт для решения новых, ранее не встречавшихся задач.</p>
            </li>
          </ol>
          <div class="comparison-table">
            <h3>Сравнение ИИ и традиционного программирования</h3>
            <table>
              <tr>
                <th>Критерий</th>
                <th>Традиционное программирование</th>
                <th>Искусственный интеллект</th>
              </tr>
              <tr>
                <td>Разработка</td>
                <td>Алгоритмы и правила задаются явно</td>
                <td>Модель обучается на данных</td>
              </tr>
              <tr>
                <td>Улучшение</td>
                <td>Требует ручного обновления кода</td>
                <td>Может самостоятельно улучшаться</td>
              </tr>
              <tr>
                <td>Входные данные</td>
                <td>Работает только с предусмотренными типами входных данных</td>
                <td>Может работать с неструктурированными и разнородными данными</td>
              </tr>
              <tr>
                <td>Прозрачность</td>
                <td>Логика принятия решений прозрачна</td>
                <td>Часто представляет собой "чёрный ящик"</td>
              </tr>
            </table>
          </div>
        `,
        type: "text",
        orderIndex: 2,
        moduleId: moduleId,
        estimatedDuration: 60,
        completed: false
      },
      {
        id: 3,
        title: "Типы искусственного интеллекта",
        description: "Разные категории и виды ИИ-систем",
        content: `
          <h2>Типы искусственного интеллекта</h2>
          <p>
            Существует несколько способов классификации искусственного интеллекта, отражающих различные аспекты этой технологии.
          </p>
          
          <h3>Классификация по уровню развития:</h3>
          <ul>
            <li>
              <strong>Узкий или слабый ИИ (ANI — Artificial Narrow Intelligence)</strong>
              <p>Специализируется на решении конкретных задач. Примеры: распознавание речи, рекомендательные системы, игровые боты.</p>
            </li>
            <li>
              <strong>Общий или сильный ИИ (AGI — Artificial General Intelligence)</strong>
              <p>Способен понимать, учиться и применять знания в различных областях, подобно человеку. В настоящее время существует только в теории.</p>
            </li>
            <li>
              <strong>Суперинтеллект (ASI — Artificial Superintelligence)</strong>
              <p>Превосходит человеческий интеллект во всех аспектах. Гипотетическая концепция, описывающая ИИ, превосходящий лучшие человеческие умы практически во всех экономически ценных областях.</p>
            </li>
          </ul>
          
          <h3>Классификация по методу работы:</h3>
          <ul>
            <li>
              <strong>Основанные на правилах</strong>
              <p>Используют предустановленные правила и логику. Пример: экспертные системы.</p>
            </li>
            <li>
              <strong>Машинное обучение</strong>
              <p>Алгоритмы, способные обучаться на данных без явного программирования. Включает подкатегории:</p>
              <ul>
                <li>Обучение с учителем</li>
                <li>Обучение без учителя</li>
                <li>Обучение с подкреплением</li>
              </ul>
            </li>
            <li>
              <strong>Глубокое обучение</strong>
              <p>Подмножество машинного обучения, использующее искусственные нейронные сети с несколькими слоями. Примеры: сверточные нейронные сети (CNN), рекуррентные нейронные сети (RNN), трансформеры.</p>
            </li>
          </ul>
          
          <h3>Классификация по функциональности:</h3>
          <ul>
            <li>
              <strong>Реактивные машины</strong>
              <p>Реагируют только на текущую ситуацию без способности формировать воспоминания или использовать опыт. Пример: Deep Blue — шахматная программа IBM.</p>
            </li>
            <li>
              <strong>Ограниченная память</strong>
              <p>Могут использовать прошлый опыт для принятия решений. Большинство современных ИИ-систем относятся к этой категории, включая самоуправляемые автомобили.</p>
            </li>
            <li>
              <strong>Теория разума</strong>
              <p>Теоретически способны понимать мысли, убеждения и намерения других существ. Находится в стадии разработки.</p>
            </li>
            <li>
              <strong>Самосознание</strong>
              <p>Гипотетический тип ИИ, обладающий сознанием и пониманием собственного существования. В настоящее время существует только как концепция.</p>
            </li>
          </ul>
        `,
        type: "text",
        orderIndex: 3,
        moduleId: moduleId,
        estimatedDuration: 90,
        completed: false
      },
      {
        id: 4,
        title: "Мифы и заблуждения об ИИ",
        description: "Разбор распространенных мифов об искусственном интеллекте",
        content: `
          <h2>Мифы и заблуждения об ИИ</h2>
          <p>
            Искусственный интеллект окружен множеством мифов и заблуждений, которые зачастую формируют неправильное представление о его возможностях и ограничениях.
          </p>
          
          <div class="quiz-section">
            <h3>Проверь себя: распознай мифы об ИИ</h3>
            <form class="myth-quiz">
              <div class="question">
                <p><strong>1. ИИ может мыслить как человек</strong></p>
                <div class="options">
                  <div class="option">
                    <input type="radio" id="q1-true" name="q1" value="true">
                    <label for="q1-true">Правда</label>
                  </div>
                  <div class="option">
                    <input type="radio" id="q1-false" name="q1" value="false">
                    <label for="q1-false">Миф</label>
                  </div>
                </div>
                <div class="explanation hidden">
                  <strong>Ответ: Миф.</strong> Современные ИИ-системы имитируют некоторые аспекты человеческого мышления, но не обладают сознанием, интуицией или эмоциональным интеллектом. Они оптимизируют статистические модели на основе данных, а не "мыслят" в человеческом понимании.
                </div>
              </div>
              
              <div class="question">
                <p><strong>2. ИИ неизбежно заменит людей во всех профессиях</strong></p>
                <div class="options">
                  <div class="option">
                    <input type="radio" id="q2-true" name="q2" value="true">
                    <label for="q2-true">Правда</label>
                  </div>
                  <div class="option">
                    <input type="radio" id="q2-false" name="q2" value="false">
                    <label for="q2-false">Миф</label>
                  </div>
                </div>
                <div class="explanation hidden">
                  <strong>Ответ: Миф.</strong> Хотя ИИ автоматизирует определенные задачи и изменит рынок труда, он также создает новые виды работ. Многие профессии требуют творчества, эмпатии, этического суждения и других уникально человеческих качеств, которые ИИ не может полностью воспроизвести.
                </div>
              </div>
              
              <div class="question">
                <p><strong>3. ИИ всегда объективен и непредвзят</strong></p>
                <div class="options">
                  <div class="option">
                    <input type="radio" id="q3-true" name="q3" value="true">
                    <label for="q3-true">Правда</label>
                  </div>
                  <div class="option">
                    <input type="radio" id="q3-false" name="q3" value="false">
                    <label for="q3-false">Миф</label>
                  </div>
                </div>
                <div class="explanation hidden">
                  <strong>Ответ: Миф.</strong> ИИ-системы обучаются на данных, которые могут содержать исторические предубеждения и стереотипы. Если данные предвзяты, то и результаты работы ИИ будут отражать эти предубеждения. Алгоритмическая предвзятость — серьезная проблема в области ИИ.
                </div>
              </div>
              
              <div class="question">
                <p><strong>4. Самообучающийся ИИ может выйти из-под контроля</strong></p>
                <div class="options">
                  <div class="option">
                    <input type="radio" id="q4-true" name="q4" value="true">
                    <label for="q4-true">Правда</label>
                  </div>
                  <div class="option">
                    <input type="radio" id="q4-false" name="q4" value="false">
                    <label for="q4-false">Миф</label>
                  </div>
                </div>
                <div class="explanation hidden">
                  <strong>Ответ: Преувеличение.</strong> Хотя существуют реальные проблемы безопасности ИИ, современные системы не обладают самосознанием или желаниями, которые могли бы привести к "восстанию машин". Тем не менее, нежелательное поведение ИИ-систем возможно из-за неправильных целевых функций или неучтенных сценариев.
                </div>
              </div>
              
              <button type="button" class="check-answers-btn">Проверить ответы</button>
            </form>
          </div>
        `,
        type: "quiz",
        orderIndex: 4,
        moduleId: moduleId,
        estimatedDuration: 60,
        completed: false
      }
    ]
  };
};

export function registerModuleRoutes(router: Router) {
  // Получить модуль по ID
  router.get("/modules/:moduleId", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      if (isNaN(moduleId)) {
        return res.status(400).json({ message: "Invalid module ID" });
      }

      // В реальном приложении здесь будет запрос к базе данных
      const module = getTestModule(moduleId);
      res.json(module);
    } catch (error) {
      console.error("Error getting module:", error);
      res.status(500).json({ message: "Failed to get module" });
    }
  });

  // Получить урок из модуля по ID
  router.get("/modules/:moduleId/lessons/:lessonId", async (req, res) => {
    try {
      const moduleId = parseInt(req.params.moduleId);
      const lessonId = parseInt(req.params.lessonId);
      
      if (isNaN(moduleId) || isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid module or lesson ID" });
      }

      // В реальном приложении здесь будет запрос к базе данных
      const module = getTestModule(moduleId);
      const lesson = module.lessons.find(l => l.id === lessonId);
      
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found" });
      }
      
      res.json(lesson);
    } catch (error) {
      console.error("Error getting lesson:", error);
      res.status(500).json({ message: "Failed to get lesson" });
    }
  });

  // Отметить урок как завершенный
  router.post("/lessons/:lessonId/complete", async (req, res) => {
    try {
      const lessonId = parseInt(req.params.lessonId);
      if (isNaN(lessonId)) {
        return res.status(400).json({ message: "Invalid lesson ID" });
      }

      // В реальном приложении здесь будет обновление базы данных
      // Примерно так:
      // await db.lessonProgress.upsert({
      //   where: { userId_lessonId: { userId: req.user.id, lessonId } },
      //   update: { completed: true, completedAt: new Date() },
      //   create: { userId: req.user.id, lessonId, completed: true, completedAt: new Date() }
      // });

      // Возвращаем успешный результат
      res.status(200).json({ message: "Lesson marked as completed", lessonId });
    } catch (error) {
      console.error("Error completing lesson:", error);
      res.status(500).json({ message: "Failed to complete lesson" });
    }
  });
}

// Создаем и экспортируем маршрутизатор
const moduleRouter = Router();
registerModuleRoutes(moduleRouter);
export default moduleRouter;