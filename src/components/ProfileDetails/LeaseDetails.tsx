import { formatLeaseDate } from 'lib/utils/helper';
import { Input } from 'src/components/common/Input';
import { useParkingStorage } from './useParkingStorage';

type LeaseDetailsProps = {
  fields: any;
  tCode: string | null;
};

export default function LeaseDetails({ fields, tCode }: LeaseDetailsProps) {
  const { parkingSpaces, storageSpaces, hasParking, hasStorage, hasAny } = useParkingStorage(tCode);

  return (
    <div className="pb-4 md:pb-8 form-group">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6">
        <Input
          label="Community name"
          value={fields?.Tenant_Project_Name ? fields?.Tenant_Project_Name : `-`}
          disabled
          showClearButton={false}
        />
        <Input
          label="Building number"
          value={fields?.Property_Code ? fields?.Property_Code : `-`}
          disabled
          showClearButton={false}
        />

        <Input
          label="Unit number"
          value={fields?.Unit_Code ? fields?.Unit_Code : `-`}
          disabled
          showClearButton={false}
        />
        <Input
          label="Tenant number"
          value={fields?.Tenant_Code ? fields?.Tenant_Code : `-`}
          disabled
          showClearButton={false}
        />

        <Input
          label="DEWA premise number"
          value={fields?.Dewa_Premise_Number ? fields?.Dewa_Premise_Number : `-`}
          disabled
          showClearButton={false}
        />
        <Input
          label="Lease start date"
          value={fields?.Lease_Start_Date ? formatLeaseDate(fields?.Lease_Start_Date) : `-`}
          disabled
          showClearButton={false}
        />

        <Input
          label="Lease renewal date"
          value={fields?.Lease_End_Date ? formatLeaseDate(fields?.Lease_End_Date) : `-`}
          disabled
          showClearButton={false}
        />
        <Input
          label="Lease period"
          value={fields?.Lease_Term ? `${fields?.Lease_Term} Months` : `-`}
          disabled
          showClearButton={false}
        />

        <Input
          label="Lease type"
          value={fields?.Lease_Type ? fields?.Lease_Type : `-`}
          disabled
          showClearButton={false}
        />
        <Input
          label="Payment terms"
          value={fields?.Payment_Terms ? `${fields?.Payment_Terms} Installments` : `-`}
          disabled
          showClearButton={false}
        />

        <Input
          label="Lease amount"
          value={fields?.Lease_Amount ? `AED ${fields?.Lease_Amount}` : `-`}
          disabled
          showClearButton={false}
        />
      </div>

      {hasAny && (
        <div className="mt-6 md:mt-8">
          <h3 className="text-heading-3 font-normal text-navy-500 mb-4 md:mb-5">
            Parking and storage spaces
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 md:gap-x-6 gap-y-4">
            {hasParking && (
              <div className="flex flex-col gap-2">
                <p className="text-body font-light text-navy-500 mb-0">Parking spaces</p>
                <div className="rounded-xl bg-silver-chalice-100 px-4 py-3">
                  {parkingSpaces.map((code) => (
                    <p
                      key={code}
                      className="text-body-sm font-normal text-navy-500 mb-0 leading-relaxed"
                    >
                      {code}
                    </p>
                  ))}
                </div>
              </div>
            )}
            {hasStorage && (
              <div className="flex flex-col gap-2">
                <p className="text-body font-light text-navy-500 mb-0">Storage spaces</p>
                <div className="rounded-xl bg-silver-chalice-100 px-4 py-3">
                  {storageSpaces.map((code) => (
                    <p
                      key={code}
                      className="text-body-sm font-normal text-navy-500 mb-0 leading-relaxed"
                    >
                      {code}
                    </p>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
