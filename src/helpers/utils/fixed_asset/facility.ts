export interface FacilityProperty {
  pkid: number | null;
  facility_name: string | null;
  facility_lat: number;
  facility_long: number;
  last_usage: Date | null;
  condition: string | null;
  status: string | null;
  description: string | null;
  office_pkid: number | null;
  office_name: string | null;
}

export const facilityInitialState: FacilityProperty = {
  pkid: null,
  facility_name: null,
  facility_lat: -7.2586,
  facility_long: 112.7485,
  last_usage: new Date(),
  condition: null,
  status: null,
  description: null,
  office_pkid: null,
  office_name: null,
};
