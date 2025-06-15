/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';

export const useGisMap = create(set => ({
  allProvince: [],
  setAllProvince: (data: any[]) => set(() => ({ allProvince: data })),
}));
