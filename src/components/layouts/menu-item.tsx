import Link from 'next/link';
import { usePathname } from 'next/navigation';
import AnimateHeight from 'react-animate-height';
import { Tooltip } from 'react-tooltip';

import IconCaretDown from '@/components/icon/icon-caret-down';

import { SingleMenu } from '@/helpers/utils/side_menu/menu';

const MenuItem = ({
  menu,
  currentMenu,
  toggleMenu,
  openMenus,
  setOpenMenus,
}: {
  menu: SingleMenu;
  currentMenu: string;
  toggleMenu: (label: string) => void;
  openMenus: string[];
  setOpenMenus: React.Dispatch<React.SetStateAction<string[]>>;
  level?: number;
}) => {
  const pathname = usePathname();
  const isOpen = openMenus.includes(menu.label);
  const isActive = pathname.startsWith(menu.path);
  const maxLabelLength = 16;

  const sliceLabel = (label: string, maxLabelLength: number) => {
    return label.length > maxLabelLength
      ? `${label.slice(0, maxLabelLength)}...`
      : label;
  };
  const handleToggle = () => {
    if (menu.has_sub_menu) {
      if (isOpen) {
        setOpenMenus(openMenus.filter(label => label !== menu.label));
      } else {
        setOpenMenus([...openMenus, menu.label]);
      }
    } else {
      toggleMenu(menu.label);
    }
  };

  return (
    <li className={`menu nav-item ${isActive ? 'active' : ''}`}>
      {menu.type === 'link' && menu.available ? (
        <Link href={menu.path} className={`group ${isActive ? 'active' : ''}`}>
          <div className='flex items-center'>
            <menu.icon className='group-hover:!text-primary shrink-0' />
            <span
              className='dark:group-hover:text-white-dark text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690]'
              data-fulltext={menu.label}
              data-tooltip-id={`my-tooltip-${menu.label}`}
            >
              {sliceLabel(menu.label, maxLabelLength)}
            </span>
          </div>
        </Link>
      ) : menu.type === 'dropdown' && menu.available ? (
        <button
          onClick={handleToggle}
          type='button'
          className={`nav-link group w-full ${isOpen ? 'active' : ''}`}
        >
          <div className='flex items-center'>
            {menu.icon({
              className: 'group-hover:!text-primary shrink-0',
            })}
            <span
              className='dark:group-hover:text-white-dark text-black ltr:pl-3 rtl:pr-3 dark:text-[#506690]'
              data-tooltip-id={`my-tooltip-${menu.label}`}
              data-fulltext={menu.label}
            >
              {sliceLabel(menu.label, maxLabelLength)}
            </span>
          </div>
          <div
            className={`transition duration-500 hover:scale-125 hover:ease-in ${
              isOpen
                ? '-rotate-90 transition duration-500 rtl:rotate-90'
                : 'transition duration-500'
            }`}
          >
            <IconCaretDown />
          </div>
        </button>
      ) : menu.type === 'modal' && menu.available ? (
        ''
      ) : (
        ''
      )}

      {menu.has_sub_menu && (
        <AnimateHeight duration={300} height={isOpen ? 'auto' : 0}>
          <ul className='ml-4 text-gray-500'>
            {menu.sub_menu?.map((subMenu, index) => (
              <MenuItem
                key={index}
                menu={subMenu}
                currentMenu={currentMenu}
                toggleMenu={toggleMenu}
                openMenus={openMenus}
                setOpenMenus={setOpenMenus}
              />
            ))}
          </ul>
        </AnimateHeight>
      )}
      <Tooltip
        id={`my-tooltip-${menu.label}`}
        content={menu.label}
        events={['hover']}
        place='right'
        style={{ backgroundColor: 'rgb(255, 255, 255)', color: '#4361ee' }}
      />
    </li>
  );
};

export default MenuItem;
