import { useQuery, useMutation } from '@tanstack/react-query';
import apiClient from 'lib/api-client';

// GENERIC GET HOOK
export function useApiGet<T>(
  key: any[],
  url: string,
  enabled = true,
  headers?: Record<string, string> // Added headers
) {
  return useQuery<T>({
    queryKey: key,
    queryFn: async () => {
      const { data } = await apiClient.get<T>(url, { headers }); // Pass headers to axios
      return data;
    },
    enabled,
  });
}

// GENERIC POST/PUT/DELETE HOOK
export function useApiMutation<TRequest, TResponse>(
  url: string | ((variables: TRequest) => string),
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'POST',
  showLoader = false,
  getBody?: (variables: TRequest) => any,
  defaultHeaders?: Record<string, string>
) {
  return useMutation<TResponse, Error, TRequest>({
    mutationFn: async (variables) => {
      // 1. Safely handle variables if they are undefined or not an object
      const safeVariables = variables && typeof variables === 'object' ? variables : ({} as any);

      // 2. Extract headers, default to empty object if not present
      const { _headers, ...data } = safeVariables;

      // 3. Determine actual data to send (if variables was just a string/id, use that)
      const actualData = variables && typeof variables !== 'object' ? variables : data;

      const finalUrl = typeof url === 'function' ? url(actualData) : url;
      const requestBody = getBody ? getBody(actualData) : actualData;

      const { data: responseData } = await apiClient({
        url: finalUrl,
        method,
        // Don't send a body for GET requests
        data: method === 'GET' ? undefined : requestBody,
        headers: { ...defaultHeaders, ..._headers },
        showLoader,
      } as any);

      return responseData;
    },
  });
}
