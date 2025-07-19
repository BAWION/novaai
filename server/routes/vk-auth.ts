import express from "express";
import type { IStorage } from "../storage";
import type { InsertUser } from "@shared/schema";
import crypto from 'crypto';

const router = express.Router();

// PKCE функции для OAuth 2.1 безопасности VK ID
function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString('base64url');
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  const hash = crypto.createHash('sha256').update(verifier).digest();
  return hash.toString('base64url');
}

// Endpoint для проверки конфигурации VK (только для разработки)
router.get("/config", (req, res) => {
  const { clientId, redirectUri } = getVKConfig();
  
  console.log('[VK Config Check] Client ID:', clientId);
  console.log('[VK Config Check] Redirect URI:', redirectUri);
  console.log('[VK Config Check] Has secret:', !!process.env.VK_CLIENT_SECRET);
  
  res.setHeader('Content-Type', 'application/json');
  res.json({
    client_id: clientId,
    redirect_uri: redirectUri,
    has_secret: !!process.env.VK_CLIENT_SECRET,
    node_env: process.env.NODE_ENV,
    base_url: process.env.BASE_URL
  });
});

// VK OAuth конфигурация
function getVKConfig() {
  const clientId = process.env.VK_CLIENT_ID || process.env.VK_APP_ID;
  const clientSecret = process.env.VK_CLIENT_SECRET;
  
  let redirectUri;
  if (process.env.VK_REDIRECT_URI) {
    redirectUri = process.env.VK_REDIRECT_URI;
  } else {
    // Определяем базовый URL в зависимости от окружения
    let baseUrl;
    if (process.env.NODE_ENV === 'production' && process.env.BASE_URL) {
      baseUrl = process.env.BASE_URL;
    } else {
      // Для разработки используем текущий домен
      baseUrl = 'https://49c11d52-b1fc-4151-bb61-b9097616c44f-00-3h2ne9cwwtbvn.janeway.replit.dev';
    }
    redirectUri = `${baseUrl}/auth/vk/callback`;
  }
  
  console.log(`[VK OAuth] Client ID: ${clientId ? 'установлен' : 'отсутствует'}`);
  console.log(`[VK OAuth] Redirect URI: ${redirectUri}`);
  
  return { clientId, clientSecret, redirectUri };
}

// Современная VK ID авторизация OAuth 2.1
router.get("/auth", async (req, res) => {
  try {
    const { clientId } = getVKConfig();
    
    if (!clientId) {
      return res.status(500).json({
        error: 'VK_CLIENT_ID не настроен'
      });
    }

    console.log('[VK ID] Инициация современной VK ID авторизации OAuth 2.1');
    
    // Определяем redirect URI для текущего окружения  
    const isProduction = req.get('host')?.includes('galaxion.ai') || req.get('host')?.includes('www.galaxion');
    const redirectUri = isProduction 
      ? 'https://www.galaxion.ai/auth/vk/callback'
      : `https://${req.get('host')}/auth/vk/callback`;

    // Генерируем PKCE для OAuth 2.1 безопасности
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Сохраняем code_verifier в сессии для последующего обмена
    req.session.vk_code_verifier = codeVerifier;

    // Современный VK ID endpoint OAuth 2.1
    const authUrl = `https://id.vk.com/oauth2/authorize?` + new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      scope: 'vkid.personal_info email phone', // Современные VK ID scopes
      response_type: 'code',
      code_challenge_method: 'S256',
      code_challenge: codeChallenge,
      state: JSON.stringify({ redirect: '/dashboard', timestamp: Date.now() })
    });

    console.log('[VK ID] Redirect URL:', redirectUri);
    console.log('[VK ID] OAuth 2.1 Auth URL (id.vk.com):', authUrl);
    
    return res.redirect(authUrl);
  } catch (error) {
    console.error('[VK ID] Ошибка:', error);
    return res.status(500).json({
      error: 'Ошибка при инициации VK ID авторизации'
    });
  }
});

// Упрощенная авторизация без email scope (обходной путь для старого OAuth)
router.get("/auth-simple", async (req, res) => {
  try {
    const { clientId } = getVKConfig();
    
    if (!clientId) {
      return res.status(500).json({
        error: 'VK_CLIENT_ID не настроен'
      });
    }

    console.log('[VK Auth Simple] Инициация упрощенной авторизации');
    
    // Определяем redirect URI для текущего окружения  
    const isProduction = req.get('host')?.includes('galaxion.ai') || req.get('host')?.includes('www.galaxion');
    const redirectUri = isProduction 
      ? 'https://www.galaxion.ai/auth/vk/callback'
      : `https://${req.get('host')}/auth/vk/callback`;

    const authUrl = `https://oauth.vk.com/authorize?` + new URLSearchParams({
      client_id: clientId,
      display: 'page',
      redirect_uri: redirectUri,
      scope: '', // БЕЗ email scope
      response_type: 'code',
      v: '5.131',
      state: 'simple_test_' + Date.now()
    });

    console.log('[VK Auth Simple] Redirect URL:', redirectUri);
    console.log('[VK Auth Simple] Auth URL:', authUrl);
    
    return res.redirect(authUrl);
  } catch (error) {
    console.error('[VK Auth Simple] Ошибка:', error);
    return res.status(500).json({
      error: 'Ошибка при инициации упрощенной VK авторизации'
    });
  }
});

// Новый endpoint для VK ID SDK данных
router.post("/auth", async (req, res) => {
  try {
    console.log('[VK ID SDK] ===== НАЧАЛО ОБРАБОТКИ VK AUTH =====');
    console.log('[VK ID SDK] Request method:', req.method);
    console.log('[VK ID SDK] Request URL:', req.url);
    console.log('[VK ID SDK] Session ID:', req.session.id);
    
    const { access_token, refresh_token, id_token, user_id } = req.body;
    const storage = req.app.get('storage') as IStorage;
    
    console.log('[VK ID SDK] Получены данные от SDK:', { 
      hasAccessToken: !!access_token,
      hasRefreshToken: !!refresh_token,
      hasIdToken: !!id_token,
      hasUserId: !!user_id,
      fullData: req.body
    });

    if (!access_token) {
      console.log('[VK ID SDK] Отсутствует access_token');
      return res.status(400).json({
        error: 'Access token не получен от VK ID SDK'
      });
    }

    // Извлекаем user_id из данных SDK, которые уже содержат основную информацию
    const vkUserId = req.body.user_id || user_id;
    
    if (!vkUserId) {
      console.error('[VK ID SDK] user_id отсутствует в данных');
      return res.status(400).json({
        error: 'User ID не получен от VK ID SDK'
      });
    }

    console.log('[VK ID SDK] Используем user_id из SDK:', vkUserId);

    // Попытаемся получить расширенную информацию о пользователе через стандартное VK API
    let userInfo: any = { user_id: vkUserId };
    let email: string | undefined;

    try {
      const userInfoResponse = await fetch(`https://api.vk.com/method/users.get?user_ids=${vkUserId}&fields=photo_400_orig&access_token=${access_token}&v=5.131`);
      
      if (userInfoResponse.ok) {
        const apiResponse = await userInfoResponse.json();
        if (apiResponse.response && apiResponse.response[0]) {
          const vkUser = apiResponse.response[0];
          userInfo = {
            user_id: vkUserId,
            first_name: vkUser.first_name,
            last_name: vkUser.last_name,
            picture: vkUser.photo_400_orig
          };
          console.log('[VK ID SDK] Расширенные данные пользователя получены через VK API');
        }
      }
    } catch (error) {
      console.log('[VK ID SDK] Не удалось получить расширенные данные, используем базовые');
    }

    const user = userInfo;

    // Пытаемся найти существующего пользователя по VK ID
    let existingUser = await storage.getUserByVkId(user.user_id?.toString());
    
    // Если не найден по VK ID, проверяем по username (на случай дублирования)
    if (!existingUser) {
      try {
        const username = `vk_${user.user_id}`;
        existingUser = await storage.getUserByUsername(username);
        console.log('[VK ID SDK] Пользователь найден по username:', username);
      } catch (error) {
        // Пользователя с таким username нет, это нормально
      }
    }
    
    if (existingUser) {
      console.log('[VK ID SDK] Пользователь найден:', existingUser.id);
      
      // Подготавливаем данные для обновления, исключая undefined значения
      const updateData: any = {
        lastLogin: new Date(),
      };
      
      if (user.first_name || user.given_name) {
        updateData.firstName = user.first_name || user.given_name;
      }
      if (user.last_name || user.family_name) {
        updateData.lastName = user.last_name || user.family_name;
      }
      if (user.avatar || user.picture || user.photo_100 || user.photo_200) {
        updateData.profilePicture = user.avatar || user.picture || user.photo_100 || user.photo_200;
      }
      
      try {
        // Обновляем информацию пользователя только если есть данные для обновления
        if (Object.keys(updateData).length > 1) { // больше чем только lastLogin
          await storage.updateUser(existingUser.id, updateData);
        }
      } catch (updateError) {
        console.log('[VK ID SDK] Ошибка обновления пользователя, продолжаем без обновления:', updateError.message);
      }
      
      // Устанавливаем сессию
      req.session.userId = existingUser.id;
      req.session.authenticated = true;
      
      console.log('[VK ID SDK] Сессия установлена:', {
        sessionId: req.session.id,
        userId: existingUser.id,
        authenticated: true
      });
      
      return res.json({
        success: true,
        message: 'Успешная авторизация через VK ID',
        user: existingUser,
        redirect: '/dashboard'
      });
    }

    // Создаем нового пользователя
    const vkEmail = email || `vk${user.user_id}@galaxion.ai`;
    
    const newUser: InsertUser = {
      vkId: user.user_id?.toString(),
      firstName: user.first_name || user.given_name || 'VK',
      lastName: user.last_name || user.family_name || 'User',
      email: vkEmail,
      displayName: `${user.first_name || user.given_name} ${user.last_name || user.family_name}`.trim() || `VK User`,
      profilePicture: user.avatar || user.picture || user.photo_100 || user.photo_200,
      role: 'student',
      username: `vk_${user.user_id}`,
      password: 'oauth_vk', // Заглушка для пароля при OAuth авторизации
      isEmailVerified: !!email, // true если получили email, false для fallback
    };

    const createdUser = await storage.createUser(newUser);
    console.log('[VK ID SDK] Пользователь создан:', createdUser.id);

    // Устанавливаем сессию
    req.session.userId = createdUser.id;
    req.session.authenticated = true;

    return res.json({
      success: true,
      user: createdUser,
      redirect: '/dashboard'
    });

  } catch (error) {
    console.error('[VK ID SDK] Ошибка авторизации:', error);
    return res.status(500).json({
      error: 'Ошибка при обработке авторизации VK ID'
    });
  }
});

// Обработка callback от VK ID SDK (One Tap)
router.post("/callback", async (req, res) => {
  try {
    const { code, device_id, state } = req.body;

    console.log('[VK SDK Callback] Получены данные:', { 
      hasCode: !!code, 
      hasDeviceId: !!device_id, 
      state 
    });

    if (!code) {
      return res.status(400).json({
        error: 'Код авторизации не получен'
      });
    }

    const { clientId, clientSecret } = getVKConfig();

    if (!clientSecret) {
      console.error('[VK Auth] VK_CLIENT_SECRET не установлен');
      return res.status(500).json({
        error: 'Конфигурация VK не настроена'
      });
    }

    // Обмениваем код на токен через VK ID API
    const tokenResponse = await fetch('https://id.vk.com/oauth2/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        client_id: clientId!,
        client_secret: clientSecret,
        code: code,
        redirect_uri: 'https://www.galaxion.ai/auth/vk/callback',
        device_id: device_id || ''
      })
    });

    console.log('[VK Token] Статус ответа:', tokenResponse.status);

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      console.error('[VK Token] Ошибка обмена токена:', errorText);
      return res.status(400).json({
        error: 'Не удалось обменять код на токен',
        details: errorText
      });
    }

    const tokenData = await tokenResponse.json();
    console.log('[VK Token] Токен получен:', { 
      hasAccessToken: !!tokenData.access_token,
      hasEmail: !!tokenData.email 
    });

    // Получаем информацию о пользователе через VK API
    const userInfoResponse = await fetch(`https://api.vk.com/method/users.get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        access_token: tokenData.access_token,
        fields: 'photo_400_orig,email',
        v: '5.131'
      })
    });

    if (!userInfoResponse.ok) {
      throw new Error('Не удалось получить информацию о пользователе VK');
    }

    const userInfo = await userInfoResponse.json();
    
    if (userInfo.error) {
      console.error('[VK User API] Ошибка:', userInfo.error);
      return res.status(400).json({
        error: `VK API error: ${userInfo.error.error_msg}`
      });
    }

    const vkUser = userInfo.response[0];
    console.log('[VK User] Информация получена:', { 
      id: vkUser.id, 
      name: `${vkUser.first_name} ${vkUser.last_name}` 
    });

    const storage = req.app.locals.storage as IStorage;

    // Проверяем, есть ли пользователь в базе
    let user = await storage.getUserByVkId(vkUser.id.toString());

    if (!user) {
      // Создаем нового пользователя
      const newUser: InsertUser = {
        email: tokenData.email || `vk${vkUser.id}@galaxion.ai`,
        vk_id: vkUser.id.toString(),
        first_name: vkUser.first_name,
        last_name: vkUser.last_name,
        display_name: `${vkUser.first_name} ${vkUser.last_name}`,
        avatar_url: vkUser.photo_400_orig,
        is_email_verified: !!tokenData.email,
      };

      user = await storage.createUser(newUser);
      console.log('[VK User] Новый пользователь создан:', user.id);
    } else {
      // Обновляем существующего пользователя
      console.log('[VK User] Пользователь найден:', user.id);
    }

    // Устанавливаем сессию
    req.session.userId = user.id;
    req.session.authenticated = true;
    req.session.loginTime = new Date().toISOString();
    req.session.method = 'vk';

    console.log('[VK Auth] Сессия установлена для пользователя:', user.id);

    // Возвращаем успешный ответ
    res.json({
      success: true,
      user: {
        id: user.id,
        display_name: user.display_name,
        email: user.email,
      },
      redirect: '/dashboard'
    });

  } catch (error) {
    console.error('[VK SDK Callback] Ошибка:', error);
    
    res.status(500).json({
      error: 'Ошибка обработки VK авторизации',
      message: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
});

// Маршрут для обработки VK ID авторизации (POST) - новая реализация для VK ID SDK 2.6.0
router.post("/auth", async (req, res) => {
  try {
    console.log("[VK ID Auth] Получен запрос:", req.body);
    
    const authData = req.body;
    
    // Валидация данных от VK ID SDK
    if (!authData || (!authData.code && !authData.access_token && !authData.user)) {
      console.error("[VK ID Auth] Неверные данные авторизации VK ID");
      return res.status(400).json({ error: "Неверные данные авторизации" });
    }

    let userInfo = null;
    const storage = req.app.locals.storage as IStorage;

    // Если есть прямо пользовательские данные - используем их
    if (authData.user) {
      userInfo = authData.user;
    } 
    // Если есть access_token - получаем данные пользователя через VK API
    else if (authData.access_token) {
      const userResponse = await fetch(`https://api.vk.com/method/users.get?access_token=${authData.access_token}&fields=photo_400_orig,email&v=5.131`);
      const userData = await userResponse.json();
      
      if (userData.error) {
        throw new Error(`VK API Error: ${userData.error.error_msg}`);
      }
      
      userInfo = userData.response[0];
      if (authData.email) {
        userInfo.email = authData.email;
      }
    }
    // Если есть код авторизации - обмениваем на токен
    else if (authData.code) {
      const { clientId, clientSecret } = getVKConfig();
      
      if (!clientSecret || !clientId) {
        return res.status(500).json({ error: 'VK конфигурация не настроена' });
      }

      // Обмениваем код на токен
      const tokenResponse = await fetch('https://id.vk.com/oauth2/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'authorization_code',
          client_id: clientId,
          client_secret: clientSecret,
          code: authData.code,
          redirect_uri: 'https://www.galaxion.ai/auth/vk/callback',
          device_id: authData.device_id || ''
        })
      });

      if (!tokenResponse.ok) {
        const errorText = await tokenResponse.text();
        console.error('[VK Token] Ошибка обмена токена:', errorText);
        throw new Error('Не удалось обменять код на токен');
      }

      const tokenData = await tokenResponse.json();
      
      // Получаем информацию о пользователе
      const userResponse = await fetch(`https://api.vk.com/method/users.get?access_token=${tokenData.access_token}&fields=photo_400_orig,email&v=5.131`);
      const userData = await userResponse.json();
      
      if (userData.error) {
        throw new Error(`VK API Error: ${userData.error.error_msg}`);
      }
      
      userInfo = userData.response[0];
      if (tokenData.email) {
        userInfo.email = tokenData.email;
      }
    }

    if (!userInfo || !userInfo.id) {
      throw new Error("Не удалось получить данные пользователя VK");
    }

    const vkId = userInfo.id.toString();
    const email = userInfo.email || null;
    const firstName = userInfo.first_name || '';
    const lastName = userInfo.last_name || '';
    const displayName = `${firstName} ${lastName}`.trim() || `VK User ${vkId}`;
    const avatarUrl = userInfo.photo_400_orig || null;

    console.log("[VK ID Auth] Обработка пользователя VK:", {
      vkId,
      email,
      displayName,
      hasAvatar: !!avatarUrl
    });

    // Проверяем, существует ли пользователь с таким VK ID
    let user = await storage.getUserByVkId(vkId);
    
    if (!user) {
      // Если пользователя нет, создаем нового
      const newUser: InsertUser = {
        username: `vk_${vkId}`,
        email: email || "",
        vk_id: vkId,
        firstName: firstName,
        lastName: lastName,
        displayName: displayName,
        avatarUrl: avatarUrl,
        isEmailVerified: !!email,
        authProvider: "vk",
        authProviderId: vkId
      };

      user = await storage.createUser(newUser);
      
      console.log("[VK ID Auth] Создан новый пользователь:", user.id);
    } else {
      console.log("[VK ID Auth] Найден существующий пользователь:", user.id);
    }

    if (!user) {
      throw new Error("Не удалось создать или найти пользователя");
    }

    // Устанавливаем сессию
    req.session.userId = user.id;
    req.session.authenticated = true;
    req.session.loginTime = new Date().toISOString();
    req.session.method = 'vk';
    
    console.log("[VK ID Auth] Сессия установлена для пользователя:", user.id);

    res.json({
      success: true,
      user: {
        id: user.id,
        display_name: user.displayName,
        email: user.email,
        vk_id: user.vk_id,
        avatar_url: user.avatarUrl
      },
      redirect: '/dashboard'
    });

  } catch (error) {
    console.error("[VK ID Auth] Ошибка:", error);
    res.status(500).json({ 
      error: "Ошибка авторизации VK ID",
      message: error instanceof Error ? error.message : 'Неизвестная ошибка'
    });
  }
});

// Современный VK ID OAuth 2.1 callback для обработки authorization code
router.get("/callback", async (req, res) => {
  const { code, state, error } = req.query;
  
  console.log("[VK ID Callback] OAuth 2.1 callback получен:", { 
    hasCode: !!code, 
    hasState: !!state,
    error: error
  });

  if (error) {
    console.error("[VK ID Callback] VK ID OAuth error:", error);
    return res.redirect("/login?error=vk_auth_failed");
  }

  if (!code) {
    console.error("[VK ID Callback] Отсутствует authorization code");
    return res.redirect("/login?error=vk_auth_failed");
  }

  try {
    const { clientId, clientSecret, redirectUri } = getVKConfig();
    const codeVerifier = req.session.vk_code_verifier;

    if (!clientId || !clientSecret) {
      throw new Error('VK конфигурация не настроена');
    }

    if (!codeVerifier) {
      throw new Error('PKCE code verifier отсутствует в сессии');
    }

    console.log('[VK ID Callback] Обмен кода на токены OAuth 2.1...');

    // Обмениваем authorization code на токены через VK ID API OAuth 2.1
    const tokenUrl = 'https://id.vk.com/oauth2/auth';
    const tokenBody = new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      code: code as string,
      code_verifier: codeVerifier // PKCE код для безопасности OAuth 2.1
    });

    const tokenResponse = await fetch(tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: tokenBody
    });

    const tokenData = await tokenResponse.json();
    console.log('[VK ID Callback] Token response status:', tokenResponse.status);

    if (!tokenResponse.ok || tokenData.error) {
      throw new Error(`VK ID Token Error: ${tokenData.error_description || tokenData.error || 'Unknown error'}`);
    }

    console.log("[VK ID Callback] Токены получены:", {
      hasAccessToken: !!tokenData.access_token,
      hasIdToken: !!tokenData.id_token,
      hasRefreshToken: !!tokenData.refresh_token,
      userId: tokenData.user_id
    });

    // Получаем данные пользователя через VK ID API
    const userInfoResponse = await fetch('https://id.vk.com/oauth2/user_info', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    });

    const userInfo = await userInfoResponse.json();
    
    if (!userInfoResponse.ok || userInfo.error) {
      throw new Error(`VK ID User Info Error: ${userInfo.error_description || userInfo.error || 'Unknown error'}`);
    }

    console.log("[VK ID Callback] Данные пользователя получены:", {
      userId: userInfo.user?.user_id,
      hasEmail: !!userInfo.user?.email,
      hasPhone: !!userInfo.user?.phone
    });

    const user = userInfo.user;
    if (!user || !user.user_id) {
      throw new Error("VK ID не вернул данные пользователя");
    }

    // Создаем/обновляем пользователя в базе
    const storage = req.app.locals.storage as IStorage;
    let existingUser = await storage.getUserByVkId(user.user_id.toString());

    if (!existingUser) {
      const newUser: InsertUser = {
        email: user.email || `vk${user.user_id}@galaxion.ai`,
        vk_id: user.user_id.toString(),
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        display_name: `${user.first_name || ''} ${user.last_name || ''}`.trim() || `VK User ${user.user_id}`,
        avatar_url: user.avatar || null,
        phone: user.phone || null,
        is_email_verified: !!user.email,
        auth_provider: "vk_id",
        auth_provider_id: user.user_id.toString()
      };

      existingUser = await storage.createUser(newUser);
      console.log("[VK ID Callback] Создан новый пользователь:", existingUser.id);
    } else {
      console.log("[VK ID Callback] Найден существующий пользователь:", existingUser.id);
    }

    // Устанавливаем сессию
    req.session.userId = existingUser.id;
    req.session.authenticated = true;
    req.session.loginTime = new Date().toISOString();
    req.session.method = "vk_id";
    
    // Очищаем PKCE данные из сессии
    delete req.session.vk_code_verifier;

    console.log("[VK ID Callback] Сессия установлена для пользователя:", existingUser.id);

    // Парсим state для редиректа
    let redirectUrl = "/dashboard";
    if (state) {
      try {
        const stateObj = JSON.parse(state as string);
        redirectUrl = stateObj.redirect || "/dashboard";
      } catch (e) {
        console.warn("[VK ID Callback] Не удалось парсить state:", e);
      }
    }

    console.log("[VK ID Callback] OAuth 2.1 авторизация завершена, редирект на:", redirectUrl);
    res.redirect(redirectUrl);

  } catch (error) {
    console.error("[VK ID Callback] Ошибка OAuth 2.1:", error);
    
    // Очищаем PKCE данные при ошибке
    delete req.session.vk_code_verifier;
    
    res.redirect("/login?error=vk_id_auth_failed");
  }
});



// Debug endpoint для проверки конфигурации VK ID
router.get('/config', (req, res) => {
  const { clientId, clientSecret, redirectUri } = getVKConfig();
  
  console.log('[VK ID Config] Client ID:', clientId ? 'установлен' : 'отсутствует');
  console.log('[VK ID Config] Redirect URI:', redirectUri);
  console.log('[VK ID Config] Has secret:', !!clientSecret);
  
  const config = {
    client_id: clientId,
    redirect_uri: redirectUri,
    has_secret: !!clientSecret,
    oauth_version: 'VK ID OAuth 2.1',
    endpoint: 'https://id.vk.com/oauth2/authorize'
  };
  
  res.json(config);
});

// Упрощенная VK авторизация без scope=email (для диагностики)
router.get('/auth-simple', (req: Request, res: Response) => {
  const { clientId } = getVKConfig();
  const redirectUri = getRedirectUri(req);
  
  if (!clientId) {
    console.error("[VK Simple Auth] VK_CLIENT_ID не настроен");
    return res.redirect("/login?error=vk_not_configured");
  }

  const authUrl = new URL("https://oauth.vk.com/authorize");
  authUrl.searchParams.set("client_id", clientId);
  authUrl.searchParams.set("redirect_uri", redirectUri);
  authUrl.searchParams.set("response_type", "code");
  authUrl.searchParams.set("v", "5.131");
  // Убираем scope=email и display=popup для упрощения

  console.log("[VK Simple Auth] Создан упрощенный auth URL:", authUrl.toString());
  res.redirect(authUrl.toString());
});

export default router;