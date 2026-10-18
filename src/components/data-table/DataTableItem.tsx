import { StatusPill } from './StatusPill';
import { DataTableItemData } from './types';

type Props = {
  item: DataTableItemData;
  onClick?: (item: DataTableItemData) => void;
};

export default function DataTableItem({ item, onClick }: Props) {
  const { id, status, category, raisedOn, date } = item;

  return (
    <>
      {/* Desktop */}
      <div onClick={() => onClick?.(item)} className="dt-row-desktop">
        <div className="dt-cell-title">{id}</div>

        <StatusPill label={status} />

        <div className="flex flex-col gap-1">
          <span className="dt-cell-title">{category.title}</span>
          {category.description && <span className="dt-cell-subtitle">{category.description}</span>}
        </div>

        <div>
          <span className="dt-cell-subtitle">Raised On</span>
          <div className="dt-cell-title">{raisedOn}</div>
        </div>

        <div>
          <span className="dt-cell-subtitle">{date.label}</span>
          <div className="dt-cell-title">{date.value}</div>
        </div>

        <div className="dt-action">VIEW DETAILS</div>
      </div>

      {/* Mobile */}
      <div onClick={() => onClick?.(item)} className="dt-row-mobile">
        <div className="dt-mobile-left">
          <StatusPill label={status} />

          <div>
            <p className="dt-cell-title">{category.title}</p>
            {category.description && <p className="dt-cell-subtitle">{category.description}</p>}
          </div>

          <p className="dt-cell-subtitle">
            Ticket no. <span className="dt-cell-title">#{id}</span>
          </p>
        </div>

        <div className="dt-mobile-right">
          <img src="/assets/svg/chevron-right-arrow.svg" alt="chevron-right-icon" />
          {/* <ChevronRightIcon className="h-4 w-4 text-gray-400" /> */}

          <div className="dt-mobile-meta">
            <p>
              <span className="dt-cell-subtitle">Raised:</span>{' '}
              <span className="dt-cell-title">{raisedOn}</span>
            </p>
            <p>
              <span className="dt-cell-subtitle">{date.label.replace(' On', '')}:</span>{' '}
              <span className="dt-cell-title">{date.value}</span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
