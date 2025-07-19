interface LevelBadgeProps {
  level: string;
  variant?: 'default' | 'outline' | 'secondary';
  className?: string;
}

const levelColors = {
  'Новичок': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'Базовый': 'bg-blue-500/10 text-blue-400 border-blue-500/20', 
  'Средний': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'Продвинутый': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'Эксперт': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  'beginner': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  'intermediate': 'bg-yellow-500/10 text-yellow-400 border-yellow-500/20',
  'advanced': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  'expert': 'bg-purple-500/10 text-purple-400 border-purple-500/20'
};

export default function LevelBadge({ level, variant = 'default', className = '' }: LevelBadgeProps) {
  const colorClasses = levelColors[level as keyof typeof levelColors] || levelColors['beginner'];
  
  return (
    <span className={`
      inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
      border ${colorClasses} ${className}
    `}>
      {level}
    </span>
  );
}
