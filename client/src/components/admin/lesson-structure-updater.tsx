import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RefreshCw, AlertTriangle, ArrowUpCircle } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { updateLessonStructure, updateAllLessonStructures, getAvailableStructureUpdates } from '@/utils/update-lesson-structures';

interface UpdateResult {
  id: number;
  success: boolean;
  error?: string;
}

/**
 * Компонент для администрирования структур уроков
 * Позволяет обновить структуру отдельных уроков или всех сразу
 */
const LessonStructureUpdater: React.FC = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [updateResults, setUpdateResults] = useState<UpdateResult[]>([]);
  
  const availableUpdates = getAvailableStructureUpdates();
  
  const handleUpdateAll = async () => {
    try {
      setLoading(true);
      const results = await updateAllLessonStructures();
      
      // Преобразуем результаты в формат UpdateResult[]
      const successResults = results.success.map(id => ({ id, success: true }));
      const failedResults = results.failed.map(item => ({ 
        id: item.id, 
        success: false, 
        error: item.error 
      }));
      
      setUpdateResults([...successResults, ...failedResults]);
      
      toast({
        title: 'Обновление структур уроков',
        description: `Успешно: ${results.success.length}, Ошибок: ${results.failed.length}`,
        variant: results.failed.length === 0 ? 'default' : 'destructive'
      });
    } catch (error) {
      toast({
        title: 'Ошибка обновления',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpdateSingle = async (lessonId: number) => {
    try {
      setLoading(true);
      await updateLessonStructure(lessonId);
      
      // Обновляем состояние результатов
      setUpdateResults(prev => {
        const filtered = prev.filter(r => r.id !== lessonId);
        return [...filtered, { id: lessonId, success: true }];
      });
      
      toast({
        title: 'Урок обновлен',
        description: `Структура урока #${lessonId} успешно обновлена`,
        variant: 'default'
      });
    } catch (error) {
      setUpdateResults(prev => {
        const filtered = prev.filter(r => r.id !== lessonId);
        return [...filtered, { 
          id: lessonId, 
          success: false,
          error: error instanceof Error ? error.message : 'Неизвестная ошибка'
        }];
      });
      
      toast({
        title: 'Ошибка обновления',
        description: error instanceof Error ? error.message : 'Неизвестная ошибка',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const getResultForLesson = (lessonId: number) => {
    return updateResults.find(r => r.id === lessonId);
  };
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Управление структурой уроков</CardTitle>
        <CardDescription>
          Обновите структуру уроков до новой микроструктуры с интерактивными элементами
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Внимание</AlertTitle>
          <AlertDescription>
            Обновление структуры урока заменит существующую структуру новой версией.
            Убедитесь, что у вас есть резервные копии данных перед выполнением операции.
          </AlertDescription>
        </Alert>
        
        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="available-updates">
            <AccordionTrigger>
              Доступные обновления ({availableUpdates.length})
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-3">
                {availableUpdates.map(update => {
                  const result = getResultForLesson(update.id);
                  
                  return (
                    <div 
                      key={update.id}
                      className="flex items-center justify-between p-3 rounded-md border bg-card"
                    >
                      <div>
                        <div className="font-medium">Урок #{update.id}</div>
                        <div className="text-sm text-muted-foreground">{update.title}</div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {result && (
                          <Badge 
                            variant={result.success ? "default" : "destructive"}
                            className="mr-2"
                          >
                            {result.success ? (
                              <CheckCircle2 className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {result.success ? 'Успешно' : 'Ошибка'}
                          </Badge>
                        )}
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUpdateSingle(update.id)}
                          disabled={loading}
                        >
                          {loading ? (
                            <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                          ) : (
                            <ArrowUpCircle className="h-4 w-4 mr-1" />
                          )}
                          Обновить
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        
        {updateResults.length > 0 && (
          <>
            <Separator className="my-4" />
            
            <div className="space-y-2">
              <h3 className="text-lg font-medium">Результаты обновления</h3>
              
              <div className="space-y-2">
                {updateResults.map(result => (
                  <div 
                    key={result.id}
                    className={`p-3 rounded-md text-sm ${
                      result.success 
                        ? 'bg-green-900/20 border border-green-700'
                        : 'bg-red-900/20 border border-red-700'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle2 className="h-4 w-4 text-green-400" />
                      ) : (
                        <XCircle className="h-4 w-4 text-red-400" />
                      )}
                      <span>
                        Урок #{result.id}: {result.success ? 'успешно обновлен' : 'ошибка обновления'}
                      </span>
                    </div>
                    
                    {!result.success && result.error && (
                      <div className="mt-1 pl-6 text-red-300">
                        {result.error}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleUpdateAll}
          disabled={loading || availableUpdates.length === 0}
          className="w-full"
        >
          {loading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <ArrowUpCircle className="h-4 w-4 mr-2" />
          )}
          Обновить все уроки ({availableUpdates.length})
        </Button>
      </CardFooter>
    </Card>
  );
};

export default LessonStructureUpdater;