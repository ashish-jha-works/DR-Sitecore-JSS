import { Accordion } from 'src/components/common/Accordion';
import UserDetails from 'src/components/UserDetails/UserDetails';
import ContactDetails from './ContactDetails';
import DependentsDetails from './DependentsDetails';
import LeaseDetails from './LeaseDetails';
import { useProfileDetails } from './useProfileDetails';

export default function ProfileDetails({ fields }: any) {
  const {
    address,
    tenantDetails,
    occupantDetails,
    householdDetails,
    petDetails,
    tCode,
    refetchTenantDetails,
  } = useProfileDetails(fields?.editProfile?.value);

  return (
    <div className="bg-silver-chalice-50 pb-12 md:pb-16">
      <UserDetails fields={{ ...fields, tenantDetails, address, tCode }} />
      <div className="container-sm mt-4 md:mt-5 flex flex-col gap-3">
        <div className="bg-white-pure border border-lilac-300 rounded-lg px-4 md:px-8">
          <Accordion
            title={fields?.contactDetailsTitle}
            leadingIcon={fields?.contactDetailsIcon}
            defaultOpen
            version={2}
            className="!border-b-0 !py-0 [&>div:first-child]:min-h-[84px] [&>div:first-child]:justify-center"
          >
            <ContactDetails fields={tenantDetails} tCode={tCode} onSaved={refetchTenantDetails} />
          </Accordion>
        </div>

        <div className="bg-white-pure border border-lilac-300 rounded-lg px-4 md:px-8">
          <Accordion
            title={fields?.leaseDetailsTitle}
            leadingIcon={fields?.leaseDetailsIcon}
            version={2}
            className="!border-b-0 !py-0 [&>div:first-child]:min-h-[84px] [&>div:first-child]:justify-center"
          >
            <LeaseDetails fields={tenantDetails} tCode={tCode} />
          </Accordion>
        </div>

        <div className="bg-white-pure border border-lilac-300 rounded-lg px-4 md:px-8">
          <Accordion
            title={fields?.dependentsDetailsTitle}
            leadingIcon={fields?.dependentsDetailsIcon}
            version={2}
            className="!border-b-0 !py-0 [&>div:first-child]:min-h-[84px] [&>div:first-child]:justify-center"
          >
            <DependentsDetails
              fields={{ ...fields, occupantDetails, householdDetails, petDetails }}
              tCode={tCode}
              parentTenantCode={tenantDetails?.Tenant_Code}
              onSaved={refetchTenantDetails}
            />
          </Accordion>
        </div>
      </div>
    </div>
  );
}
