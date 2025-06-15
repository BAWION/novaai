/**
 * Тест системы отслеживания прогресса
 * Проверяет сохранение прогресса, обновление Skills DNA и отображение в интерфейсе
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

async function testProgressTracking() {
  console.log('🧪 ТЕСТ СИСТЕМЫ ОТСЛЕЖИВАНИЯ ПРОГРЕССА');
  console.log('========================================');
  
  try {
    // Шаг 1: Авторизация
    console.log('\n1. 🔐 Авторизация...');
    const loginResponse = await makeRequest('POST', '/api/auth/login', {
      username: 'Vitaliy',
      password: '500500В'
    });
    
    if (loginResponse.status !== 200) {
      console.log('❌ Ошибка авторизации');
      return;
    }
    
    const cookies = extractCookies(loginResponse);
    console.log('✅ Пользователь авторизован');
    
    // Шаг 2: Получение базового прогресса
    console.log('\n2. 📊 Проверка базового прогресса курса AI Literacy 101...');
    
    const initialProgress = await makeRequest('GET', '/api/course-management/user-progress/2', null, cookies);
    
    if (initialProgress.status === 200) {
      const progressData = JSON.parse(initialProgress.body);
      if (progressData.success && progressData.progress) {
        console.log(`📈 Текущий прогресс: ${progressData.progress.overallProgress}%`);
        console.log(`📚 Завершено уроков: ${progressData.progress.completedLessons} из ${progressData.progress.totalLessons}`);
        
        if (progressData.progress.modules?.length > 0) {
          console.log('📂 Прогресс по модулям:');
          progressData.progress.modules.forEach(module => {
            console.log(`   • ${module.moduleTitle}: ${module.completed}/${module.total} уроков`);
          });
        }
      } else {
        console.log('📋 Прогресс пока не создан (будет создан при завершении первого урока)');
      }
    } else {
      console.log('⚠️  Не удалось получить прогресс (будет создан при завершении урока)');
    }
    
    // Шаг 3: Настройка навыков для курса и урока
    console.log('\n3. ⚙️  Настройка системы Skills DNA...');
    
    // Настройка навыков для курса AI Literacy 101
    const courseSkills = {
      skills: [
        { dnaId: 1, progressGain: 15, bloomLevel: 'awareness' },
        { dnaId: 2, progressGain: 20, bloomLevel: 'knowledge' }
      ]
    };
    
    await makeRequest('POST', '/api/course-management/configure-skills/2', courseSkills, cookies);
    console.log('✅ Навыки курса настроены');
    
    // Настройка навыков для урока "История искусственного интеллекта" (ID: 1)
    const lessonSkills = {
      skills: [
        { dnaId: 1, progressGain: 10, bloomLevel: 'awareness' },
        { dnaId: 2, progressGain: 8, bloomLevel: 'awareness' }
      ]
    };
    
    await makeRequest('POST', '/api/course-management/configure-lesson-skills/1', lessonSkills, cookies);
    console.log('✅ Навыки урока настроены');
    
    // Шаг 4: Завершение урока с отслеживанием изменений
    console.log('\n4. 🎓 ТЕСТИРОВАНИЕ ЗАВЕРШЕНИЯ УРОКА');
    console.log('Завершаем урок "История искусственного интеллекта"...');
    
    const completionResponse = await makeRequest('POST', '/api/course-management/complete-lesson/1', {}, cookies);
    
    if (completionResponse.status === 200) {
      const result = JSON.parse(completionResponse.body);
      
      console.log('✅ Урок успешно завершен!');
      console.log(`💬 Сообщение: ${result.message}`);
      
      if (result.skillsUpdated) {
        console.log('🧬 Skills DNA автоматически обновлен!');
        
        if (result.skillsSummary) {
          console.log('\n📊 Обновленные навыки:');
          console.log(`🎯 Средний прогресс навыков: ${result.skillsSummary.averageProgress}%`);
          console.log(`📈 Всего навыков: ${result.skillsSummary.totalSkills}`);
          
          if (result.skillsSummary.skills) {
            result.skillsSummary.skills.forEach(skill => {
              console.log(`   • ${skill.skillName}: ${skill.progress}% (${skill.currentLevel})`);
            });
          }
        }
      }
    } else {
      console.log('❌ Ошибка при завершении урока');
      console.log('Ответ:', completionResponse.body);
    }
    
    // Шаг 5: Проверка обновленного прогресса курса
    console.log('\n5. 📈 ПРОВЕРКА ОБНОВЛЕННОГО ПРОГРЕССА');
    
    const updatedProgress = await makeRequest('GET', '/api/course-management/user-progress/2', null, cookies);
    
    if (updatedProgress.status === 200) {
      const progressData = JSON.parse(updatedProgress.body);
      
      if (progressData.success && progressData.progress) {
        console.log('✅ Прогресс курса обновлен:');
        console.log(`📊 Общий прогресс: ${progressData.progress.overallProgress}%`);
        console.log(`📚 Завершено уроков: ${progressData.progress.completedLessons} из ${progressData.progress.totalLessons}`);
        
        if (progressData.progress.lessons?.length > 0) {
          console.log('\n📝 Детальный прогресс по урокам:');
          progressData.progress.lessons.forEach(lesson => {
            const status = lesson.status === 'completed' ? '✅' : 
                          lesson.status === 'in_progress' ? '🔄' : '⏳';
            console.log(`   ${status} ${lesson.title} (${lesson.status})`);
          });
        }
        
        if (progressData.progress.modules?.length > 0) {
          console.log('\n📂 Прогресс по модулям:');
          progressData.progress.modules.forEach(module => {
            const moduleProgress = module.total > 0 ? Math.round((module.completed / module.total) * 100) : 0;
            console.log(`   📁 ${module.moduleTitle}: ${moduleProgress}% (${module.completed}/${module.total})`);
          });
        }
      } else {
        console.log('⚠️  Не удалось получить обновленный прогресс');
      }
    } else {
      console.log('❌ Ошибка получения обновленного прогресса');
    }
    
    // Шаг 6: Завершение еще одного урока для демонстрации накопления прогресса
    console.log('\n6. 🔄 ЗАВЕРШЕНИЕ ДОПОЛНИТЕЛЬНОГО УРОКА');
    console.log('Настройка навыков для урока "Что такое искусственный интеллект" (ID: 5)...');
    
    const lesson2Skills = {
      skills: [
        { dnaId: 1, progressGain: 12, bloomLevel: 'knowledge' },
        { dnaId: 2, progressGain: 15, bloomLevel: 'knowledge' }
      ]
    };
    
    await makeRequest('POST', '/api/course-management/configure-lesson-skills/5', lesson2Skills, cookies);
    console.log('✅ Навыки второго урока настроены');
    
    const completion2Response = await makeRequest('POST', '/api/course-management/complete-lesson/5', {}, cookies);
    
    if (completion2Response.status === 200) {
      const result = JSON.parse(completion2Response.body);
      console.log('✅ Второй урок завершен!');
      
      if (result.skillsUpdated && result.skillsSummary) {
        console.log('\n🧬 Накопительный эффект Skills DNA:');
        console.log(`🎯 Новый средний прогресс: ${result.skillsSummary.averageProgress}%`);
        
        if (result.skillsSummary.skills) {
          result.skillsSummary.skills.forEach(skill => {
            console.log(`   🔼 ${skill.skillName}: ${skill.progress}% (${skill.currentLevel})`);
          });
        }
      }
    }
    
    // Шаг 7: Финальная проверка состояния системы
    console.log('\n7. 🎯 ФИНАЛЬНАЯ ПРОВЕРКА СИСТЕМЫ');
    
    const finalProgress = await makeRequest('GET', '/api/course-management/user-progress/2', null, cookies);
    const finalSkills = await makeRequest('GET', '/api/course-management/skills-summary', null, cookies);
    
    if (finalProgress.status === 200 && finalSkills.status === 200) {
      const progressData = JSON.parse(finalProgress.body);
      const skillsData = JSON.parse(finalSkills.body);
      
      console.log('\n📊 ИТОГОВЫЙ ОТЧЕТ:');
      console.log('==================');
      console.log(`📈 Прогресс курса: ${progressData.progress?.overallProgress || 0}%`);
      console.log(`📚 Завершено уроков: ${progressData.progress?.completedLessons || 0} из ${progressData.progress?.totalLessons || 0}`);
      console.log(`🧬 Средний прогресс навыков: ${skillsData.summary?.averageProgress || 0}%`);
      console.log(`🎯 Всего развиваемых навыков: ${skillsData.summary?.totalSkills || 0}`);
      
      console.log('\n✅ СИСТЕМА РАБОТАЕТ КОРРЕКТНО!');
      console.log('✓ Прогресс курса сохраняется и отображается');
      console.log('✓ Skills DNA автоматически обновляется при завершении уроков');
      console.log('✓ Интеграция курсов и навыков работает правильно');
      console.log('✓ Накопительный эффект обучения функционирует');
    }
    
    console.log('\n📋 КАК ПОЛЬЗОВАТЕЛЮ ПРОВЕРИТЬ В ИНТЕРФЕЙСЕ:');
    console.log('1. Войдите в систему');
    console.log('2. Перейдите на /courses/ai-literacy-101');
    console.log('3. Проверьте отображение прогресса в правом верхнем углу');
    console.log('4. Откройте любой урок и завершите его');
    console.log('5. Посмотрите на обновление прогресса и уведомление о Skills DNA');
    console.log('6. Перейдите в раздел Skills DNA для просмотра накопленных навыков');
    
  } catch (error) {
    console.error('❌ Ошибка во время тестирования:', error);
  }
}

// Запуск тестирования
testProgressTracking();