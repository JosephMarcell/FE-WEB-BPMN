/* eslint-disable @typescript-eslint/no-explicit-any */

'use client';

import { create } from 'zustand';

import { COUNTRY } from '@/constant/detailMapModal';

export const useDetailMapModal = create(set => ({
  detailModal: COUNTRY, // country, province, city
  feature: null,
  updateModalDetail: (props: any) =>
    set({ detailModal: props.detailModal, feature: props.feature }),
}));
