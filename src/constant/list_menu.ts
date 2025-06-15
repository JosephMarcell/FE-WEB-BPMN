// import { AiOutlineFileDone } from 'react-icons/ai';
// import { BsClipboard2DataFill } from 'react-icons/bs';
import Cookies from 'js-cookie';
import { BsWater } from 'react-icons/bs';
import { BsFileEarmarkPerson } from 'react-icons/bs';
import { FaClipboardList, FaServer, FaUsers } from 'react-icons/fa';
import { FaTools } from 'react-icons/fa';
import { FaBuilding } from 'react-icons/fa';
import { FaGears } from 'react-icons/fa6';
import { GiTwoCoins } from 'react-icons/gi';
import { MdOutlineReportProblem, MdOutlineShowChart } from 'react-icons/md';
import { MdBusinessCenter } from 'react-icons/md';
import { RiSensorFill } from 'react-icons/ri'; // Add this import for sensor icon
import { TbBriefcaseFilled } from 'react-icons/tb';

import { getTranslation } from '@/lib/lang/i18n';

import { SingleMenu } from '@/helpers/utils/side_menu/menu';

const { t } = getTranslation();

const userRole = Cookies.get('userRole');
const isSuperadmin = userRole === 'Superadmin';

export const ListMenu: SingleMenu[] = [
  {
    label: t('users'),
    icon: FaUsers, // A general dashboard-like icon for 'users'
    path: '/users',
    type: 'dropdown',
    available: true,
    has_sub_menu: true,
    sub_menu: [
      {
        label: t('user_list'),
        icon: BsFileEarmarkPerson,
        available: userRole === 'SUPERADMIN', // Only visible for SUPERADMIN
        path: '/users/user_list',
        type: 'link',
      },
      {
        label: t('tenant_admin'),
        icon: MdBusinessCenter,
        available: userRole === 'ADMIN', // Only visible for ADMIN
        type: 'link',
        path: '/tenant-admin',
      },
      {
        label: t('user_log'),
        icon: FaClipboardList,
        available: isSuperadmin,
        path: '/users/user_log',
        type: 'link',
      },
      {
        label: t('tenant_management'),
        icon: FaBuilding, // Import this icon from react-icons/fa
        available: userRole === 'SUPERADMIN',
        type: 'link',
        path: '/tenants',
      },
    ],
  },
  {
    label: t('Assets'),
    icon: TbBriefcaseFilled,
    path: '/assets',
    type: 'dropdown',
    available: true,
    has_sub_menu: true,
    sub_menu: [
      {
        label: t('Manajemen Aset'),
        icon: FaClipboardList,
        available: true, // Only visible for SUPERADMIN
        path: '/assets/asset_list',
        type: 'link',
      },
      {
        label: t('Catatan Pemeliharaan Riwayat Aset'),
        icon: FaTools,
        available: true,
        path: '/assets/maintenance_log',
        type: 'link',
      },
      {
        label: t('Sarana & Prasarana'),
        icon: FaGears,
        available: true,
        path: '/assets/facility',
        type: 'link',
      },
      {
        label: t('Sumber Daya'),
        icon: GiTwoCoins,
        available: true,
        path: '/assets/resource',
        type: 'link',
      },
    ],
  },
  {
    label: t('violations'),
    icon: MdOutlineReportProblem, // Report icon for violations
    available: true,
    path: '/violations',
    type: 'link',
  },
  {
    label: t('environment_quality'),
    icon: BsWater, // Environmental quality icon (water-related)
    available: true,
    path: '/environment_quality',
    type: 'link',
  },
  {
    label: t('Sensor Configuration'),
    icon: RiSensorFill, // Using sensor icon
    available: true,
    path: '/sensor-configuration',
    type: 'link',
  },
  {
    label: t('Sensor Reading'),
    icon: MdOutlineShowChart, // Import this from react-icons/md
    available: true,
    path: '/sensor-reading',
    type: 'link',
  },
  {
    label: t('Sensor Health'),
    icon: FaServer, // Import FaServer from 'react-icons/fa'
    available: true,
    path: '/sensor-health',
    type: 'link',
  },
];
