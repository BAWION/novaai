import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, Camera, Sparkles, X, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';

interface AvatarUploaderProps {
  currentAvatar: string;
  onAvatarChange: (newAvatarUrl: string) => void;
}

export function AvatarUploader({ currentAvatar, onAvatarChange }: AvatarUploaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedImages, setGeneratedImages] = useState<string[]>([]);
  const [aiPrompt, setAiPrompt] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Проверка типа файла
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Ошибка",
        description: "Пожалуйста, выберите изображение",
        variant: "destructive"
      });
      return;
    }

    // Проверка размера файла (макс 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Ошибка", 
        description: "Размер файла не должен превышать 5MB",
        variant: "destructive"
      });
      return;
    }

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch('/api/profile/avatar/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Ошибка загрузки файла');
      }

      const data = await response.json();
      onAvatarChange(data.avatarUrl);
      setIsOpen(false);
      
      toast({
        title: "Успешно",
        description: "Фото профиля обновлено"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось загрузить фото",
        variant: "destructive"
      });
    }
  };

  const generateAIAvatar = async () => {
    if (!aiPrompt.trim()) {
      toast({
        title: "Ошибка",
        description: "Введите описание для генерации аватара",
        variant: "destructive"
      });
      return;
    }

    setIsGenerating(true);
    try {
      const response = await fetch('/api/profile/avatar/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: `Professional avatar portrait: ${aiPrompt}. High quality, clean background, friendly expression, professional lighting.`,
          style: 'portrait'
        }),
      });

      if (!response.ok) {
        throw new Error('Ошибка генерации изображения');
      }

      const data = await response.json();
      setGeneratedImages(data.images || [data.imageUrl]);
      
      toast({
        title: "Готово!",
        description: "ИИ сгенерировал варианты аватара"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сгенерировать аватар",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const selectGeneratedImage = async (imageUrl: string) => {
    try {
      // Сохраняем выбранное изображение как аватар пользователя
      const response = await fetch('/api/profile/avatar/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Ошибка сохранения аватара');
      }

      const data = await response.json();
      onAvatarChange(data.avatarUrl);
      setIsOpen(false);
      setGeneratedImages([]);
      setAiPrompt('');
      
      toast({
        title: "Успешно",
        description: "Аватар обновлен"
      });
    } catch (error) {
      toast({
        title: "Ошибка",
        description: "Не удалось сохранить аватар",
        variant: "destructive"
      });
    }
  };

  return (
    <>
      <div className="relative group">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#6E3AFF] to-[#2EBAE1] p-1">
          <div className="w-full h-full rounded-full overflow-hidden">
            <img 
              src={currentAvatar} 
              alt="Profile" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        
        {/* Overlay для редактирования */}
        <button
          onClick={() => setIsOpen(true)}
          className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Camera className="w-6 h-6 text-white" />
        </button>
      </div>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-white">Изменить фото профиля</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            {/* Загрузка файла */}
            <div className="space-y-3">
              <Label className="text-white">Загрузить фото</Label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center cursor-pointer hover:border-[#6E3AFF] transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-400">Нажмите для выбора файла</p>
                <p className="text-gray-500 text-sm">PNG, JPG до 5MB</p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </div>

            {/* Разделитель */}
            <div className="flex items-center">
              <div className="flex-1 border-t border-gray-600"></div>
              <span className="px-4 text-gray-400 text-sm">или</span>
              <div className="flex-1 border-t border-gray-600"></div>
            </div>

            {/* ИИ генерация */}
            <div className="space-y-3">
              <Label className="text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-[#6E3AFF]" />
                Сгенерировать с помощью ИИ
              </Label>
              <Textarea
                placeholder="Опишите желаемый аватар: молодой человек в очках, деловой стиль, улыбка..."
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                className="bg-gray-800 border-gray-600 text-white resize-none"
                rows={3}
              />
              <Button
                onClick={generateAIAvatar}
                disabled={isGenerating || !aiPrompt.trim()}
                className="w-full bg-gradient-to-r from-[#6E3AFF] to-[#2EBAE1] hover:from-[#4922B2] hover:to-[#1682A1]"
              >
                {isGenerating ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Генерируем...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    Создать аватар
                  </div>
                )}
              </Button>
            </div>

            {/* Сгенерированные изображения */}
            <AnimatePresence>
              {generatedImages.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3"
                >
                  <Label className="text-white">Выберите аватар</Label>
                  <div className="grid grid-cols-2 gap-4">
                    {generatedImages.map((imageUrl, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="relative group cursor-pointer"
                        onClick={() => selectGeneratedImage(imageUrl)}
                      >
                        <img
                          src={imageUrl}
                          alt={`Generated avatar ${index + 1}`}
                          className="w-full aspect-square object-cover rounded-lg border border-gray-600 group-hover:border-[#6E3AFF] transition-colors"
                        />
                        <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Download className="w-6 h-6 text-white" />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}