export interface WorkCentreProperty {
  name: string | null;
  location: string | null;
}

export const workCentreInitialState: WorkCentreProperty = {
  name: null,
  location: null,
};
