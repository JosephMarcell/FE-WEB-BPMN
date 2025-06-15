import { FunctionComponent } from 'react';

export interface SingleMenu {
  label: string;
  description?: string;
  icon: FunctionComponent<{ className?: string }>;
  path: string;
  type: string;
  code?: string;
  available: boolean;
  has_sub_menu?: boolean;
  sub_menu?: SingleMenu[];
}
