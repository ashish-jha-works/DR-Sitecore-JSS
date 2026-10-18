import DataTableHeader from 'components/data-table/DataTableHeader';
import DataTableItem from 'components/data-table/DataTableItem';
import { DataTableItemData } from 'components/data-table/types';

const columns = [
  { key: 'srid', label: 'SR ID' },
  { key: 'status', label: 'Status' },
  { key: 'category', label: 'Category' },
  { key: 'raised', label: 'Raised On' },
  { key: 'date', label: 'Date' },
  { key: 'action', label: '' },
];

const tickets: DataTableItemData[] = [
  {
    id: '228936',
    status: 'Open',
    category: {
      title: 'Air Conditioning',
      description: 'A/C remote control not working',
    },
    raisedOn: '04/04/2025',
    date: {
      label: 'Scheduled On',
      value: '10/04/2025',
    },
  },
  {
    id: '223634',
    status: 'Closed',
    category: {
      title: 'Windows',
      description: "Window won't open/close",
    },
    raisedOn: '25/03/2025',
    date: {
      label: 'Closed On',
      value: '10/04/2025',
    },
  },
];

export default function MaintenanceTickets() {
  return (
    <div className="rounded-xl border border-gray-200">
      <DataTableHeader columns={columns} />

      {tickets.map((ticket) => (
        <DataTableItem key={ticket.id} item={ticket} />
      ))}
    </div>
  );
}
