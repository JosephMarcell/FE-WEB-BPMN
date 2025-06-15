export interface ManProperty {
  skill: string | null;
  position: string | null;
}

export const manInitialState: ManProperty = {
  skill: null,
  position: null,
};
