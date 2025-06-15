export interface DepartmentProperty {
  pkid?: number;
  name: string | null;
  description: string | null;
}

export const departmentInitialState: DepartmentProperty = {
  pkid: 0,
  name: null,
  description: null,
};
