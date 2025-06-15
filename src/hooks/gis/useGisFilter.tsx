/* eslint-disable @typescript-eslint/no-explicit-any */

import { create } from 'zustand';

export const useGisFilter = create(set => ({
  currentPage: null,
  params: null,
  setFilter: (data: any) => set(data),
}));

export const useProvincies = create(set => ({
  data: [],
  setProvincies: (data: any) => set({ data }),
}));
