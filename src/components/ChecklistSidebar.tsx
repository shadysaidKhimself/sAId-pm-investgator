import type { ChecklistItem } from '../lib/types';

interface ChecklistSidebarProps {
  items: ChecklistItem[];
}

export function ChecklistSidebar({ items }: ChecklistSidebarProps) {
  const doneCount = items.filter((i) => i.status === 'done').length;
  const total = items.length;
  const progress = total > 0 ? (doneCount / total) * 100 : 0;

  return (
    <aside className="hidden lg:flex w-2.5 bg-gray-100 dark:bg-gray-900 shrink-0 relative overflow-hidden">
      <div
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-brand-400 to-brand-500 transition-all duration-700 ease-in-out"
        style={{ height: `${progress}%` }}
      />
    </aside>
  );
}
