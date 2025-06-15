export interface ItemCategoryProperty {
  pkid?: number;
  name: string | null;
  code: string | null;
  description: string | null;
}

export const itemCategoryInitialState: ItemCategoryProperty = {
  name: null,
  code: null,
  description: null,
};
