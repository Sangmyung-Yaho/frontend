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

const items: Array<{ id: NavigationItem; label: string; icon: string }> = [
  { id: 'home', label: '홈', icon: homeIcon },
  { id: 'analysis', label: '분석', icon: analysisIcon },
  { id: 'mission', label: '미션', icon: missionIcon },
  { id: 'my', label: '마이', icon: myIcon },
];

function BottomNavigation({ activeItem, onChange, className = '' }: BottomNavigationProps) {
  return (
    <nav
      aria-label="하단 메뉴"
      className={`flex w-full max-w-[393px] border-t border-gray-100 bg-white ${className}`}
    >
      {items.map(({ id, label, icon }) => {
        const isActive = activeItem === id;

        return (
          <button
            key={id}
            type="button"
            aria-current={isActive ? 'page' : undefined}
            onClick={() => onChange?.(id)}
            className="flex min-w-0 flex-1 flex-col items-center gap-2 py-3 text-text-primary focus-visible:outline-2 focus-visible:outline-inset focus-visible:outline-main-500"
          >
            <span
              aria-hidden="true"
              className={`h-7 w-7 ${isActive ? 'bg-main-500' : 'bg-gray-300'}`}
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
            <span className="text-body-small">{label}</span>
          </button>
        );
      })}
    </nav>
  );
}

export default BottomNavigation;
