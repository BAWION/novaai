import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Glassmorphism } from './ui/glassmorphism';

interface LightningLabData {
  projectType: string;
  dataSource: string;
  targetUsers: string;
  businessImpact: string;
  answers: Record<string, boolean>;
}

interface RiskAssessment {
  category: string;
  score: number;
  issues: string[];
  recommendations: string[];
}

export const LightningEthicsLab: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<LightningLabData>({
    projectType: '',
    dataSource: '',
    targetUsers: '',
    businessImpact: '',
    answers: {}
  });
  const [assessment, setAssessment] = useState<RiskAssessment[]>([]);
  const [overallScore, setOverallScore] = useState(0);

  const questions = [
    {
      category: "Предвзятость данных",
      items: [
        "Представлены ли все демографические группы в ваших данных?",
        "Проводили ли вы проверку на исторические предвзятости?",
        "Тестировали ли модель на справедливость к разным группам?"
      ]
    },
    {
      category: "Прозрачность",
      items: [
        "Можете ли вы объяснить решения модели пользователям?",
        "Доступна ли документация об алгоритме?",
        "Есть ли механизм обжалования решений?"
      ]
    },
    {
      category: "Конфиденциальность",
      items: [
        "Соблюдается ли GDPR/152-ФЗ при обработке данных?",
        "Минимизирован ли сбор персональных данных?",
        "Получено ли согласие пользователей на обработку?"
      ]
    },
    {
      category: "Надежность",
      items: [
        "Тестировалась ли модель на крайних случаях?",
        "Есть ли система мониторинга качества?",
        "Предусмотрен ли план отката при сбоях?"
      ]
    }
  ];

  const calculateAssessment = () => {
    const results: RiskAssessment[] = [];
    let totalScore = 0;

    questions.forEach((questionGroup, groupIndex) => {
      const categoryAnswers = questionGroup.items.map((_, index) => 
        formData.answers[`${groupIndex}-${index}`] || false
      );
      
      const positiveAnswers = categoryAnswers.filter(Boolean).length;
      const score = (positiveAnswers / questionGroup.items.length) * 10;
      totalScore += score;

      const issues: string[] = [];
      const recommendations: string[] = [];

      if (score < 7) {
        switch (questionGroup.category) {
          case "Предвзятость данных":
            issues.push("Высокий риск дискриминации");
            recommendations.push("Проведите аудит данных на справедливость");
            break;
          case "Прозрачность":
            issues.push("Низкая объяснимость решений");
            recommendations.push("Внедрите инструменты интерпретации (LIME/SHAP)");
            break;
          case "Конфиденциальность":
            issues.push("Нарушение требований приватности");
            recommendations.push("Консультация с юристом по GDPR");
            break;
          case "Надежность":
            issues.push("Недостаточное тестирование");
            recommendations.push("Расширьте покрытие тестами");
            break;
        }
      }

      results.push({
        category: questionGroup.category,
        score,
        issues,
        recommendations
      });
    });

    setAssessment(results);
    setOverallScore(totalScore / 4);
    setStep(4);
  };

  const generateReport = () => {
    const reportData = {
      project: formData,
      assessment,
      overallScore,
      riskLevel: overallScore >= 8 ? "Низкий" : overallScore >= 6 ? "Средний" : "Высокий",
      timestamp: new Date().toLocaleString('ru-RU')
    };

    // Создание PDF-подобного отчета
    const reportContent = `
ОТЧЁТ ОБ ЭТИЧНОСТИ ИИ-ПРОЕКТА
Сгенерировано: ${reportData.timestamp}
Платформа: Galaxion AI Ethics Lab

ПРОЕКТ: ${formData.projectType}
Источник данных: ${formData.dataSource}
Целевые пользователи: ${formData.targetUsers}
Бизнес-влияние: ${formData.businessImpact}

ОБЩАЯ ОЦЕНКА: ${overallScore.toFixed(1)}/10
УРОВЕНЬ РИСКА: ${reportData.riskLevel}

ДЕТАЛЬНАЯ ОЦЕНКА:
${assessment.map(cat => 
  `${cat.category}: ${cat.score.toFixed(1)}/10
  ${cat.issues.length > 0 ? `Проблемы: ${cat.issues.join(', ')}` : 'Проблем не выявлено'}
  ${cat.recommendations.length > 0 ? `Рекомендации: ${cat.recommendations.join(', ')}` : ''}
`).join('\n')}

СЛЕДУЮЩИЕ ШАГИ:
1. Реализуйте приоритетные рекомендации
2. Проведите повторную оценку через месяц  
3. Рассмотрите полный курс "Этика и безопасность ИИ"

© Galaxion - AI Education Platform
    `;

    // Создание blob и скачивание
    const blob = new Blob([reportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ethics-report-${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
          ⚡ Lightning Ethics Lab
        </h1>
        <p className="text-lg text-white/70 mt-2">
          20 минут → готовый отчёт об этичности вашего ИИ-проекта
        </p>
        <div className="flex justify-center mt-4">
          <div className="flex space-x-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className={`w-3 h-3 rounded-full ${
                  num <= step ? 'bg-yellow-400' : 'bg-white/20'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <Glassmorphism className="p-8">
        {step === 1 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold mb-6">Шаг 1: Опишите ваш проект (3 мин)</h2>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">Тип ИИ-проекта</label>
                <select
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
                  value={formData.projectType}
                  onChange={(e) => setFormData({...formData, projectType: e.target.value})}
                >
                  <option value="">Выберите тип</option>
                  <option value="ML модель">ML модель</option>
                  <option value="Чат-бот">Чат-бот</option>
                  <option value="Рекомендательная система">Рекомендательная система</option>
                  <option value="Компьютерное зрение">Компьютерное зрение</option>
                  <option value="NLP">Обработка языка (NLP)</option>
                  <option value="Другое">Другое</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Источник данных</label>
                <select
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
                  value={formData.dataSource}
                  onChange={(e) => setFormData({...formData, dataSource: e.target.value})}
                >
                  <option value="">Выберите источник</option>
                  <option value="Клиентские данные">Клиентские данные</option>
                  <option value="Публичные данные">Публичные данные</option>
                  <option value="Внутренние данные">Внутренние данные компании</option>
                  <option value="Социальные сети">Социальные сети</option>
                  <option value="Датчики IoT">Датчики IoT</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Целевые пользователи</label>
                <select
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
                  value={formData.targetUsers}
                  onChange={(e) => setFormData({...formData, targetUsers: e.target.value})}
                >
                  <option value="">Выберите пользователей</option>
                  <option value="Сотрудники">Сотрудники</option>
                  <option value="Клиенты">Клиенты</option>
                  <option value="Партнеры">Партнеры</option>
                  <option value="Общественность">Широкая общественность</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Бизнес-влияние</label>
                <select
                  className="w-full p-3 rounded-lg bg-white/10 border border-white/20"
                  value={formData.businessImpact}
                  onChange={(e) => setFormData({...formData, businessImpact: e.target.value})}
                >
                  <option value="">Выберите уровень</option>
                  <option value="Высокий">Высокий (критически важно)</option>
                  <option value="Средний">Средний (важно)</option>
                  <option value="Низкий">Низкий (экспериментальное)</option>
                </select>
              </div>

              <button
                onClick={() => setStep(2)}
                disabled={!formData.projectType || !formData.dataSource || !formData.targetUsers || !formData.businessImpact}
                className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Перейти к оценке рисков →
              </button>
            </div>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h2 className="text-xl font-semibold mb-6">Шаг 2: Оценка рисков (5 мин)</h2>
            
            <div className="space-y-8">
              {questions.map((questionGroup, groupIndex) => (
                <div key={groupIndex} className="p-4 rounded-lg bg-white/5">
                  <h3 className="text-lg font-medium mb-4 text-yellow-400">
                    {questionGroup.category}
                  </h3>
                  <div className="space-y-3">
                    {questionGroup.items.map((question, questionIndex) => (
                      <label key={questionIndex} className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.answers[`${groupIndex}-${questionIndex}`] || false}
                          onChange={(e) => setFormData({
                            ...formData,
                            answers: {
                              ...formData.answers,
                              [`${groupIndex}-${questionIndex}`]: e.target.checked
                            }
                          })}
                          className="w-5 h-5 rounded border-white/20"
                        />
                        <span className="text-sm">{question}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}

              <div className="flex space-x-4">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 bg-white/10 text-white py-3 rounded-lg"
                >
                  ← Назад
                </button>
                <button
                  onClick={calculateAssessment}
                  className="flex-1 bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-semibold py-3 rounded-lg"
                >
                  Получить отчёт →
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-xl font-semibold mb-6">🎯 Ваш отчёт готов!</h2>
            
            <div className="space-y-6">
              <div className="text-center p-6 rounded-lg bg-gradient-to-r from-yellow-400/20 to-orange-500/20">
                <div className="text-4xl font-bold text-yellow-400 mb-2">
                  {overallScore.toFixed(1)}/10
                </div>
                <div className="text-lg">
                  Уровень риска: <span className={`font-semibold ${
                    overallScore >= 8 ? 'text-green-400' : 
                    overallScore >= 6 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {overallScore >= 8 ? "Низкий" : overallScore >= 6 ? "Средний" : "Высокий"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {assessment.map((category, index) => (
                  <div key={index} className="p-4 rounded-lg bg-white/5">
                    <h3 className="font-medium text-yellow-400 mb-2">{category.category}</h3>
                    <div className="text-2xl font-bold mb-2">{category.score.toFixed(1)}/10</div>
                    {category.issues.length > 0 && (
                      <div className="text-sm text-red-400 mb-2">
                        ⚠️ {category.issues.join(', ')}
                      </div>
                    )}
                    {category.recommendations.length > 0 && (
                      <div className="text-sm text-green-400">
                        💡 {category.recommendations.join(', ')}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={generateReport}
                  className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 text-white font-semibold py-3 rounded-lg"
                >
                  📄 Скачать PDF-отчёт
                </button>
                <button
                  onClick={() => {
                    setStep(1);
                    setFormData({
                      projectType: '',
                      dataSource: '',
                      targetUsers: '',
                      businessImpact: '',
                      answers: {}
                    });
                    setAssessment([]);
                  }}
                  className="flex-1 bg-white/10 text-white py-3 rounded-lg"
                >
                  🔄 Новая оценка
                </button>
              </div>

              <div className="p-4 rounded-lg bg-blue-500/20 border border-blue-500/30">
                <h3 className="font-medium mb-2">🚀 Хотите углубиться?</h3>
                <p className="text-sm text-white/70 mb-3">
                  Этот экспресс-анализ дал общее представление. Для детального изучения каждой проблемы 
                  рекомендуем полный курс "Этика и безопасность ИИ".
                </p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
                  Перейти к полному курсу →
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </Glassmorphism>
    </div>
  );
};