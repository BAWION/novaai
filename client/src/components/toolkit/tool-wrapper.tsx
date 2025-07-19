import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { LightningEthicsEmbedded } from './lightning-ethics-embedded';
import { 
  Clock, 
  Zap, 
  AlertTriangle, 
  CheckCircle, 
  Download,
  FileText,
  Loader2,
  Play,
  ArrowRight,
  Info,
  Share2,
  Sparkles,
  Eye,
  Brain,
  Lightbulb,
  Settings,
  Gauge
} from 'lucide-react';

interface ToolWrapperProps {
  tool: {
    id: string;
    name: string;
    description: string;
    estimatedDuration: number;
    difficulty: number;
    inputs?: {
      id: string;
      label: string;
      type: 'text' | 'textarea' | 'select';
      required?: boolean;
      placeholder?: string;
      options?: string[];
    }[];
    outputs?: {
      id: string;
      label: string;
      type: 'pdf' | 'excel' | 'text';
    }[];
  };
  onComplete?: (results: any) => void;
}

export default function ToolWrapper({ tool, onComplete }: ToolWrapperProps) {
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});

  // Special case for Lightning Ethics - show embedded component
  if (tool.id === 'lightning-ethics') {
    return <LightningEthicsEmbedded onComplete={onComplete} />;
  }

  const handleInputChange = (inputId: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [inputId]: value
    }));
  };

  const handleRun = async () => {
    setIsRunning(true);
    setProgress(0);
    
    // Simulate tool execution
    for (let i = 0; i <= 100; i += 10) {
      setProgress(i);
      await new Promise(resolve => setTimeout(resolve, 200));
    }
    
    // Mock results
    setResults({
      status: 'completed',
      data: { message: 'Tool execution completed successfully' }
    });
    setIsRunning(false);
    
    if (onComplete) {
      onComplete({ status: 'completed', formData });
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Zap className="w-5 h-5" />
                {tool.name}
              </CardTitle>
              <CardDescription>{tool.description}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {tool.estimatedDuration} мин
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {tool.inputs && tool.inputs.map((input) => (
            <div key={input.id} className="space-y-2">
              <Label htmlFor={input.id}>{input.label}</Label>
              {input.type === 'text' && (
                <Input
                  id={input.id}
                  placeholder={input.placeholder}
                  value={formData[input.id] || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                />
              )}
              {input.type === 'textarea' && (
                <Textarea
                  id={input.id}
                  placeholder={input.placeholder}
                  value={formData[input.id] || ''}
                  onChange={(e) => handleInputChange(input.id, e.target.value)}
                />
              )}
              {input.type === 'select' && (
                <Select onValueChange={(value) => handleInputChange(input.id, value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={input.placeholder} />
                  </SelectTrigger>
                  <SelectContent>
                    {input.options?.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          ))}
          
          {isRunning && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Выполнение инструмента...</span>
                <span>{progress}%</span>
              </div>
              <Progress value={progress} />
            </div>
          )}
          
          <div className="flex gap-2">
            <Button 
              onClick={handleRun} 
              disabled={isRunning}
              className="flex items-center gap-2"
            >
              {isRunning ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Play className="w-4 h-4" />
              )}
              {isRunning ? 'Выполнение...' : 'Запустить инструмент'}
            </Button>
          </div>
          
          {results && (
            <Alert>
              <CheckCircle className="w-4 h-4" />
              <AlertDescription>
                Инструмент выполнен успешно. Результаты готовы для скачивания.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
