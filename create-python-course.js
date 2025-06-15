/**
 * Script to create complete Python Basics course with full content
 */

const BASE_URL = "https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev";

async function makeRequest(method, path, data = null, cookies = '') {
  const url = `${BASE_URL}${path}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Cookie': cookies
    }
  };
  
  if (data) {
    options.body = JSON.stringify(data);
  }
  
  const response = await fetch(url, options);
  const result = await response.text();
  
  return {
    status: response.status,
    headers: response.headers,
    body: result,
    cookies: response.headers.get('set-cookie') || ''
  };
}

function extractCookies(response) {
  const setCookie = response.cookies;
  if (setCookie) {
    return setCookie.split(';')[0];
  }
  return '';
}

// Complete Python Basics course template
const pythonBasicsTemplate = {
  title: "Python для начинающих - Полный курс",
  slug: "python-basics-complete",
  description: "Комплексный курс программирования на Python с нуля. Включает основы синтаксиса, структуры данных, функции, ООП и практические проекты с реальным отслеживанием прогресса.",
  difficulty: 3,
  level: "basic",
  estimatedDuration: 2400, // 40 часов
  category: "tech",
  objectives: [
    "Освоить базовый синтаксис Python",
    "Понимать структуры данных: списки, словари, кортежи",
    "Создавать и использовать функции",
    "Работать с файлами и обработкой исключений",
    "Основы объектно-ориентированного программирования",
    "Создать итоговый проект - консольное приложение"
  ],
  prerequisites: [
    "Базовые навыки работы с компьютером",
    "Понимание логических операций",
    "Желание изучать программирование"
  ],
  skillsGained: [
    "Python Programming",
    "Data Structures",
    "Object-Oriented Programming",
    "File Operations",
    "Error Handling",
    "Problem Solving"
  ],
  modules: [
    {
      title: "Введение в Python",
      description: "Знакомство с языком программирования Python, установка среды разработки и первые программы",
      orderIndex: 1,
      estimatedDuration: 300,
      lessons: [
        {
          title: "Что такое Python и зачем его изучать",
          description: "История языка, области применения и преимущества Python",
          content: "# Добро пожаловать в мир Python!\n\nPython — это высокоуровневый язык программирования, созданный Гвидо ван Россумом в 1991 году.",
          type: "text",
          orderIndex: 1,
          estimatedDuration: 60,
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
                  }
                ]
              }
            }
          ]
        },
        {
          title: "Установка Python и настройка среды",
          description: "Установка Python, знакомство с IDLE и настройка редактора кода",
          content: "# Установка Python и настройка среды\n\nВ этом уроке мы изучим, как установить Python на ваш компьютер.",
          type: "text",
          orderIndex: 2,
          estimatedDuration: 90,
          assignments: [
            {
              title: "Практическое задание: Первая программа",
              description: "Создайте свою первую программу на Python",
              type: "coding",
              points: 15,
              content: {
                task: "Создайте программу Hello World",
                template: "print('Hello, World!')",
                expectedOutput: "Hello, World!"
              }
            }
          ]
        }
      ]
    },
    {
      title: "Переменные и типы данных",
      description: "Изучение переменных, основных типов данных и работы с ними",
      orderIndex: 2,
      estimatedDuration: 360,
      lessons: [
        {
          title: "Переменные и присваивание",
          description: "Понятие переменных, правила именования и операции присваивания",
          content: "# Переменные в Python\n\nПеременная — это 'ящик' с именем, в котором мы храним данные.",
          type: "text",
          orderIndex: 1,
          estimatedDuration: 120,
          assignments: [
            {
              title: "Работа с переменными",
              description: "Практические задания по работе с переменными",
              type: "coding",
              points: 25,
              content: {
                task: "Создайте переменные для имени и возраста",
                template: "name = 'Ваше имя'\nage = 0",
                expectedOutput: "Имя и возраст заданы корректно"
              }
            }
          ]
        }
      ]
    }
  ]
};

async function createPythonCourse() {
  console.log('=== Creating Complete Python Basics Course ===');
  
  try {
    // Login as Vitaliy
    console.log('\n1. Logging in...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      username: 'Vitaliy',
      password: '500500В'
    });
    
    if (loginResponse.status !== 200) {
      console.log('Login failed');
      return;
    }
    
    const cookies = extractCookies(loginResponse);
    console.log('Login successful');
    
    // Create course using course management API
    console.log('\n2. Creating complete Python course...');
    const createResponse = await makeRequest('POST', '/api/course-management/create', pythonBasicsTemplate, cookies);
    
    console.log(`Course creation status: ${createResponse.status}`);
    console.log('Response:', createResponse.body);
    
    if (createResponse.status === 201) {
      const result = JSON.parse(createResponse.body);
      console.log(`✅ Course created successfully with ID: ${result.courseId}`);
      
      // Test course content
      console.log('\n3. Verifying course content...');
      const contentResponse = await makeRequest('GET', `/api/course-management/course/${result.courseId}`, null, cookies);
      
      if (contentResponse.status === 200) {
        const courseData = JSON.parse(contentResponse.body);
        if (courseData.success && courseData.course) {
          console.log('✅ Course content verified:', {
            modules: courseData.course.modules?.length || 0,
            totalLessons: courseData.course.modules?.reduce((acc, mod) => acc + (mod.lessons?.length || 0), 0) || 0,
            objectives: courseData.course.objectives?.length || 0
          });
        }
      }
      
      // Start the course
      console.log('\n4. Starting course...');
      const startResponse = await makeRequest('POST', `/api/course-management/start/${result.courseId}`, {}, cookies);
      console.log('Start response:', startResponse.body);
      
      // Check progress
      console.log('\n5. Checking initial progress...');
      const progressResponse = await makeRequest('GET', `/api/course-management/progress/${result.courseId}`, null, cookies);
      console.log('Progress response:', progressResponse.body);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

createPythonCourse();