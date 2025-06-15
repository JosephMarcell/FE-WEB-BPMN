export interface JobOrderProperty {
  pkid: number | null;
  progress: string | null;
  production_order_pkid: number | null;
}

export const jobOrderInitialState: JobOrderProperty = {
  pkid: null,
  progress: null,
  production_order_pkid: null,
};
