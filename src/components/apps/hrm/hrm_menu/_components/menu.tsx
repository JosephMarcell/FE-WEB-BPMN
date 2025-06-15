import { useCallback, useEffect, useState } from 'react';

import CardMenu from '@/components/apps/hrm/hrm_menu/_components/card-menu';

import { useGetPermissionByToken } from '@/app/api/hooks/user_management/permission/useGetPermissionByToken';
import { ListMenu } from '@/constant/list_menu';
import { SingleMenu } from '@/helpers/utils/side_menu/menu';
import { PermissionProperty } from '@/helpers/utils/user_management/permission';

interface HRMMenuComponentProps {
  sub_menu: string;
}

const HRMMenuComponent = ({ sub_menu }: HRMMenuComponentProps) => {
  const Menu: SingleMenu | undefined =
    sub_menu === ''
      ? ListMenu.find(menu => menu.label === 'Human Resource Management')
      : ListMenu.find(
          menu => menu.label === 'Human Resource Management',
        )?.sub_menu?.find(submenu => submenu.label === sub_menu);

  const { data: permissionList } = useGetPermissionByToken();
  const [pageListMenu, setPageListMenu] = useState(Menu);
  const [isLoading, setIsLoading] = useState(true);

  const checkModuleAvailability = useCallback(
    (permissionArray: PermissionProperty[], code: string): boolean => {
      const checkModule = permissionArray.find(
        (item: PermissionProperty) => item.Router.module === code,
      );

      return !!checkModule;
    },
    [],
  );

  const checkSubmoduleAvailability = useCallback(
    (submodule: SingleMenu): boolean => {
      if (submodule.sub_menu) {
        let is_sub_menu_present = false;
        submodule.sub_menu.map(item => {
          const result = checkSubmoduleAvailability(item);
          if (result) is_sub_menu_present = true;
        });
        if (is_sub_menu_present) {
          submodule.available = true;
          return true;
        }
      } else if (submodule.code) {
        const checkModule = permissionList?.data.find(
          (item: PermissionProperty) => item.Router.router === submodule.code,
        );
        if (checkModule) {
          submodule.available = true;
          return true;
        }
      }
      return false;
    },
    [permissionList?.data],
  );

  useEffect(() => {
    if (permissionList?.data !== undefined && isLoading) {
      const listMenuTemp = Menu;

      listMenuTemp?.sub_menu?.map(menu => {
        menu.available = checkModuleAvailability(
          [...permissionList.data],
          menu.code || '',
        );

        checkSubmoduleAvailability(menu);
      });

      setPageListMenu(listMenuTemp);
      setIsLoading(false);
    }
  }, [
    permissionList,
    isLoading,
    Menu,
    checkModuleAvailability,
    checkSubmoduleAvailability,
  ]);

  return (
    <div className='panel border-white-light px-0'>
      <div className='mb-5 px-5 text-center text-2xl font-bold'>
        <h3>{sub_menu}</h3>
      </div>
      <div className='mb-5 grid grid-cols-1 gap-x-5 px-5 md:grid-cols-2 md:items-center'>
        {pageListMenu?.sub_menu?.map((menu, index) => {
          return (
            menu.available && (
              <CardMenu
                key={index}
                title={menu.label}
                description='lorem ipsum dolor sit amet, consectetur adipiscing elit.'
                icon={menu.icon}
                path={menu.path}
              />
            )
          );
        })}
      </div>
    </div>
  );
};

export default HRMMenuComponent;
