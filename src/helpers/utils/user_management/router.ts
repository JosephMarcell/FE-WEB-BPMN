export interface RouterProperty {
  pkid: string;
  router: string | null;
  router_name: string | null;
  module: string | null;
  module_name: string | null;
}

export const routerInitialState: RouterProperty = {
  pkid: '',
  router: null,
  router_name: null,
  module: null,
  module_name: null,
};
