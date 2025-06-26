-- Завершение курса "Python для начинающих"
-- Добавление недостающих модулей и уроков

BEGIN;

-- Добавляем недостающие модули
INSERT INTO course_modules (course_id, title, description, order_index, created_at, updated_at) VALUES
(1, 'Структуры данных', 'Изучение списков, кортежей, словарей и множеств в Python', 4, NOW(), NOW()),
(1, 'Функции', 'Создание и использование функций, области видимости, декораторы', 5, NOW(), NOW()),
(1, 'Объектно-ориентированное программирование', 'Классы, объекты, наследование и полиморфизм в Python', 6, NOW(), NOW()),
(1, 'Работа с файлами и модулями', 'Чтение/запись файлов, импорт модулей, создание пакетов', 7, NOW(), NOW()),
(1, 'Обработка ошибок и отладка', 'Исключения, обработка ошибок, отладка кода', 8, NOW(), NOW());

-- Модуль 4: Структуры данных
INSERT INTO lessons (module_id, title, type, duration, content, order_index, created_at, updated_at) VALUES
((SELECT id FROM course_modules WHERE course_id = 1 AND title = 'Структуры данных'), 
 'Списки в Python', 'theory', 25, 
 '# Списки в Python

## Что такое список?

Список (list) - это упорядоченная коллекция элементов, которые могут быть разных типов. Списки изменяемы (mutable), что означает, что вы можете добавлять, удалять и изменять элементы после создания списка.

## Создание списков

```python
# Пустой список
empty_list = []
empty_list = list()

# Список с элементами
numbers = [1, 2, 3, 4, 5]
fruits = ["яблоко", "банан", "апельсин"]
mixed = [1, "текст", 3.14, True]

# Список из повторяющихся элементов
zeros = [0] * 5  # [0, 0, 0, 0, 0]
```

## Доступ к элементам

```python
fruits = ["яблоко", "банан", "апельсин", "груша"]

# Доступ по индексу (начиная с 0)
print(fruits[0])    # яблоко
print(fruits[2])    # апельсин

# Отрицательные индексы (с конца)
print(fruits[-1])   # груша
print(fruits[-2])   # апельсин
```

## Срезы (Slicing)

```python
numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]

# Базовый синтаксис: список[начало:конец:шаг]
print(numbers[2:6])    # [2, 3, 4, 5]
print(numbers[:4])     # [0, 1, 2, 3]
print(numbers[6:])     # [6, 7, 8, 9]
print(numbers[::2])    # [0, 2, 4, 6, 8]
print(numbers[::-1])   # [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
```

## Изменение списков

```python
fruits = ["яблоко", "банан", "апельсин"]

# Изменение элемента
fruits[1] = "киви"
print(fruits)  # ["яблоко", "киви", "апельсин"]

# Добавление элементов
fruits.append("груша")        # в конец
fruits.insert(1, "манго")     # по индексу

# Удаление элементов
fruits.remove("киви")         # по значению
deleted = fruits.pop()        # последний элемент
deleted = fruits.pop(0)       # по индексу
del fruits[1]                 # по индексу
```

## Методы списков

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# Поиск и подсчет
print(numbers.count(1))       # 2
print(numbers.index(4))       # 2

# Сортировка
numbers.sort()                # изменяет исходный список
sorted_nums = sorted(numbers) # создает новый список

# Разворот
numbers.reverse()

# Расширение
numbers.extend([7, 8, 9])
```

## Практические примеры

```python
# Пример 1: Обработка списка оценок
grades = [85, 92, 78, 96, 88]

average = sum(grades) / len(grades)
max_grade = max(grades)
min_grade = min(grades)

print(f"Средняя оценка: {average}")
print(f"Максимальная: {max_grade}")
print(f"Минимальная: {min_grade}")

# Пример 2: Фильтрация списка
numbers = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
even_numbers = [num for num in numbers if num % 2 == 0]
print(even_numbers)  # [2, 4, 6, 8, 10]

# Пример 3: Работа со списком строк
words = ["python", "программирование", "данные", "алгоритм"]
lengths = [len(word) for word in words]
long_words = [word for word in words if len(word) > 6]
```

## Вложенные списки

```python
# Двумерный список (матрица)
matrix = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9]
]

# Доступ к элементам
print(matrix[1][2])  # 6

# Обход двумерного списка
for row in matrix:
    for element in row:
        print(element, end=" ")
    print()
```

## Полезные функции

```python
numbers = [3, 1, 4, 1, 5, 9, 2, 6]

# Встроенные функции
print(len(numbers))    # длина списка
print(sum(numbers))    # сумма элементов
print(max(numbers))    # максимальный элемент
print(min(numbers))    # минимальный элемент
print(all([True, True, False]))  # False
print(any([True, False, False])) # True
```', 1, NOW(), NOW()),

((SELECT id FROM course_modules WHERE course_id = 1 AND title = 'Структуры данных'), 
 'Кортежи и множества', 'theory', 20, 
 '# Кортежи и множества в Python

## Кортежи (Tuples)

Кортеж - это упорядоченная коллекция элементов, которая является неизменяемой (immutable). После создания кортежа нельзя изменить его элементы.

### Создание кортежей

```python
# Пустой кортеж
empty_tuple = ()
empty_tuple = tuple()

# Кортеж с элементами
coordinates = (10, 20)
colors = ("красный", "зеленый", "синий")
mixed = (1, "текст", 3.14, True)

# Кортеж с одним элементом (обратите внимание на запятую!)
single = (42,)
# Без запятой это просто число в скобках: (42)
```

### Доступ к элементам кортежа

```python
point = (3, 7, 2)

# Доступ по индексу
print(point[0])    # 3
print(point[-1])   # 2

# Срезы работают так же, как со списками
print(point[1:])   # (7, 2)

# Длина кортежа
print(len(point))  # 3
```

### Распаковка кортежей

```python
# Распаковка координат
point = (10, 20)
x, y = point
print(f"x = {x}, y = {y}")

# Обмен значений переменных
a = 5
b = 10
a, b = b, a
print(f"a = {a}, b = {b}")  # a = 10, b = 5

# Множественное присваивание
person = ("Иван", 25, "программист")
name, age, profession = person
```

### Методы кортежей

```python
numbers = (1, 2, 3, 2, 4, 2, 5)

# Подсчет элементов
print(numbers.count(2))  # 3

# Поиск индекса
print(numbers.index(4))  # 4
```

### Преобразования

```python
# Список в кортеж
list_nums = [1, 2, 3, 4]
tuple_nums = tuple(list_nums)

# Кортеж в список
new_list = list(tuple_nums)

# Строка в кортеж
char_tuple = tuple("hello")  # (''h'', ''e'', ''l'', ''l'', ''o'')
```

## Множества (Sets)

Множество - это неупорядоченная коллекция уникальных элементов. Множества изменяемы, но не могут содержать дубликаты.

### Создание множеств

```python
# Пустое множество
empty_set = set()  # НЕ {} - это словарь!

# Множество с элементами
numbers = {1, 2, 3, 4, 5}
fruits = {"яблоко", "банан", "апельсин"}

# Множество из списка (дубликаты удаляются)
duplicates = [1, 2, 2, 3, 3, 3, 4]
unique_numbers = set(duplicates)  # {1, 2, 3, 4}
```

### Операции с множествами

```python
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

# Добавление элементов
set1.add(5)
set1.update([6, 7, 8])

# Удаление элементов
set1.remove(8)     # ошибка, если элемента нет
set1.discard(9)    # без ошибки, если элемента нет
element = set1.pop()  # удаляет случайный элемент

# Проверка принадлежности
print(3 in set1)   # True
print(10 in set1)  # False
```

### Математические операции

```python
set1 = {1, 2, 3, 4}
set2 = {3, 4, 5, 6}

# Объединение (union)
union = set1 | set2           # {1, 2, 3, 4, 5, 6}
union = set1.union(set2)      # то же самое

# Пересечение (intersection)
intersection = set1 & set2           # {3, 4}
intersection = set1.intersection(set2)

# Разность (difference)
difference = set1 - set2        # {1, 2}
difference = set1.difference(set2)

# Симметричная разность
sym_diff = set1 ^ set2                        # {1, 2, 5, 6}
sym_diff = set1.symmetric_difference(set2)
```

### Проверка отношений

```python
set1 = {1, 2}
set2 = {1, 2, 3, 4}
set3 = {5, 6}

# Подмножество
print(set1.issubset(set2))    # True
print(set1 <= set2)           # True

# Надмножество
print(set2.issuperset(set1))  # True
print(set2 >= set1)           # True

# Пересекающиеся множества
print(set1.isdisjoint(set3))  # True (не пересекаются)
```

## Практические примеры

```python
# Пример 1: Удаление дубликатов из списка
numbers = [1, 2, 2, 3, 3, 3, 4, 4, 5]
unique_numbers = list(set(numbers))
print(unique_numbers)  # [1, 2, 3, 4, 5]

# Пример 2: Поиск общих элементов
list1 = ["python", "java", "c++", "javascript"]
list2 = ["python", "ruby", "javascript", "go"]
common = set(list1) & set(list2)
print(common)  # {''python'', ''javascript''}

# Пример 3: Работа с координатами как кортежами
points = [(0, 0), (1, 1), (2, 4), (3, 9)]

# Извлечение x и y координат
x_coords = [point[0] for point in points]
y_coords = [point[1] for point in points]

print(f"X: {x_coords}")  # [0, 1, 2, 3]
print(f"Y: {y_coords}")  # [0, 1, 4, 9]

# Пример 4: Кортеж как ключ словаря
game_scores = {
    ("Иван", "Мария"): 3-2,
    ("Петр", "Анна"): 1-4,
    ("Олег", "Елена"): 2-2
}

print(game_scores[("Иван", "Мария")])  # 1
```

## Выбор структуры данных

- **Список**: когда нужна упорядоченная изменяемая коллекция
- **Кортеж**: для неизменяемых данных, координат, ключей словарей
- **Множество**: для уникальных элементов, математических операций', 2, NOW(), NOW()),

((SELECT id FROM course_modules WHERE course_id = 1 AND title = 'Структуры данных'), 
 'Словари в Python', 'theory', 25, 
 '# Словари в Python

## Что такое словарь?

Словарь (dict) - это изменяемая коллекция пар "ключ-значение". Словари неупорядочены (в Python 3.7+ сохраняют порядок вставки) и позволяют быстро находить значения по ключам.

## Создание словарей

```python
# Пустой словарь
empty_dict = {}
empty_dict = dict()

# Словарь с данными
person = {
    "имя": "Иван",
    "возраст": 25,
    "город": "Москва"
}

# Различные способы создания
grades = dict(математика=5, физика=4, химия=3)
coordinates = dict([("x", 10), ("y", 20)])
```

## Доступ к элементам

```python
person = {
    "имя": "Иван",
    "возраст": 25,
    "город": "Москва"
}

# Доступ по ключу
print(person["имя"])        # Иван
print(person.get("возраст")) # 25

# Безопасный доступ с значением по умолчанию
print(person.get("профессия", "не указано"))  # не указано

# Проверка существования ключа
if "город" in person:
    print(f"Живет в {person[''город'']}")
```

## Изменение словарей

```python
person = {"имя": "Иван", "возраст": 25}

# Добавление/изменение элементов
person["город"] = "Москва"
person["возраст"] = 26
person.update({"профессия": "программист", "зарплата": 100000})

# Удаление элементов
del person["зарплата"]
profession = person.pop("профессия")  # возвращает значение
age = person.pop("возраст", 0)        # с значением по умолчанию

# Очистка словаря
person.clear()
```

## Методы словарей

```python
student = {
    "имя": "Анна",
    "возраст": 20,
    "оценки": [4, 5, 3, 5, 4]
}

# Получение ключей, значений, пар
keys = student.keys()      # dict_keys([''имя'', ''возраст'', ''оценки''])
values = student.values()  # dict_values([''Анна'', 20, [4, 5, 3, 5, 4]])
items = student.items()    # dict_items([(''имя'', ''Анна''), ...])

# Преобразование в списки
key_list = list(student.keys())
value_list = list(student.values())

# Копирование
student_copy = student.copy()
```

## Обход словарей

```python
grades = {"математика": 5, "физика": 4, "химия": 3, "биология": 5}

# Обход ключей
for subject in grades:
    print(f"{subject}: {grades[subject]}")

# Обход значений
for grade in grades.values():
    print(f"Оценка: {grade}")

# Обход пар ключ-значение
for subject, grade in grades.items():
    print(f"{subject}: {grade}")
```

## Вложенные словари

```python
# База данных студентов
students = {
    "001": {
        "имя": "Иван Петров",
        "возраст": 20,
        "оценки": {"математика": 5, "физика": 4}
    },
    "002": {
        "имя": "Мария Сидорова", 
        "возраст": 19,
        "оценки": {"математика": 4, "физика": 5}
    }
}

# Доступ к вложенным данным
print(students["001"]["имя"])
print(students["002"]["оценки"]["физика"])

# Добавление новых данных
students["001"]["оценки"]["химия"] = 3
```

## Словарные включения (Dictionary Comprehensions)

```python
# Создание словаря квадратов
squares = {x: x**2 for x in range(1, 6)}
# {1: 1, 2: 4, 3: 9, 4: 16, 5: 25}

# Фильтрация словаря
grades = {"математика": 5, "физика": 3, "химия": 4, "биология": 2}
good_grades = {subject: grade for subject, grade in grades.items() if grade >= 4}
# {''математика'': 5, ''химия'': 4}

# Преобразование данных
names = ["иван", "мария", "петр"]
name_lengths = {name.capitalize(): len(name) for name in names}
# {''Иван'': 4, ''Мария'': 5, ''Петр'': 4}
```

## Полезные функции

```python
inventory = {"яблоки": 10, "бананы": 5, "апельсины": 8}

# Подсчет элементов
print(len(inventory))  # 3

# Максимальное/минимальное значение
max_quantity = max(inventory.values())
most_fruit = max(inventory, key=inventory.get)  # ключ с макс. значением

# Сумма значений
total_fruits = sum(inventory.values())
```

## Практические примеры

```python
# Пример 1: Подсчет частоты слов
text = "python программирование python данные python"
words = text.split()
word_count = {}

for word in words:
    word_count[word] = word_count.get(word, 0) + 1

print(word_count)  # {''python'': 3, ''программирование'': 1, ''данные'': 1}

# Более элегантный способ с defaultdict
from collections import defaultdict
word_count = defaultdict(int)
for word in words:
    word_count[word] += 1

# Пример 2: Группировка данных
students = [
    {"имя": "Иван", "группа": "А", "оценка": 5},
    {"имя": "Мария", "группа": "Б", "оценка": 4},
    {"имя": "Петр", "группа": "А", "оценка": 3},
    {"имя": "Анна", "группа": "Б", "оценка": 5}
]

groups = {}
for student in students:
    group = student["группа"]
    if group not in groups:
        groups[group] = []
    groups[group].append(student)

# Пример 3: Конфигурационный файл
config = {
    "database": {
        "host": "localhost",
        "port": 5432,
        "name": "myapp"
    },
    "cache": {
        "type": "redis",
        "ttl": 3600
    },
    "debug": True
}

# Доступ к настройкам
db_host = config["database"]["host"]
cache_ttl = config["cache"]["ttl"]

# Пример 4: Меню ресторана
menu = {
    "закуски": {
        "салат цезарь": 350,
        "брускетта": 280,
        "сырная тарелка": 450
    },
    "основные блюда": {
        "стейк": 800,
        "паста карбонара": 420,
        "лосось гриль": 650
    },
    "напитки": {
        "кофе": 150,
        "чай": 100,
        "сок": 180
    }
}

# Поиск самого дорогого блюда
max_price = 0
expensive_dish = ""

for category in menu.values():
    for dish, price in category.items():
        if price > max_price:
            max_price = price
            expensive_dish = dish

print(f"Самое дорогое блюдо: {expensive_dish} - {max_price} руб.")
```

## Продвинутые техники

```python
# Объединение словарей (Python 3.9+)
dict1 = {"a": 1, "b": 2}
dict2 = {"c": 3, "d": 4}
merged = dict1 | dict2  # {''a'': 1, ''b'': 2, ''c'': 3, ''d'': 4}

# Для более ранних версий
merged = {**dict1, **dict2}

# Инвертирование словаря
original = {"ключ1": "значение1", "ключ2": "значение2"}
inverted = {v: k for k, v in original.items()}

# Сортировка словаря по ключам/значениям
grades = {"химия": 3, "математика": 5, "физика": 4}
sorted_by_key = dict(sorted(grades.items()))
sorted_by_value = dict(sorted(grades.items(), key=lambda x: x[1]))
```', 3, NOW(), NOW());

-- Модуль 5: Функции
INSERT INTO lessons (module_id, title, type, duration, content, order_index, created_at, updated_at) VALUES
((SELECT id FROM course_modules WHERE course_id = 1 AND title = 'Функции'), 
 'Основы функций', 'theory', 30, 
 '# Функции в Python

## Что такое функция?

Функция - это именованный блок кода, который выполняет определенную задачу. Функции позволяют избежать дублирования кода и делают программы более читаемыми и модульными.

## Определение функций

```python
# Базовый синтаксис
def function_name(parameters):
    """Документация функции (необязательно)"""
    # тело функции
    return result  # необязательно

# Простая функция без параметров
def greet():
    print("Привет!")

# Вызов функции
greet()  # Привет!

# Функция с параметрами
def greet_person(name):
    print(f"Привет, {name}!")

greet_person("Иван")  # Привет, Иван!
```

## Параметры и аргументы

```python
# Обязательные параметры
def add(a, b):
    return a + b

result = add(3, 5)  # 8

# Параметры по умолчанию
def greet(name, greeting="Привет"):
    return f"{greeting}, {name}!"

print(greet("Иван"))           # Привет, Иван!
print(greet("Мария", "Здравствуй"))  # Здравствуй, Мария!

# Именованные аргументы
def create_profile(name, age, city="Не указан"):
    return f"Имя: {name}, Возраст: {age}, Город: {city}"

# Разные способы вызова
profile1 = create_profile("Иван", 25)
profile2 = create_profile("Мария", age=30, city="Москва")
profile3 = create_profile(city="СПб", name="Петр", age=28)
```

## Типы параметров

```python
# Переменное количество позиционных аргументов (*args)
def sum_all(*numbers):
    total = 0
    for num in numbers:
        total += num
    return total

print(sum_all(1, 2, 3))        # 6
print(sum_all(1, 2, 3, 4, 5))  # 15

# Переменное количество именованных аргументов (**kwargs)
def create_user(**user_data):
    print("Данные пользователя:")
    for key, value in user_data.items():
        print(f"  {key}: {value}")

create_user(name="Иван", age=25, city="Москва", job="программист")

# Комбинация всех типов параметров
def complex_function(required, default="значение", *args, **kwargs):
    print(f"Обязательный: {required}")
    print(f"По умолчанию: {default}")
    print(f"Дополнительные: {args}")
    print(f"Именованные: {kwargs}")

complex_function("test", "custom", 1, 2, 3, key1="value1", key2="value2")
```

## Возвращение значений

```python
# Возврат одного значения
def square(x):
    return x * x

# Возврат нескольких значений (кортеж)
def divide_and_remainder(a, b):
    quotient = a // b
    remainder = a % b
    return quotient, remainder

q, r = divide_and_remainder(17, 5)  # q=3, r=2

# Условный возврат
def check_age(age):
    if age >= 18:
        return "Совершеннолетний"
    else:
        return "Несовершеннолетний"

# Ранний возврат
def find_first_even(numbers):
    for num in numbers:
        if num % 2 == 0:
            return num  # выход из функции
    return None  # если четных чисел нет
```

## Области видимости (Scope)

```python
# Глобальная переменная
global_var = "Я глобальная"

def demo_scope():
    # Локальная переменная
    local_var = "Я локальная"
    print(global_var)  # доступ к глобальной
    print(local_var)   # доступ к локальной

demo_scope()
# print(local_var)  # Ошибка! local_var не доступна снаружи

# Изменение глобальной переменной
counter = 0

def increment():
    global counter
    counter += 1

increment()
print(counter)  # 1

# Нелокальные переменные (nonlocal)
def outer_function():
    x = 10
    
    def inner_function():
        nonlocal x
        x += 5
        return x
    
    return inner_function()

result = outer_function()  # 15
```

## Лямбда-функции

```python
# Обычная функция
def square(x):
    return x * x

# Эквивалентная лямбда-функция
square_lambda = lambda x: x * x

print(square(5))        # 25
print(square_lambda(5)) # 25

# Лямбда с несколькими параметрами
add = lambda a, b: a + b
print(add(3, 7))  # 10

# Использование лямбда с встроенными функциями
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# Фильтрация с лямбда
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4]

# Сортировка с лямбда
students = [("Иван", 85), ("Мария", 92), ("Петр", 78)]
students.sort(key=lambda student: student[1])  # сортировка по оценкам
print(students)  # [(''Петр'', 78), (''Иван'', 85), (''Мария'', 92)]
```

## Рекурсия

```python
# Факториал
def factorial(n):
    if n <= 1:
        return 1
    else:
        return n * factorial(n - 1)

print(factorial(5))  # 120

# Числа Фибоначчи
def fibonacci(n):
    if n <= 1:
        return n
    else:
        return fibonacci(n - 1) + fibonacci(n - 2)

# Вывод первых 10 чисел Фибоначчи
for i in range(10):
    print(fibonacci(i), end=" ")  # 0 1 1 2 3 5 8 13 21 34

# Поиск в списке (рекурсивно)
def find_element(lst, target, index=0):
    if index >= len(lst):
        return -1  # не найдено
    if lst[index] == target:
        return index
    return find_element(lst, target, index + 1)
```

## Функции высшего порядка

```python
# Функция, принимающая другую функцию как аргумент
def apply_operation(numbers, operation):
    result = []
    for num in numbers:
        result.append(operation(num))
    return result

def square(x):
    return x * x

def cube(x):
    return x * x * x

numbers = [1, 2, 3, 4, 5]
squares = apply_operation(numbers, square)
cubes = apply_operation(numbers, cube)

print(squares)  # [1, 4, 9, 16, 25]
print(cubes)    # [1, 8, 27, 64, 125]

# Функция, возвращающая другую функцию
def create_multiplier(factor):
    def multiplier(x):
        return x * factor
    return multiplier

double = create_multiplier(2)
triple = create_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15
```

## Практические примеры

```python
# Пример 1: Калькулятор
def calculator(operation, a, b):
    operations = {
        "+": lambda x, y: x + y,
        "-": lambda x, y: x - y,
        "*": lambda x, y: x * y,
        "/": lambda x, y: x / y if y != 0 else "Деление на ноль!"
    }
    
    if operation in operations:
        return operations[operation](a, b)
    else:
        return "Неизвестная операция"

print(calculator("+", 10, 5))  # 15
print(calculator("/", 10, 0))  # Деление на ноль!

# Пример 2: Валидация данных
def validate_email(email):
    if "@" not in email:
        return False, "Отсутствует символ @"
    
    parts = email.split("@")
    if len(parts) != 2:
        return False, "Неверный формат email"
    
    username, domain = parts
    if len(username) == 0:
        return False, "Пустое имя пользователя"
    
    if "." not in domain:
        return False, "Неверный домен"
    
    return True, "Email корректен"

is_valid, message = validate_email("user@example.com")
print(f"{is_valid}: {message}")

# Пример 3: Обработка списка студентов
def process_students(students, min_grade=3):
    def calculate_average(grades):
        return sum(grades) / len(grades) if grades else 0
    
    def is_passing(average):
        return average >= min_grade
    
    results = []
    for student in students:
        name = student["name"]
        grades = student["grades"]
        average = calculate_average(grades)
        status = "Зачет" if is_passing(average) else "Незачет"
        
        results.append({
            "name": name,
            "average": round(average, 2),
            "status": status
        })
    
    return results

students_data = [
    {"name": "Иван", "grades": [4, 5, 3, 4]},
    {"name": "Мария", "grades": [5, 5, 4, 5]},
    {"name": "Петр", "grades": [2, 3, 2, 3]}
]

results = process_students(students_data)
for result in results:
    print(f"{result[''name'']}: {result[''average'']} - {result[''status'']}")
```

## Документирование функций

```python
def calculate_bmi(weight, height):
    """
    Вычисляет индекс массы тела (BMI).
    
    Args:
        weight (float): Вес в килограммах
        height (float): Рост в метрах
    
    Returns:
        float: Значение BMI
        
    Example:
        >>> calculate_bmi(70, 1.75)
        22.86
    """
    if height <= 0:
        raise ValueError("Рост должен быть больше нуля")
    
    bmi = weight / (height ** 2)
    return round(bmi, 2)

# Доступ к документации
print(calculate_bmi.__doc__)
help(calculate_bmi)
```', 1, NOW(), NOW()),

((SELECT id FROM course_modules WHERE course_id = 1 AND title = 'Функции'), 
 'Продвинутые возможности функций', 'theory', 25, 
 '# Продвинутые возможности функций

## Декораторы

Декораторы - это функции, которые изменяют поведение других функций без изменения их кода.

### Простые декораторы

```python
# Базовый декоратор
def my_decorator(func):
    def wrapper():
        print("Что-то происходит перед вызовом функции")
        func()
        print("Что-то происходит после вызова функции")
    return wrapper

# Применение декоратора
@my_decorator
def say_hello():
    print("Привет!")

say_hello()
# Вывод:
# Что-то происходит перед вызовом функции
# Привет!
# Что-то происходит после вызова функции
```

### Декораторы с параметрами

```python
def timer_decorator(func):
    import time
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        print(f"Функция {func.__name__} выполнилась за {end_time - start_time:.4f} секунд")
        return result
    return wrapper

@timer_decorator
def slow_function():
    import time
    time.sleep(1)
    return "Готово!"

result = slow_function()
```

### Декоратор для логирования

```python
def log_calls(func):
    def wrapper(*args, **kwargs):
        print(f"Вызов функции {func.__name__} с аргументами {args} и {kwargs}")
        result = func(*args, **kwargs)
        print(f"Функция {func.__name__} вернула: {result}")
        return result
    return wrapper

@log_calls
def multiply(a, b):
    return a * b

multiply(3, 4)
# Вывод:
# Вызов функции multiply с аргументами (3, 4) и {}
# Функция multiply вернула: 12
```

### Декораторы с параметрами

```python
def repeat(times):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for _ in range(times):
                result = func(*args, **kwargs)
            return result
        return wrapper
    return decorator

@repeat(3)
def greet(name):
    print(f"Привет, {name}!")

greet("Иван")
# Вывод:
# Привет, Иван!
# Привет, Иван!
# Привет, Иван!
```

## Замыкания (Closures)

Замыкание - это функция, которая "запоминает" значения из области видимости, в которой она была создана.

```python
def create_counter(start=0):
    count = start
    
    def counter():
        nonlocal count
        count += 1
        return count
    
    return counter

# Создание счетчиков
counter1 = create_counter()
counter2 = create_counter(10)

print(counter1())  # 1
print(counter1())  # 2
print(counter2())  # 11
print(counter1())  # 3

# Фабрика функций
def create_multiplier(factor):
    def multiplier(number):
        return number * factor
    return multiplier

double = create_multiplier(2)
triple = create_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15
```

## Генераторы

Генераторы - это функции, которые возвращают итератор и генерируют значения по требованию.

### Функции-генераторы

```python
# Простой генератор
def count_up_to(max_value):
    count = 1
    while count <= max_value:
        yield count
        count += 1

# Использование генератора
for number in count_up_to(5):
    print(number)  # 1, 2, 3, 4, 5

# Генератор чисел Фибоначчи
def fibonacci_generator(n):
    a, b = 0, 1
    for _ in range(n):
        yield a
        a, b = b, a + b

# Получение первых 10 чисел Фибоначчи
fib_numbers = list(fibonacci_generator(10))
print(fib_numbers)  # [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

### Генераторные выражения

```python
# Генераторное выражение
squares = (x**2 for x in range(10))
print(list(squares))  # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

# Фильтрация с генератором
even_squares = (x**2 for x in range(10) if x % 2 == 0)
print(list(even_squares))  # [0, 4, 16, 36, 64]

# Чтение файла построчно (экономия памяти)
def read_large_file(file_path):
    with open(file_path, ''r'') as file:
        for line in file:
            yield line.strip()

# Использование
# for line in read_large_file(''large_file.txt''):
#     process_line(line)
```

## Аннотации типов

Python поддерживает аннотации типов для улучшения читаемости кода.

```python
def greet(name: str) -> str:
    return f"Привет, {name}!"

def add_numbers(a: int, b: int) -> int:
    return a + b

def process_items(items: list[str]) -> dict[str, int]:
    return {item: len(item) for item in items}

# Опциональные типы
from typing import Optional

def find_user(user_id: int) -> Optional[str]:
    users = {1: "Иван", 2: "Мария"}
    return users.get(user_id)

# Сложные типы
from typing import List, Dict, Tuple, Union

def analyze_data(data: List[Dict[str, Union[str, int]]]) -> Tuple[int, float]:
    count = len(data)
    total_age = sum(item[''age''] for item in data if ''age'' in item)
    average_age = total_age / count if count > 0 else 0
    return count, average_age
```

## Функциональное программирование

### map, filter, reduce

```python
from functools import reduce

# map - применяет функцию к каждому элементу
numbers = [1, 2, 3, 4, 5]
squared = list(map(lambda x: x**2, numbers))
print(squared)  # [1, 4, 9, 16, 25]

# filter - фильтрует элементы
even_numbers = list(filter(lambda x: x % 2 == 0, numbers))
print(even_numbers)  # [2, 4]

# reduce - сводит список к одному значению
sum_all = reduce(lambda x, y: x + y, numbers)
print(sum_all)  # 15

# Практический пример: обработка списка слов
words = ["python", "programming", "is", "fun"]

# Получить длины слов
lengths = list(map(len, words))
print(lengths)  # [6, 11, 2, 3]

# Найти слова длиннее 3 символов
long_words = list(filter(lambda word: len(word) > 3, words))
print(long_words)  # [''python'', ''programming'']

# Объединить все слова
sentence = reduce(lambda x, y: x + " " + y, words)
print(sentence)  # python programming is fun
```

### Частичное применение функций

```python
from functools import partial

# Базовая функция
def multiply(x, y, z):
    return x * y * z

# Создание частично примененной функции
double = partial(multiply, 2)
print(double(3, 4))  # 24 (2 * 3 * 4)

# Фиксация нескольких параметров
double_triple = partial(multiply, 2, 3)
print(double_triple(4))  # 24 (2 * 3 * 4)

# Практический пример
def log_message(level, message, timestamp=None):
    import datetime
    if timestamp is None:
        timestamp = datetime.datetime.now()
    print(f"[{timestamp}] {level}: {message}")

# Создание специализированных логгеров
log_error = partial(log_message, "ERROR")
log_warning = partial(log_message, "WARNING")

log_error("Произошла ошибка!")
log_warning("Предупреждение!")
```

## Практические примеры

```python
# Пример 1: Кэширование результатов функций
def memoize(func):
    cache = {}
    def wrapper(*args):
        if args in cache:
            print(f"Результат для {args} взят из кэша")
            return cache[args]
        result = func(*args)
        cache[args] = result
        return result
    return wrapper

@memoize
def fibonacci(n):
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

print(fibonacci(10))  # Первый вызов
print(fibonacci(10))  # Второй вызов (из кэша)

# Пример 2: Валидация входных данных
def validate_input(*validators):
    def decorator(func):
        def wrapper(*args, **kwargs):
            for i, (arg, validator) in enumerate(zip(args, validators)):
                if not validator(arg):
                    raise ValueError(f"Аргумент {i+1} не прошел валидацию")
            return func(*args, **kwargs)
        return wrapper
    return decorator

def is_positive(x):
    return x > 0

def is_string(x):
    return isinstance(x, str)

@validate_input(is_positive, is_string)
def create_account(age, name):
    return f"Аккаунт создан для {name}, возраст {age}"

try:
    print(create_account(25, "Иван"))  # OK
    print(create_account(-5, "Петр"))  # Ошибка
except ValueError as e:
    print(f"Ошибка: {e}")

# Пример 3: Контекстный менеджер из функции
from contextlib import contextmanager

@contextmanager
def timer_context():
    import time
    start = time.time()
    print("Таймер запущен")
    try:
        yield
    finally:
        end = time.time()
        print(f"Время выполнения: {end - start:.4f} секунд")

# Использование
with timer_context():
    # Какой-то код
    sum(range(1000000))

# Пример 4: Пайплайн обработки данных
def pipeline(*functions):
    def process(data):
        result = data
        for func in functions:
            result = func(result)
        return result
    return process

# Функции обработки
def clean_text(text):
    return text.strip().lower()

def remove_punctuation(text):
    import string
    return text.translate(str.maketrans("", "", string.punctuation))

def count_words(text):
    return len(text.split())

# Создание пайплайна
text_processor = pipeline(clean_text, remove_punctuation, count_words)

# Использование
text = "  Привет, мир! Как дела?  "
word_count = text_processor(text)
print(f"Количество слов: {word_count}")
```', 2, NOW(), NOW());

COMMIT;

-- Проверяем результат
SELECT 
  c.title as course_title,
  COUNT(DISTINCT cm.id) as modules_created,
  COUNT(DISTINCT l.id) as lessons_created,
  COUNT(DISTINCT CASE WHEN l.content IS NOT NULL AND LENGTH(l.content) > 100 THEN l.id END) as lessons_with_content,
  c.modules as planned_modules
FROM courses c
LEFT JOIN course_modules cm ON c.id = cm.course_id
LEFT JOIN lessons l ON cm.id = l.module_id
WHERE c.id = 1
GROUP BY c.id, c.title, c.modules;