import analysisIcon from '../assets/icons/navigation/analysis.svg';
import homeIcon from '../assets/icons/navigation/home.svg';
import missionIcon from '../assets/icons/navigation/mission.svg';
import myIcon from '../assets/icons/navigation/my.svg';

export type NavigationItem = 'home' | 'analysis' | 'mission' | 'my';

export interface BottomNavigationProps {
  activeItem: NavigationItem;
  onChange?: (item: NavigationItem) => void;
  className?: string;
}

const items: Array<{ id: NavigationItem; label: string; icon: string; iconClassName: string }> = [
  { id: 'home', label: '홈', icon: homeIcon, iconClassName: 'h-[22px] w-5' },
  { id: 'analysis', label: '분석', icon: analysisIcon, iconClassName: 'size-5' },
  { id: 'mission', label: '미션', icon: missionIcon, iconClassName: 'size-[22px]' },
  { id: 'my', label: '마이', icon: myIcon, iconClassName: 'h-[23px] w-5' },
];

function BottomNavigation({ activeItem, onChange, className = '' }: BottomNavigationProps) {
  return (
    <nav
      aria-label="하단 메뉴"
      className={`flex h-[62px] w-[calc(100%-32px)] max-w-[361px] items-end justify-center gap-[clamp(48px,18vw,72px)] border-t border-gray-100 bg-background px-4 py-2 ${className}`}
    >
      {items.map(({ id, label, icon, iconClassName }) => {
        const isActive = activeItem === id;

        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange?.(id)}
            className="flex w-5 shrink-0 flex-col items-center gap-2 text-text-primary focus-visible:outline-2 focus-visible:outline-main-500"
          >
            <span
              aria-hidden="true"
              className={`${iconClassName} shrink-0 ${isActive ? 'bg-main-500' : 'bg-gray-300'}`}
              style={{
                WebkitMaskImage: `url("${icon}")`,
                maskImage: `url("${icon}")`,
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
              }}
            />
            <span className="whitespace-nowrap text-caption leading-[normal]">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavigation;
