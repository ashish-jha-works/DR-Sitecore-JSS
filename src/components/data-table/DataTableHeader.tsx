import { DataTableHeaderColumn } from './types';

type Props = {
  columns: DataTableHeaderColumn[];
};

export default function DataTableHeader({ columns }: Props) {
  return (
    <div className="dt-header">
      {columns.map((col, index) => (
        <div key={`${col.key}-${index}`} className="dt-header-cell">
          {col.label}
        </div>
      ))}
    </div>
  );
}
