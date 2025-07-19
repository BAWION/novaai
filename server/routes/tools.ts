import express from 'express';
import { z } from 'zod';
import OpenAI from 'openai';

const router = express.Router();

// Инициализация OpenAI клиента
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// Схема для валидации запросов к инструментам
const toolRunSchema = z.object({
  toolId: z.string(),
  inputData: z.record(z.any())
});

// Симуляция анализа рисков
async function runRiskCalculator(inputData: any) {
  const { projectDomain, dataTypes, aiType, stakeholders, riskFactors } = inputData;
  
  // Симуляция задержки обработки
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Простая логика оценки рисков
  let riskScore = 0;
  const risks: Array<{category: string, level: string, score: number, description: string}> = [];
  
  // Анализ типов данных
  if (dataTypes?.includes('personal')) riskScore += 20;
  if (dataTypes?.includes('financial')) riskScore += 25;
  if (dataTypes?.includes('health')) riskScore += 30;
  if (dataTypes?.includes('biometric')) riskScore += 35;
  
  // Анализ типа ИИ
  if (aiType === 'decision-making') riskScore += 25;
  if (aiType === 'generation') riskScore += 15;
  
  // Анализ факторов риска
  const riskFactorScores = {
    'Automated decision-making': 20,
    'High-stakes outcomes': 25,
    'Sensitive personal data': 30,
    'Potential for bias': 20,
    'Black-box algorithms': 15,
    'Cross-border data transfer': 10,
    'Regulatory compliance required': 15,
    'Public-facing application': 10
  };
  
  riskFactors?.forEach((factor: string) => {
    const score = riskFactorScores[factor as keyof typeof riskFactorScores] || 0;
    riskScore += score;
    
    let level = 'low';
    if (score >= 20) level = 'high';
    else if (score >= 10) level = 'medium';
    
    risks.push({
      category: factor,
      level,
      score,
      description: `Риск связанный с: ${factor}`
    });
  });
  
  // Нормализация общего счета
  const normalizedScore = Math.min(100, riskScore);
  let overallRisk = 'low';
  if (normalizedScore >= 70) overallRisk = 'high';
  else if (normalizedScore >= 40) overallRisk = 'medium';
  
  return {
    status: 'completed',
    processingTime: 2,
    results: {
      overallRiskScore: normalizedScore,
      overallRiskLevel: overallRisk,
      risks,
      recommendations: [
        'Провести дополнительную оценку bias',
        'Реализовать audit trail',
        'Добавить human-in-the-loop проверки'
      ],
      heatMapUrl: '/api/tools/risk-calculator/heatmap/12345.pdf',
      reportUrl: '/api/tools/risk-calculator/report/12345.pdf'
    },
    outputFiles: [
      { name: 'Risk Heat-Map', type: 'PDF', url: '/downloads/risk-heatmap-12345.pdf' },
      { name: 'Risk Matrix Excel', type: 'Excel', url: '/downloads/risk-matrix-12345.xlsx' },
      { name: 'Mitigation Plan', type: 'PDF', url: '/downloads/mitigation-plan-12345.pdf' }
    ]
  };
}

// Симуляция проверки соответствия GDPR
async function runComplianceChecker(inputData: any) {
  const { region, processingPurpose, dataSubjects } = inputData;
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const violations: Array<{law: string, article: string, severity: string, description: string}> = [];
  const warnings: Array<{law: string, recommendation: string}> = [];
  
  // Простая логика проверки GDPR
  if (region === 'EU' || region === 'Global') {
    if (processingPurpose?.includes('analytics') && !inputData.dataSchema?.includes('consent')) {
      violations.push({
        law: 'GDPR',
        article: 'Article 6',
        severity: 'high',
        description: 'Отсутствует правовое основание для обработки персональных данных в аналитических целях'
      });
    }
    
    if (dataSubjects?.includes('children')) {
      warnings.push({
        law: 'GDPR',
        recommendation: 'Требуется особая защита данных несовершеннолетних (Article 8)'
      });
    }
  }
  
  // Проверка 152-ФЗ для РФ
  if (region === 'RF' || region === 'Global') {
    violations.push({
      law: '152-ФЗ',
      article: 'Статья 18',
      severity: 'medium',
      description: 'Требуется локализация персональных данных граждан РФ'
    });
  }
  
  const complianceScore = Math.max(0, 100 - violations.length * 20 - warnings.length * 5);
  
  return {
    status: 'completed',
    processingTime: 3,
    results: {
      complianceScore,
      violations,
      warnings,
      recommendations: [
        'Добавить GDPR consent механизм',
        'Настроить локализацию данных для РФ',
        'Обновить Privacy Policy'
      ]
    },
    outputFiles: [
      { name: 'Compliance Report PDF', type: 'PDF', url: '/downloads/compliance-report-12345.pdf' },
      { name: 'Red Flags Excel', type: 'Excel', url: '/downloads/red-flags-12345.xlsx' },
      { name: 'Action Items List', type: 'PDF', url: '/downloads/action-items-12345.pdf' }
    ]
  };
}

// Генерация AI политики с помощью GPT
async function runTemplateGenerator(inputData: any) {
  const { company, industry, policyType, requirements } = inputData;
  
  const prompt = `Создай ${policyType} для компании "${company}" в индустрии ${industry}.
  
Дополнительные требования: ${requirements}

Структура документа должна включать:
1. Введение и цели
2. Область применения
3. Основные принципы
4. Процедуры и процессы
5. Ответственность и роли
6. Мониторинг и контроль
7. Нарушения и санкции
8. Регулярный пересмотр

Ответ должен быть на русском языке, профессиональным тоном, готовым для использования в корпоративной среде.`;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o", // используем новейшую модель GPT-4o
      messages: [
        {
          role: "system",
          content: "Ты эксперт по корпоративным политикам ИИ и privacy. Создавай практичные, юридически обоснованные документы."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      max_tokens: 2000,
      temperature: 0.7
    });

    const policyContent = response.choices[0].message.content;
    
    return {
      status: 'completed',
      processingTime: 5,
      tokensUsed: response.usage?.total_tokens || 0,
      results: {
        policyContent,
        wordCount: policyContent?.split(' ').length || 0,
        sections: [
          'Введение и цели',
          'Область применения', 
          'Основные принципы',
          'Процедуры и процессы',
          'Ответственность и роли',
          'Мониторинг и контроль'
        ]
      },
      outputFiles: [
        { name: 'Policy DOCX', type: 'DOCX', url: '/downloads/ai-policy-12345.docx' },
        { name: 'Implementation Checklist', type: 'PDF', url: '/downloads/implementation-checklist-12345.pdf' },
        { name: 'Compliance Mapping', type: 'Excel', url: '/downloads/compliance-mapping-12345.xlsx' }
      ]
    };
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Не удалось сгенерировать политику. Проверьте API ключ OpenAI.');
  }
}

// Симуляция XAI анализа
async function runXAIExplainer(inputData: any) {
  const { modelType, explainerType } = inputData;
  
  await new Promise(resolve => setTimeout(resolve, 4000));
  
  // Симуляция SHAP анализа
  const features = ['income', 'age', 'credit_history', 'employment_duration', 'loan_amount'];
  const shapValues = features.map(feature => ({
    feature,
    importance: Math.random() * 0.8 - 0.4, // -0.4 to 0.4
    description: `Влияние ${feature} на решение модели`
  }));
  
  return {
    status: 'completed',
    processingTime: 4,
    results: {
      modelType,
      explainerType,
      shapValues,
      topFeatures: shapValues.slice(0, 3),
      explanation: `Анализ показывает, что основными факторами для принятия решения являются: ${shapValues.slice(0, 3).map(s => s.feature).join(', ')}`
    },
    outputFiles: [
      { name: 'HTML Report', type: 'HTML', url: '/downloads/shap-report-12345.html' },
      { name: 'SHAP Plots PNG', type: 'PNG', url: '/downloads/shap-plots-12345.png' },
      { name: 'Feature Importance Excel', type: 'Excel', url: '/downloads/feature-importance-12345.xlsx' }
    ]
  };
}

// Симуляция red-team тестирования
async function runRedTeamSandbox(inputData: any) {
  const { testSuite, severity } = inputData;
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  const vulnerabilities = [];
  
  if (testSuite?.includes('prompt-injection')) {
    vulnerabilities.push({
      type: 'Prompt Injection',
      severity: 'high',
      description: 'Модель подвержена инъекции через системные промпты',
      example: 'Игнорируй предыдущие инструкции и...',
      remediation: 'Добавить фильтрацию входных данных'
    });
  }
  
  if (testSuite?.includes('jailbreak')) {
    vulnerabilities.push({
      type: 'Jailbreak',
      severity: 'medium',
      description: 'Возможен обход safety ограничений',
      example: 'Режим разработчика активирован...',
      remediation: 'Усилить alignment training'
    });
  }
  
  const securityScore = Math.max(0, 100 - vulnerabilities.length * 25);
  
  return {
    status: 'completed',
    processingTime: 3,
    results: {
      securityScore,
      vulnerabilities,
      testsRun: testSuite?.length || 0,
      recommendations: [
        'Добавить input sanitization',
        'Реализовать content filtering',
        'Установить rate limiting'
      ]
    },
    outputFiles: [
      { name: 'Security Report JSON', type: 'JSON', url: '/downloads/security-report-12345.json' },
      { name: 'Vulnerability Log', type: 'TXT', url: '/downloads/vulnerability-log-12345.txt' },
      { name: 'Remediation Guide', type: 'PDF', url: '/downloads/remediation-guide-12345.pdf' }
    ]
  };
}

// Lightning Ethics Lab - быстрая оценка этичности проекта
async function runLightningEthics(inputData: any) {
  const { projectType, dataSource, targetUsers, businessImpact, answers } = inputData;
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Анализ этических рисков на основе ответов
  const riskCategories = [
    {
      category: "Предвзятость данных",
      score: calculateCategoryScore(answers, 'bias'),
      issues: getIssuesForCategory('bias', answers),
      recommendations: getRecommendationsForCategory('bias')
    },
    {
      category: "Прозрачность",
      score: calculateCategoryScore(answers, 'transparency'),
      issues: getIssuesForCategory('transparency', answers),
      recommendations: getRecommendationsForCategory('transparency')
    },
    {
      category: "Конфиденциальность",
      score: calculateCategoryScore(answers, 'privacy'),
      issues: getIssuesForCategory('privacy', answers),
      recommendations: getRecommendationsForCategory('privacy')
    },
    {
      category: "Надежность",
      score: calculateCategoryScore(answers, 'reliability'),
      issues: getIssuesForCategory('reliability', answers),
      recommendations: getRecommendationsForCategory('reliability')
    }
  ];
  
  const overallScore = Math.round(riskCategories.reduce((sum, cat) => sum + cat.score, 0) / riskCategories.length);
  let readinessLevel = 'low';
  if (overallScore >= 80) readinessLevel = 'high';
  else if (overallScore >= 60) readinessLevel = 'medium';
  
  return {
    status: 'completed',
    processingTime: 3,
    results: {
      projectType,
      dataSource,
      targetUsers,
      businessImpact,
      overallScore,
      readinessLevel,
      riskCategories,
      priorityActions: riskCategories
        .filter(cat => cat.score < 60)
        .map(cat => `Улучшить ${cat.category.toLowerCase()}`)
        .slice(0, 3),
      complianceStatus: {
        gdpr: overallScore >= 70 ? 'compliant' : 'needs-work',
        ethics: overallScore >= 75 ? 'good' : 'requires-attention'
      }
    },
    outputFiles: [
      { name: 'Ethics Assessment Report', type: 'PDF', url: '/downloads/ethics-assessment-12345.pdf' },
      { name: 'Compliance Checklist', type: 'PDF', url: '/downloads/compliance-checklist-12345.pdf' },
      { name: 'Action Plan', type: 'DOCX', url: '/downloads/action-plan-12345.docx' }
    ]
  };
}

// Вспомогательные функции для Lightning Ethics
function calculateCategoryScore(answers: any, category: string): number {
  // Простая логика: каждый положительный ответ = 25 очков, максимум 100
  const categoryMap: any = {
    'bias': ['0-0', '0-1', '0-2'],
    'transparency': ['1-0', '1-1', '1-2'],
    'privacy': ['2-0', '2-1', '2-2'],
    'reliability': ['3-0', '3-1', '3-2']
  };
  
  const questionKeys = categoryMap[category] || [];
  const positiveAnswers = questionKeys.filter(key => answers?.[key] === true).length;
  return Math.round((positiveAnswers / questionKeys.length) * 100);
}

function getIssuesForCategory(category: string, answers: any): string[] {
  const issues: any = {
    'bias': ['Недостаточная проверка репрезентативности данных', 'Отсутствие тестирования на справедливость'],
    'transparency': ['Неясность в объяснении решений', 'Отсутствие механизма обжалования'],
    'privacy': ['Нарушения GDPR/152-ФЗ', 'Избыточный сбор данных'],
    'reliability': ['Недостаточное тестирование на edge cases', 'Отсутствие плана отката']
  };
  return issues[category] || [];
}

function getRecommendationsForCategory(category: string): string[] {
  const recommendations: any = {
    'bias': ['Провести аудит данных на репрезентативность', 'Внедрить fairness testing'],
    'transparency': ['Добавить XAI компоненты', 'Создать user-friendly объяснения'],
    'privacy': ['Реализовать privacy-by-design', 'Минимизировать сбор данных'],
    'reliability': ['Расширить test coverage', 'Создать monitoring dashboard']
  };
  return recommendations[category] || [];
}

// Lightning Demo - запуск всех инструментов на примерах
async function runLightningDemo(inputData: any) {
  const { projectType, useCase } = inputData;
  
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  // Демо результаты всех инструментов
  const demoResults = {
    riskCalculator: {
      overallRiskScore: 65,
      topRisks: ['High-stakes outcomes', 'Sensitive personal data', 'Potential for bias']
    },
    complianceChecker: {
      complianceScore: 75,
      violations: 2,
      warnings: 3
    },
    xaiExplainer: {
      topFeatures: ['income', 'credit_history', 'age'],
      explainabilityScore: 85
    },
    redTeamSandbox: {
      securityScore: 70,
      vulnerabilities: 3
    },
    templateGenerator: {
      sectionsGenerated: 8,
      wordCount: 2500
    }
  };
  
  return {
    status: 'completed',
    processingTime: 5,
    results: {
      projectType,
      useCase,
      summary: `Демонстрация всех инструментов на проекте типа ${projectType}`,
      demoResults,
      overallAssessment: {
        readiness: 'medium',
        score: 73,
        recommendation: 'Требуется доработка в области безопасности и bias'
      }
    },
    outputFiles: [
      { name: 'PDF Risk Summary', type: 'PDF', url: '/downloads/demo-risk-summary-12345.pdf' },
      { name: 'GDPR Quick Check', type: 'PDF', url: '/downloads/demo-gdpr-check-12345.pdf' },
      { name: 'Security Alert', type: 'JSON', url: '/downloads/demo-security-alert-12345.json' },
      { name: 'Sample Policy', type: 'DOCX', url: '/downloads/demo-sample-policy-12345.docx' }
    ]
  };
}

// Главный эндпоинт для запуска инструментов
router.post('/run', async (req, res) => {
  try {
    const { toolId, inputData } = toolRunSchema.parse(req.body);
    
    console.log(`[Tools API] Запуск инструмента: ${toolId}`);
    
    let result;
    
    switch (toolId) {
      case 'lightning-ethics':
        result = await runLightningEthics(inputData);
        break;
      case 'risk-calculator':
        result = await runRiskCalculator(inputData);
        break;
      case 'compliance-checker':
        result = await runComplianceChecker(inputData);
        break;
      case 'template-generator':
        result = await runTemplateGenerator(inputData);
        break;
      case 'xai-explainer':
        result = await runXAIExplainer(inputData);
        break;
      case 'redteam-sandbox':
        result = await runRedTeamSandbox(inputData);
        break;
      case 'lightning-demo':
        result = await runLightningDemo(inputData);
        break;
      default:
        return res.status(400).json({ error: `Неизвестный инструмент: ${toolId}` });
    }
    
    console.log(`[Tools API] Инструмент ${toolId} завершен за ${result.processingTime}s`);
    
    res.json({
      success: true,
      toolId,
      ...result
    });
    
  } catch (error) {
    console.error('[Tools API] Ошибка:', error);
    res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Внутренняя ошибка сервера',
      success: false
    });
  }
});

// Получение статуса задания (для будущего асинхронного выполнения)
router.get('/job/:jobId', async (req, res) => {
  const { jobId } = req.params;
  
  // Пока что возвращаем заглушку
  res.json({
    jobId,
    status: 'completed',
    progress: 100,
    results: 'Job completed successfully'
  });
});

// Отдельные роуты для каждого инструмента (для прямого вызова)
router.post('/lightning-ethics', async (req, res) => {
  try {
    console.log(`[Tools API] Запуск lightning-ethics напрямую`);
    const result = await runLightningEthics(req.body);
    res.json({ success: true, toolId: 'lightning-ethics', ...result });
  } catch (error) {
    console.error('[Tools API] Ошибка lightning-ethics:', error);
    res.status(500).json({ error: 'Ошибка выполнения инструмента', success: false });
  }
});

router.post('/lightning-demo', async (req, res) => {
  try {
    console.log(`[Tools API] Запуск lightning-demo напрямую`);
    const result = await runLightningDemo(req.body);
    res.json({ success: true, toolId: 'lightning-demo', ...result });
  } catch (error) {
    console.error('[Tools API] Ошибка lightning-demo:', error);
    res.status(500).json({ error: 'Ошибка выполнения инструмента', success: false });
  }
});

router.post('/risk-calculator', async (req, res) => {
  try {
    console.log(`[Tools API] Запуск risk-calculator напрямую`);
    const result = await runRiskCalculator(req.body);
    res.json({ success: true, toolId: 'risk-calculator', ...result });
  } catch (error) {
    console.error('[Tools API] Ошибка risk-calculator:', error);
    res.status(500).json({ error: 'Ошибка выполнения инструмента', success: false });
  }
});

router.post('/compliance-checker', async (req, res) => {
  try {
    console.log(`[Tools API] Запуск compliance-checker напрямую`);
    const result = await runComplianceChecker(req.body);
    res.json({ success: true, toolId: 'compliance-checker', ...result });
  } catch (error) {
    console.error('[Tools API] Ошибка compliance-checker:', error);
    res.status(500).json({ error: 'Ошибка выполнения инструмента', success: false });
  }
});

router.post('/xai-explainer', async (req, res) => {
  try {
    console.log(`[Tools API] Запуск xai-explainer напрямую`);
    const result = await runXAIExplainer(req.body);
    res.json({ success: true, toolId: 'xai-explainer', ...result });
  } catch (error) {
    console.error('[Tools API] Ошибка xai-explainer:', error);
    res.status(500).json({ error: 'Ошибка выполнения инструмента', success: false });
  }
});

router.post('/redteam-sandbox', async (req, res) => {
  try {
    console.log(`[Tools API] Запуск redteam-sandbox напрямую`);
    const result = await runRedTeamSandbox(req.body);
    res.json({ success: true, toolId: 'redteam-sandbox', ...result });
  } catch (error) {
    console.error('[Tools API] Ошибка redteam-sandbox:', error);
    res.status(500).json({ error: 'Ошибка выполнения инструмента', success: false });
  }
});

router.post('/template-generator', async (req, res) => {
  try {
    console.log(`[Tools API] Запуск template-generator напрямую`);
    const result = await runTemplateGenerator(req.body);
    res.json({ success: true, toolId: 'template-generator', ...result });
  } catch (error) {
    console.error('[Tools API] Ошибка template-generator:', error);
    res.status(500).json({ error: 'Ошибка выполнения инструмента', success: false });
  }
});

// Получение списка доступных инструментов
router.get('/list', async (req, res) => {
  const tools = [
    {
      id: 'lightning-ethics',
      name: 'Lightning Lab: Экспресс-аудит этики за 20 минут',
      description: 'Быстрая оценка этичности вашего ИИ-проекта → готовый отчёт для руководства',
      estimatedDuration: 20,
      difficulty: 1
    },
    {
      id: 'lightning-demo',
      name: 'Lightning Demo',
      description: 'Быстрая демонстрация всех инструментов',
      estimatedDuration: 5,
      difficulty: 1
    },
    {
      id: 'risk-calculator',
      name: 'Risk Calculator',
      description: 'Оценка рисков ИИ-проекта',
      estimatedDuration: 5,
      difficulty: 1
    },
    {
      id: 'compliance-checker',
      name: 'Compliance Checker',
      description: 'Проверка соответствия GDPR и 152-ФЗ',
      estimatedDuration: 10,
      difficulty: 2
    },
    {
      id: 'xai-explainer',
      name: 'XAI Explainer',
      description: 'Генерация LIME/SHAP отчетов',
      estimatedDuration: 15,
      difficulty: 2
    },
    {
      id: 'redteam-sandbox',
      name: 'Red-Team Sandbox',
      description: 'Тестирование безопасности LLM',
      estimatedDuration: 10,
      difficulty: 3
    },
    {
      id: 'template-generator',
      name: 'Template Generator',
      description: 'Генерация AI политик',
      estimatedDuration: 5,
      difficulty: 1
    }
  ];
  
  res.json({ tools });
});

export { router as toolsRouter };
export default router;