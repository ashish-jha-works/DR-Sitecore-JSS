import { useEffect, useState } from 'react';
import { useApiMutation } from 'src/hooks/useApi';

export const useServiceRequestTenantDetails = (tCode: string | null) => {
  const [tenantDetails, setTenantDetails] = useState<Record<string, string | null> | null>(null);

  const { mutate: loadTenantDetails } = useApiMutation<any, any>(
    () => `/Yardi/GetDetails?tCode=${tCode}`,
    'GET',
    false
  );

  useEffect(() => {
    if (!tCode) return;

    loadTenantDetails(null, {
      onSuccess: (response) => {
        setTenantDetails(response?.Tenant_Details?.[0] ?? null);
      },
      onError: () => {
        setTenantDetails(null);
      },
    });
  }, [tCode, loadTenantDetails]);

  return tenantDetails;
};
