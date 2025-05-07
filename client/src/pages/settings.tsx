import React, { useState } from "react";
import { DashboardLayout } from "@/components/layout/dashboard-layout";
import { motion } from "framer-motion";
import { Glassmorphism } from "@/components/ui/glassmorphism";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

export default function Settings() {
  const { logout } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");
  
  // Settings state
  const [generalSettings, setGeneralSettings] = useState({
    language: "ru",
    theme: "dark",
    emailNotifications: true,
    telegramNotifications: true,
    streakReminders: true
  });
  
  const [privacySettings, setPrivacySettings] = useState({
    showProfileStats: true,
    showCertificates: true,
    showProgress: true,
    allowDataCollection: true
  });
  
  const [accountSettings, setAccountSettings] = useState({
    email: "anna@example.com",
    newPassword: "",
    confirmPassword: "",
    currentPassword: ""
  });

  // Handler for theme toggle
  const handleThemeChange = (value: string) => {
    setGeneralSettings({ ...generalSettings, theme: value });
    // In a real app, this would update the theme in the app and possibly save to user preferences
  };

  // Handler for language change
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGeneralSettings({ ...generalSettings, language: e.target.value });
    // In a real app, this would update the language and save preferences
  };

  // Handler for notification toggles
  const handleNotificationToggle = (setting: keyof typeof generalSettings) => {
    setGeneralSettings({ 
      ...generalSettings, 
      [setting]: !generalSettings[setting as keyof typeof generalSettings]
    });
  };

  // Handler for privacy toggles
  const handlePrivacyToggle = (setting: keyof typeof privacySettings) => {
    setPrivacySettings({ 
      ...privacySettings, 
      [setting]: !privacySettings[setting as keyof typeof privacySettings]
    });
  };

  // Handler for email change
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSettings({ ...accountSettings, email: e.target.value });
  };

  // Handler for password fields
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAccountSettings({ 
      ...accountSettings, 
      [e.target.name]: e.target.value 
    });
  };

  // Handler for account save
  const handleAccountSave = () => {
    // Validate passwords match
    if (accountSettings.newPassword && accountSettings.newPassword !== accountSettings.confirmPassword) {
      toast({
        title: "Ошибка",
        description: "Пароли не совпадают",
        variant: "destructive"
      });
      return;
    }

    // Validate current password (in a real app, this would verify with backend)
    if (accountSettings.newPassword && !accountSettings.currentPassword) {
      toast({
        title: "Ошибка",
        description: "Введите текущий пароль",
        variant: "destructive"
      });
      return;
    }

    // Mock successful update
    toast({
      title: "Успех",
      description: "Настройки аккаунта обновлены",
    });

    // Reset password fields
    setAccountSettings({
      ...accountSettings,
      newPassword: "",
      confirmPassword: "",
      currentPassword: ""
    });
  };

  // Handler for settings save
  const handleSaveSettings = () => {
    toast({
      title: "Успех",
      description: "Настройки сохранены",
    });
  };

  // Handler for account deletion (with confirmation)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const handleDeleteAccount = () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }

    // In a real app, this would call an API to delete the account
    toast({
      title: "Аккаунт удален",
      description: "Ваш аккаунт был успешно удален",
    });
    
    // Logout after account deletion
    setTimeout(() => {
      logout();
      window.location.href = "/login";
    }, 2000);
  };

  // Handler for logout
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  // List of connected accounts (for OAuth section)
  const connectedAccounts = [
    { 
      name: "Telegram", 
      icon: "telegram", 
      color: "bg-[#0088cc]", 
      connected: true, 
      username: "@anna_data"
    },
    { 
      name: "GitHub", 
      icon: "github", 
      color: "bg-[#333]", 
      connected: true, 
      username: "annadata"
    },
    { 
      name: "Google", 
      icon: "google", 
      color: "bg-[#DB4437]", 
      connected: false, 
      username: null
    },
    { 
      name: "Discord", 
      icon: "discord", 
      color: "bg-[#5865F2]", 
      connected: false, 
      username: null
    }
  ];

  return (
    <DashboardLayout 
      title="Настройки" 
      subtitle="Управление аккаунтом и персонализация"
    >
      <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-8">
          <TabsTrigger value="general">Общие</TabsTrigger>
          <TabsTrigger value="privacy">Приватность</TabsTrigger>
          <TabsTrigger value="account">Аккаунт</TabsTrigger>
          <TabsTrigger value="connected">Связанные аккаунты</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Glassmorphism className="p-6 rounded-xl">
              <h3 className="font-medium mb-6">Основные настройки</h3>
              
              <div className="space-y-6">
                {/* Language selection */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between">
                  <div>
                    <h4 className="font-medium">Язык</h4>
                    <p className="text-white/60 text-sm">Выберите язык интерфейса</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    <select
                      value={generalSettings.language}
                      onChange={handleLanguageChange}
                      className="bg-space-800/50 border border-white/10 px-4 py-2 rounded-lg w-full sm:w-auto"
                    >
                      <option value="ru">Русский</option>
                      <option value="en">English</option>
                    </select>
                  </div>
                </div>
                
                {/* Theme selection */}
                <div className="border-t border-white/10 pt-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                    <div>
                      <h4 className="font-medium">Тема</h4>
                      <p className="text-white/60 text-sm">Выберите тему интерфейса</p>
                    </div>
                    <div className="mt-2 sm:mt-0">
                      <TabsList className="p-1 h-auto">
                        <TabsTrigger
                          value="dark"
                          onClick={() => handleThemeChange("dark")}
                          className={`px-4 py-1.5 text-sm ${generalSettings.theme === "dark" ? "data-[state=active]" : ""}`}
                        >
                          <i className="fas fa-moon mr-2"></i>
                          Темная
                        </TabsTrigger>
                        <TabsTrigger
                          value="light"
                          onClick={() => handleThemeChange("light")}
                          className={`px-4 py-1.5 text-sm ${generalSettings.theme === "light" ? "data-[state=active]" : ""}`}
                        >
                          <i className="fas fa-sun mr-2"></i>
                          Светлая
                        </TabsTrigger>
                      </TabsList>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Glassmorphism className={`p-4 rounded-lg ${generalSettings.theme === "dark" ? "border-2 border-[#6E3AFF]/50" : ""}`}>
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium text-sm">Темная</h5>
                        <div className="w-4 h-4 rounded-full bg-space-900"></div>
                      </div>
                      <div className="w-full h-20 bg-space-900 rounded-md overflow-hidden">
                        <div className="h-6 bg-space-800 border-b border-white/5"></div>
                        <div className="p-2">
                          <div className="w-1/2 h-2 bg-white/10 rounded"></div>
                          <div className="w-3/4 h-2 bg-white/5 rounded mt-2"></div>
                        </div>
                      </div>
                    </Glassmorphism>
                    
                    <Glassmorphism className={`p-4 rounded-lg ${generalSettings.theme === "light" ? "border-2 border-[#6E3AFF]/50" : ""}`}>
                      <div className="flex justify-between items-center mb-3">
                        <h5 className="font-medium text-sm">Светлая</h5>
                        <div className="w-4 h-4 rounded-full bg-white"></div>
                      </div>
                      <div className="w-full h-20 bg-white rounded-md overflow-hidden">
                        <div className="h-6 bg-white/90 border-b border-black/5"></div>
                        <div className="p-2">
                          <div className="w-1/2 h-2 bg-black/10 rounded"></div>
                          <div className="w-3/4 h-2 bg-black/5 rounded mt-2"></div>
                        </div>
                      </div>
                    </Glassmorphism>
                  </div>
                </div>
                
                {/* Notifications */}
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-medium mb-4">Уведомления</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-sm">Email уведомления</h5>
                        <p className="text-white/60 text-xs">Получать уведомления на email</p>
                      </div>
                      <Switch
                        checked={generalSettings.emailNotifications}
                        onCheckedChange={() => handleNotificationToggle("emailNotifications")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-sm">Telegram уведомления</h5>
                        <p className="text-white/60 text-xs">Получать уведомления в Telegram</p>
                      </div>
                      <Switch
                        checked={generalSettings.telegramNotifications}
                        onCheckedChange={() => handleNotificationToggle("telegramNotifications")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-sm">Напоминания о Streak</h5>
                        <p className="text-white/60 text-xs">Получать напоминания о ежедневных занятиях</p>
                      </div>
                      <Switch
                        checked={generalSettings.streakReminders}
                        onCheckedChange={() => handleNotificationToggle("streakReminders")}
                      />
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-6 rounded-lg transition duration-300"
                >
                  Сохранить настройки
                </button>
              </div>
            </Glassmorphism>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Glassmorphism className="p-6 rounded-xl">
              <h3 className="font-medium mb-6">Настройки приватности</h3>
              
              <div className="space-y-6">
                {/* Profile visibility */}
                <div>
                  <h4 className="font-medium mb-4">Видимость профиля</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-sm">Показывать статистику</h5>
                        <p className="text-white/60 text-xs">Показывать вашу статистику другим пользователям</p>
                      </div>
                      <Switch
                        checked={privacySettings.showProfileStats}
                        onCheckedChange={() => handlePrivacyToggle("showProfileStats")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-sm">Показывать сертификаты</h5>
                        <p className="text-white/60 text-xs">Показывать ваши сертификаты другим пользователям</p>
                      </div>
                      <Switch
                        checked={privacySettings.showCertificates}
                        onCheckedChange={() => handlePrivacyToggle("showCertificates")}
                      />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-sm">Показывать прогресс</h5>
                        <p className="text-white/60 text-xs">Показывать ваш прогресс по курсам</p>
                      </div>
                      <Switch
                        checked={privacySettings.showProgress}
                        onCheckedChange={() => handlePrivacyToggle("showProgress")}
                      />
                    </div>
                  </div>
                </div>
                
                {/* Data collection */}
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-medium mb-4">Сбор данных</h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h5 className="font-medium text-sm">Аналитика обучения</h5>
                        <p className="text-white/60 text-xs">Разрешить собирать данные о вашем прогрессе для улучшения рекомендаций</p>
                      </div>
                      <Switch
                        checked={privacySettings.allowDataCollection}
                        onCheckedChange={() => handlePrivacyToggle("allowDataCollection")}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-space-800/60 rounded-lg">
                    <div className="flex items-start">
                      <div className="text-yellow-400 mr-2 mt-0.5">
                        <i className="fas fa-info-circle"></i>
                      </div>
                      <p className="text-white/70 text-xs">
                        Мы собираем анонимные данные о вашем прогрессе и использовании платформы для улучшения рекомендаций и персонализации обучения. Эти данные не передаются третьим лицам и используются только внутри платформы.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-6 rounded-lg transition duration-300"
                >
                  Сохранить настройки
                </button>
              </div>
            </Glassmorphism>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="account" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Glassmorphism className="p-6 rounded-xl">
              <h3 className="font-medium mb-6">Управление аккаунтом</h3>
              
              <div className="space-y-6">
                {/* Email change */}
                <div>
                  <h4 className="font-medium mb-4">Email</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="email" className="block text-sm text-white/80 mb-1">Email адрес</label>
                      <input
                        id="email"
                        type="email"
                        value={accountSettings.email}
                        onChange={handleEmailChange}
                        className="w-full bg-space-800/50 border border-white/10 px-4 py-2 rounded-lg"
                      />
                    </div>
                  </div>
                </div>
                
                {/* Password change */}
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-medium mb-4">Изменение пароля</h4>
                  
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="currentPassword" className="block text-sm text-white/80 mb-1">Текущий пароль</label>
                      <input
                        id="currentPassword"
                        name="currentPassword"
                        type="password"
                        value={accountSettings.currentPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-space-800/50 border border-white/10 px-4 py-2 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="newPassword" className="block text-sm text-white/80 mb-1">Новый пароль</label>
                      <input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={accountSettings.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-space-800/50 border border-white/10 px-4 py-2 rounded-lg"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm text-white/80 mb-1">Подтвердите пароль</label>
                      <input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={accountSettings.confirmPassword}
                        onChange={handlePasswordChange}
                        className="w-full bg-space-800/50 border border-white/10 px-4 py-2 rounded-lg"
                      />
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-space-800/60 rounded-lg">
                    <div className="flex items-start">
                      <div className="text-yellow-400 mr-2 mt-0.5">
                        <i className="fas fa-shield-alt"></i>
                      </div>
                      <p className="text-white/70 text-xs">
                        Рекомендуем использовать сложный пароль, содержащий заглавные и строчные буквы, цифры и специальные символы.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-medium mb-4">Сессии</h4>
                  
                  <div className="space-y-4">
                    <button
                      onClick={handleLogout}
                      className="flex items-center bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition duration-300 w-full sm:w-auto"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i> Выйти из всех устройств
                    </button>
                  </div>
                </div>
                
                <div className="border-t border-white/10 pt-4">
                  <h4 className="font-medium mb-4 text-red-400">Опасная зона</h4>
                  
                  <div className="space-y-4">
                    <div className="p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                      <h5 className="font-medium text-red-400 mb-2">Удаление аккаунта</h5>
                      <p className="text-white/70 text-sm mb-4">
                        Удаление аккаунта приведет к безвозвратной потере всех ваших данных, включая прогресс, сертификаты и достижения.
                      </p>
                      
                      {showDeleteConfirm ? (
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            onClick={() => setShowDeleteConfirm(false)}
                            className="bg-white/10 hover:bg-white/20 text-white py-2 px-4 rounded-lg transition duration-300"
                          >
                            Отмена
                          </button>
                          <button
                            onClick={handleDeleteAccount}
                            className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition duration-300"
                          >
                            Подтвердить удаление
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={handleDeleteAccount}
                          className="bg-red-500/20 hover:bg-red-500/30 text-red-400 py-2 px-4 rounded-lg transition duration-300"
                        >
                          Удалить аккаунт
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <button
                  onClick={handleAccountSave}
                  className="bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1] text-white py-2 px-6 rounded-lg transition duration-300"
                >
                  Сохранить изменения
                </button>
              </div>
            </Glassmorphism>
          </motion.div>
        </TabsContent>
        
        <TabsContent value="connected" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Glassmorphism className="p-6 rounded-xl">
              <h3 className="font-medium mb-6">Связанные аккаунты</h3>
              
              <div className="space-y-6">
                <p className="text-white/70">
                  Подключите свои аккаунты для быстрого входа и дополнительных возможностей.
                </p>
                
                <div className="space-y-4">
                  {connectedAccounts.map((account) => (
                    <div key={account.name} className="flex items-center justify-between p-4 bg-space-800/60 rounded-lg">
                      <div className="flex items-center">
                        <div className={`w-10 h-10 rounded-full ${account.color} flex items-center justify-center mr-4`}>
                          <i className={`fab fa-${account.icon} text-white`}></i>
                        </div>
                        <div>
                          <h4 className="font-medium">{account.name}</h4>
                          {account.connected ? (
                            <p className="text-white/60 text-sm">{account.username}</p>
                          ) : (
                            <p className="text-white/40 text-sm">Не подключено</p>
                          )}
                        </div>
                      </div>
                      
                      {account.connected ? (
                        <button className="bg-white/10 hover:bg-white/20 text-white py-1.5 px-4 rounded-lg text-sm transition duration-300">
                          Отключить
                        </button>
                      ) : (
                        <button className={`${account.color} text-white py-1.5 px-4 rounded-lg text-sm transition duration-300`}>
                          Подключить
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 p-3 bg-space-800/60 rounded-lg">
                  <div className="flex items-start">
                    <div className="text-blue-400 mr-2 mt-0.5">
                      <i className="fas fa-info-circle"></i>
                    </div>
                    <p className="text-white/70 text-xs">
                      Подключение аккаунтов позволяет входить на платформу с помощью этих сервисов и синхронизировать данные между ними.
                    </p>
                  </div>
                </div>
              </div>
            </Glassmorphism>
          </motion.div>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  );
}