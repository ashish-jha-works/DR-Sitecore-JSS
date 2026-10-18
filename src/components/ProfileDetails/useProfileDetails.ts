import { useCallback, useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';
import { useUserStore } from 'src/store/useUserStore';

const mapProfileResponse = (response: any) => {
  const tenant = response.Tenant_Details[0];
  const address = `${tenant.Tenant_Project_Name}, ${tenant.Property_Code}, ${tenant.Unit_Code}`;

  const occupantList: any[] = [];
  const householdList: any[] = [];
  response?.Occupant_Details?.forEach((item: any) => {
    if (item.Occupant_Relation === 'Maid') {
      householdList.push(item);
    } else {
      occupantList.push(item);
    }
  });

  return {
    address,
    tenantDetails: tenant,
    occupantDetails: occupantList,
    householdDetails: householdList,
    petDetails: response.Pet_Details ?? [],
  };
};

export const useProfileDetails = (editProfile: number = 0) => {
  const { tCode } = useUserStore();
  const [address, setAddress] = useState<string | null>(null);
  const [tenantDetails, setTenantDetails] = useState<any>({});
  const [occupantDetails, setOccupantDetails] = useState<any>([]);
  const [householdDetails, setHouseholdDetails] = useState<any>([]);
  const [petDetails, setPetDetails] = useState<any>([]);

  const { mutate: loadDetails } = useApiMutation<any, any>(
    `/Yardi/GetDetails?tCode=${tCode}`,
    'GET',
    false
  );

  const refetchTenantDetails = useCallback(() => {
    if (!tCode || Number(editProfile) !== 1) return;

    loadDetails(null, {
      onSuccess: (response: any) => {
        const mapped = mapProfileResponse(response);
        setAddress(mapped.address);
        setTenantDetails(mapped.tenantDetails);
        setOccupantDetails(mapped.occupantDetails);
        setHouseholdDetails(mapped.householdDetails);
        setPetDetails(mapped.petDetails);
      },
    });
  }, [tCode, editProfile, loadDetails]);

  useEffect(() => {
    refetchTenantDetails();
  }, [refetchTenantDetails]);

  return {
    address,
    tenantDetails,
    occupantDetails,
    householdDetails,
    petDetails,
    tCode,
    refetchTenantDetails,
  };
};
