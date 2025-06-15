// Asli
// import { useQuery } from '@tanstack/react-query';

// import AxiosService from '@/services/axiosService';

// export interface Log {
//   pkid: number;
//   actor_pkid: number;
//   actor_username: string;
//   actor_role: string;
//   ip_address: string;
//   office: string;
//   activity_time: string;
//   activity_type: string;
//   target_table: string;
//   target_pkid: number;
//   req_body: string | null;
// }

// export const useGetUserLogs = () => {
//   return useQuery<Log[], Error>({
//     queryKey: ['userLogs'],
//     queryFn: async () => {
//       const { data } = await AxiosService.AxiosServiceUserManagement.get(
//         '/log/get-log-user',
//       );
//       return data.data.map((log: Log) => ({
//         ...log,
//         activity_time: new Date(log.activity_time).toISOString(),
//       }));
//     },
//   });
// };

// Dummy
// Import data dummy
import { dummyUserLogs } from '@/__mocks__/profileDummyData';

export interface Log {
  pkid: number;
  actor_pkid: number;
  actor_username: string;
  actor_role: string;
  ip_address: string;
  office: string;
  activity_time: string;
  activity_type: string;
  target_table: string;
  target_pkid: number;
  req_body: string | null;
}

export const useGetUserLogs = () => {
  // Gunakan data dummy alih-alih memanggil API
  return {
    data: dummyUserLogs as Log[],
    isLoading: false,
    error: null as Error | null,
  };
};
