export type DataTableHeaderColumn = {
  key: string;
  label: string;
};

export type DataTableItemData = {
  id: string;
  status: string;
  category: {
    title: string;
    description?: string;
  };
  raisedOn: string;
  date: {
    label: 'Scheduled On' | 'Closed On';
    value: string;
  };
};
