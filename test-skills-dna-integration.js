/**
 * Тест интеграции Skills DNA с курсами
 * Настраивает навыки для Python курса и тестирует автоматическое обновление
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

async function testSkillsDnaIntegration() {
  console.log('=== Тест интеграции Skills DNA с курсами ===');
  
  try {
    // Шаг 1: Авторизация
    console.log('\n1. Авторизация...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      username: 'Vitaliy',
      password: '500500В'
    });
    
    if (loginResponse.status !== 200) {
      console.log('Ошибка авторизации:', loginResponse.body);
      return;
    }
    
    const cookies = extractCookies(loginResponse);
    console.log('✅ Авторизация успешна');
    
    // Шаг 2: Получение текущего состояния Skills DNA
    console.log('\n2. Получение текущего состояния Skills DNA...');
    const skillsSummaryBefore = await makeRequest('GET', '/api/course-management/skills-summary', null, cookies);
    console.log('Статус получения навыков:', skillsSummaryBefore.status);
    
    if (skillsSummaryBefore.status === 200) {
      const summary = JSON.parse(skillsSummaryBefore.body);
      console.log('Текущие навыки:', {
        totalSkills: summary.summary?.totalSkills || 0,
        averageProgress: summary.summary?.averageProgress || 0
      });
      
      // Показать первые 3 навыка для примера
      if (summary.summary?.skills?.length > 0) {
        console.log('Примеры навыков:');
        summary.summary.skills.slice(0, 3).forEach(skill => {
          console.log(`  - ${skill.skillName}: ${skill.progress || 0}% (${skill.currentLevel})`);
        });
      }
    }
    
    // Шаг 3: Настройка навыков для курса Python (ID 6)
    console.log('\n3. Настройка навыков для курса Python (ID 6)...');
    const courseSkillsConfig = {
      skills: [
        {
          dnaId: 5, // Python программирование
          progressGain: 30,
          bloomLevel: 'application'
        },
        {
          dnaId: 8, // Аналитическое мышление
          progressGain: 15,
          bloomLevel: 'knowledge'
        },
        {
          dnaId: 10, // Решение проблем
          progressGain: 20,
          bloomLevel: 'application'
        }
      ]
    };
    
    const configureSkillsResponse = await makeRequest('POST', '/api/course-management/configure-skills/6', courseSkillsConfig, cookies);
    console.log('Статус настройки навыков курса:', configureSkillsResponse.status);
    console.log('Ответ:', configureSkillsResponse.body);
    
    // Шаг 4: Настройка навыков для урока (предполагаем, что у нас есть урок с ID 1)
    console.log('\n4. Настройка навыков для урока...');
    
    // Получаем информацию о курсе и его уроках
    const courseInfoResponse = await makeRequest('GET', '/api/course-management/course/6', null, cookies);
    if (courseInfoResponse.status === 200) {
      const courseData = JSON.parse(courseInfoResponse.body);
      
      if (courseData.success && courseData.course?.modules?.length > 0) {
        const firstModule = courseData.course.modules[0];
        if (firstModule.lessons?.length > 0) {
          const firstLesson = firstModule.lessons[0];
          console.log(`Настройка навыков для урока "${firstLesson.title}" (ID: ${firstLesson.id})`);
          
          const lessonSkillsConfig = {
            skills: [
              {
                dnaId: 5, // Python программирование
                progressGain: 5, // 5% за завершение урока
                bloomLevel: 'awareness'
              },
              {
                dnaId: 8, // Аналитическое мышление
                progressGain: 3, // 3% за теоретический урок
                bloomLevel: 'awareness'
              }
            ]
          };
          
          const configureLessonResponse = await makeRequest('POST', `/api/course-management/configure-lesson-skills/${firstLesson.id}`, lessonSkillsConfig, cookies);
          console.log('Статус настройки навыков урока:', configureLessonResponse.status);
          console.log('Ответ:', configureLessonResponse.body);
          
          // Шаг 5: Тестирование завершения урока с обновлением Skills DNA
          console.log('\n5. Тестирование завершения урока с обновлением Skills DNA...');
          const completeLessonResponse = await makeRequest('POST', `/api/course-management/complete-lesson/${firstLesson.id}`, {}, cookies);
          console.log('Статус завершения урока:', completeLessonResponse.status);
          console.log('Ответ:', completeLessonResponse.body);
          
          if (completeLessonResponse.status === 200) {
            const result = JSON.parse(completeLessonResponse.body);
            if (result.skillsUpdated) {
              console.log('✅ Skills DNA был обновлен!');
            } else {
              console.log('ℹ️  Skills DNA не был обновлен (возможно, урок не настроен)');
            }
          }
        }
      }
    }
    
    // Шаг 6: Проверка обновленного состояния Skills DNA
    console.log('\n6. Проверка обновленного состояния Skills DNA...');
    const skillsSummaryAfter = await makeRequest('GET', '/api/course-management/skills-summary', null, cookies);
    
    if (skillsSummaryAfter.status === 200) {
      const summaryAfter = JSON.parse(skillsSummaryAfter.body);
      console.log('Обновленные навыки:', {
        totalSkills: summaryAfter.summary?.totalSkills || 0,
        averageProgress: summaryAfter.summary?.averageProgress || 0
      });
      
      // Показать Python и связанные навыки
      if (summaryAfter.summary?.skills?.length > 0) {
        console.log('Ключевые навыки после обучения:');
        summaryAfter.summary.skills
          .filter(skill => ['Python', 'Аналитическое', 'Решение'].some(keyword => 
            skill.skillName.includes(keyword)))
          .forEach(skill => {
            console.log(`  - ${skill.skillName}: ${skill.progress || 0}% (${skill.currentLevel})`);
          });
      }
    }
    
    // Шаг 7: Тестирование завершения курса
    console.log('\n7. Тестирование завершения курса...');
    const completeCourseResponse = await makeRequest('POST', '/api/course-management/complete-course/6', {}, cookies);
    console.log('Статус завершения курса:', completeCourseResponse.status);
    
    if (completeCourseResponse.status === 404) {
      console.log('ℹ️  Эндпоинт завершения курса еще не реализован');
    } else {
      console.log('Ответ:', completeCourseResponse.body);
    }
    
    console.log('\n=== Тест интеграции Skills DNA завершен ===');
    
  } catch (error) {
    console.error('Ошибка во время тестирования:', error);
  }
}

// Запуск теста
testSkillsDnaIntegration();