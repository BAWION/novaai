/**
 * Тест интеграции Skills DNA с курсом AI Literacy 101
 * Настраивает навыки для существующего курса и демонстрирует обновления
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

async function testAiLiteracySkillsDna() {
  console.log('🎯 ТЕСТ SKILLS DNA ДЛЯ КУРСА AI LITERACY 101');
  console.log('====================================================');
  
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
    console.log('✅ Авторизован успешно');
    
    // Шаг 2: Получаем информацию о курсе AI Literacy 101
    console.log('\n2. 📚 Поиск курса AI Literacy 101...');
    
    // Попробуем найти курс по ID 2 (согласно логам)
    const courseInfo = await makeRequest('GET', '/api/course-management/course/2', null, cookies);
    
    if (courseInfo.status === 200) {
      const courseData = JSON.parse(courseInfo.body);
      console.log(`✅ Найден курс: "${courseData.course?.title || 'AI Literacy 101'}"`);
      console.log(`📖 Модулей: ${courseData.course?.modules?.length || 0}`);
      
      if (courseData.course?.modules?.length > 0) {
        let totalLessons = 0;
        courseData.course.modules.forEach(module => {
          const lessonsCount = module.lessons?.length || 0;
          totalLessons += lessonsCount;
          console.log(`   - ${module.title}: ${lessonsCount} уроков`);
        });
        console.log(`📝 Всего уроков: ${totalLessons}`);
      }
    } else {
      console.log('⚠️  Курс не найден через новое API, попробуем старое...');
    }
    
    // Шаг 3: Текущее состояние Skills DNA
    console.log('\n3. 🧬 Текущее состояние Skills DNA...');
    const currentSkills = await makeRequest('GET', '/api/course-management/skills-summary', null, cookies);
    
    if (currentSkills.status === 200) {
      const skillsData = JSON.parse(currentSkills.body);
      console.log(`📊 Навыков: ${skillsData.summary?.totalSkills || 0}`);
      console.log(`📈 Средний прогресс: ${skillsData.summary?.averageProgress || 0}%`);
      
      if (skillsData.summary?.skills?.length > 0) {
        console.log('🎯 Ваши навыки:');
        skillsData.summary.skills.forEach(skill => {
          console.log(`   • ${skill.skillName}: ${skill.progress || 0}% (${skill.currentLevel})`);
        });
      } else {
        console.log('   Навыки пока не настроены');
      }
    }
    
    // Шаг 4: Настройка навыков для AI Literacy 101
    console.log('\n4. ⚙️  Настройка навыков для AI Literacy 101...');
    
    const aiLiteracySkills = {
      skills: [
        {
          dnaId: 1, // Критическое мышление
          progressGain: 20,
          bloomLevel: 'application'
        },
        {
          dnaId: 2, // Технологическая грамотность
          progressGain: 25,
          bloomLevel: 'knowledge'
        },
        {
          dnaId: 3, // Аналитическое мышление
          progressGain: 15,
          bloomLevel: 'application'
        }
      ]
    };
    
    const configResponse = await makeRequest('POST', '/api/course-management/configure-skills/2', aiLiteracySkills, cookies);
    
    if (configResponse.status === 200) {
      console.log('✅ Навыки для курса настроены');
      console.log(`🎛️  Настроено ${aiLiteracySkills.skills.length} навыков`);
    } else {
      console.log('⚠️  Не удалось настроить навыки курса, попробуем урок напрямую...');
    }
    
    // Шаг 5: Настройка навыков для урока "История искусственного интеллекта"
    console.log('\n5. 📖 Настройка навыков для урока...');
    
    const lessonSkills = {
      skills: [
        {
          dnaId: 1, // Критическое мышление
          progressGain: 8,
          bloomLevel: 'awareness'
        },
        {
          dnaId: 2, // Технологическая грамотность
          progressGain: 12,
          bloomLevel: 'knowledge'
        }
      ]
    };
    
    // Урок "История искусственного интеллекта" имеет ID 1
    const lessonConfigResponse = await makeRequest('POST', '/api/course-management/configure-lesson-skills/1', lessonSkills, cookies);
    
    if (lessonConfigResponse.status === 200) {
      console.log('✅ Навыки для урока "История искусственного интеллекта" настроены');
    } else {
      console.log('⚠️  Не удалось настроить навыки урока');
    }
    
    // Шаг 6: Демонстрация обновления Skills DNA
    console.log('\n6. 🎓 ТЕСТИРУЕМ ОБНОВЛЕНИЕ SKILLS DNA');
    console.log('Завершаем урок "История искусственного интеллекта"...');
    
    const completionResponse = await makeRequest('POST', '/api/course-management/complete-lesson/1', {}, cookies);
    
    if (completionResponse.status === 200) {
      const result = JSON.parse(completionResponse.body);
      
      if (result.skillsUpdated) {
        console.log('🎉 НАВЫКИ ОБНОВЛЕНЫ!');
        console.log(`💬 ${result.message}`);
        
        if (result.skillsSummary) {
          console.log('\n📊 Обновленная статистика навыков:');
          console.log(`🎯 Общий прогресс: ${result.skillsSummary.averageProgress}%`);
          console.log(`📈 Навыков развивается: ${result.skillsSummary.totalSkills}`);
          
          if (result.skillsSummary.skills) {
            console.log('\n🧬 Детали по навыкам:');
            result.skillsSummary.skills.forEach(skill => {
              console.log(`   ✨ ${skill.skillName}: ${skill.progress}% (${skill.currentLevel})`);
            });
          }
        }
      } else {
        console.log('ℹ️  Урок завершен, но навыки не были обновлены');
        console.log(`💬 ${result.message}`);
      }
    } else {
      console.log('❌ Ошибка при завершении урока');
    }
    
    // Шаг 7: Финальная проверка Skills DNA
    console.log('\n7. 🔍 Финальная проверка Skills DNA...');
    
    const finalSkills = await makeRequest('GET', '/api/course-management/skills-summary', null, cookies);
    
    if (finalSkills.status === 200) {
      const finalData = JSON.parse(finalSkills.body);
      
      console.log('\n🎯 РЕЗУЛЬТАТ ТЕСТИРОВАНИЯ:');
      console.log('================================');
      console.log(`📊 Всего навыков: ${finalData.summary?.totalSkills || 0}`);
      console.log(`📈 Средний прогресс: ${finalData.summary?.averageProgress || 0}%`);
      
      if (finalData.summary?.skills?.length > 0) {
        console.log('\n🏆 Ваши развитые навыки:');
        finalData.summary.skills
          .sort((a, b) => (b.progress || 0) - (a.progress || 0))
          .forEach((skill, index) => {
            const medal = ['🥇', '🥈', '🥉'][index] || '⭐';
            console.log(`   ${medal} ${skill.skillName}: ${skill.progress}% (${skill.currentLevel})`);
          });
      }
    }
    
    console.log('\n🎯 ТЕСТ ЗАВЕРШЕН!');
    console.log('\n📋 КАК ПРОТЕСТИРОВАТЬ САМОСТОЯТЕЛЬНО:');
    console.log('1. Войдите в систему через веб-интерфейс');
    console.log('2. Перейдите на курс AI Literacy 101');
    console.log('3. Начните проходить урок "История искусственного интеллекта"');
    console.log('4. Завершите урок - система автоматически обновит ваши навыки');
    console.log('5. Перейдите в раздел Skills DNA, чтобы увидеть обновления');
    
  } catch (error) {
    console.error('❌ Ошибка во время тестирования:', error);
  }
}

// Запуск теста
testAiLiteracySkillsDna();