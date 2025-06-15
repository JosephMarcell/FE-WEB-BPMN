import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { InputHppProperty } from '@/helpers/utils/general_ledger/hppReport';

interface NormalDepreciationEntry {
  coa_pkid: number;
  machine_pkid: string | null;
  name: string;
  price: number;
}

interface HppData {
  persediaan_awal: number;
  pembelian: number;
  bahan_baku_tersedia: number;
  penyesuaian: number;
  persediaan_akhir: number;
  bahan_baku_langsung_terpakai: number;
  tenaga_kerja_langsung: number;
  total_overhead_mesin: number;
  pemeliharaan_mesin: number;
  biaya_listrik: number;
  biaya_air: number;
  total_overhead_manufaktur: number;
  total_tambah_biaya_manufaktur: number;
  bahan_dalam_proses_awal: number;
  total_biaya_manufaktur: number;
  bahan_dalam_proses_akhir: number;
  harga_pokok_produksi: number;
  persediaan_awal_produk_jadi: number;
  harga_pokok_barang_siap_jual: number;
  persediaan_akhir_produk_jadi: number;
  harga_pokok_penjualan: number;
  variance: number;
  normal_depreciation: NormalDepreciationEntry[];
  periods: InputHppProperty;
}

interface InitialState {
  hppData: HppData;
}

const initialStateHpp: InitialState = {
  hppData: {
    persediaan_awal: 0,
    pembelian: 0,
    bahan_baku_tersedia: 0,
    penyesuaian: 0,
    persediaan_akhir: 0,
    bahan_baku_langsung_terpakai: 0,
    tenaga_kerja_langsung: 0,
    total_overhead_mesin: 0,
    pemeliharaan_mesin: 0,
    biaya_listrik: 0,
    biaya_air: 0,
    total_overhead_manufaktur: 0,
    total_tambah_biaya_manufaktur: 0,
    bahan_dalam_proses_awal: 0,
    total_biaya_manufaktur: 0,
    bahan_dalam_proses_akhir: 0,
    harga_pokok_produksi: 0,
    persediaan_awal_produk_jadi: 0,
    harga_pokok_barang_siap_jual: 0,
    persediaan_akhir_produk_jadi: 0,
    harga_pokok_penjualan: 0,
    variance: 0,
    normal_depreciation: [],
    periods: {
      start_date: null,
      end_date: null,
    },
  },
};

const hppSlice = createSlice({
  name: 'hpp',
  initialState: initialStateHpp,
  reducers: {
    setHppData: (state, action: PayloadAction<HppData>) => {
      state.hppData = action.payload;
    },
  },
});

export const { setHppData } = hppSlice.actions;
export default hppSlice.reducer;
