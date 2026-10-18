import React from 'react';
import Tabs from 'src/common/Tabx';
import Documents from './Documents';
import { useDocuments } from './useDocuments';
import { DocumentsSkeleton } from './DocumentsSkeleton';

const DocumentsPage = ({ fields }: any) => {
  const documentsState = useDocuments();

  return (
    <section className="DocumentsPage">
      {documentsState?.isLoading ? (
        <DocumentsSkeleton />
      ) : (
        <Tabs
          tabs={[
            {
              id: 1,
              label: 'PERSONAL',
              content: (
                <Documents
                  fields={fields}
                  documentType="PERSONAL"
                  documentsState={documentsState}
                />
              ),
            },
            {
              id: 2,
              label: 'UTILITY',
              content: (
                <Documents fields={fields} documentType="UTILITY" documentsState={documentsState} />
              ),
            },
            {
              id: 3,
              label: 'CONTRACT',
              content: (
                <Documents
                  fields={fields}
                  documentType="CONTRACT"
                  documentsState={documentsState}
                />
              ),
            },
          ]}
        />
      )}
    </section>
  );
};

export default DocumentsPage;
