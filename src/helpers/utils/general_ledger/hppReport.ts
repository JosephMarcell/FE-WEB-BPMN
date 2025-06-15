export interface InputHppProperty {
  start_date: Date | null;
  end_date: Date | null;
}

export const inputHppInitialState: InputHppProperty = {
  start_date: null,
  end_date: null,
};
