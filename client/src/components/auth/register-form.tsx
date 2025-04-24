import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/context/auth-context";

// Схема валидации формы регистрации
const registerSchema = z.object({
  username: z.string()
    .min(3, { message: "Имя пользователя должно содержать не менее 3 символов" })
    .max(50, { message: "Имя пользователя не должно превышать 50 символов" }),
  email: z.string()
    .email({ message: "Введите корректный email адрес" }),
  password: z.string()
    .min(6, { message: "Пароль должен содержать не менее 6 символов" }),
  displayName: z.string()
    .min(2, { message: "Отображаемое имя должно содержать не менее 2 символов" })
    .max(50, { message: "Отображаемое имя не должно превышать 50 символов" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  // Инициализация формы с валидацией
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      displayName: "",
    },
  });

  // Обработчик отправки формы
  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    
    try {
      // Отправка запроса на регистрацию
      const response = await apiRequest("POST", "/api/auth/register", data);
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Ошибка при регистрации");
      }
      
      // Получаем данные пользователя из ответа
      const userData = await response.json();
      
      // Обновляем состояние аутентификации
      login(userData);
      
      // Успешная регистрация
      toast({
        title: "Регистрация успешна",
        description: "Вы успешно зарегистрировались. Добро пожаловать!",
      });
      
      // Перенаправление на главную панель (dashboard)
      // Модальное окно приветствия будет показано автоматически на dashboard
      setLocation("/dashboard");
    } catch (error) {
      console.error("Ошибка регистрации:", error);
      toast({
        title: "Ошибка регистрации",
        description: error instanceof Error ? error.message : "Произошла ошибка при регистрации",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя пользователя</FormLabel>
              <FormControl>
                <Input 
                  placeholder="username" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input 
                  type="email"
                  placeholder="email@example.com" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="displayName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Отображаемое имя</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Ваше имя" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Пароль</FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••" 
                  {...field} 
                  disabled={isLoading}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Регистрация...
            </>
          ) : (
            "Зарегистрироваться"
          )}
        </Button>
      </form>
    </Form>
  );
}