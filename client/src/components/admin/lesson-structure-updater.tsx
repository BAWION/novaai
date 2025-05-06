import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { updateLessonStructure, updateAllLessonStructures } from '@/utils/update-lesson-structures';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Loader2, Check, XCircle, FileText, RefreshCw } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface UpdateResult {
  lessonId?: number;
  success: boolean;
  action?: string;
  error?: any;
}

/**
 * Компонент для обновления структуры уроков через админ-интерфейс
 */
const LessonStructureUpdater: React.FC = () => {
  const { toast } = useToast();
  const [updating, setUpdating] = useState(false);
  const [results, setResults] = useState<UpdateResult[]>([]);

  // Обработчик обновления всех структур уроков
  const handleUpdateAll = async () => {
    setUpdating(true);
    setResults([]);
    
    try {
      const updateResults = await updateAllLessonStructures();
      setResults(updateResults);
      
      const successCount = updateResults.filter(r => r.success).length;
      
      toast({
        title: 'Обновление структур уроков',
        description: `Обновлено: ${successCount} из ${updateResults.length} уроков`,
        variant: successCount === updateResults.length ? 'default' : 'destructive',
      });
    } catch (error) {
      console.error('Ошибка при обновлении структур уроков:', error);
      toast({
        title: 'Ошибка обновления',
        description: 'Произошла ошибка при обновлении структур уроков',
        variant: 'destructive',
      });
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Card className="border-space-700 bg-space-800/60 backdrop-blur-lg">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Обновление структуры уроков</CardTitle>
        <CardDescription>
          Обновляет структуру уроков модуля "Основы искусственного интеллекта" на новую микроструктуру с Hook, Explain, Demo, Quick Try и Reflect.
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between bg-space-900/40 p-3 rounded-md">
          <div className="flex items-center space-x-2">
            <FileText size={18} className="text-primary" />
            <span>Адаптация уроков модуля "Основы искусственного интеллекта"</span>
          </div>
          <Badge variant="outline" className="font-mono">
            3 урока
          </Badge>
        </div>
        
        {results.length > 0 && (
          <div className="space-y-2 mt-4">
            <h3 className="text-sm font-medium text-white/70">Результаты обновления:</h3>
            {results.map((result, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-2 rounded-md ${
                  result.success ? 'bg-green-900/20' : 'bg-red-900/20'
                }`}
              >
                <div className="flex items-center space-x-2">
                  {result.success ? 
                    <Check size={16} className="text-green-400" /> : 
                    <XCircle size={16} className="text-red-400" />
                  }
                  <span>Урок {index + 5}</span>
                </div>
                <Badge variant="outline" className={result.success ? 'border-green-700 text-green-400' : 'border-red-700 text-red-400'}>
                  {result.success ? (result.action === 'created' ? 'Создано' : 'Обновлено') : 'Ошибка'}
                </Badge>
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleUpdateAll}
          disabled={updating}
          className="w-full"
        >
          {updating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Обновление...
            </>
          ) : (
            <>
              <RefreshCw className="mr-2 h-4 w-4" />
              Обновить структуру всех уроков
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LessonStructureUpdater;