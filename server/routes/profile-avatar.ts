import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";

const router = Router();

// Настройка multer для загрузки файлов
const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB максимум
  },
  fileFilter: (req, file, cb) => {
    // Проверяем тип файла
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Можно загружать только изображения'), false);
    }
  },
});

// Создаем директорию для аватаров если её нет
const avatarsDir = path.join(process.cwd(), 'public', 'avatars');
if (!fs.existsSync(avatarsDir)) {
  fs.mkdirSync(avatarsDir, { recursive: true });
}

/**
 * POST /api/profile/avatar/upload
 * Загрузка фото аватара
 */
router.post('/upload', upload.single('avatar'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'Файл не найден' });
    }

    // Генерируем уникальное имя файла
    const fileId = uuidv4();
    const fileName = `${fileId}.webp`;
    const filePath = path.join(avatarsDir, fileName);
    
    // Обрабатываем изображение: изменяем размер и конвертируем в WebP
    await sharp(req.file.buffer)
      .resize(300, 300, { 
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(filePath);

    // Формируем URL для доступа к изображению
    const avatarUrl = `/avatars/${fileName}`;
    
    // TODO: Сохранить URL аватара в профиле пользователя в базе данных
    // await storage.updateUserAvatar(userId, avatarUrl);

    res.json({ 
      success: true,
      avatarUrl,
      message: 'Аватар успешно загружен'
    });

  } catch (error) {
    console.error('Ошибка загрузки аватара:', error);
    res.status(500).json({ 
      error: 'Ошибка при загрузке файла',
      details: error.message 
    });
  }
});

/**
 * POST /api/profile/avatar/generate
 * Генерация аватара с помощью ИИ
 */
router.post('/generate', async (req, res) => {
  try {
    const { prompt, style = 'portrait' } = req.body;
    
    if (!prompt || prompt.trim().length === 0) {
      return res.status(400).json({ error: 'Необходимо указать описание для генерации' });
    }

    // Вызываем OpenAI DALL-E для генерации изображения
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'dall-e-3',
        prompt: `Professional high-quality portrait avatar: ${prompt}. Clean studio lighting, neutral background, professional headshot style, friendly expression, high resolution.`,
        n: 1,
        size: '1024x1024',
        quality: 'standard',
        style: 'natural'
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`OpenAI API ошибка: ${error.error?.message || 'Неизвестная ошибка'}`);
    }

    const data = await response.json();
    const imageUrl = data.data[0]?.url;

    if (!imageUrl) {
      throw new Error('Не удалось получить сгенерированное изображение');
    }

    // Загружаем сгенерированное изображение и сохраняем локально
    const imageResponse = await fetch(imageUrl);
    const imageBuffer = await imageResponse.arrayBuffer();
    
    const fileId = uuidv4();
    const fileName = `ai-${fileId}.webp`;
    const filePath = path.join(avatarsDir, fileName);
    
    // Обрабатываем и сохраняем изображение
    await sharp(Buffer.from(imageBuffer))
      .resize(300, 300, { 
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 85 })
      .toFile(filePath);

    const localImageUrl = `/avatars/${fileName}`;

    res.json({
      success: true,
      imageUrl: localImageUrl,
      originalPrompt: prompt,
      message: 'Аватар успешно сгенерирован'
    });

  } catch (error) {
    console.error('Ошибка генерации аватара:', error);
    res.status(500).json({ 
      error: 'Ошибка при генерации аватара',
      details: error.message 
    });
  }
});

/**
 * POST /api/profile/avatar/save
 * Сохранение выбранного аватара в профиль пользователя
 */
router.post('/save', async (req, res) => {
  try {
    const { imageUrl } = req.body;
    
    if (!imageUrl) {
      return res.status(400).json({ error: 'URL изображения не указан' });
    }

    // TODO: Получить ID пользователя из сессии
    // const userId = req.session?.user?.id;
    // if (!userId) {
    //   return res.status(401).json({ error: 'Пользователь не авторизован' });
    // }

    // TODO: Сохранить URL аватара в профиле пользователя
    // await storage.updateUserAvatar(userId, imageUrl);

    res.json({
      success: true,
      avatarUrl: imageUrl,
      message: 'Аватар сохранен в профиль'
    });

  } catch (error) {
    console.error('Ошибка сохранения аватара:', error);
    res.status(500).json({ 
      error: 'Ошибка при сохранении аватара',
      details: error.message 
    });
  }
});

export default router;