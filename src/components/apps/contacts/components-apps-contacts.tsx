'use client';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import Swal, { SweetAlertIcon } from 'sweetalert2';

import IconFacebook from '@/components/icon/icon-facebook';
import IconInstagram from '@/components/icon/icon-instagram';
import IconLayoutGrid from '@/components/icon/icon-layout-grid';
import IconLinkedin from '@/components/icon/icon-linkedin';
import IconListCheck from '@/components/icon/icon-list-check';
import IconSearch from '@/components/icon/icon-search';
import IconTwitter from '@/components/icon/icon-twitter';
import IconUser from '@/components/icon/icon-user';
import IconUserPlus from '@/components/icon/icon-user-plus';
import IconX from '@/components/icon/icon-x';

interface Contact {
  id: number;
  path: string;
  name: string;
  role: string;
  email: string;
  location: string;
  phone: string;
  posts: number;
  followers: string;
  following: number;
}

interface Params {
  id: number | null;
  name: string;
  email: string;
  phone: string;
  role: string;
  location: string;
}

const defaultParams: Params = {
  id: null,
  name: '',
  email: '',
  phone: '',
  role: '',
  location: '',
};

const ComponentsAppsContacts = () => {
  const [addContactModal, setAddContactModal] = useState<boolean>(false);
  const [value, setValue] = useState<string>('list');
  const [params, setParams] = useState<Params>({ ...defaultParams });
  const [search, setSearch] = useState<string>('');

  const changeValue = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, id } = e.target;
    setParams(prev => ({ ...prev, [id]: value }));
  };

  const [contactList] = useState<Contact[]>([
    {
      id: 1,
      path: 'profile-35.png',
      name: 'Alan Green',
      role: 'Web Developer',
      email: 'alan@mail.com',
      location: 'Boston, USA',
      phone: '+1 202 555 0197',
      posts: 25,
      followers: '5K',
      following: 500,
    },
    {
      id: 2,
      path: 'profile-35.png',
      name: 'Linda Nelson',
      role: 'Web Designer',
      email: 'linda@mail.com',
      location: 'Sydney, Australia',
      phone: '+1 202 555 0170',
      posts: 25,
      followers: '21.5K',
      following: 350,
    },
    {
      id: 3,
      path: 'profile-35.png',
      name: 'Lila Perry',
      role: 'UX/UI Designer',
      email: 'lila@mail.com',
      location: 'Miami, USA',
      phone: '+1 202 555 0105',
      posts: 20,
      followers: '21.5K',
      following: 350,
    },
    {
      id: 4,
      path: 'profile-35.png',
      name: 'Andy King',
      role: 'Project Lead',
      email: 'andy@mail.com',
      location: 'Tokyo, Japan',
      phone: '+1 202 555 0194',
      posts: 25,
      followers: '21.5K',
      following: 300,
    },
    {
      id: 5,
      path: 'profile-35.png',
      name: 'Jesse Cory',
      role: 'Web Developer',
      email: 'jesse@mail.com',
      location: 'Edinburgh, UK',
      phone: '+1 202 555 0161',
      posts: 30,
      followers: '20K',
      following: 350,
    },
    {
      id: 6,
      path: 'profile-35.png',
      name: 'Xavier',
      role: 'UX/UI Designer',
      email: 'xavier@mail.com',
      location: 'New York, USA',
      phone: '+1 202 555 0155',
      posts: 25,
      followers: '21.5K',
      following: 350,
    },
    {
      id: 7,
      path: 'profile-35.png',
      name: 'Susan',
      role: 'Project Manager',
      email: 'susan@mail.com',
      location: 'Miami, USA',
      phone: '+1 202 555 0118',
      posts: 40,
      followers: '21.5K',
      following: 350,
    },
    {
      id: 8,
      path: 'profile-35.png',
      name: 'Raul Lopez',
      role: 'Web Developer',
      email: 'traci@mail.com',
      location: 'Edinburgh, UK',
      phone: '+1 202 555 0135',
      posts: 25,
      followers: '21.5K',
      following: 350,
    },
    {
      id: 9,
      path: 'profile-35.png',
      name: 'Steven Mendoza',
      role: 'HR',
      email: 'sokol@verizon.net',
      location: 'Monrovia, US',
      phone: '+1 202 555 0100',
      posts: 40,
      followers: '21.8K',
      following: 300,
    },
    {
      id: 10,
      path: 'profile-35.png',
      name: 'James Cantrell',
      role: 'Web Developer',
      email: 'sravani@comcast.net',
      location: 'Michigan, US',
      phone: '+1 202 555 0134',
      posts: 100,
      followers: '28K',
      following: 520,
    },
    {
      id: 11,
      path: 'profile-35.png',
      name: 'Reginald Brown',
      role: 'Web Designer',
      email: 'drhyde@gmail.com',
      location: 'Barcelona, Spain',
      phone: '+1 202 555 0153',
      posts: 35,
      followers: '25K',
      following: 500,
    },
    {
      id: 12,
      path: 'profile-35.png',
      name: 'Stacey Smith',
      role: 'Chief technology officer',
      email: 'maikelnai@optonline.net',
      location: 'Warsaw, Poland',
      phone: '+1 202 555 0115',
      posts: 21,
      followers: '5K',
      following: 200,
    },
  ]);

  const [filteredItems, setFilteredItems] = useState<Contact[]>(contactList);

  useEffect(() => {
    const searchContact = () => {
      setFilteredItems(
        contactList.filter((item: Contact) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      );
    };

    searchContact();
  }, [search, contactList]);

  const saveUser = () => {
    if (!params.name) {
      showMessage('Name is required.', 'error');
      return true;
    }
    if (!params.email) {
      showMessage('Email is required.', 'error');
      return true;
    }
    if (!params.phone) {
      showMessage('Phone is required.', 'error');
      return true;
    }
    if (!params.role) {
      showMessage('Occupation is required.', 'error');
      return true;
    }

    const user = filteredItems.find((d: Contact) => d.id === params.id);

    if (user) {
      user.name = params.name;
      user.email = params.email;
      user.phone = params.phone;
      user.role = params.role;
      user.location = params.location;
    } else {
      //add user
      const maxUserId = filteredItems.length
        ? filteredItems.reduce(
            (max: number, character: Contact) =>
              character.id > max ? character.id : max,
            filteredItems[0].id,
          )
        : 0;

      const user = {
        id: maxUserId + 1,
        path: 'profile-35.png',
        name: params.name,
        email: params.email,
        phone: params.phone,
        role: params.role,
        location: params.location,
        posts: 20,
        followers: '5K',
        following: 500,
      };
      filteredItems.splice(0, 0, user);
      //   searchContacts();
    }

    showMessage('User has been saved successfully.');
    setAddContactModal(false);
  };

  const editUser = (user: Contact | null = null) => {
    const json = JSON.parse(JSON.stringify(defaultParams)) as Params;
    setParams(json);
    if (user) {
      const json1 = JSON.parse(JSON.stringify(user)) as Params;
      setParams(json1);
    }
    setAddContactModal(true);
  };

  const deleteUser = (user: Contact | null = null) => {
    setFilteredItems(filteredItems.filter((d: Contact) => d.id !== user?.id));
    showMessage('User has been deleted successfully.');
  };

  const showMessage = (msg: string, type: SweetAlertIcon = 'success') => {
    Swal.fire({
      icon: type,
      title: msg,
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      customClass: {
        popup: 'swal-wide',
      },
      padding: '10px 20px',
    }).then(() => {
      // setAddContactModal(false);
    });
  };

  return (
    <div>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <h2 className='text-xl'>Contacts</h2>
        <div className='flex w-full flex-col gap-4 sm:w-auto sm:flex-row sm:items-center sm:gap-3'>
          <div className='flex gap-3'>
            <div>
              <button
                type='button'
                className='btn btn-primary'
                onClick={() => editUser()}
              >
                <IconUserPlus className='ltr:mr-2 rtl:ml-2' />
                Add Contact
              </button>
            </div>
            <div>
              <button
                type='button'
                className={`btn btn-outline-primary p-2 ${
                  value === 'list' && 'bg-primary text-white'
                }`}
                onClick={() => setValue('list')}
              >
                <IconListCheck />
              </button>
            </div>
            <div>
              <button
                type='button'
                className={`btn btn-outline-primary p-2 ${
                  value === 'grid' && 'bg-primary text-white'
                }`}
                onClick={() => setValue('grid')}
              >
                <IconLayoutGrid />
              </button>
            </div>
          </div>
          <div className='relative'>
            <input
              type='text'
              placeholder='Search Contacts'
              className='form-input peer py-2 ltr:pr-11 rtl:pl-11'
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button
              type='button'
              className='peer-focus:text-primary absolute top-1/2 -translate-y-1/2 ltr:right-[11px] rtl:left-[11px]'
            >
              <IconSearch className='mx-auto' />
            </button>
          </div>
        </div>
      </div>
      {value === 'list' && (
        <div className='panel mt-5 overflow-hidden border-0 p-0'>
          <div className='table-responsive'>
            <table className='table-striped table-hover'>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Location</th>
                  <th>Phone</th>
                  <th className='!text-center'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((contact: Contact) => {
                  return (
                    <tr key={contact.id}>
                      <td>
                        <div className='flex w-max items-center'>
                          {contact.path && (
                            <div className='relative h-8 w-8 w-max'>
                              <Image
                                src={`/assets/images/${contact.path}`}
                                className='rounded-full object-cover'
                                alt='avatar'
                                layout='fill'
                              />
                            </div>
                          )}
                          {!contact.path && contact.name && (
                            <div className='bg-primary grid h-8 w-8 place-content-center rounded-full text-sm font-semibold text-white ltr:mr-2 rtl:ml-2'></div>
                          )}
                          {!contact.path && !contact.name && (
                            <div className='rounded-full border border-gray-300 p-2 ltr:mr-2 rtl:ml-2 dark:border-gray-800'>
                              <IconUser className='h-4.5 w-4.5' />
                            </div>
                          )}
                          <div>{contact.name}</div>
                        </div>
                      </td>
                      <td>{contact.email}</td>
                      <td className='whitespace-nowrap'>{contact.location}</td>
                      <td className='whitespace-nowrap'>{contact.phone}</td>
                      <td>
                        <div className='flex items-center justify-center gap-4'>
                          <button
                            type='button'
                            className='btn btn-sm btn-outline-primary'
                            onClick={() => editUser(contact)}
                          >
                            Edit
                          </button>
                          <button
                            type='button'
                            className='btn btn-sm btn-outline-danger'
                            onClick={() => deleteUser(contact)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {value === 'grid' && (
        <div className='mt-5 grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4'>
          {filteredItems.map((contact: Contact) => {
            return (
              <div
                className='relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]'
                key={contact.id}
              >
                <div className='relative overflow-hidden rounded-md bg-white text-center shadow dark:bg-[#1c232f]'>
                  <div className="rounded-t-md bg-white/40 bg-[url('/assets/images/notification-bg.png')] bg-cover bg-center p-6 pb-0">
                    <div className='relative mx-auto h-[160px] w-[80%]'>
                      {' '}
                      {}
                      <Image
                        src={`/assets/images/${contact.path}`}
                        alt='contact_image'
                        layout='fill'
                        objectFit='contain'
                      />
                    </div>
                  </div>
                  <div className='relative -mt-10 px-6 pb-24'>
                    <div className='rounded-md bg-white px-2 py-4 shadow-md dark:bg-gray-900'>
                      <div className='text-xl'>{contact.name}</div>
                      <div className='text-white-dark'>{contact.role}</div>
                      <div className='mt-6 flex flex-wrap items-center justify-between gap-3'>
                        <div className='flex-auto'>
                          <div className='text-info'>{contact.posts}</div>
                          <div>Posts</div>
                        </div>
                        <div className='flex-auto'>
                          <div className='text-info'>{contact.following}</div>
                          <div>Following</div>
                        </div>
                        <div className='flex-auto'>
                          <div className='text-info'>{contact.followers}</div>
                          <div>Followers</div>
                        </div>
                      </div>
                      <div className='mt-4'>
                        <ul className='flex items-center justify-center space-x-4 rtl:space-x-reverse'>
                          <li>
                            <button
                              type='button'
                              className='btn btn-outline-primary h-7 w-7 rounded-full p-0'
                            >
                              <IconFacebook />
                            </button>
                          </li>
                          <li>
                            <button
                              type='button'
                              className='btn btn-outline-primary h-7 w-7 rounded-full p-0'
                            >
                              <IconInstagram />
                            </button>
                          </li>
                          <li>
                            <button
                              type='button'
                              className='btn btn-outline-primary h-7 w-7 rounded-full p-0'
                            >
                              <IconLinkedin />
                            </button>
                          </li>
                          <li>
                            <button
                              type='button'
                              className='btn btn-outline-primary h-7 w-7 rounded-full p-0'
                            >
                              <IconTwitter />
                            </button>
                          </li>
                        </ul>
                      </div>
                    </div>
                    <div className='mt-6 grid grid-cols-1 gap-4 ltr:text-left rtl:text-right'>
                      <div className='flex items-center'>
                        <div className='flex-none ltr:mr-2 rtl:ml-2'>
                          Email :
                        </div>
                        <div className='text-white-dark truncate'>
                          {contact.email}
                        </div>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex-none ltr:mr-2 rtl:ml-2'>
                          Phone :
                        </div>
                        <div className='text-white-dark'>{contact.phone}</div>
                      </div>
                      <div className='flex items-center'>
                        <div className='flex-none ltr:mr-2 rtl:ml-2'>
                          Address :
                        </div>
                        <div className='text-white-dark'>
                          {contact.location}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className='absolute bottom-0 mt-6 flex w-full gap-4 p-6 ltr:left-0 rtl:right-0'>
                    <button
                      type='button'
                      className='btn btn-outline-primary w-1/2'
                      onClick={() => editUser(contact)}
                    >
                      Edit
                    </button>
                    <button
                      type='button'
                      className='btn btn-outline-danger w-1/2'
                      onClick={() => deleteUser(contact)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Transition appear show={addContactModal} as={Fragment}>
        <Dialog
          as='div'
          open={addContactModal}
          onClose={() => setAddContactModal(false)}
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
                    onClick={() => setAddContactModal(false)}
                    className='absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600'
                  >
                    <IconX />
                  </button>
                  <div className='bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]'>
                    {params.id ? 'Edit Contact' : 'Add Contact'}
                  </div>
                  <div className='p-5'>
                    <form>
                      <div className='mb-5'>
                        <label htmlFor='name'>Name</label>
                        <input
                          id='name'
                          type='text'
                          placeholder='Enter Name'
                          className='form-input'
                          value={params.name}
                          onChange={e => changeValue(e)}
                        />
                      </div>
                      <div className='mb-5'>
                        <label htmlFor='email'>Email</label>
                        <input
                          id='email'
                          type='email'
                          placeholder='Enter Email'
                          className='form-input'
                          value={params.email}
                          onChange={e => changeValue(e)}
                        />
                      </div>
                      <div className='mb-5'>
                        <label htmlFor='number'>Phone Number</label>
                        <input
                          id='phone'
                          type='text'
                          placeholder='Enter Phone Number'
                          className='form-input'
                          value={params.phone}
                          onChange={e => changeValue(e)}
                        />
                      </div>
                      <div className='mb-5'>
                        <label htmlFor='occupation'>Occupation</label>
                        <input
                          id='role'
                          type='text'
                          placeholder='Enter Occupation'
                          className='form-input'
                          value={params.role}
                          onChange={e => changeValue(e)}
                        />
                      </div>
                      <div className='mb-5'>
                        <label htmlFor='address'>Address</label>
                        <textarea
                          id='location'
                          rows={3}
                          placeholder='Enter Address'
                          className='form-textarea min-h-[130px] resize-none'
                          value={params.location}
                          onChange={e => changeValue(e)}
                        ></textarea>
                      </div>
                      <div className='mt-8 flex items-center justify-end'>
                        <button
                          type='button'
                          className='btn btn-outline-danger'
                          onClick={() => setAddContactModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          className='btn btn-primary ltr:ml-4 rtl:mr-4'
                          onClick={saveUser}
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
    </div>
  );
};

export default ComponentsAppsContacts;
