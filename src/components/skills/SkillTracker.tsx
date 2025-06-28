import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { updateSkill, getLevel, getUserSkills } from '@/services/skill-graph-service';
import { useAuth } from '@/context/auth-context';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface UserSkill {
  id: number;
  userId: number;
  skillId: number;
  level: number;
  skillName: string;
  displayName: string;
  category: string;
  xp: number;
}

export default function SkillTracker() {
  const { user } = useAuth();
  const [skills, setSkills] = useState<UserSkill[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [level, setLevel] = useState<number>(0);
  const [xp, setXp] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  // Загружаем навыки пользователя при монтировании компонента
  useEffect(() => {
    const fetchSkills = async () => {
      if (user) {
        setLoading(true);
        const userSkills = await getUserSkills();
        setSkills(userSkills);
        setLoading(false);
      }
    };

    fetchSkills();
  }, [user]);

  // Получаем уровень выбранного навыка
  useEffect(() => {
    const fetchSkillLevel = async () => {
      if (user && selectedSkill) {
        setLoading(true);
        const skillLevel = await getLevel(user.id, selectedSkill);
        setLevel(skillLevel.level);
        setXp(skillLevel.xp);
        setLoading(false);
      }
    };

    fetchSkillLevel();
  }, [user, selectedSkill]);

  // Обработчик изменения навыка
  const handleSkillChange = (value: string) => {
    setSelectedSkill(value);
  };

  // Функция обновления навыка
  const handleUpdateSkill = async (deltaLevel: number, deltaXp: number) => {
    if (!user || !selectedSkill) {
      setMessage('Выберите навык для обновления');
      return;
    }

    setLoading(true);
    const result = await updateSkill(user.id, selectedSkill, deltaLevel, deltaXp);
    setLoading(false);

    if (result.success) {
      setMessage(`Навык успешно обновлен! Уровень: ${result.data.newLevel}`);
      setLevel(result.data.newLevel);
      setXp(result.data.xp + deltaXp);
      
      // Обновляем список навыков
      const userSkills = await getUserSkills();
      setSkills(userSkills);
    } else {
      setMessage('Ошибка при обновлении навыка');
    }
  };

  // Функция создания навыка (выбор не из списка)
  const handleCreateSkill = async () => {
    const skillName = prompt('Введите название навыка (например, prompt_engineering):');
    if (!skillName || !user) return;

    setLoading(true);
    const result = await updateSkill(user.id, skillName, 1, 10);
    setLoading(false);

    if (result.success) {
      setMessage(`Навык ${skillName} успешно создан!`);
      setSelectedSkill(skillName);
      
      // Обновляем список навыков
      const userSkills = await getUserSkills();
      setSkills(userSkills);
    } else {
      setMessage('Ошибка при создании навыка');
    }
  };

  // Список предустановленных навыков
  const predefinedSkills = [
    { name: 'prompt_engineering', displayName: 'Prompt Engineering' },
    { name: 'ai_ethics', displayName: 'AI Ethics' },
    { name: 'machine_learning', displayName: 'Machine Learning' },
    { name: 'data_analysis', displayName: 'Data Analysis' },
    { name: 'python', displayName: 'Python' },
  ];

  return (
    <Card className="w-full max-w-lg">
      <CardHeader>
        <CardTitle>Мои навыки</CardTitle>
        <CardDescription>Отслеживайте свой прогресс в различных навыках</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-4">Загрузка...</div>
        ) : (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-1">Выберите навык:</label>
              <Select value={selectedSkill} onValueChange={handleSkillChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Выберите навык" />
                </SelectTrigger>
                <SelectContent>
                  {skills.length > 0 ? (
                    skills.map((skill) => (
                      <SelectItem key={skill.skillId} value={skill.skillName}>
                        {skill.displayName} (Уровень: {skill.level})
                      </SelectItem>
                    ))
                  ) : (
                    predefinedSkills.map((skill) => (
                      <SelectItem key={skill.name} value={skill.name}>
                        {skill.displayName}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {selectedSkill && (
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">Текущий уровень: {level}</span>
                    <span className="text-sm">XP: {xp}</span>
                  </div>
                  <Progress value={(level / 100) * 100} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  {skills.length > 0 &&
                    skills
                      .filter((skill) => skill.skillName === selectedSkill)
                      .map((skill) => (
                        <Badge key={skill.id} variant="outline" className="px-2 py-1">
                          {skill.category}
                        </Badge>
                      ))}
                </div>

                {message && (
                  <div className="bg-muted p-2 rounded text-sm">
                    {message}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </CardContent>
      <CardFooter className="flex flex-wrap gap-2">
        <Button
          onClick={() => handleUpdateSkill(1, 10)}
          disabled={loading || !selectedSkill}
          size="sm"
        >
          +1 уровень
        </Button>
        <Button
          onClick={() => handleUpdateSkill(0, 20)}
          disabled={loading || !selectedSkill}
          size="sm"
          variant="outline"
        >
          +20 XP
        </Button>
        <Button
          onClick={handleCreateSkill}
          disabled={loading}
          size="sm"
          variant="secondary"
        >
          Создать навык
        </Button>
      </CardFooter>
    </Card>
  );
}