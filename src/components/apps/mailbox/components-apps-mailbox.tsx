'use client';
import { Disclosure } from '@headlessui/react';
import Tippy from '@tippyjs/react';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
// import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import 'tippy.js/dist/tippy.css';
import 'react-quill/dist/quill.snow.css';

import Dropdown from '@/components/dropdown';
import IconArchive from '@/components/icon/icon-archive';
import IconArrowBackward from '@/components/icon/icon-arrow-backward';
import IconArrowForward from '@/components/icon/icon-arrow-forward';
import IconArrowLeft from '@/components/icon/icon-arrow-left';
import IconBook from '@/components/icon/icon-book';
import IconBookmark from '@/components/icon/icon-bookmark';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconChartSquare from '@/components/icon/icon-chart-square';
import IconDownload from '@/components/icon/icon-download';
import IconFile from '@/components/icon/icon-file';
import IconFolder from '@/components/icon/icon-folder';
import IconGallery from '@/components/icon/icon-gallery';
import IconHelpCircle from '@/components/icon/icon-help-circle';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconInfoHexagon from '@/components/icon/icon-info-hexagon';
import IconMail from '@/components/icon/icon-mail';
import IconMenu from '@/components/icon/icon-menu';
import IconMessage2 from '@/components/icon/icon-message2';
import IconOpenBook from '@/components/icon/icon-open-book';
import IconPaperclip from '@/components/icon/icon-paperclip';
import IconPlus from '@/components/icon/icon-plus';
import IconPrinter from '@/components/icon/icon-printer';
import IconRefresh from '@/components/icon/icon-refresh';
import IconRestore from '@/components/icon/icon-restore';
import IconSearch from '@/components/icon/icon-search';
import IconSend from '@/components/icon/icon-send';
import IconSettings from '@/components/icon/icon-settings';
import IconStar from '@/components/icon/icon-star';
import IconTag from '@/components/icon/icon-tag';
import IconTrash from '@/components/icon/icon-trash';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconTxtFile from '@/components/icon/icon-txt-file';
import IconUser from '@/components/icon/icon-user';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconUsers from '@/components/icon/icon-users';
import IconVideo from '@/components/icon/icon-video';
import IconWheel from '@/components/icon/icon-wheel';
import IconZipFile from '@/components/icon/icon-zip-file';

import { IRootState } from '@/store';

interface Attachment {
  name: string;
  size: string;
  type: string;
}

interface Mail {
  id: number;
  path: string;
  firstName: string;
  lastName: string;
  email: string;
  date: string;
  time: string;
  title: string;
  displayDescription: string;
  type: string;
  isImportant: boolean;
  isStar: boolean;
  group: string;
  isUnread: boolean;
  attachments?: Attachment[];
  description: string;
}

interface Params {
  id: number | null;
  from: string;
  to: string;
  cc: string;
  title: string;
  file: FileList | null;
  description: string;
  displayDescription: string;
}

interface Pager {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
}

interface MailItem {
  id: number;
  type: string;
  group?: string;
  isStar: boolean;
  isImportant: boolean;
  isUnread: boolean;
  email: string;
  title: string;
  description?: string;
  displayDescription?: string;
}

interface Params {
  id: number | null;
  from: string;
  to: string;
  cc: string;
  title: string;
  file: FileList | null;
  description: string;
  displayDescription: string;
}

enum ActionType {
  Trash = 'trash',
  Read = 'read',
  Unread = 'unread',
  Important = 'important',
  Unimportant = 'unimportant',
  Star = 'star',
  Restore = 'restore',
  Delete = 'delete',
}

type ActionTypeForEmail =
  | 'save'
  | 'save_reply'
  | 'save_forward'
  | 'send'
  | 'reply'
  | 'forward';

const ComponentsAppsMailbox = () => {
  const [mailList, setMailList] = useState<Mail[]>([
    {
      id: 1,
      path: 'profile-15.jpeg',
      firstName: 'Laurie',
      lastName: 'Fox',
      email: 'laurieFox@mail.com',
      date: new Date().toISOString(),
      time: '2:00 PM',
      title: 'Promotion Page',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duos lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'inbox',
      isImportant: false,
      isStar: true,
      group: 'social',
      isUnread: false,
      attachments: [
        {
          name: 'Confirm File.txt',
          size: '450KB',
          type: 'file',
        },
        {
          name: 'Important Docs.xml',
          size: '2.1MB',
          type: 'file',
        },
      ],
      description: `
                              <p class="mail-content"> Anim pariatur cliché reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <div class="gallery text-center">
                                  <img alt="image-gallery" src="/assets/images/carousel3.jpeg" class="mb-4 mt-4" style="width: 250px; height: 180px;" />
                                  <img alt="image-gallery" src="/assets/images/carousel2.jpeg" class="mb-4 mt-4" style="width: 250px; height: 180px;" />
                                  <img alt="image-gallery" src="/assets/images/carousel1.jpeg" class="mb-4 mt-4" style="width: 250px; height: 180px;" />
                              </div>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 2,
      path: 'profile-14.jpeg',
      firstName: 'Andy',
      lastName: 'King',
      email: 'kingAndy@mail.com',
      date: new Date().toISOString(),
      time: '6:28 PM',
      title: 'Hosting Payment Reminder',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Dis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan except butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accuseds labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 3,
      path: '',
      firstName: 'Kristen',
      lastName: 'Beck',
      email: 'kirsten.beck@mail.com',
      date: new Date().toISOString(),
      time: '11:09 AM',
      title: 'Verification Link',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: 'social',
      isUnread: true,
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 4,
      path: 'profile-16.jpeg',
      firstName: 'Christian',
      lastName: '',
      email: 'christian@mail.com',
      date: '11/30/2021',
      time: '2:00 PM',
      title: 'New Updates',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: 'private',
      isUnread: false,
      attachments: [
        {
          name: 'update.zip',
          size: '1.38MB',
          type: 'zip',
        },
      ],
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 5,
      path: 'profile-17.jpeg',
      firstName: 'Roxanne',
      lastName: '',
      email: 'roxanne@mail.com',
      date: '11/15/2021',
      time: '2:00 PM',
      title: 'Scheduled Alert',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: 'personal',
      isUnread: true,
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 6,
      path: 'profile-18.jpeg',
      firstName: 'Nia',
      lastName: 'Hillyer',
      email: 'niahillyer@mail.com',
      date: '08/16/2020',
      time: '2:22 AM',
      title: 'Motion UI Kit',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'inbox',
      isImportant: true,

      isStar: true,
      group: '',
      isUnread: false,
      description: `
                              <p class="mail-content"> Anim pariatur cliché reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et.</p>
                              <div class="gallery text-center">
                                  <img alt="image-gallery" src="/assets/images/carousel3.jpeg" class="mb-4 mt-4" style="width: 250px; height: 180px;">
                                  <img alt="image-gallery" src="/assets/images/carousel2.jpeg" class="mb-4 mt-4" style="width: 250px; height: 180px;">
                                  <img alt="image-gallery" src="/assets/images/carousel1.jpeg" class="mb-4 mt-4" style="width: 250px; height: 180px;">
                              </div>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 7,
      path: 'profile-19.jpeg',
      firstName: 'Iris',
      lastName: 'Hubbard',
      email: 'irishubbard@mail.com',
      date: '08/16/2020',
      time: '1:40 PM',
      title: 'Green Illustration',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'inbox',
      isImportant: true,

      isStar: true,
      group: '',
      isUnread: false,
      description: `
                              <p class="mail-content"> Anim pariatur cliché reprehend, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia acute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 8,
      path: '',
      firstName: 'Ernest',
      lastName: 'Reeves',
      email: 'reevesErnest@mail.com',
      date: '06/02/2020',
      time: '8:25 PM',
      title: 'Youtube',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'archive',
      isImportant: true,

      isStar: true,
      group: 'work',
      isUnread: false,
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 9,
      path: 'profile-20.jpeg',
      firstName: 'Info',
      lastName: 'Company',
      email: 'infocompany@mail.com',
      date: '02/10/2020',
      time: '7:00 PM',
      title: '50% Discount',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: 'work',
      isUnread: false,
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },

    {
      id: 10,
      path: '',
      firstName: 'NPM',
      lastName: 'Inc',
      email: 'npminc@mail.com',
      date: '12/15/2018',
      time: '8:37 AM',
      title: 'npm Inc',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'archive',
      isImportant: false,
      isStar: false,
      group: 'personal',
      isUnread: true,
      attachments: [
        {
          name: 'package.zip',
          size: '450KB',
          type: 'zip',
        },
      ],
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 11,
      path: 'profile-21.jpeg',
      firstName: 'Marlene',
      lastName: 'Wood',
      email: 'marlenewood@mail.com',
      date: '11/25/2018',
      time: '1:51 PM',
      title: 'eBill',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: 'personal',
      isUnread: false,
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },

    {
      id: 12,
      path: '',
      firstName: 'Keith',
      lastName: 'Foster',
      email: 'kf@mail.com',
      date: '12/15/2018',
      time: '9:30 PM',
      title: 'Web Design News',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'draft',
      isImportant: false,
      isStar: false,
      group: 'personal',
      isUnread: false,
      description: `
                              <p class="mail-content"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.</p>
                              `,
    },
    {
      id: 13,
      path: '',
      firstName: 'Amy',
      lastName: 'Diaz',
      email: 'amyDiaz@mail.com',
      date: '12/15/2018',
      time: '2:00 PM',
      title: 'Ecommerce Analytics',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'draft',
      isImportant: false,
      isStar: false,
      group: 'private',
      isUnread: false,
      description: `
                              <p class="mail-content"> Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.</p>
                              `,
    },

    {
      id: 14,
      path: '',
      firstName: 'Alan',
      lastName: '',
      email: 'alan@mail.com',
      date: '12/16/2019',
      time: '8:45 AM',
      title: 'Mozilla Update',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'sent_mail',
      isImportant: false,
      isStar: false,
      group: 'work',
      isUnread: false,
      attachments: [
        {
          name: 'Confirm File',
          size: '450KB',
          type: 'file',
        },
        {
          name: 'Important Docs',
          size: '2.1MB',
          type: 'folder',
        },
        {
          name: 'Photo.png',
          size: '50kb',
          type: 'image',
        },
      ],
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 15,
      path: '',
      firstName: 'Justin',
      lastName: 'Cross',
      email: 'justincross@mail.com',
      date: '09/14/219',
      time: '3:10 PM',
      title: 'App Project Checklist',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'sent_mail',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      attachments: [
        {
          name: 'Important Docs',
          size: '2.1MB',
          type: 'folder',
        },
        {
          name: 'Photo.png',
          size: '50kb',
          type: 'image',
        },
      ],
      description: `
                              <p class="mail-content"> Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Three wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },

    {
      id: 16,
      path: 'profile-21.jpeg',
      firstName: 'Alex',
      lastName: 'Gray',
      email: 'alexGray@mail.com',
      date: '08/16/2019',
      time: '10:18 AM',
      title: 'Weekly Newsletter',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'spam',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      attachments: [
        {
          name: 'Confirm File',
          size: '450KB',
          type: 'file',
        },
        {
          name: 'Important Docs',
          size: '2.1MB',
          type: 'folder',
        },
        {
          name: 'Photo.png',
          size: '50kb',
          type: 'image',
        },
      ],
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 17,
      path: 'profile-22.jpeg',
      firstName: 'Info',
      lastName: 'Company',
      email: 'infocompany@mail.com',
      date: '02/10/2018',
      time: '7:00 PM',
      title: '50% Discount',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'spam',
      isImportant: false,
      isStar: false,
      group: 'work',
      isUnread: false,
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 18,
      path: 'profile-21.jpeg',
      firstName: 'Marlene',
      lastName: 'Wood',
      email: 'marlenewood@mail.com',
      date: '11/25/2017',
      time: '1:51 PM',
      title: 'eBill',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'spam',
      isImportant: false,
      isStar: false,
      group: 'personal',
      isUnread: false,
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },

    {
      id: 19,
      path: 'profile-23.jpeg',
      firstName: 'Ryan MC',
      lastName: 'Killop',
      email: 'ryanMCkillop@mail.com',
      date: '08/17/2018',
      time: '11:45 PM',
      title: 'Make it Simple',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'trash',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `
                              <p class="mail-content"> Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. Three wolf moon officia aute, non cupidatat skateboard dolor brunch. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <div class="gallery text-center">
                                  <img alt="image-gallery" src="/assets/images/carousel2.jpeg" class="mb-4 mt-4" style="width: 250px; height: 180px;">
                                  <img alt="image-gallery" src="/assets/images/carousel3.jpeg" class="mb-4 mt-4" style="width: 250px; height: 180px;">
                                  <img alt="image-gallery" src="/assets/images/carousel1.jpeg" class="mb-4 mt-4" style="width: 250px; height: 180px;">
                              </div>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 20,
      path: 'profile-23.jpeg',
      firstName: 'Liam',
      lastName: 'Sheldon',
      email: 'liamsheldon@mail.com',
      date: '08/17/2018 ',
      time: '11:45 PM',
      title: 'New Offers',
      displayDescription:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue.',
      type: 'trash',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      attachments: [
        {
          name: 'Confirm File',
          size: '450KB',
          type: 'file',
        },
      ],
      description: `
                              <p class="mail-content"> Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS. </p>
                              <p>Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.</p>
                              `,
    },
    {
      id: 21,
      path: 'profile-21.jpeg',
      firstName: 'Porter',
      lastName: 'Taylor',
      email: 'porter.harber@wiza.info',
      date: '06/01/2020',
      time: '02:40 PM',
      title: 'Id labore ex et quam laborum',
      displayDescription:
        'Laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `<p class="mail-content">Laudantium enim quasi est quidem magnam voluptate ipsam eos\ntempora quo necessitatibus\ndolor quam autem quasi\nreiciendis et nam sapiente accusantium</p>
                          <p>Lorem Ipsum is simply test double text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard test double text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 22,
      path: 'profile-22.jpeg',
      firstName: 'Brock',
      lastName: 'Mills',
      email: 'brock.gibson@farrell.biz',
      date: '09/08/2020',
      time: '04:20 AM',
      title: 'Quo vero reiciendis velit similique earum',
      displayDescription:
        'Est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `<p class="mail-content">Est natus enim nihil est dolore omnis voluptatem numquam\net omnis occaecati quod ullam at\nvoluptatem error expedita pariatur\nnihil sint nostrum voluptatem reiciendis et</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 23,
      path: 'profile-3.jpeg',
      firstName: 'Nyost',
      lastName: 'Terry',
      email: 'nyost@yahoo.com',
      date: '04/01/2019',
      time: '02:10 AM',
      title: 'Odio adipisci rerum aut animi',
      displayDescription:
        'Quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\nomnis quibusdam delectus saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione',
      type: 'inbox',
      isImportant: true,
      isStar: false,
      group: 'personal',
      isUnread: false,
      description: `<p class="mail-content">Quia molestiae reprehenderit quasi aspernatur\naut expedita occaecati aliquam eveniet laudantium\names quibusdam select saepe quia accusamus maiores nam est\ncum et ducimus et vero voluptates excepturi deleniti ratione</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 24,
      path: 'profile-2.jpeg',
      firstName: 'Leonardo',
      lastName: 'Knox',
      email: 'leonardo61@yahoo.com',
      date: '08/08/2018',
      time: '07:50 PM',
      title: 'Alias odio sit',
      displayDescription:
        'Non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati',
      type: 'inbox',
      isImportant: false,
      isStar: true,
      group: '',
      isUnread: false,
      description: `<p class="mail-content">Non et atque\noccaecati deserunt quas accusantium unde odit nobis qui voluptatem\nquia voluptas consequuntur itaque dolor\net qui rerum deleniti ut occaecati</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 25,
      path: 'profile-24.jpeg',
      firstName: 'Melisa',
      lastName: 'Mitchell',
      email: 'melisa.legros@mayer.com',
      date: '10/03/2018',
      time: '06:40 AM',
      title: 'Vero eaque aliquid doloribus et culpa',
      displayDescription:
        'Harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et',
      type: 'inbox',
      isImportant: true,
      isStar: true,
      group: 'work',
      isUnread: false,
      description: `<p class="mail-content">Harum non quasi et ratione\ntempore iure ex voluptates in ratione\nharum architecto fugit inventore cupiditate\nvoluptates magni quo et</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 26,
      path: 'profile-26.jpeg',
      firstName: 'Florida',
      lastName: 'Morgan',
      email: 'florida54@gmail.com',
      date: '05/12/2019',
      time: '09:20 PM',
      title: 'Et fugit eligendi deleniti quidem qui sint nihil autem',
      displayDescription:
        'Doloribus at sed quis culpa deserunt consectetur qui praesentium\naccusamus fugiat dicta\nvoluptatem rerum ut voluptate autem\nvoluptatem repellendus aspernatur dolorem in',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `<p class="mail-content">Doloribus at sed quis culpa deserunt consectetur qui praesentium\naccusamus fugiat dicta\nvoluptatem rerum ut voluptate autem\nvoluptatem repellendus aspernatur dolorem in</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 27,
      path: 'profile-27.jpeg',
      firstName: 'Madison',
      lastName: 'King',
      email: 'madison86@yahoo.com',
      date: '12/04/2018',
      time: '10:40 PM',
      title: 'Repellat consequatur praesentium vel minus molestias voluptatum',
      displayDescription:
        'Maiores sed dolores similique labore et inventore et\nquasi temporibus esse sunt id et\neos voluptatem aliquam\naliquid ratione corporis molestiae mollitia quia et magnam dolor',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: 'private',
      isUnread: false,
      description: `<p class="mail-content">Maiores sed dolores similique labore et inventore et\nquasi temporibus Asse sunt id et\neos voluptatem aliquam\naliquid ratione corporis molestiae mollitia quia et magnam dolor</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 28,
      path: 'profile-30.jpeg',
      firstName: 'Paul',
      lastName: 'Lambert',
      email: 'paul.cruickshank@yahoo.com',
      date: '06/05/2018',
      time: '01:40 AM',
      title: 'Et omnis dolorem',
      displayDescription:
        'Ut voluptatem corrupti velit\nad voluptatem maiores\net nisi velit vero accusamus maiores\nvoluptates quia aliquid ullam eaque',
      type: 'inbox',
      isImportant: true,
      isStar: false,
      group: '',
      isUnread: false,
      description: `<p class="mail-content">Ut voluptatem corrupti velit\nad voluptatem maiores\net nisi velit vero accusamus maiores\nvoluptates quia aliquid ullam eaque</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 29,
      path: 'profile-31.jpeg',
      firstName: 'Brakus',
      lastName: 'Morrison',
      email: 'brakus.heidi@gmail.com',
      date: '03/09/2018',
      time: '06:10 PM',
      title: 'Provident id voluptas',
      displayDescription:
        'Sapiente assumenda molestiae atque\nadipisci laborum distinctio aperiam et ab ut omnis\net occaecati aspernatur odit sit rem expedita\nquas enim ipsam minus',
      type: 'inbox',
      isImportant: false,
      isStar: true,
      group: 'social',
      isUnread: false,
      description: `<p class="mail-content">Sapiente assumenda molestiae atque\nadipisci laborum distinctio aperiam et ab ut omnis\net occaecati aspernatur odit sit rem expedita\nquas enim ipsam minus</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 30,
      path: 'profile-32.jpeg',
      firstName: 'Predovic',
      lastName: 'Peake',
      email: 'predovic.arianna@kirlin.com',
      date: '05/06/2018',
      time: '09:00 AM',
      title: 'Eaque et deleniti atque tenetur ut quo ut',
      displayDescription:
        'Voluptate iusto quis nobis reprehenderit ipsum amet nulla\nquia quas dolores velit et non\naut quia necessitatibus\nnostrum quaerat nulla et accusamus nisi facili',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: 'personal',
      isUnread: false,
      description: `<p class="mail-content">Voluptate iusto quis nobis reprehenderit ipsum amet nulla\nquia quas dolores velit et non\naut quia necessitatibus\nnostrum quaerat nulla et accusamus nisi facili</p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 31,
      path: 'profile-32.jpeg',
      firstName: 'shaylee',
      lastName: 'Buford',
      email: 'Buford@shaylee.biz',
      date: '07/03/2018',
      time: '08:15 AM',
      title: 'Ex velit ut cum eius odio ad placeat',
      displayDescription:
        'Quia incidunt ut\naliquid est ut rerum deleniti iure est\nipsum quia ea sint et\nvoluptatem quaerat eaque repudiandae eveniet aut',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `<p class="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 32,
      path: 'profile-32.jpeg',
      firstName: 'Maria',
      lastName: 'laurel',
      email: 'Maria@laurel.name',
      date: '08/03/2018',
      time: '09:30 AM',
      title: 'Dolorem architecto ut pariatur quae qui suscipit',
      displayDescription:
        'Nihil ea itaque libero illo\nofficiis quo quo dicta inventore consequatur voluptas voluptatem\ncorporis sed necessitatibus velit tempore\nrerum velit et temporibus',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `<p class="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 33,
      path: 'profile-32.jpeg',
      firstName: 'Jaeden',
      lastName: 'Towne',
      email: 'Jaeden.Towne@arlene.tv',
      date: '11/07/2018',
      time: '10:15 AM',
      title: 'Voluptatum totem vel voluptate omnis',
      displayDescription:
        'Fugit harum quae vero\nlibero unde tempore\nsoluta eaque culpa sequi quibusdam nulla id\net et necessitatibus',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `<p class="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 34,
      path: 'profile-32.jpeg',
      firstName: 'Schneider',
      lastName: 'Ethelyn',
      email: 'Ethelyn.Schneider@emelia.co.uk',
      date: '07/11/2018',
      time: '10:30 AM',
      title: 'Omnis nemo sunt ab autem',
      displayDescription:
        'Omnis temporibus quasi ab omnis\nfacilis et omnis illum quae quasi aut\nminus Sure ex rem ut reprehenderit\nin non fugit',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `<p class="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
    {
      id: 35,
      path: 'profile-32.jpeg',
      firstName: 'Anna',
      lastName: 'Georgi',
      email: 'Georgianna@florence.io',
      date: '10/10/2017',
      time: '10:45 AM',
      title:
        'Repellendus sapiente omnis praesentium aliquam ipsum id molestiae omnis',
      displayDescription:
        'Dolor mollitia quidem facere et\nvel est ut\nut repudiandae est quidem dolorous sed atque\nrem quia aut adipisci sunt',
      type: 'inbox',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      description: `<p class="mail-content"></p>
                          <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularized in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</p>`,
    },
  ]);

  const defaultParams = {
    id: null,
    from: 'vristo@mail.com',
    to: '',
    cc: '',
    title: '',
    file: null,
    description: '',
    displayDescription: '',
  };

  const [isShowMailMenu, setIsShowMailMenu] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [selectedTab, setSelectedTab] = useState('inbox');
  const [filteredMailList, setFilteredMailList] = useState<Mail[]>(
    mailList.filter(d => d.type === 'inbox'),
  );

  const [ids, setIds] = useState<number[]>([]);
  const [searchText, setSearchText] = useState<string>('');
  const [selectedMail, setSelectedMail] = useState<Mail | null>(null);
  const [params, setParams] = useState<Params>(
    JSON.parse(JSON.stringify(defaultParams)),
  );

  const [pagedMails, setPagedMails] = useState<Mail[]>([]);

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const [pager, setPager] = useState<Pager>({
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    startIndex: 0,
    endIndex: 0,
  });

  const refreshMails = () => {
    setSearchText('');
    searchMails(false);
  };

  const setArchive = () => {
    if (ids.length) {
      const items = filteredMailList.filter((mail: MailItem) =>
        ids.includes(mail.id),
      );
      for (const item of items) {
        item.type = item.type === 'archive' ? 'inbox' : 'archive';
      }
      if (selectedTab === 'archive') {
        showMessage(ids.length + ' Mail has been removed from Archive.');
      } else {
        showMessage(ids.length + ' Mail has been added to Archive.');
      }
      searchMails(false);
    }
  };

  const setSpam = () => {
    if (ids.length) {
      const items = filteredMailList.filter((d: MailItem) =>
        ids.includes(d.id),
      );
      for (const item of items) {
        item.type = item.type === 'spam' ? 'inbox' : 'spam';
      }
      if (selectedTab === 'spam') {
        showMessage(`${ids.length} Mail has been removed from Spam.`);
      } else {
        showMessage(`${ids.length} Mail has been added to Spam.`);
      }
      searchMails(false);
    }
  };

  const setGroup = (group: string) => {
    if (ids.length) {
      const items = mailList.filter((d: MailItem) => ids.includes(d.id));
      for (const item of items) {
        item.group = group;
      }

      showMessage(
        `${ids.length} Mail has been grouped as ${group.toUpperCase()}.`,
      );
      clearSelection();
      setTimeout(() => {
        searchMails(false);
      });
    }
  };

  const setAction = (type: ActionType) => {
    if (ids.length) {
      const totalSelected = ids.length;
      const items = filteredMailList.filter((item: MailItem) =>
        ids.includes(item.id),
      );
      for (const item of items) {
        switch (type) {
          case ActionType.Trash:
            item.type = 'trash';
            item.group = '';
            item.isStar = false;
            item.isImportant = false;
            showMessage(`${totalSelected} Mail has been deleted.`);
            break;
          case ActionType.Read:
            item.isUnread = false;
            showMessage(`${totalSelected} Mail has been marked as Read.`);
            break;
          case ActionType.Unread:
            item.isUnread = true;
            showMessage(`${totalSelected} Mail has been marked as UnRead.`);
            break;
          case ActionType.Important:
            item.isImportant = true;
            showMessage(`${totalSelected} Mail has been marked as Important.`);
            break;
          case ActionType.Unimportant:
            item.isImportant = false;
            showMessage(
              `${totalSelected} Mail has been marked as UnImportant.`,
            );
            break;
          case ActionType.Star:
            item.isStar = true;
            showMessage(`${totalSelected} Mail has been marked as Star.`);
            break;
          case ActionType.Restore:
            item.type = 'inbox';
            showMessage(`${totalSelected} Mail Restored.`);
            break;
          case ActionType.Delete:
            setMailList(mailList.filter((d: MailItem) => d.id !== item.id));
            showMessage(`${totalSelected} Mail Permanently Deleted.`);
            break;
        }
      }
      clearSelection();
      searchMails(false);
    }
  };

  const selectMail = (item: Mail | null) => {
    if (item) {
      if (item.type !== 'draft') {
        if (item.isUnread) {
          item.isUnread = false;
        }
        setSelectedMail(item);
      } else {
        openMail('draft', item);
      }
    } else {
      setSelectedMail(null);
    }
  };

  const setStar = (mailId: number) => {
    const item = filteredMailList.find((d: MailItem) => d.id === mailId);
    if (item) {
      item.isStar = !item.isStar;
      setTimeout(() => {
        searchMails(false);
      });
    }
  };

  const setImportant = (mailId: number) => {
    const item = filteredMailList.find((mail: Mail) => mail.id === mailId);
    if (item) {
      item.isImportant = !item.isImportant;
      setTimeout(() => {
        searchMails(false);
      });
    }
  };

  const showTime = (item: Mail) => {
    const displayDt = new Date(item.date);
    const cDt = new Date();
    if (displayDt.toDateString() === cDt.toDateString()) {
      return item.time;
    } else if (displayDt.getFullYear() === cDt.getFullYear()) {
      const monthNames = [
        'Jan',
        'Feb',
        'Mar',
        'Apr',
        'May',
        'Jun',
        'Jul',
        'Aug',
        'Sep',
        'Oct',
        'Nov',
        'Dec',
      ];
      return (
        monthNames[displayDt.getMonth()] +
        ' ' +
        String(displayDt.getDate()).padStart(2, '0')
      );
    } else {
      return (
        String(displayDt.getMonth() + 1).padStart(2, '0') +
        '/' +
        String(displayDt.getDate()).padStart(2, '0') +
        '/' +
        displayDt.getFullYear()
      );
    }
  };

  const openMail = (type: string, item: Mail | null) => {
    let newParams: Params = { ...defaultParams };

    if (type === 'add') {
      setIsShowMailMenu(false);
    } else if (item) {
      newParams = {
        ...newParams,
        id: item.id,
        to: item.email,
        title: item.title,
        description: item.description,
        displayDescription: item.displayDescription,
        cc: '',
        file: null,
      };

      if (type === 'reply') {
        newParams.title = 'Re: ' + item.title;
        newParams.displayDescription = 'Re: ' + item.displayDescription;
      } else if (type === 'forward') {
        newParams.title = 'Fwd: ' + item.title;
        newParams.displayDescription = 'Fwd: ' + item.displayDescription;
      }
    }

    setParams(newParams);
    setIsEdit(true);
  };

  const searchMails = useCallback(
    (isResetPage = true) => {
      if (isResetPage) {
        setPager(prevPager => ({ ...prevPager, currentPage: 1 }));
      }

      let res;
      if (selectedTab === 'important') {
        res = mailList.filter(d => d.isImportant);
      } else if (selectedTab === 'star') {
        res = mailList.filter(d => d.isStar);
      } else if (
        selectedTab === 'personal' ||
        selectedTab === 'work' ||
        selectedTab === 'social' ||
        selectedTab === 'private'
      ) {
        res = mailList.filter(d => d.group === selectedTab);
      } else {
        res = mailList.filter(d => d.type === selectedTab);
      }

      const filteredRes = res.filter(
        d =>
          (d.title &&
            d.title.toLowerCase().includes(searchText.toLowerCase())) ||
          (d.firstName &&
            d.firstName.toLowerCase().includes(searchText.toLowerCase())) ||
          (d.lastName &&
            d.lastName.toLowerCase().includes(searchText.toLowerCase())) ||
          (d.displayDescription &&
            d.displayDescription
              .toLowerCase()
              .includes(searchText.toLowerCase())),
      );

      setFilteredMailList([...filteredRes]);

      if (filteredRes.length) {
        const updatedPager = { ...pager };
        updatedPager.totalPages =
          pager.pageSize < 1
            ? 1
            : Math.ceil(filteredRes.length / pager.pageSize);
        if (updatedPager.currentPage > updatedPager.totalPages) {
          updatedPager.currentPage = 1;
        }
        updatedPager.startIndex =
          (updatedPager.currentPage - 1) * pager.pageSize;
        updatedPager.endIndex = Math.min(
          updatedPager.startIndex + pager.pageSize - 1,
          filteredRes.length - 1,
        );
        setPagedMails([
          ...filteredRes.slice(
            updatedPager.startIndex,
            updatedPager.endIndex + 1,
          ),
        ]);
        setPager(updatedPager);
      } else {
        setPagedMails([]);
        setPager(prevPager => ({
          ...prevPager,
          startIndex: -1,
          endIndex: -1,
        }));
      }
      clearSelection();
    },
    [selectedTab, searchText, mailList, pager],
  );

  useEffect(() => {
    searchMails();
  }, [selectedTab, searchText, mailList, searchMails]);

  const saveMail = (type: ActionTypeForEmail, id: number | null) => {
    if (!params.to) {
      showMessage('To email address is required.', 'error');
      return;
    }
    if (!params.title) {
      showMessage('Title of email is required.', 'error');
      return;
    }

    const maxId = mailList.reduce((max, item) => Math.max(item.id, max), 0);

    const obj: Mail = {
      id: id ?? maxId + 1,
      path: '',
      firstName: '',
      lastName: '',
      email: params.to,
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      title: params.title,
      displayDescription: params.displayDescription ?? '',
      type: 'draft',
      isImportant: false,
      isStar: false,
      group: '',
      isUnread: false,
      attachments: params.file
        ? Array.from(params.file).map(file => ({
            name: file.name,
            size: getFileSize(file.size),
            type: getFileType(file.type),
          }))
        : [],
      description: params.description,
    };

    if (['save', 'save_reply', 'save_forward'].includes(type)) {
      obj.type = 'draft';
      showMessage('Mail has been saved successfully to draft.');
    } else if (['send', 'reply', 'forward'].includes(type)) {
      obj.type = 'sent_mail';
      showMessage('Mail has been sent successfully.');
    }

    obj.date = new Date().toISOString();
    const index = mailList.findIndex(mail => mail.id === id);
    if (index > -1) {
      mailList[index] = obj;
    } else {
      mailList.push(obj);
    }

    setSelectedMail(null);
    setIsEdit(false);
    searchMails();
  };

  const getFileSize = (total_bytes: number) => {
    let size: string;
    if (total_bytes < 1000000) {
      size = Math.floor(total_bytes / 1000) + 'KB';
    } else {
      size = Math.floor(total_bytes / 1000000) + 'MB';
    }
    return size;
  };

  const getFileType = (file_type: string) => {
    let type = 'file';
    if (file_type.includes('image/')) {
      type = 'image';
    } else if (
      file_type.includes('application/zip') ||
      file_type.includes('application/x-zip-compressed')
    ) {
      type = 'zip';
    } else if (file_type.includes('text/plain')) {
      type = 'text';
    }
    return type;
  };
  const clearSelection = () => {
    setIds([]);
  };

  const tabChanged = () => {
    setIsEdit(false);
    setIsShowMailMenu(false);
    setSelectedMail(null);
  };

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    setParams({ ...params, [id]: value });
  };

  const handleCheckboxChange = (id: number) => {
    if (ids.includes(id)) {
      setIds(ids.filter(d => d !== id));
    } else {
      setIds([...ids, id]);
    }
  };

  const checkAllCheckbox = () =>
    filteredMailList.length > 0 && ids.length === filteredMailList.length;

  const closeMsgPopUp = () => {
    setIsEdit(false);
    setSelectedTab('inbox');
    searchMails();
  };

  const showMessage = (
    msg = '',
    type: 'success' | 'error' | 'warning' | 'info' | 'question' = 'success',
  ): void => {
    Swal.fire({
      icon: type,
      title: msg,
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: toast => {
        toast.addEventListener('mouseenter', Swal.stopTimer);
        toast.addEventListener('mouseleave', Swal.resumeTimer);
      },
    }).then(r => {
      return r;
    });
  };

  return (
    <div>
      <div className='relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]'>
        <div
          className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${
            isShowMailMenu ? '!block xl:!hidden' : ''
          }`}
          onClick={() => setIsShowMailMenu(!isShowMailMenu)}
        ></div>
        <div
          className={`panel dark:gray-50 absolute z-10 hidden h-full w-[250px] max-w-full flex-none space-y-3 overflow-hidden p-4 xl:relative xl:block xl:h-auto ltr:rounded-r-none ltr:xl:rounded-r-md rtl:rounded-l-none rtl:xl:rounded-l-md ${
            isShowMailMenu ? '!block' : ''
          }`}
        >
          <div className='flex h-full flex-col pb-16'>
            <div className='pb-5'>
              <button
                className='btn btn-primary w-full'
                type='button'
                onClick={() => openMail('add', null)}
              >
                New Message
              </button>
            </div>
            <PerfectScrollbar className='relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5'>
              <div className='space-y-1'>
                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    !isEdit && selectedTab === 'inbox'
                      ? 'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedTab('inbox');
                    tabChanged();
                  }}
                >
                  <div className='flex items-center'>
                    <IconMail className='h-5 w-5 shrink-0' />
                    <div className='ltr:ml-3 rtl:mr-3'>Inbox</div>
                  </div>
                  <div className='bg-primary-light whitespace-nowrap rounded-md px-2 py-0.5 font-semibold dark:bg-[#060818]'>
                    {mailList &&
                      mailList.filter(d => d.type === 'inbox').length}
                  </div>
                </button>

                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    !isEdit && selectedTab === 'star'
                      ? 'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedTab('star');
                    tabChanged();
                  }}
                >
                  <div className='flex items-center'>
                    <IconStar className='shrink-0' />
                    <div className='ltr:ml-3 rtl:mr-3'>Marked</div>
                  </div>
                </button>

                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    !isEdit && selectedTab === 'sent_mail'
                      ? 'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedTab('sent_mail');
                    tabChanged();
                  }}
                >
                  <div className='flex items-center'>
                    <IconSend className='shrink-0' />

                    <div className='ltr:ml-3 rtl:mr-3'>Sent</div>
                  </div>
                </button>

                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    !isEdit && selectedTab === 'spam'
                      ? 'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedTab('spam');
                    tabChanged();
                  }}
                >
                  <div className='flex items-center'>
                    <IconInfoHexagon className='shrink-0' />
                    <div className='ltr:ml-3 rtl:mr-3'>Spam</div>
                  </div>
                </button>

                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    !isEdit && selectedTab === 'draft'
                      ? 'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedTab('draft');
                    tabChanged();
                  }}
                >
                  <div className='flex items-center'>
                    <IconFile className='h-4.5 w-4.5' />
                    <div className='ltr:ml-3 rtl:mr-3'>Drafts</div>
                  </div>
                  <div className='bg-primary-light whitespace-nowrap rounded-md px-2 py-0.5 font-semibold dark:bg-[#060818]'>
                    {mailList &&
                      mailList.filter(d => d.type === 'draft').length}
                  </div>
                </button>

                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    !isEdit && selectedTab === 'trash'
                      ? 'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                      : ''
                  }`}
                  onClick={() => {
                    setSelectedTab('trash');
                    tabChanged();
                  }}
                >
                  <div className='flex items-center'>
                    <IconTrashLines className='shrink-0' />
                    <div className='ltr:ml-3 rtl:mr-3'>Trash</div>
                  </div>
                </button>

                <Disclosure as='div'>
                  {({ open }) => (
                    <>
                      <Disclosure.Button className='hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center rounded-md p-2 font-medium dark:hover:bg-[#181F32]'>
                        <IconCaretDown
                          className={`h-5 w-5 shrink-0 ${open && 'rotate-180'}`}
                        />

                        <div className='ltr:ml-3 rtl:mr-3'>
                          {open ? 'Less' : 'More'}
                        </div>
                      </Disclosure.Button>

                      <Disclosure.Panel
                        as='ul'
                        unmount={false}
                        className='mt-1 space-y-1'
                      >
                        <li>
                          <button
                            type='button'
                            className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                              !isEdit && selectedTab === 'archive'
                                ? 'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedTab('archive');
                              tabChanged();
                            }}
                          >
                            <IconArchive className='shrink-0' />
                            <div className='ltr:ml-3 rtl:mr-3'>Archive</div>
                          </button>
                        </li>
                        <li>
                          <button
                            type='button'
                            className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                              !isEdit && selectedTab === 'important'
                                ? 'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                                : ''
                            }`}
                            onClick={() => {
                              setSelectedTab('important');
                              tabChanged();
                            }}
                          >
                            <IconBookmark className='shrink-0' />
                            <div className='ltr:ml-3 rtl:mr-3'>Important</div>
                          </button>
                        </li>
                      </Disclosure.Panel>
                    </>
                  )}
                </Disclosure>

                <div className='border-white-light h-px border-b dark:border-[#1b2e4b]'></div>

                <button
                  type='button'
                  className='hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32]'
                >
                  <div className='flex items-center'>
                    <IconVideo className='shrink-0' />
                    <div className='ltr:ml-3 rtl:mr-3'>New meeting</div>
                  </div>
                </button>
                <button
                  type='button'
                  className='hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32]'
                >
                  <div className='flex items-center'>
                    <IconChartSquare className='shrink-0 rotate-180' />
                    <div className='ltr:ml-3 rtl:mr-3'>Join a meeting</div>
                  </div>
                </button>
                <div className='border-white-light h-px border-b dark:border-[#1b2e4b]'></div>
              </div>
            </PerfectScrollbar>

            <div className='absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0'>
              <button
                type='button'
                className='hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary group flex w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32]'
                onClick={() => setIsShowMailMenu(false)}
              >
                <div className='flex items-center'>
                  <IconUserPlus className='shrink-0' />
                  <div className='ltr:ml-3 rtl:mr-3'>Add Account</div>
                </div>
                <div className='bg-primary-light rounded-md px-2 py-1 dark:bg-[#060818]'>
                  <IconPlus />
                </div>
              </button>
            </div>
          </div>
        </div>

        <div className='panel h-full flex-1 overflow-x-hidden p-0'>
          {!selectedMail && !isEdit && (
            <div className='flex h-full flex-col'>
              <div className='flex flex-wrap-reverse items-center justify-between gap-4 p-4'>
                <div className='flex w-full items-center sm:w-auto'>
                  <div className='ltr:mr-4 rtl:ml-4'>
                    <input
                      type='checkbox'
                      className='form-checkbox'
                      checked={checkAllCheckbox()}
                      onChange={() => {
                        const newIds =
                          filteredMailList.length === ids.length
                            ? []
                            : filteredMailList.map(d => d.id);
                        setIds(newIds);
                      }}
                      onClick={event => event.stopPropagation()}
                    />
                  </div>

                  <div className='ltr:mr-4 rtl:ml-4'>
                    <Tippy content='Refresh'>
                      <button
                        type='button'
                        className='hover:text-primary flex items-center'
                        onClick={() => refreshMails()}
                      >
                        <IconRefresh />
                      </button>
                    </Tippy>
                  </div>

                  {selectedTab !== 'trash' && (
                    <ul className='flex grow items-center gap-4 sm:flex-none ltr:sm:mr-4 rtl:sm:ml-4'>
                      <li>
                        <div>
                          <Tippy content='Archive'>
                            <button
                              type='button'
                              className='hover:text-primary flex items-center'
                              onClick={setArchive}
                            >
                              <IconArchive />
                            </button>
                          </Tippy>
                        </div>
                      </li>
                      <li>
                        <div>
                          <Tippy content='Spam'>
                            <button
                              type='button'
                              className='hover:text-primary flex items-center'
                              onClick={setSpam}
                            >
                              <IconInfoHexagon />
                            </button>
                          </Tippy>
                        </div>
                      </li>
                      <li>
                        <div className='dropdown'>
                          <Dropdown
                            offset={[0, 1]}
                            placement={`${
                              isRtl ? 'bottom-start' : 'bottom-end'
                            }`}
                            btnClassName='hover:text-primary flex items-center'
                            button={
                              <Tippy content='Group'>
                                <span>
                                  <IconWheel />
                                </span>
                              </Tippy>
                            }
                          >
                            <ul className='text-sm font-medium'>
                              <li>
                                <button
                                  type='button'
                                  className='w-full'
                                  onClick={() => setGroup('personal')}
                                >
                                  <div className='bg-primary h-2 w-2 shrink-0 rounded-full ltr:mr-3 rtl:ml-3'></div>
                                  Personal
                                </button>
                              </li>
                              <li>
                                <button
                                  type='button'
                                  className='w-full'
                                  onClick={() => setGroup('work')}
                                >
                                  <div className='bg-warning h-2 w-2 shrink-0 rounded-full ltr:mr-3 rtl:ml-3'></div>
                                  Work
                                </button>
                              </li>
                              <li>
                                <button
                                  type='button'
                                  className='w-full'
                                  onClick={() => setGroup('social')}
                                >
                                  <div className='bg-success h-2 w-2 shrink-0 rounded-full ltr:mr-3 rtl:ml-3'></div>
                                  Social
                                </button>
                              </li>
                              <li>
                                <button
                                  type='button'
                                  className='w-full'
                                  onClick={() => setGroup('private')}
                                >
                                  <div className='bg-danger h-2 w-2 shrink-0 rounded-full ltr:mr-3 rtl:ml-3'></div>
                                  Private
                                </button>
                              </li>
                            </ul>
                          </Dropdown>
                        </div>
                      </li>
                      <li>
                        <div className='dropdown'>
                          <Dropdown
                            offset={[0, 1]}
                            placement={`${
                              isRtl ? 'bottom-start' : 'bottom-end'
                            }`}
                            btnClassName='hover:text-primary flex items-center'
                            button={
                              <IconHorizontalDots className='rotate-90 opacity-70' />
                            }
                          >
                            <ul className='whitespace-nowrap'>
                              <li>
                                <button
                                  type='button'
                                  className='w-full'
                                  onClick={() => setAction(ActionType.Read)}
                                >
                                  <IconOpenBook className='shrink-0 ltr:mr-2 rtl:ml-2' />
                                  Mark as Read
                                </button>
                              </li>
                              <li>
                                <button
                                  type='button'
                                  className='w-full'
                                  onClick={() => setAction(ActionType.Unread)}
                                >
                                  <IconBook className='shrink-0 ltr:mr-2 rtl:ml-2' />
                                  Mark as Unread
                                </button>
                              </li>
                              <li>
                                <button
                                  type='button'
                                  className='w-full'
                                  onClick={() => setAction(ActionType.Trash)}
                                >
                                  <IconTrashLines className='shrink-0 ltr:mr-2 rtl:ml-2' />
                                  Trash
                                </button>
                              </li>
                            </ul>
                          </Dropdown>
                        </div>
                      </li>
                    </ul>
                  )}

                  {selectedTab === 'trash' && (
                    <ul className='flex flex-1 items-center gap-4 sm:flex-none ltr:sm:mr-3 rtl:sm:ml-4'>
                      <li>
                        <div>
                          <Tippy content='Permanently Delete'>
                            <button
                              type='button'
                              className='hover:text-primary block'
                              onClick={() => setAction(ActionType.Delete)}
                            >
                              <IconTrash />
                            </button>
                          </Tippy>
                        </div>
                      </li>
                      <li>
                        <div>
                          <Tippy content='Restore'>
                            <button
                              type='button'
                              className='hover:text-primary block'
                              onClick={() => setAction(ActionType.Restore)}
                            >
                              <IconRestore />
                            </button>
                          </Tippy>
                        </div>
                      </li>
                    </ul>
                  )}
                </div>

                <div className='flex w-full items-center justify-between sm:w-auto'>
                  <div className='flex items-center ltr:mr-4 rtl:ml-4'>
                    <button
                      type='button'
                      className='hover:text-primary block xl:hidden ltr:mr-3 rtl:ml-3'
                      onClick={() => setIsShowMailMenu(!isShowMailMenu)}
                    >
                      <IconMenu />
                    </button>
                    <div className='group relative'>
                      <input
                        type='text'
                        className='form-input peer ltr:pr-8 rtl:pl-8'
                        placeholder='Search Mail'
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        onKeyUp={() => searchMails()}
                      />
                      <div className='peer-focus:text-primary absolute top-1/2 -translate-y-1/2 ltr:right-[11px] rtl:left-[11px]'>
                        <IconSearch />
                      </div>
                    </div>
                  </div>
                  <div className='flex items-center'>
                    <div className='ltr:mr-4 rtl:ml-4'>
                      <Tippy content='Settings'>
                        <button type='button' className='hover:text-primary'>
                          <IconSettings />
                        </button>
                      </Tippy>
                    </div>
                    <div>
                      <Tippy content='Help'>
                        <button type='button' className='hover:text-primary'>
                          <IconHelpCircle className='h-6 w-6' />
                        </button>
                      </Tippy>
                    </div>
                  </div>
                </div>
              </div>

              <div className='border-white-light h-px border-b dark:border-[#1b2e4b]'></div>

              <div className='flex flex-col flex-wrap items-center justify-between px-4 pb-4 md:flex-row xl:w-auto'>
                <div className='mt-4 grid w-full grid-cols-2 gap-3 sm:w-auto sm:grid-cols-4'>
                  <button
                    type='button'
                    className={`btn btn-outline-primary flex ${
                      selectedTab === 'personal' ? 'bg-primary text-white' : ''
                    }`}
                    onClick={() => {
                      setSelectedTab('personal');
                      tabChanged();
                    }}
                  >
                    <IconUser className='h-5 w-5 ltr:mr-2 rtl:ml-2' />
                    Personal
                  </button>

                  <button
                    type='button'
                    className={`btn btn-outline-warning flex ${
                      selectedTab === 'work' ? 'bg-warning text-white' : ''
                    }`}
                    onClick={() => {
                      setSelectedTab('work');
                      tabChanged();
                    }}
                  >
                    <IconMessage2 className='h-5 w-5 ltr:mr-2 rtl:ml-2' />
                    Work
                  </button>

                  <button
                    type='button'
                    className={`btn btn-outline-success flex ${
                      selectedTab === 'social' ? 'bg-success text-white' : ''
                    }`}
                    onClick={() => {
                      setSelectedTab('social');
                      tabChanged();
                    }}
                  >
                    <IconUsers className='ltr:mr-2 rtl:ml-2' />
                    Social
                  </button>

                  <button
                    type='button'
                    className={`btn btn-outline-danger flex ${
                      selectedTab === 'private' ? 'bg-danger text-white' : ''
                    }`}
                    onClick={() => {
                      setSelectedTab('private');
                      tabChanged();
                    }}
                  >
                    <IconTag className='ltr:mr-2 rtl:ml-2' />
                    Private
                  </button>
                </div>

                <div className='mt-4 flex-1 md:flex-auto'>
                  <div className='flex items-center justify-center md:justify-end'>
                    <div className='ltr:mr-3 rtl:ml-3'>
                      {pager.startIndex +
                        1 +
                        '-' +
                        (pager.endIndex + 1) +
                        ' of ' +
                        filteredMailList.length}
                    </div>
                    <button
                      type='button'
                      disabled={pager.currentPage === 1}
                      className='enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 rounded-md bg-[#f4f4f4] p-1 disabled:cursor-not-allowed disabled:opacity-60 ltr:mr-3 rtl:ml-3'
                      onClick={() => {
                        pager.currentPage--;
                        searchMails(false);
                      }}
                    >
                      <IconCaretDown className='h-5 w-5 rotate-90 rtl:-rotate-90' />
                    </button>
                    <button
                      type='button'
                      disabled={pager.currentPage === pager.totalPages}
                      className='enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 rounded-md bg-[#f4f4f4] p-1 disabled:cursor-not-allowed disabled:opacity-60'
                      onClick={() => {
                        pager.currentPage++;
                        searchMails(false);
                      }}
                    >
                      <IconCaretDown className='h-5 w-5 -rotate-90 rtl:rotate-90' />
                    </button>
                  </div>
                </div>
              </div>

              <div className='border-white-light h-px border-b dark:border-[#1b2e4b]'></div>

              {pagedMails.length ? (
                <div className='table-responsive min-h-[400px] grow overflow-y-auto sm:min-h-[300px]'>
                  <table className='table-hover'>
                    <tbody>
                      {pagedMails.map((mail: Mail) => {
                        return (
                          <tr
                            key={mail.id}
                            className='cursor-pointer'
                            onClick={() => selectMail(mail)}
                          >
                            <td>
                              <div className='flex items-center whitespace-nowrap'>
                                <div className='ltr:mr-3 rtl:ml-3'>
                                  {ids.includes(mail.id)}
                                  <input
                                    type='checkbox'
                                    id={`chk-${mail.id}`}
                                    value={mail.id}
                                    checked={
                                      ids.length ? ids.includes(mail.id) : false
                                    }
                                    onChange={() =>
                                      handleCheckboxChange(mail.id)
                                    }
                                    onClick={event => event.stopPropagation()}
                                    className='form-checkbox'
                                  />
                                </div>
                                <div className='ltr:mr-3 rtl:ml-3'>
                                  <Tippy content='Star'>
                                    <button
                                      type='button'
                                      className={`enabled:hover:text-warning flex items-center disabled:opacity-60 ${
                                        mail.isStar ? 'text-warning' : ''
                                      }`}
                                      onClick={e => {
                                        e.stopPropagation();
                                        setStar(mail.id);
                                      }}
                                      disabled={selectedTab === 'trash'}
                                    >
                                      <IconStar
                                        className={
                                          mail.isStar ? 'fill-warning' : ''
                                        }
                                      />
                                    </button>
                                  </Tippy>
                                </div>
                                <div className='ltr:mr-3 rtl:ml-3'>
                                  <Tippy content='Important'>
                                    <button
                                      type='button'
                                      className={`enabled:hover:text-primary flex rotate-90 items-center disabled:opacity-60 ${
                                        mail.isImportant ? 'text-primary' : ''
                                      }`}
                                      onClick={e => {
                                        e.stopPropagation();
                                        setImportant(mail.id);
                                      }}
                                      disabled={selectedTab === 'trash'}
                                    >
                                      <IconBookmark
                                        bookmark={false}
                                        className={`h-4.5 w-4.5 ${
                                          mail.isImportant && 'fill-primary'
                                        }`}
                                      />
                                    </button>
                                  </Tippy>
                                </div>
                                <div
                                  className={`whitespace-nowrap font-semibold dark:text-gray-300 ${
                                    !mail.isUnread
                                      ? 'text-gray-500 dark:text-gray-500'
                                      : ''
                                  }`}
                                >
                                  {mail.firstName
                                    ? mail.firstName + ' ' + mail.lastName
                                    : mail.email}
                                </div>
                              </div>
                            </td>
                            <td>
                              <div className='text-white-dark line-clamp-1 min-w-[300px] overflow-hidden font-medium'>
                                <span
                                  className={`${
                                    mail.isUnread
                                      ? 'font-semibold text-gray-800 dark:text-gray-300'
                                      : ''
                                  }`}
                                >
                                  <span>{mail.title}</span> &minus;
                                  <span> {mail.displayDescription}</span>
                                </span>
                              </div>
                            </td>
                            <td>
                              <div className='flex items-center'>
                                <div
                                  className={`h-2 w-2 rounded-full ${
                                    (mail.group === 'personal' &&
                                      'bg-primary') ||
                                    (mail.group === 'work' && 'bg-warning') ||
                                    (mail.group === 'social' && 'bg-success') ||
                                    (mail.group === 'private' && 'bg-danger')
                                  }`}
                                ></div>
                                {mail.attachments && (
                                  <div className='ltr:ml-4 rtl:mr-4'>
                                    <IconPaperclip />
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className='whitespace-nowrap font-medium ltr:text-right rtl:text-left'>
                              {showTime(mail)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className='grid h-full min-h-[300px] place-content-center text-lg font-semibold'>
                  No data available
                </div>
              )}
            </div>
          )}

          {selectedMail && !isEdit && (
            <div>
              <div className='flex flex-wrap items-center justify-between p-4'>
                <div className='flex items-center'>
                  <button
                    type='button'
                    className='hover:text-primary ltr:mr-2 rtl:ml-2'
                    onClick={() => setSelectedMail(null)}
                  >
                    <IconArrowLeft className='h-5 w-5 rotate-180' />
                  </button>
                  <h4 className='text-base font-medium md:text-lg ltr:mr-2 rtl:ml-2'>
                    {selectedMail.title}
                  </h4>
                  <div className='badge bg-info hover:top-0'>
                    {selectedMail.type}
                  </div>
                </div>
                <div>
                  <Tippy content='Print'>
                    <button type='button'>
                      <IconPrinter />
                    </button>
                  </Tippy>
                </div>
              </div>
              <div className='border-white-light h-px border-b dark:border-[#1b2e4b]'></div>
              <div className='relative p-4'>
                <div className='flex flex-wrap'>
                  <div className='flex-shrink-0 ltr:mr-2 rtl:ml-2'>
                    {selectedMail.path ? (
                      <Image
                        src={`/assets/images/${selectedMail.path}`}
                        className='h-12 w-12 rounded-full object-cover'
                        alt='avatar'
                        width={48}
                        height={48}
                      />
                    ) : (
                      <div className='rounded-full border border-gray-300 p-3 dark:border-gray-800'>
                        <IconUser className='h-5 w-5' />
                      </div>
                    )}
                  </div>
                  <div className='flex-1 ltr:mr-2 rtl:ml-2'>
                    <div className='flex items-center'>
                      <div className='whitespace-nowrap text-lg ltr:mr-4 rtl:ml-4'>
                        {selectedMail.firstName
                          ? selectedMail.firstName + ' ' + selectedMail.lastName
                          : selectedMail.email}
                      </div>
                      {selectedMail.group && (
                        <div className='ltr:mr-4 rtl:ml-4'>
                          <Tippy
                            content={selectedMail.group}
                            className='capitalize'
                          >
                            <div
                              className={`h-2 w-2 rounded-full ${
                                (selectedMail.group === 'personal' &&
                                  'bg-primary') ||
                                (selectedMail.group === 'work' &&
                                  'bg-warning') ||
                                (selectedMail.group === 'social' &&
                                  'bg-success') ||
                                (selectedMail.group === 'private' &&
                                  'bg-danger')
                              }`}
                            ></div>
                          </Tippy>
                        </div>
                      )}
                      <div className='text-white-dark whitespace-nowrap'>
                        1 days ago
                      </div>
                    </div>
                    <div className='text-white-dark flex items-center'>
                      <div className='ltr:mr-1 rtl:ml-1'>
                        {selectedMail.type === 'sent_mail'
                          ? selectedMail.email
                          : 'to me'}
                      </div>
                      <div className='dropdown'>
                        <Dropdown
                          offset={[0, 5]}
                          placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                          btnClassName='hover:text-primary flex items-center'
                          button={<IconCaretDown className='h-5 w-5' />}
                        >
                          <ul className='sm:w-56'>
                            <li>
                              <div className='flex items-center px-4 py-2'>
                                <div className='text-white-dark w-1/4 ltr:mr-2 rtl:ml-2'>
                                  From:
                                </div>
                                <div className='flex-1 truncate'>
                                  {selectedMail.type === 'sent_mail'
                                    ? 'vristo@gmail.com'
                                    : selectedMail.email}
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className='flex items-center px-4 py-2'>
                                <div className='text-white-dark w-1/4 ltr:mr-2 rtl:ml-2'>
                                  To:
                                </div>
                                <div className='flex-1 truncate'>
                                  {selectedMail.type !== 'sent_mail'
                                    ? 'vristo@gmail.com'
                                    : selectedMail.email}
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className='flex items-center px-4 py-2'>
                                <div className='text-white-dark w-1/4 ltr:mr-2 rtl:ml-2'>
                                  Date:
                                </div>
                                <div className='flex-1'>
                                  {selectedMail.date + ', ' + selectedMail.time}
                                </div>
                              </div>
                            </li>
                            <li>
                              <div className='flex items-center px-4 py-2'>
                                <div className='text-white-dark w-1/4 ltr:mr-2 rtl:ml-2'>
                                  Subject:
                                </div>
                                <div className='flex-1'>
                                  {selectedMail.title}
                                </div>
                              </div>
                            </li>
                          </ul>
                        </Dropdown>
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className='flex items-center justify-center space-x-3 rtl:space-x-reverse'>
                      <Tippy content='Star'>
                        <button
                          type='button'
                          className={`enabled:hover:text-warning disabled:opacity-60 ${
                            selectedMail.isStar ? 'text-warning' : ''
                          }`}
                          onClick={() => setStar(selectedMail.id)}
                          disabled={selectedTab === 'trash'}
                        >
                          <IconStar
                            className={
                              selectedMail.isStar ? 'fill-warning' : ''
                            }
                          />
                        </button>
                      </Tippy>
                      <Tippy content='Important'>
                        <button
                          type='button'
                          className={`enabled:hover:text-primary disabled:opacity-60 ${
                            selectedMail.isImportant ? 'text-primary' : ''
                          }`}
                          onClick={() => setImportant(selectedMail.id)}
                          disabled={selectedTab === 'trash'}
                        >
                          <IconBookmark
                            bookmark={false}
                            className={`h-4.5 w-4.5 rotate-90 ${
                              selectedMail.isImportant && 'fill-primary'
                            }`}
                          />
                        </button>
                      </Tippy>
                      <Tippy content='Reply'>
                        <button
                          type='button'
                          className='hover:text-info'
                          onClick={() => openMail('reply', selectedMail)}
                        >
                          <IconArrowBackward className='rtl:hidden' />
                          <IconArrowForward className='ltr:hidden' />
                        </button>
                      </Tippy>
                      <Tippy content='Forward'>
                        <button
                          type='button'
                          className='hover:text-info'
                          onClick={() => openMail('forward', selectedMail)}
                        >
                          <IconArrowBackward className='ltr:hidden' />
                          <IconArrowForward className='rtl:hidden' />
                        </button>
                      </Tippy>
                    </div>
                  </div>
                </div>

                <div
                  className='prose prose-p:text-sm prose-img:m-0 prose-img:inline-block dark:prose-p:text-white md:prose-p:text-sm mt-8 max-w-full'
                  dangerouslySetInnerHTML={{ __html: selectedMail.description }}
                ></div>
                <p className='mt-4'>Best Regards,</p>
                <p>{selectedMail.firstName + ' ' + selectedMail.lastName}</p>

                {selectedMail.attachments && (
                  <div className='mt-8'>
                    <div className='mb-4 text-base'>Attachments</div>
                    <div className='border-white-light h-px border-b dark:border-[#1b2e4b]'></div>
                    <div className='mt-6 flex flex-wrap items-center'>
                      {selectedMail.attachments.map(
                        (attachment: Attachment, i: number) => {
                          return (
                            <button
                              key={i}
                              type='button'
                              className='border-white-light hover:border-primary hover:text-primary group relative mb-4 flex items-center rounded-md border px-4 py-2.5 transition-all duration-300 ltr:mr-4 rtl:ml-4 dark:border-[#1b2e4b]'
                            >
                              {attachment.type === 'image' && <IconGallery />}
                              {attachment.type === 'folder' && <IconFolder />}
                              {attachment.type === 'zip' && <IconZipFile />}
                              {attachment.type !== 'zip' &&
                                attachment.type !== 'image' &&
                                attachment.type !== 'folder' && (
                                  <IconTxtFile className='h-5 w-5' />
                                )}

                              <div className='ltr:ml-3 rtl:mr-3'>
                                <p className='text-primary text-xs font-semibold'>
                                  {attachment.name}
                                </p>
                                <p className='text-[11px] text-gray-400 dark:text-gray-600'>
                                  {attachment.size}
                                </p>
                              </div>
                              <div className='bg-dark-light/40 absolute top-0 z-[5] hidden h-full w-full rounded-md group-hover:block ltr:left-0 rtl:right-0'></div>
                              <div className='btn btn-primary absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 rounded-full p-1 group-hover:block'>
                                <IconDownload className='h-4.5 w-4.5' />
                              </div>
                            </button>
                          );
                        },
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {isEdit && (
            <div className='relative'>
              <div className='flex items-center px-6 py-4'>
                <button
                  type='button'
                  className='hover:text-primary block xl:hidden ltr:mr-3 rtl:ml-3'
                  onClick={() => setIsShowMailMenu(!isShowMailMenu)}
                >
                  <IconMenu />
                </button>
                <h4 className='text-lg font-medium text-gray-600 dark:text-gray-400'>
                  Message
                </h4>
              </div>
              <div className='h-px bg-gradient-to-l from-indigo-900/20 via-black to-indigo-900/20 opacity-[0.1] dark:via-white'></div>
              <form className='grid gap-6 p-6'>
                <div>
                  <input
                    id='to'
                    type='text'
                    className='form-input'
                    placeholder='Enter To'
                    defaultValue={params.to}
                    onChange={e => {
                      changeValue(e);
                    }}
                  />
                </div>

                <div>
                  <input
                    id='cc'
                    type='text'
                    className='form-input'
                    placeholder='Enter Cc'
                    defaultValue={params.cc}
                    onChange={e => changeValue(e)}
                  />
                </div>

                <div>
                  <input
                    id='title'
                    type='text'
                    className='form-input'
                    placeholder='Enter Subject'
                    defaultValue={params.title}
                    onChange={e => changeValue(e)}
                  />
                </div>

                <div className='h-fit'>
                  {/* <ReactQuill
                    theme='snow'
                    value={params.description || ''}
                    onChange={(content, _, __, editor) => {
                      params.description = content;
                      params.displayDescription = editor.getText();
                      setParams({
                        ...params,
                      });
                    }}
                    style={{ minHeight: '200px' }}
                  /> */}
                </div>

                <div>
                  <input
                    type='file'
                    className='form-input file:bg-primary/90 file:hover:bg-primary p-0 file:border-0 file:px-4 file:py-2 file:font-semibold file:text-white ltr:file:mr-5 rtl:file:ml-5'
                    multiple
                    accept='image/*,.zip,.pdf,.xls,.xlsx,.txt.doc,.docx'
                    required
                  />
                </div>
                <div className='mt-8 flex items-center ltr:ml-auto rtl:mr-auto'>
                  <button
                    type='button'
                    className='btn btn-outline-danger ltr:mr-3 rtl:ml-3'
                    onClick={closeMsgPopUp}
                  >
                    Close
                  </button>
                  <button
                    type='button'
                    className='btn btn-success ltr:mr-3 rtl:ml-3'
                    onClick={() => saveMail('save', null)}
                  >
                    Save
                  </button>
                  <button
                    type='button'
                    className='btn btn-primary'
                    onClick={() => saveMail('send', params.id)}
                  >
                    Send
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComponentsAppsMailbox;
