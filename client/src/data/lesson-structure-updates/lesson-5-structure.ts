import { LessonStructure } from '@/components/courses/micro-lesson-structure-new';

/**
 * Обновленная структура для урока 5 "Что такое искусственный интеллект"
 * Модуль: Основы искусственного интеллекта (ID: 5)
 */
export const lesson5Structure = {
  title: "Что такое искусственный интеллект",
  structure: {
    hook: {
      title: "Знакомство с искусственным интеллектом",
      content: `
        <div class="space-y-4">
          <p>
            Привет! Сегодня мы начинаем увлекательное путешествие в мир искусственного интеллекта.
            Вы наверняка уже слышали это словосочетание множество раз, но что же такое ИИ на самом деле?
          </p>
          <p>
            Искусственный интеллект (ИИ) — это не просто технология будущего, это уже часть нашей повседневной жизни.
            От подборки видео на YouTube до навигационных систем, от умных помощников в телефоне до диагностики заболеваний
            — ИИ незаметно изменил то, как мы живем и работаем.
          </p>
          <blockquote class="p-4 border-l-4 border-primary/60 bg-primary/10 rounded">
            <p class="italic">"Искусственный интеллект — это новое электричество. Как электричество 100 лет назад изменило почти всё, сейчас трудно представить отрасль, которую ИИ не изменит в ближайшие несколько лет."</p>
            <footer class="text-right">— Эндрю Ын, основатель Coursera</footer>
          </blockquote>
        </div>
      `,
      imageUrl: "https://storage.googleapis.com/novaai-dev-public/ai-types-diagram.png"
    },
    explain: {
      title: "Что такое искусственный интеллект",
      content: `
        <div class="space-y-4">
          <p>
            <strong>Искусственный интеллект (ИИ)</strong> — это область информатики, которая занимается созданием 
            компьютерных систем, способных выполнять задачи, требующие человеческого интеллекта. Эти задачи включают 
            распознавание речи и изображений, принятие решений, перевод между языками и понимание естественного языка.
          </p>
          
          <h3 class="text-xl font-semibold mt-6 mb-2">Краткая история искусственного интеллекта</h3>
          
          <ul class="list-disc pl-6 space-y-2">
            <li><strong>1950-е:</strong> Алан Тьюринг предлагает "тест Тьюринга" для определения интеллекта машины. Термин "искусственный интеллект" впервые используется на конференции в Дартмуте.</li>
            <li><strong>1960-70-е:</strong> Первые экспертные системы и исследования в области машинного обучения.</li>
            <li><strong>1980-90-е:</strong> Развитие нейронных сетей и баз знаний.</li>
            <li><strong>2000-е:</strong> Прорывы в машинном обучении и обработке естественного языка.</li>
            <li><strong>2010-е:</strong> Революция глубокого обучения, когда нейронные сети с множеством слоев показали беспрецедентные результаты в распознавании изображений, речи и игре в го.</li>
            <li><strong>2020-е:</strong> Эра генеративного ИИ с моделями, способными создавать тексты, изображения и другой контент на человеческом уровне.</li>
          </ul>
        
          <h3 class="text-xl font-semibold mt-6 mb-2">Типы искусственного интеллекта</h3>
          
          <div class="space-y-3">
            <div class="bg-space-900/30 p-4 rounded-lg border border-space-700">
              <h4 class="font-medium text-blue-400">1. Узкий или слабый ИИ (Narrow AI)</h4>
              <p>Системы, разработанные для выполнения конкретных задач: распознавание лиц, вождение автомобиля, перевод текста. Большинство современных систем ИИ относятся к этой категории.</p>
            </div>
            
            <div class="bg-space-900/30 p-4 rounded-lg border border-space-700">
              <h4 class="font-medium text-blue-400">2. Общий ИИ (General AI)</h4>
              <p>Системы, которые могли бы выполнять любые интеллектуальные задачи, как человек. В настоящее время такие системы существуют только в теории и научной фантастике.</p>
            </div>
            
            <div class="bg-space-900/30 p-4 rounded-lg border border-space-700">
              <h4 class="font-medium text-blue-400">3. Сверхразум (Superintelligence)</h4>
              <p>Гипотетические системы, которые могли бы превзойти человека во всех аспектах интеллекта. Это теоретическая концепция, вызывающая как ожидание, так и опасения.</p>
            </div>
          </div>
        </div>
      `
    },
    demo: {
      title: "Искусственный интеллект в действии",
      content: `
        <div class="space-y-4">
          <p>
            Давайте рассмотрим несколько примеров, как ИИ уже сегодня применяется в разных областях:
          </p>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="border border-space-700 bg-space-900/30 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-amber-400 mb-2">Медицина</h3>
              <p>ИИ анализирует медицинские изображения, помогает диагностировать заболевания, предсказывает вспышки эпидемий, ускоряет разработку лекарств.</p>
              <p class="text-amber-300 text-sm mt-2">Пример: Система Watson от IBM помогает врачам диагностировать рак, анализируя медицинские данные.</p>
            </div>
            
            <div class="border border-space-700 bg-space-900/30 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-amber-400 mb-2">Финансы</h3>
              <p>ИИ выявляет мошеннические операции, оценивает кредитные риски, оптимизирует инвестиционные портфели, автоматизирует торговлю на биржах.</p>
              <p class="text-amber-300 text-sm mt-2">Пример: Алгоритмы JPMorgan Chase обрабатывают миллионы документов для выявления правовых рисков.</p>
            </div>
            
            <div class="border border-space-700 bg-space-900/30 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-amber-400 mb-2">Транспорт</h3>
              <p>ИИ управляет беспилотными автомобилями, оптимизирует маршруты доставки, контролирует трафик, повышает безопасность на дорогах.</p>
              <p class="text-amber-300 text-sm mt-2">Пример: Автомобили Tesla используют компьютерное зрение для автопилота и помощи водителю.</p>
            </div>
            
            <div class="border border-space-700 bg-space-900/30 p-4 rounded-lg">
              <h3 class="text-lg font-medium text-amber-400 mb-2">Обучение</h3>
              <p>ИИ персонализирует образовательный контент, автоматически проверяет работы, создает адаптивные учебные программы.</p>
              <p class="text-amber-300 text-sm mt-2">Пример: Duolingo использует ИИ для создания персонализированных уроков иностранных языков.</p>
            </div>
          </div>
          
          <h3 class="text-xl font-semibold mt-6">Ключевые технологии ИИ</h3>
          
          <div class="space-y-3 mt-3">
            <div class="flex items-start gap-3">
              <div class="bg-amber-600 text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">1</div>
              <div>
                <h4 class="font-medium">Машинное обучение</h4>
                <p class="text-sm">Алгоритмы, которые позволяют компьютерам "учиться" на данных без явного программирования. Наиболее распространенный подход в современном ИИ.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="bg-amber-600 text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">2</div>
              <div>
                <h4 class="font-medium">Глубокое обучение</h4>
                <p class="text-sm">Подвид машинного обучения, использующий многослойные нейронные сети. Особенно эффективно для распознавания образов и анализа естественного языка.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="bg-amber-600 text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">3</div>
              <div>
                <h4 class="font-medium">Компьютерное зрение</h4>
                <p class="text-sm">Технологии, позволяющие компьютерам "видеть" и интерпретировать визуальную информацию.</p>
              </div>
            </div>
            
            <div class="flex items-start gap-3">
              <div class="bg-amber-600 text-white h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 mt-1">4</div>
              <div>
                <h4 class="font-medium">Обработка естественного языка (NLP)</h4>
                <p class="text-sm">Позволяет компьютерам понимать, интерпретировать и генерировать человеческую речь и текст.</p>
              </div>
            </div>
          </div>
        </div>
      `
    },
    quickTry: {
      title: "Проверь свои знания",
      type: "interactive",
      introduction: "Давайте проверим, насколько хорошо вы поняли материал. Ответьте на следующие вопросы и выполните практическое задание.",
      interactiveElements: [
        {
          type: "quiz",
          question: "Какой тип искусственного интеллекта используется в большинстве современных приложений?",
          options: [
            { id: "1", text: "Общий ИИ (General AI)", isCorrect: false },
            { id: "2", text: "Узкий ИИ (Narrow AI)", isCorrect: true },
            { id: "3", text: "Сверхразум (Superintelligence)", isCorrect: false },
            { id: "4", text: "Самосознающий ИИ", isCorrect: false }
          ],
          explanation: "Большинство современных ИИ-систем относятся к категории узкого (слабого) ИИ, который предназначен для решения конкретных задач, таких как распознавание лиц или перевод текста."
        },
        {
          type: "quiz",
          question: "Что из перечисленного НЕ является ключевой технологией современного ИИ?",
          options: [
            { id: "1", text: "Машинное обучение", isCorrect: false },
            { id: "2", text: "Компьютерное зрение", isCorrect: false },
            { id: "3", text: "Квантовые вычисления", isCorrect: true },
            { id: "4", text: "Обработка естественного языка", isCorrect: false }
          ],
          explanation: "Квантовые вычисления — это перспективная технология, которая в будущем может расширить возможности ИИ, но пока не является ключевой технологией современного ИИ, в отличие от машинного обучения, компьютерного зрения и обработки естественного языка."
        },
        {
          type: "practical",
          title: "Определение типа ИИ",
          instructions: "Для каждого из перечисленных ниже примеров определите, к какому типу ИИ он относится: узкий ИИ, общий ИИ или гипотетический сверхразум.",
          taskDescription: `
            <ol class="list-decimal pl-6 space-y-2">
              <li>Голосовой помощник, который может включать музыку и устанавливать будильники.</li>
              <li>Программа, которая обыграла чемпиона мира в шахматы.</li>
              <li>Система, которая может самостоятельно изучать любую науку и решать любые проблемы не хуже человека.</li>
              <li>Алгоритм, который анализирует медицинские снимки для выявления опухолей.</li>
            </ol>
            
            <p class="mt-3">Запишите свои ответы (достаточно будет указать номер примера и тип ИИ).</p>
          `,
          hints: [
            "Подумайте о том, насколько узкой или широкой является задача, которую решает ИИ.",
            "Общий ИИ должен уметь решать разнообразные интеллектуальные задачи, как человек."
          ]
        }
      ]
    },
    reflect: {
      title: "Осмысление изученного",
      content: `
        <div class="space-y-4">
          <p>
            Поздравляем! Вы завершили первый урок об искусственном интеллекте и познакомились с основными концепциями и типами ИИ.
          </p>
          
          <h3 class="text-lg font-medium">Ключевые выводы:</h3>
          
          <ul class="list-disc pl-6 space-y-1">
            <li>Искусственный интеллект — это область информатики, направленная на создание систем, способных выполнять задачи, требующие человеческого интеллекта.</li>
            <li>Существует три типа ИИ: узкий ИИ (который уже широко используется), общий ИИ (пока теоретический) и сверхразум (гипотетический).</li>
            <li>ИИ уже применяется в медицине, финансах, транспорте, образовании и многих других сферах.</li>
            <li>Ключевые технологии ИИ включают машинное обучение, глубокое обучение, компьютерное зрение и обработку естественного языка.</li>
          </ul>
          
          <div class="bg-space-900/30 border border-space-700 rounded-lg p-4 mt-4">
            <h3 class="text-lg font-medium text-purple-400 mb-2">Вопросы для размышления:</h3>
            <ol class="list-decimal pl-6 space-y-2">
              <li>Как вы думаете, какие еще области человеческой деятельности могут быть изменены благодаря ИИ в ближайшие 5-10 лет?</li>
              <li>Какие этические вопросы поднимает развитие искусственного интеллекта?</li>
              <li>Как вы считаете, возможно ли создание общего ИИ? Если да, то в какие сроки?</li>
            </ol>
          </div>
          
          <p>
            В следующих уроках мы погрузимся глубже в различные аспекты искусственного интеллекта, включая машинное обучение, нейронные сети и практическое применение этих технологий.
          </p>
        </div>
      `
    }
  }
};