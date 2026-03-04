import React, { useContext, useState } from 'react';
import { useIntl } from 'react-intl';
import { Trophy, Star, Crown, Target, Medal, Sparkles, Gift, Zap, Award, TrendingUp, BadgeDollarSign, Users, ShoppingCart } from 'lucide-react';
import { ThemeContext } from '../lib/theme.ts';
import { PageHeader } from '../components/PageHeader';

const getAchievementCategories = (intl: ReturnType<typeof useIntl>) => [
  { id: 'sales', nameKey: 'pages.achievements.category.sales', icon: BadgeDollarSign, color: 'text-green-500', bgColor: 'bg-green-500/10' },
  { id: 'customers', nameKey: 'pages.achievements.category.customers', icon: Users, color: 'text-blue-500', bgColor: 'bg-blue-500/10' },
  { id: 'products', nameKey: 'pages.achievements.category.products', icon: ShoppingCart, color: 'text-purple-500', bgColor: 'bg-purple-500/10' }
];

const achievements = [
  {
    id: 1,
    category: 'sales',
    icon: Star,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    completed: true,
    completedAt: "15/01/2024",
    reward: { type: "badge", rewardKey: 1 }
  },
  {
    id: 2,
    category: 'sales',
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    completed: true,
    completedAt: "01/02/2024",
    reward: { type: "discount", rewardKey: 2 }
  },
  {
    id: 3,
    category: 'sales',
    icon: Medal,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    completed: true,
    completedAt: "10/02/2024",
    reward: { type: "discount", rewardKey: 3 }
  },
  {
    id: 4,
    category: 'sales',
    icon: Crown,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    completed: false,
    progress: 85,
    currentValue: 85000,
    targetValue: 100000,
    reward: { type: "discount", rewardKey: 4 }
  },
  {
    id: 5,
    category: 'sales',
    icon: Sparkles,
    color: "text-pink-500",
    bgColor: "bg-pink-500/10",
    completed: false,
    progress: 35,
    currentValue: 350000,
    targetValue: 1000000,
    reward: { type: "discount", rewardKey: 5 }
  },
  {
    id: 6,
    category: 'customers',
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
    completed: true,
    completedAt: "20/01/2024",
    reward: { type: "feature", rewardKey: 6 }
  },
  {
    id: 7,
    category: 'customers',
    icon: TrendingUp,
    color: "text-green-500",
    bgColor: "bg-green-500/10",
    completed: false,
    progress: 45,
    currentValue: 45,
    targetValue: 100,
    reward: { type: "feature", rewardKey: 7 }
  },
  {
    id: 8,
    category: 'products',
    icon: ShoppingCart,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
    completed: true,
    completedAt: "25/01/2024",
    reward: { type: "feature", rewardKey: 8 }
  },
  {
    id: 9,
    category: 'products',
    icon: Award,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
    completed: false,
    progress: 20,
    currentValue: 10,
    targetValue: 50,
    reward: { type: "feature", rewardKey: 9 }
  }
];

export default function Achievements() {
  const intl = useIntl();
  const { isDarkMode } = useContext(ThemeContext);
  const [selectedCategory, setSelectedCategory] = useState('sales');
  const achievementCategories = getAchievementCategories(intl);

  const filteredAchievements = achievements.filter(
    achievement => achievement.category === selectedCategory
  );

  const completedCount = achievements.filter(a => a.completed).length;
  const totalCount = achievements.length;
  const currentLevel = achievements.filter(a => a.completed && a.reward.type === 'discount')
    .reduce((max, current) => {
      const name = intl.formatMessage({ id: `pages.achievements.${current.reward.rewardKey}.rewardName` });
      const discount = parseInt(name);
      return !isNaN(discount) && discount > max ? discount : max;
    }, 0);

  const nextAchievement = achievements.find(a => !a.completed && a.reward.type === 'discount');
  const nextLevel = nextAchievement ? intl.formatMessage({ id: `pages.achievements.${nextAchievement.reward.rewardKey}.rewardName` }) : '';

  return (
    <>
      <PageHeader
        title={intl.formatMessage({ id: 'pages.achievements.title' })}
        description={intl.formatMessage({ id: 'pages.achievements.description' })}
      />

      <div className="p-4 lg:p-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Trophy className="text-[var(--primary-color)]" size={20} />
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'pages.achievements.total' })}</span>
            </div>
            <p className="text-2xl font-bold">{completedCount}/{totalCount}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Star className="text-amber-500" size={20} />
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'pages.achievements.currentLevel' })}</span>
            </div>
            <p className="text-2xl font-bold">{currentLevel}% {intl.formatMessage({ id: 'pages.achievements.discountSuffix' })}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Gift className="text-green-500" size={20} />
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'pages.achievements.activeRewards' })}</span>
            </div>
            <p className="text-2xl font-bold">{completedCount}</p>
          </div>

          <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} p-5 rounded-xl border`}>
            <div className="flex items-center gap-2 mb-3">
              <Zap className="text-blue-500" size={20} />
              <span className="text-sm text-gray-400">{intl.formatMessage({ id: 'pages.achievements.nextLevel' })}</span>
            </div>
            <p className="text-2xl font-bold">{nextLevel}</p>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {achievementCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-lg transition-colors whitespace-nowrap
                ${selectedCategory === category.id
                  ? `${category.bgColor} ${category.color}`
                  : isDarkMode
                    ? 'bg-[var(--card-background)] text-gray-400 hover:text-white'
                    : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
                }
              `}
            >
              <category.icon size={20} />
              <span>{intl.formatMessage({ id: category.nameKey })}</span>
            </button>
          ))}
        </div>

        {/* Timeline */}
        <div className={`${isDarkMode ? 'bg-[var(--card-background)] border-white/5' : 'bg-white border-gray-200'} rounded-xl border p-6`}>
          <div className="space-y-6">
            {filteredAchievements.map((achievement, index) => (
              <div key={achievement.id} className="relative">
                {/* Connecting Line */}
                {index < filteredAchievements.length - 1 && (
                  <div 
                    className={`absolute left-6 top-12 bottom-0 w-0.5 ${
                      achievement.completed ? 'bg-[var(--primary-color)]' : isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-200'
                    }`}
                  />
                )}

                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className={`relative z-10 w-12 h-12 rounded-xl flex items-center justify-center ${
                    achievement.completed ? achievement.bgColor : isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-100'
                  }`}>
                    <achievement.icon 
                      size={24} 
                      className={achievement.completed ? achievement.color : 'text-gray-400'} 
                    />
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-medium">{intl.formatMessage({ id: `pages.achievements.${achievement.id}.title` })}</h3>
                      {achievement.completed && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/10 text-green-500">
                          {intl.formatMessage({ id: 'pages.achievements.completed' })}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{intl.formatMessage({ id: `pages.achievements.${achievement.id}.description` })}</p>
                    
                    {achievement.completed ? (
                      <p className="text-sm text-gray-400">
                        {intl.formatMessage({ id: 'pages.achievements.completedAt' })} {achievement.completedAt}
                      </p>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 h-2 bg-gray-700/20 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-[var(--primary-color)] rounded-full"
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <span className="text-sm text-gray-400">
                            {achievement.currentValue?.toLocaleString('pt-BR', { 
                              style: achievement.category === 'sales' ? 'currency' : 'decimal',
                              currency: 'BRL'
                            })} / {achievement.targetValue?.toLocaleString('pt-BR', {
                              style: achievement.category === 'sales' ? 'currency' : 'decimal',
                              currency: 'BRL'
                            })}
                          </span>
                        </div>
                      </div>
                    )}

                    <div className={`mt-3 p-3 rounded-lg ${isDarkMode ? 'bg-[var(--card-background)]' : 'bg-gray-50'}`}>
                      <div className="flex items-center gap-2">
                        <Gift size={16} className="text-[var(--primary-color)]" />
                        <div>
                          <span className="text-sm font-medium">{intl.formatMessage({ id: `pages.achievements.${achievement.reward.rewardKey}.rewardName` })}</span>
                          <p className="text-xs text-gray-400">{intl.formatMessage({ id: `pages.achievements.${achievement.reward.rewardKey}.rewardDesc` })}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}