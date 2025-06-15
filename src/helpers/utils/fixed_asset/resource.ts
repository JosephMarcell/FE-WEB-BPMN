export interface ResourceProperty {
  pkid: number | null;
  asset_pkid: number | null;
  resource_name: string | null;
  resource_latitude: number;
  resource_longitude: number;
  description: string | null;
  office_pkid: number | null;
  office_name: string | null;
}

export const resourceInitialState: ResourceProperty = {
  pkid: null,
  asset_pkid: null,
  resource_name: null,
  resource_latitude: -7.2586,
  resource_longitude: 112.7485,
  description: null,
  office_pkid: null,
  office_name: null,
};
