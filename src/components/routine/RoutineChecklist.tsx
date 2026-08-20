import { Checkbox } from '../common';
import type { RoutineItem } from '../../api/routines';

interface RoutineChecklistProps {
  routines: RoutineItem[];
  onToggle: (routine: RoutineItem) => void;
}

function RoutineChecklist({ routines, onToggle }: RoutineChecklistProps) {
  return (
    <section className="flex w-full flex-col gap-4">
      <h2 className="text-title-2 text-text-primary">오늘 추천 루틴</h2>
      <div className="flex flex-col gap-2">
        {routines.map((routine) => (
          <div
            key={routine.routine_id}
            className={`flex min-h-[54px] w-full items-center rounded-[10px] border p-4 transition-colors ${
              routine.is_completed ? 'border-main-500 bg-main-50' : 'border-gray-100 bg-card'
            }`}
          >
            <Checkbox
              checked={routine.is_completed}
              onChange={() => onToggle(routine)}
              label={routine.title}
              className="w-full gap-[9px] [&>span:first-of-type]:size-5 [&>span:first-of-type]:border [&>span:last-child]:text-caption-3"
            />
          </div>
        ))}
      </div>
    </section>
  );
}

export default RoutineChecklist;
