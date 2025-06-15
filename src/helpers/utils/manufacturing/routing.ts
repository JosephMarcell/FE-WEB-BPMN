export interface RoutingProperty {
  name: string | null;
  order: number | null;
  item_pkid: number | null;
  operation_pkid: number | null;
}

export const routingInitialState: RoutingProperty = {
  name: null,
  order: null,
  item_pkid: null,
  operation_pkid: null,
};
