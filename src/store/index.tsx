import { combineReducers, configureStore } from '@reduxjs/toolkit';

import { allFixedAssetReducers } from '@/store/fixed_asset';
import { allGeneralLedgerReducers } from '@/store/general_ledger';
import { allInventoryReducers } from '@/store/inventory';
import themeConfigSlice from '@/store/themeConfigSlice';

const rootReducer = combineReducers({
  ...allFixedAssetReducers,
  ...allGeneralLedgerReducers,
  ...allInventoryReducers,
  themeConfig: themeConfigSlice,
});

export default configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type IRootState = ReturnType<typeof rootReducer>;
