/**
 * Comprehensive Content Creation Script for NovaAI University
 * Creates production-ready courses with rich content
 */

import fs from 'fs';
import path from 'path';

// Comprehensive course content structure
const comprehensiveCourses = [
  {
    title: "Машинное обучение: От основ к практике",
    slug: "machine-learning-complete",
    description: "Полный курс машинного обучения от базовых концепций до реальных проектов",
    difficulty: "intermediate",
    duration: "12 weeks",
    tags: ["machine-learning", "python", "data-science", "ai"],
    modules: [
      {
        title: "Введение в машинное обучение",
        description: "Основные концепции и терминология ML",
        orderIndex: 1,
        lessons: [
          {
            title: "Что такое машинное обучение?",
            type: "text",
            duration: 45,
            content: `# Что такое машинное обучение?

## Определение и основные концепции

Машинное обучение (Machine Learning, ML) — это раздел искусственного интеллекта, который позволяет компьютерам обучаться и принимать решения на основе данных без явного программирования каждого шага.

### Ключевые характеристики ML:

1. **Обучение на данных**: Алгоритмы анализируют большие объемы данных для выявления закономерностей
2. **Автоматическое улучшение**: Производительность системы улучшается с опытом
3. **Прогнозирование**: Способность делать предсказания на новых данных

## Типы машинного обучения

### 1. Обучение с учителем (Supervised Learning)
- Алгоритм обучается на размеченных данных
- Примеры: классификация email как спам/не спам, прогноз цен на недвижимость

### 2. Обучение без учителя (Unsupervised Learning)
- Поиск скрытых закономерностей в неразмеченных данных
- Примеры: кластеризация клиентов, выявление аномалий

### 3. Обучение с подкреплением (Reinforcement Learning)
- Обучение через взаимодействие с средой и получение наград
- Примеры: игровые AI, автономные автомобили

## Применения машинного обучения

### В бизнесе:
- Рекомендательные системы (Netflix, Amazon)
- Детекция мошенничества в банках
- Оптимизация цепочек поставок

### В медицине:
- Диагностика заболеваний по медицинским изображениям
- Разработка лекарств
- Персонализированная медицина

### В технологиях:
- Распознавание речи и изображений
- Автономные транспортные средства
- Переводчики

## Практическое задание

Подумайте о проблеме в вашей области деятельности, которую можно решить с помощью машинного обучения. Опишите:
1. Тип данных, которые у вас есть
2. Какой результат вы хотите получить
3. Какой тип ML подойдет для решения`
          },
          {
            title: "История и эволюция ML",
            type: "text",
            duration: 30,
            content: `# История и эволюция машинного обучения

## Ранние годы (1940-1960)

### Первые концепции
- **1943**: Уоррен МакКаллох и Уолтер Питтс создают математическую модель нейрона
- **1950**: Алан Тьюринг предлагает "Тест Тьюринга" для оценки машинного интеллекта
- **1952**: Артур Сэмюэл создает первую программу для игры в шашки, которая обучается

### Ключевые достижения:
- Концепция перцептрона (Фрэнк Розенблатт, 1957)
- Первые эксперименты с нейронными сетями

## Классический период (1960-1980)

### Развитие алгоритмов
- **1967**: Алгоритм k-ближайших соседей
- **1970s**: Развитие экспертных систем
- **1975**: Алгоритм обратного распространения ошибки

### Проблемы и ограничения:
- "AI Winter" - период снижения интереса к ИИ
- Ограниченные вычислительные ресурсы
- Недостаток данных

## Возрождение (1980-2000)

### Новые подходы
- **1986**: Возрождение нейронных сетей
- **1990s**: Развитие машин опорных векторов (SVM)
- **1997**: Deep Blue побеждает Гарри Каспарова

### Статистические методы:
- Байесовские сети
- Случайные леса
- Бустинг алгоритмы

## Эра больших данных (2000-2010)

### Революционные изменения
- Интернет и доступность больших данных
- Улучшение вычислительной мощности
- Развитие ансамблевых методов

### Ключевые вехи:
- **2006**: Термин "глубокое обучение" (Джеффри Хинтон)
- Появление крупных датасетов (ImageNet)

## Современная эра (2010-настоящее время)

### Прорывы в глубоком обучении
- **2012**: AlexNet революционизирует компьютерное зрение
- **2016**: AlphaGo побеждает чемпиона мира по го
- **2017**: Архитектура Transformer меняет обработку языка

### Трансформеры и языковые модели:
- **2018**: BERT от Google
- **2019**: GPT-2 от OpenAI
- **2020**: GPT-3 - 175 миллиардов параметров
- **2022**: ChatGPT изменяет восприятие ИИ

## Современное состояние

### Основные направления:
1. **Генеративный ИИ**: ChatGPT, Midjourney, DALL-E
2. **Мультимодальные модели**: Объединение текста, изображений, звука
3. **Автономные системы**: Беспилотные автомобили, роботы
4. **Квантовое машинное обучение**: Новые возможности квантовых компьютеров

### Вызовы будущего:
- Этические вопросы и bias в данных
- Объяснимость алгоритмов
- Энергоэффективность
- AGI (Artificial General Intelligence)

## Практическое задание

Исследуйте одну из современных языковых моделей (GPT, Claude, Gemini):
1. Протестируйте её возможности в разных задачах
2. Определите сильные и слабые стороны
3. Подумайте о потенциальных применениях в вашей области`
          }
        ]
      },
      {
        title: "Подготовка данных и анализ",
        description: "Работа с данными: очистка, анализ, подготовка",
        orderIndex: 2,
        lessons: [
          {
            title: "Исследовательский анализ данных (EDA)",
            type: "interactive",
            duration: 60,
            content: `# Исследовательский анализ данных (EDA)

## Что такое EDA?

Исследовательский анализ данных (Exploratory Data Analysis) — это процесс анализа данных для понимания их основных характеристик, выявления закономерностей и аномалий.

## Цели EDA

### 1. Понимание структуры данных
- Количество записей и признаков
- Типы данных (числовые, категориальные)
- Пропущенные значения

### 2. Выявление закономерностей
- Распределения переменных
- Корреляции между признаками
- Выбросы и аномалии

### 3. Формулирование гипотез
- Какие признаки важны для предсказания?
- Есть ли скрытые зависимости?
- Нужна ли дополнительная обработка?

## Основные этапы EDA

### 1. Первичный осмотр данных

\`\`\`python
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns

# Загрузка данных
df = pd.read_csv('data.csv')

# Основная информация
print("Размер данных:", df.shape)
print("\\nИнформация о столбцах:")
df.info()

# Первые несколько строк
df.head()
\`\`\`

### 2. Описательная статистика

\`\`\`python
# Статистика для числовых признаков
df.describe()

# Статистика для категориальных признаков
df.describe(include=['object'])

# Проверка пропущенных значений
df.isnull().sum()
\`\`\`

### 3. Визуализация распределений

\`\`\`python
# Гистограммы для числовых признаков
numeric_cols = df.select_dtypes(include=[np.number]).columns
df[numeric_cols].hist(figsize=(15, 10), bins=20)
plt.tight_layout()
plt.show()

# Боксплоты для выявления выбросов
plt.figure(figsize=(12, 8))
df[numeric_cols].boxplot()
plt.xticks(rotation=45)
plt.show()
\`\`\`

### 4. Анализ корреляций

\`\`\`python
# Корреляционная матрица
correlation_matrix = df[numeric_cols].corr()

# Тепловая карта корреляций
plt.figure(figsize=(10, 8))
sns.heatmap(correlation_matrix, annot=True, cmap='coolwarm', center=0)
plt.title('Матрица корреляций')
plt.show()
\`\`\`

### 5. Анализ категориальных переменных

\`\`\`python
# Частотные таблицы
for col in df.select_dtypes(include=['object']).columns:
    print(f"\\nРаспределение {col}:")
    print(df[col].value_counts())
    
    # Визуализация
    plt.figure(figsize=(8, 5))
    df[col].value_counts().plot(kind='bar')
    plt.title(f'Распределение {col}')
    plt.xticks(rotation=45)
    plt.show()
\`\`\`

## Продвинутые техники EDA

### 1. Парные графики

\`\`\`python
# Парные графики для понимания взаимосвязей
sns.pairplot(df, hue='target_column')
plt.show()
\`\`\`

### 2. Анализ выбросов

\`\`\`python
# Метод межквартильного размаха (IQR)
def detect_outliers_iqr(df, column):
    Q1 = df[column].quantile(0.25)
    Q3 = df[column].quantile(0.75)
    IQR = Q3 - Q1
    lower_bound = Q1 - 1.5 * IQR
    upper_bound = Q3 + 1.5 * IQR
    
    outliers = df[(df[column] < lower_bound) | (df[column] > upper_bound)]
    return outliers

# Поиск выбросов для каждого числового признака
for col in numeric_cols:
    outliers = detect_outliers_iqr(df, col)
    print(f"\\nВыбросы в {col}: {len(outliers)} записей")
\`\`\`

### 3. Временной анализ (для временных рядов)

\`\`\`python
# Если есть временная составляющая
if 'date' in df.columns:
    df['date'] = pd.to_datetime(df['date'])
    df.set_index('date').plot(figsize=(12, 6))
    plt.title('Временной ряд данных')
    plt.show()
\`\`\`

## Интерпретация результатов EDA

### На что обратить внимание:

1. **Качество данных**
   - Много пропущенных значений?
   - Есть ли дубликаты?
   - Правильные ли типы данных?

2. **Распределения**
   - Нормальное распределение или скошенное?
   - Есть ли многомодальность?
   - Нужна ли трансформация?

3. **Взаимосвязи**
   - Сильные корреляции между признаками
   - Нелинейные зависимости
   - Взаимодействия между признаками

4. **Выбросы**
   - Ошибки в данных или важная информация?
   - Как они влияют на анализ?

## Практическое задание

Проведите EDA для вашего датасета:

1. Загрузите данные и изучите их структуру
2. Постройте визуализации для ключевых переменных
3. Найдите корреляции между признаками
4. Выявите выбросы и аномалии
5. Сформулируйте 3-5 гипотез на основе анализа

## Инструменты для EDA

### Python библиотеки:
- **pandas**: манипуляции с данными
- **matplotlib/seaborn**: визуализация
- **plotly**: интерактивные графики
- **pandas-profiling**: автоматические отчеты

### Автоматизированные инструменты:
- **ydata-profiling**: comprehensive EDA reports
- **sweetviz**: сравнение датасетов
- **autoviz**: автоматическая визуализация

\`\`\`python
# Быстрый автоматический отчет
from ydata_profiling import ProfileReport

profile = ProfileReport(df, title="EDA Report")
profile.to_file("eda_report.html")
\`\`\`

Помните: EDA — это итеративный процесс. Чем лучше вы понимаете свои данные, тем лучше будут ваши модели!`
          }
        ]
      }
    ]
  },
  {
    title: "Глубокое обучение и нейронные сети",
    slug: "deep-learning-fundamentals",
    description: "Современные архитектуры нейронных сетей и их применения",
    difficulty: "advanced",
    duration: "16 weeks",
    tags: ["deep-learning", "neural-networks", "tensorflow", "pytorch"],
    modules: [
      {
        title: "Основы нейронных сетей",
        description: "Математические основы и базовые архитектуры",
        orderIndex: 1,
        lessons: [
          {
            title: "Математические основы нейронных сетей",
            type: "text",
            duration: 90,
            content: `# Математические основы нейронных сетей

## Биологическая мотивация

Нейронные сети вдохновлены работой человеческого мозга, который состоит из миллиардов взаимосвязанных нейронов.

### Биологический нейрон:
- **Дендриты**: получают сигналы от других нейронов
- **Сома**: обрабатывает входящие сигналы
- **Аксон**: передает выходной сигнал другим нейронам
- **Синапсы**: связи между нейронами

## Искусственный нейрон (перцептрон)

### Математическая модель:

Входные данные: $x_1, x_2, ..., x_n$
Веса: $w_1, w_2, ..., w_n$
Смещение: $b$

**Линейная комбинация:**
$$z = w_1x_1 + w_2x_2 + ... + w_nx_n + b = \\sum_{i=1}^{n} w_i x_i + b$$

**Функция активации:**
$$a = f(z)$$

### Основные функции активации:

1. **Сигмоида (Sigmoid)**
   $$\\sigma(z) = \\frac{1}{1 + e^{-z}}$$
   - Выход: (0, 1)
   - Используется в бинарной классификации

2. **Гиперболический тангенс (Tanh)**
   $$\\tanh(z) = \\frac{e^z - e^{-z}}{e^z + e^{-z}}$$
   - Выход: (-1, 1)
   - Центрирован относительно нуля

3. **ReLU (Rectified Linear Unit)**
   $$\\text{ReLU}(z) = \\max(0, z)$$
   - Простая и эффективная
   - Решает проблему затухающих градиентов

4. **Leaky ReLU**
   $$\\text{Leaky ReLU}(z) = \\max(\\alpha z, z)$$
   где $\\alpha$ - небольшое положительное число (обычно 0.01)

5. **Softmax** (для многоклассовой классификации)
   $$\\text{softmax}(z_i) = \\frac{e^{z_i}}{\\sum_{j=1}^{K} e^{z_j}}$$

## Многослойные нейронные сети

### Архитектура:
- **Входной слой**: принимает данные
- **Скрытые слои**: выполняют вычисления
- **Выходной слой**: генерирует предсказания

### Прямое распространение (Forward Propagation):

Для слоя $l$:
$$z^{[l]} = W^{[l]} a^{[l-1]} + b^{[l]}$$
$$a^{[l]} = f^{[l]}(z^{[l]})$$

где:
- $W^{[l]}$ - матрица весов слоя $l$
- $b^{[l]}$ - вектор смещений
- $a^{[l-1]}$ - активации предыдущего слоя

## Функции потерь

### 1. Среднеквадратичная ошибка (MSE)
Для регрессии:
$$L(y, \\hat{y}) = \\frac{1}{m} \\sum_{i=1}^{m} (y_i - \\hat{y}_i)^2$$

### 2. Перекрестная энтропия
Для бинарной классификации:
$$L(y, \\hat{y}) = -\\frac{1}{m} \\sum_{i=1}^{m} [y_i \\log(\\hat{y}_i) + (1-y_i) \\log(1-\\hat{y}_i)]$$

Для многоклассовой классификации:
$$L(y, \\hat{y}) = -\\frac{1}{m} \\sum_{i=1}^{m} \\sum_{j=1}^{K} y_{ij} \\log(\\hat{y}_{ij})$$

## Обратное распространение ошибки

### Цель: минимизировать функцию потерь

Используем градиентный спуск:
$$w := w - \\alpha \\frac{\\partial L}{\\partial w}$$

где $\\alpha$ - скорость обучения (learning rate).

### Вычисление градиентов:

**Для выходного слоя:**
$$\\frac{\\partial L}{\\partial z^{[L]}} = a^{[L]} - y$$

**Для скрытых слоев:**
$$\\frac{\\partial L}{\\partial z^{[l]}} = \\frac{\\partial L}{\\partial z^{[l+1]}} \\cdot W^{[l+1]T} \\odot f'^{[l]}(z^{[l]})$$

**Градиенты по весам и смещениям:**
$$\\frac{\\partial L}{\\partial W^{[l]}} = \\frac{\\partial L}{\\partial z^{[l]}} \\cdot a^{[l-1]T}$$
$$\\frac{\\partial L}{\\partial b^{[l]}} = \\frac{\\partial L}{\\partial z^{[l]}}$$

## Проблемы и решения

### 1. Затухающие градиенты
**Проблема**: Градиенты становятся очень маленькими в глубоких сетях

**Решения**:
- Использование ReLU вместо сигмоиды
- Правильная инициализация весов (Xavier, He)
- Batch Normalization
- Residual connections

### 2. Переобучение (Overfitting)
**Проблема**: Модель хорошо работает на обучающих данных, но плохо на новых

**Решения**:
- Dropout
- L1/L2 регуляризация
- Early stopping
- Data augmentation

### 3. Инициализация весов

**Xavier инициализация:**
$$w \\sim \\mathcal{N}\\left(0, \\frac{1}{n_{in}}\\right)$$

**He инициализация (для ReLU):**
$$w \\sim \\mathcal{N}\\left(0, \\frac{2}{n_{in}}\\right)$$

## Оптимизаторы

### 1. Стохастический градиентный спуск (SGD)
$$w_{t+1} = w_t - \\alpha \\nabla L(w_t)$$

### 2. Momentum
$$v_t = \\beta v_{t-1} + \\alpha \\nabla L(w_t)$$
$$w_{t+1} = w_t - v_t$$

### 3. Adam (Adaptive Moment Estimation)
$$m_t = \\beta_1 m_{t-1} + (1-\\beta_1) \\nabla L(w_t)$$
$$v_t = \\beta_2 v_{t-1} + (1-\\beta_2) (\\nabla L(w_t))^2$$
$$\\hat{m_t} = \\frac{m_t}{1-\\beta_1^t}, \\quad \\hat{v_t} = \\frac{v_t}{1-\\beta_2^t}$$
$$w_{t+1} = w_t - \\frac{\\alpha \\hat{m_t}}{\\sqrt{\\hat{v_t}} + \\epsilon}$$

## Практическая реализация

### Простой пример на Python:

\`\`\`python
import numpy as np

class NeuralNetwork:
    def __init__(self, layers):
        self.layers = layers
        self.weights = []
        self.biases = []
        
        # Инициализация весов и смещений
        for i in range(len(layers)-1):
            w = np.random.randn(layers[i], layers[i+1]) * 0.1
            b = np.zeros((1, layers[i+1]))
            self.weights.append(w)
            self.biases.append(b)
    
    def sigmoid(self, z):
        return 1 / (1 + np.exp(-np.clip(z, -250, 250)))
    
    def sigmoid_derivative(self, z):
        return z * (1 - z)
    
    def forward(self, X):
        self.activations = [X]
        current_input = X
        
        for i in range(len(self.weights)):
            z = np.dot(current_input, self.weights[i]) + self.biases[i]
            a = self.sigmoid(z)
            self.activations.append(a)
            current_input = a
            
        return current_input
    
    def backward(self, X, y, learning_rate):
        m = X.shape[0]
        
        # Вычисление ошибки для выходного слоя
        delta = self.activations[-1] - y
        
        # Обратное распространение
        for i in reversed(range(len(self.weights))):
            # Градиенты
            dW = np.dot(self.activations[i].T, delta) / m
            db = np.sum(delta, axis=0, keepdims=True) / m
            
            # Обновление весов
            self.weights[i] -= learning_rate * dW
            self.biases[i] -= learning_rate * db
            
            # Ошибка для предыдущего слоя
            if i > 0:
                delta = np.dot(delta, self.weights[i].T) * \\
                        self.sigmoid_derivative(self.activations[i])
    
    def train(self, X, y, epochs, learning_rate):
        for epoch in range(epochs):
            # Прямое распространение
            output = self.forward(X)
            
            # Обратное распространение
            self.backward(X, y, learning_rate)
            
            # Вычисление потерь
            if epoch % 100 == 0:
                loss = np.mean((output - y) ** 2)
                print(f"Epoch {epoch}, Loss: {loss:.4f}")

# Пример использования
if __name__ == "__main__":
    # Создание простого датасета (XOR)
    X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
    y = np.array([[0], [1], [1], [0]])
    
    # Создание и обучение сети
    nn = NeuralNetwork([2, 4, 1])
    nn.train(X, y, epochs=1000, learning_rate=1.0)
    
    # Тестирование
    predictions = nn.forward(X)
    print("\\nПредсказания:")
    for i in range(len(X)):
        print(f"Вход: {X[i]}, Ожидается: {y[i][0]}, Предсказано: {predictions[i][0]:.3f}")
\`\`\`

## Практические задания

1. **Реализация перцептрона**: Создайте простой перцептрон для линейной классификации

2. **Исследование функций активации**: Сравните производительность разных функций активации

3. **Анализ градиентов**: Визуализируйте проблему затухающих градиентов

4. **Оптимизаторы**: Реализуйте и сравните SGD, Momentum и Adam

## Заключение

Понимание математических основ нейронных сетей критически важно для:
- Выбора правильной архитектуры
- Настройки гиперпараметров
- Диагностики проблем обучения
- Разработки новых методов

В следующем уроке мы изучим современные фреймворки для глубокого обучения и построим первые практические модели.`
          }
        ]
      }
    ]
  },
  {
    title: "Computer Vision: От классических методов к современным архитектурам",
    slug: "computer-vision-complete",
    description: "Полный курс компьютерного зрения с практическими проектами",
    difficulty: "intermediate",
    duration: "14 weeks",
    tags: ["computer-vision", "cnn", "image-processing", "opencv"],
    modules: [
      {
        title: "Основы обработки изображений",
        description: "Классические методы и фундаментальные концепции",
        orderIndex: 1,
        lessons: [
          {
            title: "Цифровые изображения и их представление",
            type: "interactive",
            duration: 75,
            content: `# Цифровые изображения и их представление

## Что такое цифровое изображение?

Цифровое изображение — это двумерный массив чисел, где каждое число представляет интенсивность пикселя в определенной позиции.

### Основные характеристики:

1. **Разрешение**: количество пикселей (например, 1920×1080)
2. **Глубина цвета**: количество бит на пиксель
3. **Цветовая модель**: способ представления цвета

## Типы изображений

### 1. Градации серого (Grayscale)
- Один канал
- Значения от 0 (черный) до 255 (белый)
- 8 бит на пиксель = 256 оттенков

### 2. Цветные изображения (RGB)
- Три канала: Red, Green, Blue
- Каждый канал: 0-255
- 24 бита на пиксель = 16.7 млн цветов

### 3. Изображения с альфа-каналом (RGBA)
- Четыре канала: Red, Green, Blue, Alpha
- Alpha определяет прозрачность
- 32 бита на пиксель

## Цветовые пространства

### RGB (Red, Green, Blue)
- Аддитивная модель
- Используется в мониторах
- Интуитивно понятная

### HSV (Hue, Saturation, Value)
- **Hue**: оттенок (0-360°)
- **Saturation**: насыщенность (0-100%)
- **Value**: яркость (0-100%)
- Удобна для цветовой сегментации

### LAB
- **L**: Lightness (яркость)
- **A**: Green-Red компонента
- **B**: Blue-Yellow компонента
- Перцептуально однородная

## Практическая работа с изображениями

### Загрузка и отображение:

\`\`\`python
import cv2
import numpy as np
import matplotlib.pyplot as plt

# Загрузка изображения
image = cv2.imread('image.jpg')

# OpenCV использует BGR, matplotlib - RGB
image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

# Отображение
plt.figure(figsize=(10, 6))
plt.imshow(image_rgb)
plt.title('Исходное изображение')
plt.axis('off')
plt.show()

# Информация об изображении
print(f"Размер: {image.shape}")
print(f"Тип данных: {image.dtype}")
print(f"Минимальное значение: {image.min()}")
print(f"Максимальное значение: {image.max()}")
\`\`\`

### Преобразование в градации серого:

\`\`\`python
# Преобразование в grayscale
gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)

plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.imshow(image_rgb)
plt.title('Цветное изображение')
plt.axis('off')

plt.subplot(1, 2, 2)
plt.imshow(gray, cmap='gray')
plt.title('Градации серого')
plt.axis('off')

plt.tight_layout()
plt.show()
\`\`\`

### Работа с каналами:

\`\`\`python
# Разделение на каналы
b, g, r = cv2.split(image)

# Отображение каналов
fig, axes = plt.subplots(2, 2, figsize=(10, 10))

axes[0, 0].imshow(image_rgb)
axes[0, 0].set_title('Исходное изображение')
axes[0, 0].axis('off')

axes[0, 1].imshow(r, cmap='Reds')
axes[0, 1].set_title('Красный канал')
axes[0, 1].axis('off')

axes[1, 0].imshow(g, cmap='Greens')
axes[1, 0].set_title('Зеленый канал')
axes[1, 0].axis('off')

axes[1, 1].imshow(b, cmap='Blues')
axes[1, 1].set_title('Синий канал')
axes[1, 1].axis('off')

plt.tight_layout()
plt.show()
\`\`\`

## Гистограммы

Гистограмма показывает распределение интенсивности пикселей в изображении.

\`\`\`python
# Гистограмма для grayscale
plt.figure(figsize=(12, 4))

plt.subplot(1, 2, 1)
plt.imshow(gray, cmap='gray')
plt.title('Изображение')
plt.axis('off')

plt.subplot(1, 2, 2)
plt.hist(gray.ravel(), bins=256, range=[0, 256])
plt.title('Гистограмма')
plt.xlabel('Интенсивность пикселя')
plt.ylabel('Количество пикселей')

plt.tight_layout()
plt.show()

# Цветная гистограмма
colors = ['red', 'green', 'blue']
plt.figure(figsize=(10, 6))

for i, color in enumerate(colors):
    channel = image_rgb[:, :, i]
    plt.hist(channel.ravel(), bins=256, range=[0, 256], 
             color=color, alpha=0.7, label=f'{color.capitalize()} канал')

plt.title('Цветная гистограмма')
plt.xlabel('Интенсивность пикселя')
plt.ylabel('Количество пикселей')
plt.legend()
plt.show()
\`\`\`

## Базовые операции с изображениями

### 1. Изменение размера:

\`\`\`python
# Изменение размера
resized = cv2.resize(image, (300, 200))

print(f"Исходный размер: {image.shape}")
print(f"Новый размер: {resized.shape}")
\`\`\`

### 2. Обрезка:

\`\`\`python
# Обрезка (crop)
h, w = image.shape[:2]
cropped = image[h//4:3*h//4, w//4:3*w//4]

plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.title('Исходное')
plt.axis('off')

plt.subplot(1, 2, 2)
plt.imshow(cv2.cvtColor(cropped, cv2.COLOR_BGR2RGB))
plt.title('Обрезанное')
plt.axis('off')

plt.show()
\`\`\`

### 3. Поворот:

\`\`\`python
# Поворот
h, w = image.shape[:2]
center = (w//2, h//2)

# Матрица поворота на 45 градусов
rotation_matrix = cv2.getRotationMatrix2D(center, 45, 1.0)
rotated = cv2.warpAffine(image, rotation_matrix, (w, h))

plt.figure(figsize=(10, 4))

plt.subplot(1, 2, 1)
plt.imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
plt.title('Исходное')
plt.axis('off')

plt.subplot(1, 2, 2)
plt.imshow(cv2.cvtColor(rotated, cv2.COLOR_BGR2RGB))
plt.title('Повернутое на 45°')
plt.axis('off')

plt.show()
\`\`\`

### 4. Отражение:

\`\`\`python
# Отражение
flipped_horizontal = cv2.flip(image, 1)  # По горизонтали
flipped_vertical = cv2.flip(image, 0)    # По вертикали
flipped_both = cv2.flip(image, -1)       # По обеим осям

fig, axes = plt.subplots(2, 2, figsize=(10, 10))

axes[0, 0].imshow(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))
axes[0, 0].set_title('Исходное')
axes[0, 0].axis('off')

axes[0, 1].imshow(cv2.cvtColor(flipped_horizontal, cv2.COLOR_BGR2RGB))
axes[0, 1].set_title('Отражение по горизонтали')
axes[0, 1].axis('off')

axes[1, 0].imshow(cv2.cvtColor(flipped_vertical, cv2.COLOR_BGR2RGB))
axes[1, 0].set_title('Отражение по вертикали')
axes[1, 0].axis('off')

axes[1, 1].imshow(cv2.cvtColor(flipped_both, cv2.COLOR_BGR2RGB))
axes[1, 1].set_title('Отражение по обеим осям')
axes[1, 1].axis('off')

plt.tight_layout()
plt.show()
\`\`\`

## Арифметические операции

### Сложение изображений:

\`\`\`python
# Создание простых изображений для демонстрации
img1 = np.zeros((300, 300, 3), dtype=np.uint8)
cv2.rectangle(img1, (50, 50), (150, 150), (255, 0, 0), -1)

img2 = np.zeros((300, 300, 3), dtype=np.uint8)
cv2.circle(img2, (150, 150), 75, (0, 255, 0), -1)

# Сложение
added = cv2.add(img1, img2)

# Взвешенное сложение
blended = cv2.addWeighted(img1, 0.7, img2, 0.3, 0)

plt.figure(figsize=(12, 3))

plt.subplot(1, 4, 1)
plt.imshow(cv2.cvtColor(img1, cv2.COLOR_BGR2RGB))
plt.title('Изображение 1')
plt.axis('off')

plt.subplot(1, 4, 2)
plt.imshow(cv2.cvtColor(img2, cv2.COLOR_BGR2RGB))
plt.title('Изображение 2')
plt.axis('off')

plt.subplot(1, 4, 3)
plt.imshow(cv2.cvtColor(added, cv2.COLOR_BGR2RGB))
plt.title('Сложение')
plt.axis('off')

plt.subplot(1, 4, 4)
plt.imshow(cv2.cvtColor(blended, cv2.COLOR_BGR2RGB))
plt.title('Взвешенное сложение')
plt.axis('off')

plt.tight_layout()
plt.show()
\`\`\`

## Практические задания

### Задание 1: Анализ изображения
Загрузите изображение и проанализируйте:
1. Размеры и количество каналов
2. Тип данных пикселей
3. Минимальные и максимальные значения
4. Постройте гистограммы для каждого канала

### Задание 2: Манипуляции с изображением
Создайте функции для:
1. Изменения яркости изображения
2. Изменения контрастности
3. Применения цветового фильтра

\`\`\`python
def adjust_brightness(image, value):
    """Изменение яркости изображения"""
    hsv = cv2.cvtColor(image, cv2.COLOR_BGR2HSV)
    hsv = hsv.astype(np.float64)
    hsv[:, :, 2] = hsv[:, :, 2] + value
    hsv[:, :, 2][hsv[:, :, 2] > 255] = 255
    hsv[:, :, 2][hsv[:, :, 2] < 0] = 0
    hsv = hsv.astype(np.uint8)
    return cv2.cvtColor(hsv, cv2.COLOR_HSV2BGR)

def adjust_contrast(image, alpha):
    """Изменение контрастности изображения"""
    return cv2.convertScaleAbs(image, alpha=alpha, beta=0)

# Пример использования
bright_image = adjust_brightness(image, 50)
contrast_image = adjust_contrast(image, 1.5)
\`\`\`

### Задание 3: Создание коллажа
Создайте коллаж из 4 изображений с разными эффектами:
1. Исходное изображение
2. Изображение в градациях серого
3. Изображение с измененной яркостью
4. Изображение с измененным контрастом

## Выводы

В этом уроке мы изучили:
- Представление цифровых изображений
- Цветовые пространства и их применения
- Базовые операции с изображениями
- Гистограммы и их анализ
- Арифметические операции с изображениями

Эти знания являются фундаментом для более сложных техник компьютерного зрения, которые мы изучим в следующих уроках.

## Дополнительные ресурсы

1. **OpenCV Documentation**: https://docs.opencv.org/
2. **PIL/Pillow Documentation**: https://pillow.readthedocs.io/
3. **Scikit-image Documentation**: https://scikit-image.org/
4. **Digital Image Processing (Gonzalez & Woods)** - классический учебник

В следующем уроке мы изучим фильтрацию изображений и выделение границ!`
          }
        ]
      }
    ]
  },
  {
    title: "Natural Language Processing: Современные подходы",
    slug: "nlp-modern-approaches",
    description: "От традиционных методов NLP к трансформерам и языковым моделям",
    difficulty: "advanced",
    duration: "18 weeks",
    tags: ["nlp", "transformers", "bert", "gpt", "language-models"],
    modules: [
      {
        title: "Основы обработки естественного языка",
        description: "Фундаментальные концепции и традиционные методы",
        orderIndex: 1,
        lessons: [
          {
            title: "Введение в NLP и предобработка текста",
            type: "text",
            duration: 60,
            content: `# Введение в обработку естественного языка (NLP)

## Что такое NLP?

Natural Language Processing (NLP) — область искусственного интеллекта, которая помогает компьютерам понимать, интерпретировать и генерировать человеческий язык осмысленным и полезным образом.

## Задачи NLP

### 1. Понимание текста
- **Классификация текста**: определение темы, тональности
- **Извлечение информации**: поиск сущностей, отношений
- **Вопросно-ответные системы**: понимание вопросов и поиск ответов

### 2. Генерация текста
- **Машинный перевод**: перевод с одного языка на другой
- **Генерация текста**: создание статей, резюме
- **Диалоговые системы**: чат-боты и виртуальные помощники

### 3. Анализ и понимание
- **Анализ тональности**: определение эмоциональной окраски
- **Распознавание речи**: преобразование аудио в текст
- **Семантический анализ**: понимание смысла

## Вызовы в NLP

### 1. Неоднозначность
- **Лексическая**: одно слово - несколько значений
- **Синтаксическая**: разные способы разбора предложения
- **Семантическая**: разные интерпретации смысла

### 2. Контекст
- Значение слов зависит от контекста
- Понимание культурных и исторических ссылок
- Ирония и сарказм

### 3. Вариативность языка
- Разные языки и диалекты
- Сленг и неформальная речь
- Эволюция языка

## Предобработка текста

Предобработка — критический этап, определяющий качество последующего анализа.

### 1. Очистка текста

\`\`\`python
import re
import string
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize, sent_tokenize
from nltk.stem import PorterStemmer, WordNetLemmatizer

# Загрузка необходимых ресурсов NLTK
nltk.download('punkt')
nltk.download('stopwords')
nltk.download('wordnet')

def clean_text(text):
    """Основная очистка текста"""
    # Приведение к нижнему регистру
    text = text.lower()
    
    # Удаление HTML тегов
    text = re.sub(r'<[^>]+>', '', text)
    
    # Удаление URL
    text = re.sub(r'http\\S+|www\\S+|https\\S+', '', text, flags=re.MULTILINE)
    
    # Удаление email
    text = re.sub(r'\\S+@\\S+', '', text)
    
    # Удаление специальных символов и цифр
    text = re.sub(r'[^a-zA-Zа-яА-Я\\s]', '', text)
    
    # Удаление лишних пробелов
    text = re.sub(r'\\s+', ' ', text).strip()
    
    return text

# Пример использования
sample_text = """
Привет! Это пример текста для обработки. 
Здесь есть числа: 123, символы: @#$%, и URL: https://example.com
Email: user@example.com тоже будет удален.
"""

cleaned = clean_text(sample_text)
print("Исходный текст:", sample_text)
print("Очищенный текст:", cleaned)
\`\`\`

### 2. Токенизация

Токенизация — процесс разбития текста на отдельные единицы (токены).

\`\`\`python
def tokenize_text(text):
    """Токенизация на предложения и слова"""
    # Токенизация на предложения
    sentences = sent_tokenize(text, language='russian')
    
    # Токенизация на слова
    words = word_tokenize(text, language='russian')
    
    return sentences, words

text = "Машинное обучение — это увлекательно! Особенно обработка естественного языка."
sentences, words = tokenize_text(text)

print("Предложения:")
for i, sent in enumerate(sentences, 1):
    print(f"{i}: {sent}")

print("\\nСлова:")
print(words)
\`\`\`

### 3. Удаление стоп-слов

Стоп-слова — часто встречающиеся слова, которые обычно не несут смысловой нагрузки.

\`\`\`python
def remove_stopwords(words, language='russian'):
    """Удаление стоп-слов"""
    stop_words = set(stopwords.words(language))
    filtered_words = [word for word in words if word not in stop_words]
    return filtered_words

# Пример
words = ['это', 'очень', 'интересный', 'и', 'полезный', 'курс', 'по', 'nlp']
filtered = remove_stopwords(words)

print("Исходные слова:", words)
print("После удаления стоп-слов:", filtered)
\`\`\`

### 4. Стемминг и лемматизация

#### Стемминг
Приведение слов к корневой форме путем отсечения окончаний.

\`\`\`python
def stem_words(words):
    """Стемминг слов"""
    stemmer = PorterStemmer()
    stemmed = [stemmer.stem(word) for word in words]
    return stemmed

words = ['running', 'ran', 'runs', 'runner']
stemmed = stem_words(words)

print("Исходные слова:", words)
print("После стемминга:", stemmed)
\`\`\`

#### Лемматизация
Приведение слов к словарной форме с учетом части речи.

\`\`\`python
def lemmatize_words(words):
    """Лемматизация слов"""
    lemmatizer = WordNetLemmatizer()
    lemmatized = [lemmatizer.lemmatize(word) for word in words]
    return lemmatized

words = ['running', 'ran', 'runs', 'runner', 'better', 'good']
lemmatized = lemmatize_words(words)

print("Исходные слова:", words)
print("После лемматизации:", lemmatized)
\`\`\`

### 5. Комплексная функция предобработки

\`\`\`python
class TextPreprocessor:
    def __init__(self, language='russian'):
        self.language = language
        self.stemmer = PorterStemmer()
        self.lemmatizer = WordNetLemmatizer()
        self.stop_words = set(stopwords.words(language))
    
    def preprocess(self, text, 
                   clean=True, 
                   tokenize=True, 
                   remove_stopwords=True, 
                   lemmatize=True,
                   stem=False):
        """
        Комплексная предобработка текста
        
        Args:
            text: исходный текст
            clean: очистка текста
            tokenize: токенизация
            remove_stopwords: удаление стоп-слов
            lemmatize: лемматизация
            stem: стемминг
        """
        result = text
        
        # Очистка
        if clean:
            result = self.clean_text(result)
        
        # Токенизация
        if tokenize:
            words = word_tokenize(result, language=self.language)
        else:
            words = result.split()
        
        # Удаление стоп-слов
        if remove_stopwords:
            words = [word for word in words if word.lower() not in self.stop_words]
        
        # Лемматизация
        if lemmatize:
            words = [self.lemmatizer.lemmatize(word.lower()) for word in words]
        
        # Стемминг
        if stem:
            words = [self.stemmer.stem(word.lower()) for word in words]
        
        return words
    
    def clean_text(self, text):
        """Очистка текста"""
        text = text.lower()
        text = re.sub(r'<[^>]+>', '', text)
        text = re.sub(r'http\\S+|www\\S+|https\\S+', '', text, flags=re.MULTILINE)
        text = re.sub(r'\\S+@\\S+', '', text)
        text = re.sub(r'[^a-zA-Zа-яА-Я\\s]', '', text)
        text = re.sub(r'\\s+', ' ', text).strip()
        return text

# Пример использования
preprocessor = TextPreprocessor()

sample_text = """
Машинное обучение и искусственный интеллект стали неотъемлемой частью современного мира.
Эти технологии применяются в различных сферах: от медицины до финансов.
"""

processed = preprocessor.preprocess(sample_text)
print("Обработанный текст:", processed)
\`\`\`

## Работа с русским языком

### Особенности обработки русского текста:

1. **Морфология**: богатая система склонений и спряжений
2. **Порядок слов**: более свободный, чем в английском
3. **Кодировка**: важность правильной обработки UTF-8

\`\`\`python
# Специфические инструменты для русского языка
import pymorphy2

# Морфологический анализатор для русского языка
morph = pymorphy2.MorphAnalyzer()

def analyze_russian_word(word):
    """Морфологический анализ русского слова"""
    parsed = morph.parse(word)[0]
    
    return {
        'normal_form': parsed.normal_form,
        'tag': str(parsed.tag),
        'part_of_speech': parsed.tag.POS,
        'case': parsed.tag.case,
        'number': parsed.tag.number
    }

# Пример анализа
word = "собакам"
analysis = analyze_russian_word(word)
print(f"Анализ слова '{word}':")
for key, value in analysis.items():
    print(f"  {key}: {value}")
\`\`\`

## Практические задания

### Задание 1: Создание конвейера предобработки
Создайте функцию, которая:
1. Принимает список текстов
2. Очищает каждый текст
3. Возвращает словарь с исходными и обработанными текстами

### Задание 2: Анализ частотности слов
Напишите код для:
1. Подсчета частоты слов в тексте
2. Визуализации топ-20 самых частых слов
3. Создания облака слов

\`\`\`python
from collections import Counter
import matplotlib.pyplot as plt
from wordcloud import WordCloud

def word_frequency_analysis(text):
    """Анализ частотности слов"""
    preprocessor = TextPreprocessor()
    words = preprocessor.preprocess(text)
    
    # Подсчет частотности
    word_freq = Counter(words)
    
    # Топ-20 слов
    top_words = word_freq.most_common(20)
    
    # Визуализация
    words_list, counts = zip(*top_words)
    
    plt.figure(figsize=(12, 6))
    plt.bar(words_list, counts)
    plt.title('Топ-20 самых частых слов')
    plt.xlabel('Слова')
    plt.ylabel('Частота')
    plt.xticks(rotation=45)
    plt.tight_layout()
    plt.show()
    
    # Облако слов
    wordcloud = WordCloud(width=800, height=400, 
                         background_color='white',
                         max_words=100).generate(' '.join(words))
    
    plt.figure(figsize=(10, 5))
    plt.imshow(wordcloud, interpolation='bilinear')
    plt.title('Облако слов')
    plt.axis('off')
    plt.show()
    
    return word_freq

# Пример использования
sample_text = """
Ваш большой текст для анализа...
"""

freq = word_frequency_analysis(sample_text)
\`\`\`

### Задание 3: Сравнение методов предобработки
Сравните результаты разных подходов к предобработке:
1. Только очистка
2. Очистка + удаление стоп-слов
3. Очистка + удаление стоп-слов + лемматизация
4. Полная предобработка

## Заключение

Предобработка текста — основа успешного NLP проекта. Правильная подготовка данных может значительно улучшить качество модели.

**Ключевые принципы:**
1. Понимайте свои данные
2. Экспериментируйте с разными подходами
3. Учитывайте специфику языка
4. Сохраняйте баланс между очисткой и потерей информации

В следующем уроке мы изучим векторные представления слов и методы их создания!`
          }
        ]
      }
    ]
  },
  {
    title: "AI для бизнеса: Практическое применение",
    slug: "ai-for-business",
    description: "Как внедрить ИИ в бизнес-процессы и получить конкурентные преимущества",
    difficulty: "beginner",
    duration: "8 weeks",
    tags: ["business", "ai-strategy", "automation", "roi"],
    modules: [
      {
        title: "Стратегия внедрения ИИ",
        description: "Планирование и стратегия цифровой трансформации",
        orderIndex: 1,
        lessons: [
          {
            title: "ИИ-стратегия компании: с чего начать",
            type: "text",
            duration: 45,
            content: `# ИИ-стратегия компании: с чего начать

## Зачем бизнесу нужен искусственный интеллект?

### Конкурентные преимущества ИИ:

1. **Автоматизация процессов**: снижение затрат и ошибок
2. **Персонализация**: улучшение клиентского опыта
3. **Предиктивная аналитика**: принятие решений на основе данных
4. **Инновации**: создание новых продуктов и услуг

## Этапы разработки ИИ-стратегии

### 1. Оценка текущего состояния

#### Аудит данных
- Какие данные у вас есть?
- Как они структурированы?
- Каково их качество?

#### Технологическая готовность
- Текущая IT-инфраструктура
- Облачные решения
- Системы аналитики

#### Человеческие ресурсы
- Команда data science
- ИИ-компетенции сотрудников
- Готовность к изменениям

### 2. Определение целей и приоритетов

#### Бизнес-цели
- Увеличение выручки
- Снижение затрат
- Улучшение качества продукта
- Повышение удовлетворенности клиентов

#### SMART-цели для ИИ
- **Specific**: Конкретные
- **Measurable**: Измеримые
- **Achievable**: Достижимые
- **Relevant**: Релевантные
- **Time-bound**: Ограниченные во времени

**Пример SMART-цели:**
"Увеличить точность прогнозирования спроса на 25% в течение 6 месяцев, что приведет к снижению остатков на складе на 15%"

### 3. Выбор приоритетных направлений

#### Матрица приоритетов ИИ-проектов

| Критерий | Вес | Проект A | Проект B | Проект C |
|----------|-----|----------|----------|----------|
| Потенциальный ROI | 30% | 8/10 | 6/10 | 9/10 |
| Техническая сложность | 20% | 7/10 | 9/10 | 5/10 |
| Доступность данных | 25% | 9/10 | 7/10 | 8/10 |
| Влияние на клиентов | 25% | 6/10 | 8/10 | 7/10 |
| **Итоговый балл** | | **7.5** | **7.3** | **7.5** |

## Основные направления применения ИИ в бизнесе

### 1. Клиентский сервис
- **Чат-боты**: автоматизация поддержки
- **Рекомендательные системы**: персонализация предложений
- **Анализ тональности**: мониторинг отзывов

### 2. Продажи и маркетинг
- **Прогнозирование продаж**: планирование и бюджетирование
- **Сегментация клиентов**: таргетированная реклама
- **Динамическое ценообразование**: оптимизация прибыли

### 3. Операционная деятельность
- **Предиктивное обслуживание**: снижение простоев
- **Оптимизация поставок**: управление запасами
- **Контроль качества**: автоматическая проверка продукции

### 4. Финансы и риски
- **Кредитный скоринг**: оценка кредитоспособности
- **Детекция мошенничества**: защита от финансовых потерь
- **Алгоритмический трейдинг**: автоматизация торговли

### 5. HR и управление персоналом
- **Подбор кандидатов**: автоматизация рекрутинга
- **Прогнозирование текучести**: удержание талантов
- **Оценка производительности**: объективная аттестация

## Модели внедрения ИИ

### 1. Собственная разработка
**Преимущества:**
- Полный контроль над решением
- Уникальные конкурентные преимущества
- Интеграция с существующими системами

**Недостатки:**
- Высокие затраты на разработку
- Необходимость в экспертизе
- Длительные сроки разработки

### 2. Готовые решения (SaaS)
**Преимущества:**
- Быстрое внедрение
- Низкие первоначальные затраты
- Техническая поддержка

**Недостатки:**
- Ограниченная кастомизация
- Зависимость от поставщика
- Ежемесячные платежи

### 3. Гибридный подход
**Комбинация:**
- Готовые решения для стандартных задач
- Собственная разработка для уникальных потребностей
- Партнерство с ИИ-компаниями

## Создание ИИ-команды

### Ключевые роли:

#### 1. Chief AI Officer (CAIO)
- Стратегическое планирование
- Координация ИИ-инициатив
- Взаимодействие с руководством

#### 2. Data Scientist
- Разработка моделей
- Анализ данных
- Экспериментирование

#### 3. ML Engineer
- Внедрение моделей в продакшн
- Масштабирование решений
- MLOps

#### 4. Data Engineer
- Построение data pipeline
- Интеграция данных
- Обеспечение качества данных

#### 5. Product Manager
- Определение требований
- Приоритизация функций
- Взаимодействие с бизнесом

### Варианты формирования команды:

1. **Hiring**: найм специалистов
2. **Training**: обучение существующих сотрудников
3. **Outsourcing**: привлечение внешних экспертов
4. **Partnership**: сотрудничество с ИИ-компаниями

## Оценка ROI ИИ-проектов

### Методика расчета ROI:

**ROI = (Прибыль от ИИ - Затраты на ИИ) / Затраты на ИИ × 100%**

#### Прибыль от ИИ включает:
- Увеличение выручки
- Снижение затрат
- Экономия времени
- Повышение качества

#### Затраты на ИИ включают:
- Разработка и внедрение
- Обучение персонала
- Инфраструктура
- Текущее обслуживание

### Пример расчета ROI

**Проект**: Система рекомендаций для интернет-магазина

**Затраты (первый год):**
- Разработка: $100,000
- Инфраструктура: $20,000
- Команда: $150,000
- **Итого**: $270,000

**Прибыль (первый год):**
- Увеличение конверсии на 15%: $300,000
- Увеличение среднего чека на 10%: $200,000
- **Итого**: $500,000

**ROI = ($500,000 - $270,000) / $270,000 × 100% = 85%**

## Риски и вызовы

### Технические риски:
- Низкое качество данных
- Переобучение моделей
- Интеграционные проблемы

### Бизнес-риски:
- Неопределенный ROI
- Изменение требований
- Конкуренция

### Этические и правовые риски:
- Bias в алгоритмах
- Конфиденциальность данных
- Соответствие регулированию

### Организационные риски:
- Сопротивление изменениям
- Недостаток экспертизы
- Неправильные ожидания

## Практические рекомендации

### 1. Начинайте с малого
- Выберите простой пилотный проект
- Получите быстрые результаты
- Масштабируйте успешные решения

### 2. Фокусируйтесь на данных
- Инвестируйте в качество данных
- Создайте единую data platform
- Обеспечьте data governance

### 3. Развивайте культуру данных
- Обучайте сотрудников
- Поощряйте эксперименты
- Создавайте центры компетенций

### 4. Выстраивайте партнерства
- Сотрудничайте с университетами
- Участвуйте в ИИ-сообществе
- Привлекайте внешних экспертов

## Практическое задание

Разработайте ИИ-стратегию для вашей компании:

1. **Оценка текущего состояния**
   - Аудит данных
   - Технологическая готовность
   - Экспертиза команды

2. **Определение целей**
   - 3 SMART-цели для ИИ
   - Ожидаемый ROI

3. **Выбор приоритетных проектов**
   - Список из 5 потенциальных проектов
   - Матрица приоритетов
   - Топ-3 проекта для реализации

4. **План реализации**
   - Roadmap на 12 месяцев
   - Ресурсы и бюджет
   - Метрики успеха

## Заключение

Успешная ИИ-стратегия требует:
- Четкого понимания бизнес-целей
- Реалистичной оценки возможностей
- Поэтапного подхода к внедрению
- Инвестиций в людей и данные

**Помните**: ИИ — это не цель, а средство для достижения бизнес-целей!

В следующем уроке мы изучим конкретные кейсы успешного внедрения ИИ в различных отраслях.`
          }
        ]
      }
    ]
  }
];

// Создание JSON файла с контентом
const contentData = {
  courses: comprehensiveCourses,
  generated_at: new Date().toISOString(),
  version: "1.0.0"
};

fs.writeFileSync('comprehensive-courses-content.json', JSON.stringify(contentData, null, 2), 'utf8');

console.log('✅ Comprehensive course content created successfully!');
console.log(`📚 Created ${comprehensiveCourses.length} courses with rich content`);
console.log('📁 File saved as: comprehensive-courses-content.json');

// Создание скрипта для загрузки в базу данных
const insertScript = `
-- Script to insert comprehensive course content
-- Generated on ${new Date().toISOString()}

BEGIN;

-- Clear existing data
DELETE FROM lesson_progress;
DELETE FROM lessons;
DELETE FROM course_modules;
DELETE FROM courses;

-- Reset sequences
ALTER SEQUENCE courses_id_seq RESTART WITH 1;
ALTER SEQUENCE course_modules_id_seq RESTART WITH 1;
ALTER SEQUENCE lessons_id_seq RESTART WITH 1;

-- Insert courses
${comprehensiveCourses.map((course, courseIndex) => `
INSERT INTO courses (id, title, slug, description, difficulty, duration, tags, created_at, updated_at)
VALUES (${courseIndex + 1}, '${course.title}', '${course.slug}', '${course.description}', '${course.difficulty}', '${course.duration}', '{${course.tags.join(',')}}', NOW(), NOW());
`).join('')}

-- Insert modules and lessons
${comprehensiveCourses.map((course, courseIndex) => 
  course.modules.map((module, moduleIndex) => `
INSERT INTO course_modules (id, course_id, title, description, order_index, created_at, updated_at)
VALUES (${courseIndex * 10 + moduleIndex + 1}, ${courseIndex + 1}, '${module.title}', '${module.description}', ${module.orderIndex}, NOW(), NOW());

${module.lessons.map((lesson, lessonIndex) => `
INSERT INTO lessons (module_id, title, type, content, duration, order_index, created_at, updated_at)
VALUES (${courseIndex * 10 + moduleIndex + 1}, '${lesson.title}', '${lesson.type}', $LESSON_CONTENT_${courseIndex}_${moduleIndex}_${lessonIndex}$${lesson.content}$LESSON_CONTENT_${courseIndex}_${moduleIndex}_${lessonIndex}$, ${lesson.duration}, ${lessonIndex + 1}, NOW(), NOW());
`).join('')}
`).join('')
).join('')}

COMMIT;
`;

fs.writeFileSync('insert-comprehensive-content.sql', insertScript, 'utf8');

console.log('📝 SQL insertion script created: insert-comprehensive-content.sql');
console.log('🎯 Ready to populate database with comprehensive content!');