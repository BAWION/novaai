import { useApp } from "@/context/app-context";

export function AppIntegrationTest() {
  const { 
    auth, 
    courses, 
    learning, 
    skills, 
    isAppLoading, 
    appError 
  } = useApp();
  
  // Если приложение загружается, показываем индикатор загрузки
  if (isAppLoading) {
    return (
      <div className="p-4 rounded-lg bg-background/50 backdrop-blur-lg border border-border shadow-lg">
        <h2 className="text-lg font-semibold text-primary mb-2">Загрузка данных...</h2>
        <div className="w-8 h-8 rounded-full border-2 border-primary/30 border-t-primary animate-spin mx-auto"></div>
      </div>
    );
  }
  
  // Если есть ошибка, показываем ее
  if (appError) {
    return (
      <div className="p-4 rounded-lg bg-destructive/10 backdrop-blur-lg border border-destructive shadow-lg">
        <h2 className="text-lg font-semibold text-destructive mb-2">Ошибка</h2>
        <p className="text-sm text-muted-foreground">{appError.message}</p>
      </div>
    );
  }
  
  return (
    <div className="space-y-6 p-4 rounded-lg bg-background/50 backdrop-blur-lg border border-border shadow-lg">
      <h2 className="text-xl font-bold text-primary">Статус интеграции приложения</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Статус аутентификации */}
        <div className="p-3 rounded-md bg-background/70 border border-border">
          <h3 className="font-medium mb-2">Аутентификация</h3>
          <div className="flex items-center mb-1">
            <span className="text-xs text-muted-foreground mr-2">Статус:</span>
            {auth.isAuthenticated ? (
              <span className="text-xs px-2 py-0.5 rounded bg-green-500/20 text-green-500">Авторизован</span>
            ) : (
              <span className="text-xs px-2 py-0.5 rounded bg-orange-500/20 text-orange-500">Гость</span>
            )}
          </div>
          {auth.user && (
            <div className="text-xs text-muted-foreground mt-1">
              Пользователь: {auth.user.username || 'Неизвестно'}
            </div>
          )}
        </div>
        
        {/* Статус курсов */}
        <div className="p-3 rounded-md bg-background/70 border border-border">
          <h3 className="font-medium mb-2">Курсы</h3>
          <div className="flex items-center mb-1">
            <span className="text-xs text-muted-foreground mr-2">Загружено курсов:</span>
            <span className="text-xs font-medium">{courses.allCourses.length}</span>
          </div>
          {auth.isAuthenticated && (
            <>
              <div className="flex items-center mb-1">
                <span className="text-xs text-muted-foreground mr-2">Курсы пользователя:</span>
                <span className="text-xs font-medium">{courses.userCourses.length}</span>
              </div>
              <div className="flex items-center">
                <span className="text-xs text-muted-foreground mr-2">Рекомендации:</span>
                <span className="text-xs font-medium">{courses.recommended.length}</span>
              </div>
            </>
          )}
        </div>
        
        {/* Статус обучения */}
        {auth.isAuthenticated && (
          <div className="p-3 rounded-md bg-background/70 border border-border">
            <h3 className="font-medium mb-2">Прогресс обучения</h3>
            <div className="flex items-center mb-1">
              <span className="text-xs text-muted-foreground mr-2">Пройдено уроков:</span>
              <span className="text-xs font-medium">{learning.completedLessons.length}</span>
            </div>
            {learning.lastAccessed && (
              <div className="text-xs text-muted-foreground">
                Последний доступ: {learning.lastAccessed.title || 'Неизвестно'}
              </div>
            )}
          </div>
        )}
        
        {/* Статус навыков */}
        {auth.isAuthenticated && (
          <div className="p-3 rounded-md bg-background/70 border border-border">
            <h3 className="font-medium mb-2">Навыки</h3>
            <div className="flex items-center mb-1">
              <span className="text-xs text-muted-foreground mr-2">Количество навыков:</span>
              <span className="text-xs font-medium">{skills.userSkills.length}</span>
            </div>
            {skills.assessmentResults && (
              <div className="text-xs text-muted-foreground">
                Дата диагностики: {skills.assessmentResults.date || 'Неизвестно'}
              </div>
            )}
          </div>
        )}
      </div>
      
      <div className="text-xs text-center text-muted-foreground italic">
        Интеграция приложения работает через единую точку входа: AppContext
      </div>
    </div>
  );
}
