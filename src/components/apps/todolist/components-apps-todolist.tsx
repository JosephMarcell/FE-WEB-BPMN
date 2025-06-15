'use client';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import PerfectScrollbar from 'react-perfect-scrollbar';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import 'react-quill/dist/quill.snow.css';

import Dropdown from '@/components/dropdown';
import IconCaretDown from '@/components/icon/icon-caret-down';
import IconClipboardText from '@/components/icon/icon-clipboard-text';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconListCheck from '@/components/icon/icon-list-check';
import IconMenu from '@/components/icon/icon-menu';
import IconPencilPaper from '@/components/icon/icon-pencil-paper';
import IconPlus from '@/components/icon/icon-plus';
import IconRestore from '@/components/icon/icon-restore';
import IconSearch from '@/components/icon/icon-search';
import IconSquareRotated from '@/components/icon/icon-square-rotated';
import IconStar from '@/components/icon/icon-star';
import IconThumbUp from '@/components/icon/icon-thumb-up';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconUser from '@/components/icon/icon-user';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

interface Task {
  id: number;
  title: string;
  description: string;
  descriptionText: string;
  assignee: string;
  path: string;
  tag: string;
  priority: 'low' | 'medium' | 'high' | '';
  date?: string;
  status?: 'complete' | 'important' | 'trash' | '';
}

interface TaskParams extends Omit<Task, 'id' | 'date' | 'status'> {
  id: number | null;
  date?: string;
  status?: 'complete' | 'important' | 'trash' | '';
}

interface Pager {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  startIndex: number;
  endIndex: number;
}

const initialTasks: Task[] = [
  {
    id: 1,
    title: 'Meeting with Shaun Park at 4:50pm',
    date: 'Aug, 07 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: 'team',
    priority: 'medium',
    assignee: 'John Smith',
    path: '',
    status: '',
  },
  {
    id: 2,
    title: 'Team meet at Starbucks',
    date: 'Aug, 06 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: 'team',
    priority: 'low',
    assignee: 'John Smith',
    path: 'profile-15.jpeg',
    status: '',
  },
  {
    id: 3,
    title: 'Meet Lisa to discuss project details',
    date: 'Aug, 05 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: 'update',
    priority: 'medium',
    assignee: 'John Smith',
    path: 'profile-1.jpeg',
    status: 'complete',
  },
  {
    id: 4,
    title: 'Download Complete',
    date: 'Aug, 04 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: 'low',
    assignee: 'John Smith',
    path: 'profile-16.jpeg',
    status: '',
  },
  {
    id: 5,
    title: 'Conference call with Marketing Manager',
    date: 'Aug, 03 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: 'update',
    priority: 'high',
    assignee: 'John Smith',
    path: 'profile-5.jpeg',
    status: 'important',
  },
  {
    id: 6,
    title: 'New User Registered',
    date: 'Aug, 02 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: 'medium',
    assignee: '',
    path: '',
    status: 'important',
  },
  {
    id: 7,
    title: 'Fix issues in new project',
    date: 'Aug, 01 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: 'team',
    priority: 'medium',
    assignee: 'John Smith',
    path: 'profile-17.jpeg',
    status: '',
  },
  {
    id: 8,
    title: 'Check All functionality',
    date: 'Aug, 07 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: 'update',
    priority: 'medium',
    assignee: 'John Smith',
    path: 'profile-18.jpeg',
    status: 'important',
  },
  {
    id: 9,
    title: 'Check Repository',
    date: 'Aug, 07 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: 'team',
    priority: 'medium',
    assignee: 'John Smith',
    path: 'profile-20.jpeg',
    status: 'complete',
  },
  {
    id: 10,
    title: 'Trashed Tasks',
    date: 'Aug, 08 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: 'team',
    priority: 'medium',
    assignee: 'John Smith',
    path: 'profile-15.jpeg',
    status: 'trash',
  },
  {
    id: 11,
    title: 'Trashed Tasks 2',
    date: 'Aug, 09 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: 'medium',
    assignee: 'John Smith',
    path: 'profile-2.jpeg',
    status: 'trash',
  },
  {
    id: 12,
    title: 'Trashed Tasks 3',
    date: 'Aug, 10 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: 'team',
    priority: 'medium',
    assignee: 'John Smith',
    path: 'profile-24.jpeg',
    status: 'trash',
  },
  {
    id: 13,
    title: 'Do something nice for someone I care about',
    date: 'Sep, 10 2022',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-25.jpeg',
    status: '',
  },
  {
    id: 14,
    title: 'Memorize the fifty states and their capitals',
    date: 'Sep, 13 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-11.jpeg',
    status: '',
  },
  {
    id: 15,
    title: 'Watch a classic movie',
    date: 'Oct, 10 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-10.jpeg',
    status: '',
  },
  {
    id: 16,
    title:
      'Contribute code or a monetary donation to an open-source software project',
    date: 'Nov, 10 2017',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-12.jpeg',
    status: '',
  },
  {
    id: 17,
    title: 'Solve a Rubik`s cube',
    date: 'Nov, 15 2017',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-25.jpeg',
    status: '',
  },
  {
    id: 18,
    title: 'Bake pastries for me and neighbor',
    date: 'Mar, 19 2018',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-27.jpeg',
    status: '',
  },
  {
    id: 19,
    title: 'Go see a Broadway production',
    date: 'Oct, 2 2018',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-26.jpeg',
    status: '',
  },
  {
    id: 20,
    title: 'Write a thank you letter to an influential person in my life',
    date: 'Nov, 20 2018',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-18.jpeg',
    status: '',
  },
  {
    id: 21,
    title: 'Invite some friends over for a game night',
    date: 'Jun 6 2019',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-13.jpeg',
    status: '',
  },
  {
    id: 22,
    title: 'Have a football scrimmage with some friends',
    date: 'Sep, 13 2019',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-24.jpeg',
    status: '',
  },
  {
    id: 23,
    title: 'Text a friend I haven`t talked to in a long time',
    date: 'Oct, 10 2019',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-20.jpeg',
    status: '',
  },
  {
    id: 24,
    title: 'Organize pantry',
    date: 'Feb, 24 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-10.jpeg',
    status: '',
  },
  {
    id: 25,
    title: 'Buy a new house decoration',
    date: 'Mar, 25 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-9.jpeg',
    status: '',
  },
  {
    id: 26,
    title: 'Plan a vacation I`ve always wanted to take',
    date: 'Mar, 30 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-4.jpeg',
    status: '',
  },
  {
    id: 27,
    title: 'Clean out car',
    date: 'Apr, 3 2020',
    description:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    descriptionText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi pulvinar feugiat consequat. Duis lacus nibh, sagittis id varius vel, aliquet non augue. Vivamus sem ante, ultrices at ex a, rhoncus ullamcorper tellus. Nunc iaculis eu ligula ac consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Vestibulum mattis urna neque, eget posuere lorem tempus non. Suspendisse ac turpis dictum, convallis est ut, posuere sem. Etiam imperdiet aliquam risus, eu commodo urna vestibulum at. Suspendisse malesuada lorem eu sodales aliquam.',
    tag: '',
    priority: '',
    assignee: 'John Smith',
    path: 'profile-3.jpeg',
    status: '',
  },
];

const ComponentsAppsTodoList = () => {
  const defaultParams: TaskParams = {
    id: null,
    title: '',
    description: '',
    descriptionText: '',
    assignee: '',
    path: '',
    tag: '',
    priority: 'low',
  };

  const [selectedTab, setSelectedTab] = useState('');
  const [isShowTaskMenu, setIsShowTaskMenu] = useState(false);
  const [addTaskModal, setAddTaskModal] = useState(false);
  const [viewTaskModal, setViewTaskModal] = useState(false);
  const [params, setParams] = useState<TaskParams>(defaultParams);
  const [allTasks, setAllTasks] = useState<Task[]>(initialTasks);

  const [filteredTasks, setFilteredTasks] = useState<Task[]>(
    allTasks as Task[],
  );
  const [pagedTasks, setPagedTasks] = useState<Task[]>(filteredTasks);
  const [searchTask, setSearchTask] = useState<string>('');
  const [selectedTask, setSelectedTask] = useState<TaskParams>(defaultParams);
  const [isTagMenu] = useState<number | null>(null);

  const [pager] = useState<Pager>({
    currentPage: 1,
    totalPages: 0,
    pageSize: 10,
    startIndex: 0,
    endIndex: 0,
  });

  const changeValue = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { value, id } = e.target;
    setParams({ ...params, [id]: value });
  };

  const getPager = useCallback(
    (res: Task[]) => {
      setTimeout(() => {
        if (res.length) {
          const updatedPager = { ...pager };
          updatedPager.totalPages =
            updatedPager.pageSize < 1
              ? 1
              : Math.ceil(res.length / updatedPager.pageSize);
          if (updatedPager.currentPage > updatedPager.totalPages) {
            updatedPager.currentPage = 1;
          }
          updatedPager.startIndex =
            (updatedPager.currentPage - 1) * updatedPager.pageSize;
          updatedPager.endIndex = Math.min(
            updatedPager.startIndex + updatedPager.pageSize - 1,
            res.length - 1,
          );
          setPagedTasks(
            res.slice(updatedPager.startIndex, updatedPager.endIndex + 1),
          );
        } else {
          setPagedTasks([]);
          pager.startIndex = -1;
          pager.endIndex = -1;
        }
      }, 0);
    },
    [pager, setPagedTasks],
  );

  const searchTasks = useCallback(() => {
    let res: Task[] = allTasks.filter(() => {
      if (
        selectedTab === 'complete' ||
        selectedTab === 'important' ||
        selectedTab === 'trash'
      ) {
        res = allTasks.filter(d => d.status === selectedTab);
      } else {
        res = allTasks.filter(d => d.status !== 'trash');
      }

      if (selectedTab === 'team' || selectedTab === 'update') {
        res = res.filter(d => d.tag === selectedTab);
      } else if (
        selectedTab === 'high' ||
        selectedTab === 'medium' ||
        selectedTab === 'low'
      ) {
        res = res.filter(d => d.priority === selectedTab);
      }

      res = res.filter(d =>
        d.title.toLowerCase().includes(searchTask.toLowerCase()),
      );
    });
    setFilteredTasks(res);
    getPager(res);
  }, [selectedTab, searchTask, allTasks, getPager]);

  useEffect(() => {
    searchTasks();
  }, [searchTasks]);

  const setPriority = (task: Task, name: 'low' | 'medium' | 'high' | '') => {
    const item = filteredTasks.find((d: Task) => d.id === task.id);
    if (item) {
      item.priority = name;
      searchTasks();
    }
  };

  const setTag = (task: Task, name: string) => {
    const item = filteredTasks.find((d: Task) => d.id === task.id);
    if (item) {
      item.tag = name;
      searchTasks();
    }
  };

  const tabChanged = () => {
    setIsShowTaskMenu(false);
  };

  const taskComplete = (task: Task | null) => {
    if (task) {
      const item = filteredTasks.find((d: Task) => d.id === task.id);
      if (item) {
        item.status = item.status === 'complete' ? '' : 'complete';
        searchTasks();
      }
    }
  };

  const setImportant = (task: Task | null) => {
    if (task) {
      const item = filteredTasks.find((d: Task) => d.id === task.id);
      if (item) {
        item.status = item.status === 'important' ? '' : 'important';
        searchTasks();
      }
    }
  };

  const viewTask = (item: Task | null) => {
    if (item) {
      setSelectedTask({
        ...item,
      });
      setViewTaskModal(true);
    }
  };

  const addEditTask = (task: TaskParams | null = null) => {
    setIsShowTaskMenu(false);
    if (task) {
      setParams({ ...task });
    } else {
      setParams({ ...defaultParams });
    }
    setAddTaskModal(true);
  };

  const deleteTask = (
    task: Task,
    type: 'deletePermanent' | 'delete' | 'restore' | '' = '',
  ) => {
    let updatedTasks: Task[] = allTasks.map((t: Task) => {
      if (t.id === task.id) {
        let statusUpdate = t.status;
        if (type === 'delete') {
          statusUpdate = 'trash';
        } else if (type === 'restore') {
          statusUpdate = '';
        }
        return { ...t, status: statusUpdate };
      }
      return t;
    });

    if (type === 'deletePermanent') {
      updatedTasks = allTasks.filter((t: Task) => t.id !== task.id);
    }

    setAllTasks(updatedTasks);
    searchTasks();
  };

  const saveTask = () => {
    if (!params.title) {
      showMessage('Title is required.', 'error');
      return false;
    }
    if (params.id !== null) {
      setAllTasks(
        allTasks.map(d =>
          d.id === params.id ? { ...d, ...params, id: d.id } : d,
        ),
      );
    } else {
      const maxId = allTasks.length ? Math.max(...allTasks.map(t => t.id)) : 0;
      const today = new Date();
      const date = `${today.toLocaleString('default', {
        month: 'short',
      })}, ${today.getDate()} ${today.getFullYear()}`;
      const newTask: Task = {
        id: maxId + 1,
        date: date,
        status: '',
        title: params.title,
        description: params.description,
        descriptionText: params.descriptionText,
        assignee: params.assignee,
        path: params.path,
        tag: params.tag,
        priority: params.priority,
      };
      setAllTasks(prevTasks => [...prevTasks, newTask]);
    }
    showMessage('Task has been saved successfully.');
    setAddTaskModal(false);
  };

  const showMessage = (msg = '', type: 'success' | 'error' = 'success') => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: 'toast' },
    });

    toast
      .fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
      })
      .then(r => r);
  };

  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const getPriorityBadgeClass = (task: Task) => {
    const baseClass =
      'badge rounded-full capitalize hover:top-0 hover:text-white';
    if (task.priority === 'medium') {
      return `${baseClass} badge-outline-primary hover:bg-primary`;
    } else if (task.priority === 'low') {
      return `${baseClass} badge-outline-warning hover:bg-warning`;
    } else if (task.priority === 'high') {
      return `${baseClass} badge-outline-danger hover:bg-danger`;
    } else {
      return baseClass;
    }
  };

  return (
    <div>
      <div className='relative flex h-full gap-5 sm:h-[calc(100vh_-_150px)]'>
        <div
          className={`panel absolute z-10 hidden h-full w-[240px] max-w-full flex-none space-y-4 p-4 xl:relative xl:block xl:h-auto ltr:rounded-r-none ltr:xl:rounded-r-md rtl:rounded-l-none rtl:xl:rounded-l-md ${
            isShowTaskMenu && '!block'
          }`}
        >
          <div className='flex h-full flex-col pb-16'>
            <div className='pb-5'>
              <div className='flex items-center text-center'>
                <div className='shrink-0'>
                  <IconClipboardText />
                </div>
                <h3 className='text-lg font-semibold ltr:ml-3 rtl:mr-3'>
                  Todo list
                </h3>
              </div>
            </div>
            <div className='border-white-light mb-5 h-px w-full border-b dark:border-[#1b2e4b]'></div>
            <PerfectScrollbar className='relative h-full grow ltr:-mr-3.5 ltr:pr-3.5 rtl:-ml-3.5 rtl:pl-3.5'>
              <div className='space-y-1'>
                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    selectedTab === ''
                      ? 'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                      : ''
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab('');
                  }}
                >
                  <div className='flex items-center'>
                    <IconListCheck className='h-4.5 w-4.5 shrink-0' />
                    <div className='ltr:ml-3 rtl:mr-3'>Inbox</div>
                  </div>
                  <div className='bg-primary-light whitespace-nowrap rounded-md px-2 py-0.5 font-semibold dark:bg-[#060818]'>
                    {allTasks?.filter(d => d.status !== 'trash').length}
                  </div>
                </button>
                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    selectedTab === 'complete' &&
                    'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab('complete');
                  }}
                >
                  <div className='flex items-center'>
                    <IconThumbUp className='h-5 w-5 shrink-0' />
                    <div className='ltr:ml-3 rtl:mr-3'>Done</div>
                  </div>
                  <div className='bg-primary-light whitespace-nowrap rounded-md px-2 py-0.5 font-semibold dark:bg-[#060818]'>
                    {allTasks?.filter(d => d.status === 'complete').length}
                  </div>
                </button>
                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    selectedTab === 'important' &&
                    'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab('important');
                  }}
                >
                  <div className='flex items-center'>
                    <IconStar className='shrink-0' />
                    <div className='ltr:ml-3 rtl:mr-3'>Important</div>
                  </div>
                  <div className='bg-primary-light whitespace-nowrap rounded-md px-2 py-0.5 font-semibold dark:bg-[#060818]'>
                    {allTasks?.filter(d => d.status === 'important').length}
                  </div>
                </button>
                <button
                  type='button'
                  className={`hover:bg-white-dark/10 hover:text-primary dark:hover:text-primary flex h-10 w-full items-center justify-between rounded-md p-2 font-medium dark:hover:bg-[#181F32] ${
                    selectedTab === 'trash' &&
                    'text-primary dark:text-primary bg-gray-100 dark:bg-[#181F32]'
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab('trash');
                  }}
                >
                  <div className='flex items-center'>
                    <IconTrashLines className='shrink-0' />
                    <div className='ltr:ml-3 rtl:mr-3'>Trash</div>
                  </div>
                </button>
                <div className='border-white-light h-px w-full border-b dark:border-[#1b2e4b]'></div>
                <div className='text-white-dark px-1 py-3'>Tags</div>
                <button
                  type='button'
                  className={`text-success hover:bg-white-dark/10 flex h-10 w-full items-center rounded-md p-1 font-medium duration-300 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${
                    selectedTab === 'team' &&
                    'bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]'
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab('team');
                  }}
                >
                  <IconSquareRotated className='fill-success shrink-0' />
                  <div className='ltr:ml-3 rtl:mr-3'>Team</div>
                </button>
                <button
                  type='button'
                  className={`text-warning hover:bg-white-dark/10 flex h-10 w-full items-center rounded-md p-1 font-medium duration-300 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${
                    selectedTab === 'low' &&
                    'bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]'
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab('low');
                  }}
                >
                  <IconSquareRotated className='fill-warning shrink-0' />
                  <div className='ltr:ml-3 rtl:mr-3'>Low</div>
                </button>

                <button
                  type='button'
                  className={`text-primary hover:bg-white-dark/10 flex h-10 w-full items-center rounded-md p-1 font-medium duration-300 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${
                    selectedTab === 'medium' &&
                    'bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]'
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab('medium');
                  }}
                >
                  <IconSquareRotated className='fill-primary shrink-0' />
                  <div className='ltr:ml-3 rtl:mr-3'>Medium</div>
                </button>
                <button
                  type='button'
                  className={`text-danger hover:bg-white-dark/10 flex h-10 w-full items-center rounded-md p-1 font-medium duration-300 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${
                    selectedTab === 'high' &&
                    'bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]'
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab('high');
                  }}
                >
                  <IconSquareRotated className='fill-danger shrink-0' />
                  <div className='ltr:ml-3 rtl:mr-3'>High</div>
                </button>
                <button
                  type='button'
                  className={`text-info hover:bg-white-dark/10 flex h-10 w-full items-center rounded-md p-1 font-medium duration-300 ltr:hover:pl-3 rtl:hover:pr-3 dark:hover:bg-[#181F32] ${
                    selectedTab === 'update' &&
                    'bg-gray-100 ltr:pl-3 rtl:pr-3 dark:bg-[#181F32]'
                  }`}
                  onClick={() => {
                    tabChanged();
                    setSelectedTab('update');
                  }}
                >
                  <IconSquareRotated className='fill-info shrink-0' />
                  <div className='ltr:ml-3 rtl:mr-3'>Update</div>
                </button>
              </div>
            </PerfectScrollbar>
            <div className='absolute bottom-0 w-full p-4 ltr:left-0 rtl:right-0'>
              <button
                className='btn btn-primary w-full'
                type='button'
                onClick={() => addEditTask()}
              >
                <IconPlus className='shrink-0 ltr:mr-2 rtl:ml-2' />
                Add New Task
              </button>
            </div>
          </div>
        </div>
        <div
          className={`overlay absolute z-[5] hidden h-full w-full rounded-md bg-black/60 ${
            isShowTaskMenu && '!block xl:!hidden'
          }`}
          onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
        ></div>
        <div className='panel h-full flex-1 overflow-auto p-0'>
          <div className='flex h-full flex-col'>
            <div className='flex w-full flex-col gap-4 p-4 sm:flex-row sm:items-center'>
              <div className='flex items-center ltr:mr-3 rtl:ml-3'>
                <button
                  type='button'
                  className='hover:text-primary block xl:hidden ltr:mr-3 rtl:ml-3'
                  onClick={() => setIsShowTaskMenu(!isShowTaskMenu)}
                >
                  <IconMenu />
                </button>
                <div className='group relative flex-1'>
                  <input
                    type='text'
                    className='form-input peer ltr:!pr-10 rtl:!pl-10'
                    placeholder='Search Task...'
                    value={searchTask}
                    onChange={e => setSearchTask(e.target.value)}
                    onKeyUp={() => searchTasks()}
                  />
                  <div className='peer-focus:text-primary absolute top-1/2 -translate-y-1/2 ltr:right-[11px] rtl:left-[11px]'>
                    <IconSearch />
                  </div>
                </div>
              </div>
              <div className='flex flex-1 items-center justify-center sm:flex-auto sm:justify-end'>
                <p className='ltr:mr-3 rtl:ml-3'>
                  {pager.startIndex +
                    1 +
                    '-' +
                    (pager.endIndex + 1) +
                    ' of ' +
                    filteredTasks.length}
                </p>
                <button
                  type='button'
                  disabled={pager.currentPage === 1}
                  className='enabled:hover:bg-primary-light dark:bg-white-dark/20 enabled:dark:hover:bg-white-dark/30 rounded-md bg-[#f4f4f4] p-1 disabled:cursor-not-allowed disabled:opacity-60 ltr:mr-3 rtl:ml-3'
                  onClick={() => {
                    pager.currentPage--;
                    searchTasks();
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
                    searchTasks();
                  }}
                >
                  <IconCaretDown className='h-5 w-5 -rotate-90 rtl:rotate-90' />
                </button>
              </div>
            </div>
            <div className='border-white-light h-px w-full border-b dark:border-[#1b2e4b]'></div>

            {pagedTasks.length ? (
              <div className='table-responsive min-h-[400px] grow overflow-y-auto sm:min-h-[300px]'>
                <table className='table-hover'>
                  <tbody>
                    {pagedTasks.map((task: Task) => {
                      return (
                        <tr
                          className={`group cursor-pointer ${
                            task.status === 'complete'
                              ? 'bg-white-light/30 dark:bg-[#1a2941] '
                              : ''
                          }`}
                          key={task.id}
                        >
                          <td className='w-1'>
                            <input
                              type='checkbox'
                              id={`chk-${task.id}`}
                              className='form-checkbox'
                              disabled={selectedTab === 'trash'}
                              onClick={() => taskComplete(task)}
                              defaultChecked={task.status === 'complete'}
                            />
                          </td>
                          <td>
                            <div onClick={() => viewTask(task)}>
                              <div
                                className={`group-hover:text-primary whitespace-nowrap text-base font-semibold ${
                                  task.status === 'complete'
                                    ? 'line-through'
                                    : ''
                                }`}
                              >
                                {task.title}
                              </div>
                              <div
                                className={`text-white-dark line-clamp-1 min-w-[300px] overflow-hidden ${
                                  task.status === 'complete'
                                    ? 'line-through'
                                    : ''
                                }`}
                              >
                                {task.descriptionText}
                              </div>
                            </div>
                          </td>
                          <td className='w-1'>
                            <div className='flex items-center space-x-2 ltr:justify-end rtl:justify-start rtl:space-x-reverse'>
                              {task.priority && (
                                <div className='dropdown'>
                                  <Dropdown
                                    offset={[0, 5]}
                                    placement={`${
                                      isRtl ? 'bottom-start' : 'bottom-end'
                                    }`}
                                    btnClassName='align-middle'
                                    button={
                                      <span
                                        className={getPriorityBadgeClass(task)}
                                      >
                                        {task.priority}
                                      </span>
                                    }
                                  >
                                    <ul className='text-medium text-sm'>
                                      <li>
                                        <button
                                          type='button'
                                          className='text-danger ltr:text-left rtl:text-right'
                                          onClick={() =>
                                            setPriority(task, 'high')
                                          }
                                        >
                                          High
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          type='button'
                                          className='text-primary ltr:text-left rtl:text-right'
                                          onClick={() =>
                                            setPriority(task, 'medium')
                                          }
                                        >
                                          Medium
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          type='button'
                                          className='text-warning ltr:text-left rtl:text-right'
                                          onClick={() =>
                                            setPriority(task, 'low')
                                          }
                                        >
                                          Low
                                        </button>
                                      </li>
                                    </ul>
                                  </Dropdown>
                                </div>
                              )}

                              {task.tag && (
                                <div className='dropdown'>
                                  <Dropdown
                                    offset={[0, 5]}
                                    placement={`${
                                      isRtl ? 'bottom-start' : 'bottom-end'
                                    }`}
                                    btnClassName='align-middle'
                                    button={
                                      <span
                                        className={`badge rounded-full capitalize hover:top-0 hover:text-white ${
                                          task.tag === 'team'
                                            ? 'badge-outline-success hover:bg-success'
                                            : task.tag === 'update'
                                            ? 'badge-outline-info hover:bg-info'
                                            : task.tag === 'team' &&
                                              isTagMenu === task.id
                                            ? 'bg-success text-white '
                                            : task.tag === 'update' &&
                                              isTagMenu === task.id
                                            ? 'bg-info text-white '
                                            : ''
                                        }`}
                                      >
                                        {task.tag}
                                      </span>
                                    }
                                  >
                                    <ul className='text-medium text-sm'>
                                      <li>
                                        <button
                                          type='button'
                                          className='text-success'
                                          onClick={() => setTag(task, 'team')}
                                        >
                                          Team
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          type='button'
                                          className='text-info'
                                          onClick={() => setTag(task, 'update')}
                                        >
                                          Update
                                        </button>
                                      </li>
                                      <li>
                                        <button
                                          type='button'
                                          onClick={() => setTag(task, '')}
                                        >
                                          None
                                        </button>
                                      </li>
                                    </ul>
                                  </Dropdown>
                                </div>
                              )}
                            </div>
                          </td>
                          <td className='w-1'>
                            <p
                              className={`text-white-dark whitespace-nowrap font-medium ${
                                task.status === 'complete' ? 'line-through' : ''
                              }`}
                            >
                              {task.date}
                            </p>
                          </td>
                          <td className='w-1'>
                            <div className='flex w-max items-center justify-between'>
                              <div className='flex-shrink-0 ltr:mr-2.5 rtl:ml-2.5'>
                                {task.path && (
                                  <div>
                                    <Image
                                      src={`/assets/images/${task.path}`}
                                      className='h-8 w-8 rounded-full object-cover'
                                      alt='avatar'
                                      width={32}
                                      height={32}
                                    />
                                  </div>
                                )}
                                {!task.path && task.assignee ? (
                                  <div className='bg-primary grid h-8 w-8 place-content-center rounded-full text-sm font-semibold text-white'>
                                    {task.assignee.charAt(0) +
                                      '' +
                                      task.assignee.charAt(
                                        task.assignee.indexOf(' ') + 1,
                                      )}
                                  </div>
                                ) : (
                                  ''
                                )}
                                {!task.path && !task.assignee ? (
                                  <div className='grid h-8 w-8 place-content-center rounded-full border border-gray-300 dark:border-gray-800'>
                                    <IconUser className='h-4.5 w-4.5' />
                                  </div>
                                ) : (
                                  ''
                                )}
                              </div>
                              <div className='dropdown'>
                                <Dropdown
                                  offset={[0, 5]}
                                  placement={`${
                                    isRtl ? 'bottom-start' : 'bottom-end'
                                  }`}
                                  btnClassName='align-middle'
                                  button={
                                    <IconHorizontalDots className='rotate-90 opacity-70' />
                                  }
                                >
                                  <ul className='whitespace-nowrap'>
                                    {selectedTab !== 'trash' && (
                                      <>
                                        <li>
                                          <button
                                            type='button'
                                            onClick={() => addEditTask(task)}
                                          >
                                            <IconPencilPaper className='h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2' />
                                            Edit
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            type='button'
                                            onClick={() =>
                                              deleteTask(task, 'delete')
                                            }
                                          >
                                            <IconTrashLines className='shrink-0 ltr:mr-2 rtl:ml-2' />
                                            Delete
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            type='button'
                                            onClick={() => setImportant(task)}
                                          >
                                            <IconStar className='h-4.5 w-4.5 shrink-0 ltr:mr-2 rtl:ml-2' />
                                            <span>
                                              {task.status === 'important'
                                                ? 'Not Important'
                                                : 'Important'}
                                            </span>
                                          </button>
                                        </li>
                                      </>
                                    )}
                                    {selectedTab === 'trash' && (
                                      <>
                                        <li>
                                          <button
                                            type='button'
                                            onClick={() =>
                                              deleteTask(
                                                task,
                                                'deletePermanent',
                                              )
                                            }
                                          >
                                            <IconTrashLines className='shrink-0 ltr:mr-2 rtl:ml-2' />
                                            Permanent Delete
                                          </button>
                                        </li>
                                        <li>
                                          <button
                                            type='button'
                                            onClick={() =>
                                              deleteTask(task, 'restore')
                                            }
                                          >
                                            <IconRestore className='shrink-0 ltr:mr-2 rtl:ml-2' />
                                            Restore Task
                                          </button>
                                        </li>
                                      </>
                                    )}
                                  </ul>
                                </Dropdown>
                              </div>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className='flex h-full min-h-[400px] items-center justify-center text-lg font-semibold sm:min-h-[300px]'>
                No data available
              </div>
            )}
          </div>
        </div>

        <Transition appear show={addTaskModal} as={Fragment}>
          <Dialog
            as='div'
            open={addTaskModal}
            onClose={() => setAddTaskModal(false)}
            className='relative z-50'
          >
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-[black]/60' />
            </Transition.Child>

            <div className='fixed inset-0 overflow-y-auto'>
              <div className='flex min-h-full items-center justify-center px-4 py-8'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'
                >
                  <Dialog.Panel className='panel dark:text-white-dark w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black'>
                    <button
                      type='button'
                      onClick={() => setAddTaskModal(false)}
                      className='absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600'
                    >
                      <IconX />
                    </button>
                    <div className='bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]'>
                      {params.id ? 'Edit Task' : 'Add Task'}
                    </div>
                    <div className='p-5'>
                      <form>
                        <div className='mb-5'>
                          <label htmlFor='title'>Title</label>
                          <input
                            id='title'
                            type='text'
                            placeholder='Enter Task Title'
                            className='form-input'
                            value={params.title}
                            onChange={e => changeValue(e)}
                          />
                        </div>
                        <div className='mb-5'>
                          <label htmlFor='assignee'>Assignee</label>
                          <select
                            id='assignee'
                            className='form-select'
                            value={params.assignee}
                            onChange={e => changeValue(e)}
                          >
                            <option value=''>Select Assignee</option>
                            <option value='John Smith'>John Smith</option>
                            <option value='Kia Vega'>Kia Vega</option>
                            <option value='Sandy Doe'>Sandy Doe</option>
                            <option value='Jane Foster'>Jane Foster</option>
                            <option value='Donna Frank'>Donna Frank</option>
                          </select>
                        </div>
                        <div className='mb-5 flex justify-between gap-4'>
                          <div className='flex-1'>
                            <label htmlFor='tag'>Tag</label>
                            <select
                              id='tag'
                              className='form-select'
                              value={params.tag}
                              onChange={e => changeValue(e)}
                            >
                              <option value=''>Select Tag</option>
                              <option value='team'>Team</option>
                              <option value='update'>Update</option>
                            </select>
                          </div>
                          <div className='flex-1'>
                            <label htmlFor='priority'>Priority</label>
                            <select
                              id='priority'
                              className='form-select'
                              value={params.priority}
                              onChange={e => changeValue(e)}
                            >
                              <option value=''>Select Priority</option>
                              <option value='low'>Low</option>
                              <option value='medium'>Medium</option>
                              <option value='high'>High</option>
                            </select>
                          </div>
                        </div>
                        <div className='mb-5'>
                          <label>Description</label>
                          <ReactQuill
                            theme='snow'
                            value={params.description}
                            defaultValue={params.description}
                            onChange={(content, delta, source, editor) => {
                              params.description = content;
                              params.descriptionText = editor.getText();
                              setParams({
                                ...params,
                              });
                            }}
                            style={{ minHeight: '200px' }}
                          />
                        </div>
                        <div className='mt-8 flex items-center justify-end ltr:text-right rtl:text-left'>
                          <button
                            type='button'
                            className='btn btn-outline-danger'
                            onClick={() => setAddTaskModal(false)}
                          >
                            Cancel
                          </button>
                          <button
                            type='button'
                            className='btn btn-primary ltr:ml-4 rtl:mr-4'
                            onClick={() => saveTask()}
                          >
                            {params.id ? 'Update' : 'Add'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>

        <Transition appear show={viewTaskModal} as={Fragment}>
          <Dialog
            as='div'
            open={viewTaskModal}
            onClose={() => setViewTaskModal(false)}
            className='relative z-50'
          >
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0'
              enterTo='opacity-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100'
              leaveTo='opacity-0'
            >
              <div className='fixed inset-0 bg-[black]/60' />
            </Transition.Child>

            <div className='fixed inset-0 overflow-y-auto'>
              <div className='flex min-h-full items-center justify-center px-4 py-8'>
                <Transition.Child
                  as={Fragment}
                  enter='ease-out duration-300'
                  enterFrom='opacity-0 scale-95'
                  enterTo='opacity-100 scale-100'
                  leave='ease-in duration-200'
                  leaveFrom='opacity-100 scale-100'
                  leaveTo='opacity-0 scale-95'
                >
                  <Dialog.Panel className='panel dark:text-white-dark w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black'>
                    <button
                      type='button'
                      onClick={() => setViewTaskModal(false)}
                      className='absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600'
                    >
                      <IconX />
                    </button>
                    <div className='flex flex-wrap items-center gap-2 bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]'>
                      <div>{selectedTask.title}</div>
                      {selectedTask.priority && (
                        <div
                          className={`badge rounded-3xl capitalize ${
                            selectedTask.priority === 'medium'
                              ? 'badge-outline-primary'
                              : selectedTask.priority === 'low'
                              ? 'badge-outline-warning '
                              : selectedTask.priority === 'high'
                              ? 'badge-outline-danger '
                              : ''
                          }`}
                        >
                          {selectedTask.priority}
                        </div>
                      )}
                      {selectedTask.tag && (
                        <div
                          className={`badge rounded-3xl capitalize ${
                            selectedTask.tag === 'team'
                              ? 'badge-outline-success'
                              : selectedTask.tag === 'update'
                              ? 'badge-outline-info '
                              : ''
                          }`}
                        >
                          {selectedTask.tag}
                        </div>
                      )}
                    </div>
                    <div className='p-5'>
                      <div
                        className='prose text-base'
                        dangerouslySetInnerHTML={{
                          __html: selectedTask.description,
                        }}
                      ></div>
                      <div className='mt-8 flex items-center justify-end'>
                        <button
                          type='button'
                          className='btn btn-outline-danger'
                          onClick={() => setViewTaskModal(false)}
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      </div>
    </div>
  );
};

export default ComponentsAppsTodoList;
