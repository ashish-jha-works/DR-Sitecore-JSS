export type ServiceRequestAddressLines = {
  unitLine: string | null;
  propertyLine: string | null;
  cityLine: string | null;
};

export const parseCommunityLocationFromDescription = (
  problemDescription?: string | null
): string | null => {
  if (!problemDescription?.includes('$')) return null;
  const location = problemDescription.split('$')[1]?.trim();
  return location || null;
};

export const parseCommunityIssueDescription = (problemDescription?: string | null): string => {
  if (!problemDescription?.includes('$')) return problemDescription?.trim() ?? '';
  return problemDescription.split('$')[0]?.trim() ?? '';
};

export const normalizeCommunityServiceRequestDetails = <
  T extends Record<string, string | null | undefined>
>(
  serviceRequest: T
): T => {
  if (!serviceRequest?.Problem_Description?.includes('$')) {
    return serviceRequest;
  }

  const [description, location] = serviceRequest.Problem_Description.split('$');

  return {
    ...serviceRequest,
    Problem_Description: description?.trim() || serviceRequest.Problem_Description,
    Location: serviceRequest.Location?.trim() || location?.trim() || serviceRequest.Location,
  };
};

export const getServiceRequestAddressLines = (
  tenantDetails?: Record<string, string | null | undefined> | null,
  serviceRequest?: Record<string, string | null | undefined> | null
): ServiceRequestAddressLines => {
  const unitCode = (serviceRequest?.Unit_Code ?? tenantDetails?.Unit_Code ?? '').trim();
  const propertyCode = (tenantDetails?.Property_Code ?? '').trim();
  const projectName = (tenantDetails?.Tenant_Project_Name ?? '').trim();
  const zip = (tenantDetails?.Tenant_Zip ?? '').trim();

  const unitLine = unitCode ? `Unit #${unitCode}` : null;

  let propertyLine: string | null = null;
  if (propertyCode && projectName) {
    propertyLine = `Property #${propertyCode}, ${projectName}`;
  } else if (projectName) {
    propertyLine = projectName;
  } else if (propertyCode) {
    propertyLine = `Property #${propertyCode}`;
  }

  const cityLine = zip ? `Dubai, ${zip}` : 'Dubai';

  return { unitLine, propertyLine, cityLine };
};

export const getCommunityCareAddress = (
  serviceRequest?: Record<string, string | null | undefined> | null
): string | null => {
  const location = serviceRequest?.Location?.trim();
  if (location) return location;

  return parseCommunityLocationFromDescription(serviceRequest?.Problem_Description);
};
