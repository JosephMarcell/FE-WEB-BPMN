import { Dialog, Transition } from '@headlessui/react';
import { Fragment, useEffect, useState } from 'react';
import { FiSearch, FiUserPlus } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { getTranslation } from '@/lib/lang/i18n';

import { IRootState } from '@/store';

import { useInviteUserToTenant } from '@/app/api/hooks/tenant/useInviteUserToTenant';
import { useGetAllUser } from '@/app/api/hooks/user_management/user/useGetAllUser';

const { t } = getTranslation();

// Define a User interface to fix the TypeScript error
interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  is_verified?: boolean;
}

interface ModalInviteUserProps {
  modal: boolean;
  setModal: (val: boolean) => void;
  tenantId: string;
  refetch: () => void;
}

const ModalInviteUser = ({
  modal,
  setModal,
  tenantId,
  refetch,
}: ModalInviteUserProps) => {
  const isDark = useSelector(
    (state: IRootState) =>
      state.themeConfig.theme === 'dark' || state.themeConfig.isDarkMode,
  );
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch users
  const { data: usersData, isLoading: isLoadingUsers } = useGetAllUser();
  // Invite user mutation
  const { mutateAsync: inviteUserToTenant } = useInviteUserToTenant();

  // Filter users for display - include only users with role USER or ADMIN
  const filteredUsers =
    usersData?.data?.filter(
      (user: User) =>
        (user.role === 'USER' || user.role === 'ADMIN') &&
        (user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email?.toLowerCase().includes(searchTerm.toLowerCase())),
    ) || [];

  // Reset selected user when modal is closed
  useEffect(() => {
    if (!modal) {
      setSelectedUser(null);
      setSearchTerm('');
    }
  }, [modal]);

  const handleInviteUser = async () => {
    if (!selectedUser) {
      Swal.fire({
        title: 'Error',
        text: 'Please select a user to invite',
        icon: 'error',
      });
      return;
    }

    setIsLoading(true);
    try {
      await inviteUserToTenant({
        tenantId,
        userId: selectedUser.id,
      });

      Swal.fire({
        title: 'Success',
        text: `User ${selectedUser.username} has been invited to the tenant`,
        icon: 'success',
      }).then(() => {
        setModal(false);
        refetch();
      });
    } catch (error: any) {
      console.error('Error inviting user:', error);

      // Extract error message
      let errorMessage = 'Failed to invite user';
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      Swal.fire({
        title: 'Error',
        text: errorMessage,
        icon: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeColor = (role: string) => {
    if (role === 'SUPERADMIN') return 'bg-dark';
    else if (role === 'ADMIN') return 'bg-primary';
    else if (role === 'SUPERVISOR') return 'bg-warning';
    else return 'bg-info';
  };

  return (
    <Transition appear show={modal} as={Fragment}>
      <Dialog
        as='div'
        className='relative z-50'
        onClose={() => setModal(false)}
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
          <div className='fixed inset-0 bg-black bg-opacity-50' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='dark:bg-navy-700 w-full max-w-md transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all'>
                <Dialog.Title
                  as='h3'
                  className='text-xl font-semibold leading-6 text-gray-900 dark:text-white'
                >
                  Invite User to Tenant
                </Dialog.Title>

                <div className='mt-4'>
                  {/* Search input */}
                  <div className='mb-4'>
                    <label
                      htmlFor='search-user'
                      className='mb-2 block text-sm font-medium'
                    >
                      Search User
                    </label>
                    <div className='relative'>
                      <input
                        id='search-user'
                        type='text'
                        className='form-input w-full pl-10'
                        placeholder='Search by username or email'
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                      />
                      <FiSearch className='absolute left-3 top-3 text-gray-400' />
                    </div>
                  </div>

                  {/* Selected User */}
                  {selectedUser && (
                    <div className='dark:bg-navy-800 mb-4 rounded-md border bg-gray-50 p-3'>
                      <h4 className='font-medium'>Selected User</h4>
                      <div className='mt-2 flex items-center gap-2'>
                        <div className='bg-primary/20 flex h-8 w-8 items-center justify-center rounded-full'>
                          <span className='text-primary font-bold'>
                            {selectedUser.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className='text-sm font-medium'>
                            {selectedUser.username}
                          </p>
                          <p className='text-xs text-gray-500'>
                            {selectedUser.email}
                          </p>
                        </div>
                        <span
                          className={`badge ml-auto ${getRoleBadgeColor(
                            selectedUser.role,
                          )}`}
                        >
                          {selectedUser.role}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* User list */}
                  <div className='max-h-60 overflow-y-auto rounded-md border'>
                    {isLoadingUsers ? (
                      <div className='p-4 text-center text-gray-500'>
                        Loading users...
                      </div>
                    ) : filteredUsers.length > 0 ? (
                      <ul className='divide-y'>
                        {filteredUsers.map((user: User) => (
                          <li
                            key={user.id}
                            className={`dark:hover:bg-navy-600 cursor-pointer p-3 hover:bg-gray-50 ${
                              selectedUser?.id === user.id
                                ? 'dark:bg-navy-500 bg-blue-50'
                                : ''
                            }`}
                            onClick={() => setSelectedUser(user)}
                          >
                            <div className='flex items-center'>
                              <div className='flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700'>
                                <span className='font-medium'>
                                  {user.username.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <div className='ml-3'>
                                <p className='text-sm font-medium'>
                                  {user.username}
                                </p>
                                <p className='text-xs text-gray-500'>
                                  {user.email}
                                </p>
                              </div>
                              <span
                                className={`badge ml-auto ${getRoleBadgeColor(
                                  user.role,
                                )}`}
                              >
                                {user.role}
                              </span>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className='p-4 text-center text-gray-500'>
                        {searchTerm
                          ? 'No users found matching your search'
                          : 'No users available'}
                      </div>
                    )}
                  </div>

                  {/* Form Actions */}
                  <div className='mt-6 flex justify-end gap-3'>
                    <button
                      type='button'
                      className='btn btn-outline-danger'
                      onClick={() => setModal(false)}
                      disabled={isLoading}
                    >
                      Cancel
                    </button>
                    <button
                      type='button'
                      className='btn btn-primary flex items-center gap-2'
                      onClick={handleInviteUser}
                      disabled={!selectedUser || isLoading}
                    >
                      {isLoading ? (
                        <>
                          <span className='h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent'></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          <FiUserPlus />
                          Invite User
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ModalInviteUser;
