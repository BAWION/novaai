/// <reference types="cypress" />

/**
 * Тест полного потока диагностики навыков
 * 
 * Проверяет:
 * 1. Быструю диагностику навыков (без авторизации)
 * 2. Авторизацию после диагностики
 * 3. Успешный показ результатов диагностики в профиле Skills DNA
 * 4. Корректное сохранение/восстановление данных через локальный кэш
 */

describe('Полный поток диагностики навыков', () => {
  const testUser = {
    username: 'test-user@example.com',
    password: 'password123',
    displayName: 'Тестовый Пользователь'
  };

  beforeEach(() => {
    // Сбрасываем состояние приложения
    cy.clearLocalStorage();
    cy.clearCookies();
  });

  it('Должен успешно пройти диагностику, авторизоваться и увидеть результаты в Skills DNA', () => {
    // 1. Посещаем главную страницу и переходим к быстрой диагностике
    cy.visit('/');
    cy.contains('Пройти диагностику').click();
    
    // Запоминаем URL для проверки редиректа
    cy.url().should('include', '/quick-diagnosis');
    
    // 2. Заполняем форму диагностики
    // Шаг 1: Выбор специализации
    cy.contains('Машинное обучение').click();
    cy.contains('Далее').click();
    
    // Шаг 2: Уровень опыта
    cy.contains('Средний уровень').click();
    cy.contains('Далее').click();
    
    // Шаг 3: Цели и языки
    cy.contains('Развитие карьеры').click();
    cy.get('input[type="checkbox"]').first().check(); // Выбираем Python
    cy.contains('Завершить').click();
    
    // 3. Ожидаем завершения анализа
    cy.contains('Анализ ваших интересов', { timeout: 10000 });
    cy.contains('Анализ вашего опыта', { timeout: 10000 });
    cy.contains('Анализ ваших целей', { timeout: 10000 });
    cy.contains('Формирование рекомендаций', { timeout: 10000 });
    cy.contains('Анализ завершен', { timeout: 15000 });
    
    // 4. Проверяем, что данные сохранены в localStorage
    cy.window().then((win) => {
      const cache = win.localStorage.getItem('skillsDnaCachedResults');
      expect(cache).to.not.be.null;
      
      // Проверяем структуру кэшированных данных
      const cacheData = JSON.parse(cache);
      expect(cacheData).to.have.property('results');
      expect(cacheData.results).to.have.property('skills');
      expect(cacheData.results).to.have.property('diagnosticType', 'quick');
      
      cy.log('Кэш диагностики успешно создан в localStorage');
    });
    
    // 5. Переходим к авторизации
    cy.contains('Требуется авторизация', { timeout: 10000 });
    cy.url().should('include', '/auth');
    
    // 6. Создаем новый аккаунт
    cy.contains('Регистрация').click();
    cy.get('input[name="username"]').type(testUser.username);
    cy.get('input[name="password"]').type(testUser.password);
    cy.get('input[name="displayName"]').type(testUser.displayName);
    cy.contains('button', 'Зарегистрироваться').click();
    
    // 7. Ожидаем редирект на страницу дашборда
    cy.url().should('include', '/dashboard', { timeout: 15000 });
    
    // 8. Проверяем, что кэш очищен после успешного сохранения
    cy.window().then((win) => {
      const cache = win.localStorage.getItem('skillsDnaCachedResults');
      expect(cache).to.be.null;
      cy.log('Кэш диагностики успешно очищен после сохранения результатов');
    });
    
    // 9. Проверяем, что Skills DNA показывает результаты диагностики
    cy.contains('Skills DNA', { timeout: 10000 }).click();
    cy.contains('Ваши навыки', { timeout: 10000 });
    
    // Проверяем, что данные отображаются в интерфейсе
    cy.get('[data-test="skills-radar"]').should('be.visible');
    cy.get('[data-test="skills-list"]').should('contain', 'Машинное обучение');
    
    // 10. Проверяем наличие рекомендаций на основе Skills DNA
    cy.visit('/dashboard');
    cy.contains('Рекомендуемые курсы', { timeout: 10000 });
    cy.get('[data-test="course-card"]').should('have.length.at.least', 1);
  });

  it('Должен восстановить результаты при перезагрузке страницы во время диагностики', () => {
    // 1. Начинаем диагностику
    cy.visit('/quick-diagnosis');
    
    // 2. Заполняем первые два шага
    // Шаг 1: Выбор специализации
    cy.contains('Машинное обучение').click();
    cy.contains('Далее').click();
    
    // Шаг 2: Уровень опыта
    cy.contains('Средний уровень').click();
    
    // 3. Имитируем перезагрузку страницы
    cy.reload();
    
    // 4. Проверяем, что прогресс восстановлен
    cy.contains('Выберите интересующую вас специализацию');
    cy.get('input[type="radio"]').should('have.length.at.least', 3);
    
    // Специализация должна быть уже выбрана
    cy.contains('Машинное обучение').parent().find('input[type="radio"]').should('be.checked');
  });

  it('Должен кэшировать и восстанавливать данные диагностики при прерванной сессии', () => {
    // 1. Посещаем страницу диагностики и заполняем форму
    cy.visit('/quick-diagnosis');
    
    // Выбор специализации
    cy.contains('Машинное обучение').click();
    cy.contains('Далее').click();
    
    // Уровень опыта
    cy.contains('Средний уровень').click();
    cy.contains('Далее').click();
    
    // Цели и языки
    cy.contains('Развитие карьеры').click();
    cy.get('input[type="checkbox"]').first().check();
    cy.contains('Завершить').click();
    
    // 2. Дожидаемся завершения анализа и проверяем наличие кэша
    cy.contains('Анализ завершен', { timeout: 15000 });
    cy.window().then((win) => {
      const cache = win.localStorage.getItem('skillsDnaCachedResults');
      expect(cache).to.not.be.null;
    });
    
    // 3. Имитируем прерванную сессию, закрывая браузер (очищаем сессию)
    cy.clearCookies();
    
    // 4. Авторизуемся
    cy.visit('/auth');
    cy.contains('Вход').click();
    cy.get('input[name="username"]').type(testUser.username);
    cy.get('input[name="password"]').type(testUser.password);
    cy.contains('button', 'Войти').click();
    
    // 5. Проверяем, что результаты восстановились из кэша
    cy.url().should('include', '/dashboard', { timeout: 15000 });
    cy.contains('Результаты диагностики восстановлены', { timeout: 10000 });
    
    // 6. Проверяем, что кэш очищен после успешного восстановления
    cy.window().then((win) => {
      const cache = win.localStorage.getItem('skillsDnaCachedResults');
      expect(cache).to.be.null;
    });
    
    // 7. Проверяем наличие данных в Skills DNA
    cy.contains('Skills DNA').click();
    cy.get('[data-test="skills-radar"]').should('be.visible');
  });
});