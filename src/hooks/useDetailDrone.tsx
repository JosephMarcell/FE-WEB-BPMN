import { create } from 'zustand';

export const useDetailDrone = create(set => ({
  show: false,
  setShow: (value: boolean) => set({ show: value }),
}));
