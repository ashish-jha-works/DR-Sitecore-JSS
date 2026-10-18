type TableItemProps = {
  leftTitle: string;
  leftSubtitle?: string;
  rightTitle: string;
  rightSubtitle?: string;
  rightSubtitleLink?: string;
  rightLinkAction?: () => void;
  emphasis?: 'default' | 'total';
  isLastItem?: boolean;
};

export default function TableItem({
  leftTitle,
  leftSubtitle,
  rightTitle,
  rightSubtitle,
  rightSubtitleLink,
  rightLinkAction,
  emphasis = 'default',
  isLastItem = false,
}: TableItemProps) {
  const isTotal = emphasis === 'total';

  return (
    <div
      className={`flex items-start justify-between py-3
        border-b border-lilac-100 ${isLastItem ? 'border-none' : ''}`}
    >
      {/* Left column */}
      <div className="flex flex-col">
        <span className={`text-body text-navy-500 font-light ${isTotal ? 'font-semibold' : ''}`}>
          {leftTitle}
        </span>
        {leftSubtitle && <span className="text-body text-navy-400 font-light">{leftSubtitle}</span>}
      </div>

      {/* Right column */}
      <div className="flex flex-col gap-1 text-right">
        <span className={`text-body text-navy-500 font-light ${isTotal ? 'font-semibold' : ''}`}>
          {rightTitle}
        </span>
        {rightSubtitle && <span className="text-body text-navy-400">{rightSubtitle}</span>}
        {rightSubtitleLink && (
          <button
            className="text-body-sm font-medium underline uppercase text-sky-700 hover:text-sky-600 cursor-pointer tracking-[2px] lg:tracking-[1.4px]"
            onClick={rightLinkAction}
          >
            {rightSubtitleLink}
          </button>
        )}
      </div>
    </div>
  );
}
