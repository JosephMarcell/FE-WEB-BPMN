import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface BillOfMaterialObject {
  item_detail_pkid: number;
  item_name: string;
  quantity: number;
  unique_parent: number;
  item_code: string;
  level?: number;
  childBomDetails: BillOfMaterialObject[];
}

export const initialStateBillOfMaterialObject: BillOfMaterialObject = {
  item_detail_pkid: 0,
  item_name: '',
  quantity: 0,
  unique_parent: 0,
  item_code: 'IEP',
  level: 0,
  childBomDetails: [],
};

export interface BillOfMaterialState {
  tree: BillOfMaterialObject;
}

const initialState: BillOfMaterialState = {
  tree: initialStateBillOfMaterialObject,
};

const addItemToParent = (
  parentNode: BillOfMaterialObject,
  parentId: number,
  newItem: BillOfMaterialObject,
): boolean => {
  const isItemPkidExistAtLevel = (
    node: BillOfMaterialObject,
    itemPkid: number,
  ): boolean => {
    for (const child of node.childBomDetails) {
      if (child.item_detail_pkid === itemPkid) {
        return true;
      }
    }
    return false;
  };

  if (parentNode.unique_parent === parentId) {
    if (isItemPkidExistAtLevel(parentNode, newItem.item_detail_pkid)) {
      return false;
    }
    parentNode.childBomDetails.push(newItem);
    return true;
  }

  for (const child of parentNode.childBomDetails) {
    if (addItemToParent(child, parentId, newItem)) {
      return true;
    }
  }

  return false;
};
const billOfMaterialSlice = createSlice({
  name: 'billOfMaterial',
  initialState,
  reducers: {
    handleSetBillOfMaterial: (
      state,
      action: PayloadAction<BillOfMaterialObject>,
    ) => {
      state.tree = action.payload;
    },
    handleAddItemParent: (
      state,
      action: PayloadAction<BillOfMaterialObject>,
    ) => {
      state.tree = action.payload;
    },
    handleAddItemBillOfMaterial: (
      state,
      action: PayloadAction<{
        parentId: number;
        newItem: BillOfMaterialObject;
      }>,
    ) => {
      const { parentId, newItem } = action.payload;
      addItemToParent(state.tree, parentId, newItem);
    },
    handleClearBillOfMaterial: state => {
      state.tree = initialStateBillOfMaterialObject;
    },
    handleDeleteItemBillOfMaterialNode: (
      state,
      action: PayloadAction<number>,
    ) => {
      const deleteNode = (parentNode: BillOfMaterialObject): boolean => {
        for (let i = 0; i < parentNode.childBomDetails.length; i++) {
          if (parentNode.childBomDetails[i].unique_parent === action.payload) {
            parentNode.childBomDetails.splice(i, 1);
            return true;
          }
          if (deleteNode(parentNode.childBomDetails[i])) {
            return true;
          }
        }
        return false;
      };
      deleteNode(state.tree);
    },
  },
});

export const {
  handleSetBillOfMaterial,
  handleAddItemBillOfMaterial,
  handleAddItemParent,
  handleClearBillOfMaterial,
  handleDeleteItemBillOfMaterialNode,
} = billOfMaterialSlice.actions;
export default billOfMaterialSlice.reducer;
