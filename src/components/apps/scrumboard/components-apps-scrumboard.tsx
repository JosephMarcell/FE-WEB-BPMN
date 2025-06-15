'use client';
import { Dialog, Transition } from '@headlessui/react';
import Image from 'next/image';
import React, { Fragment, useState } from 'react';
import { useSelector } from 'react-redux';
import { ReactSortable } from 'react-sortablejs';
import Swal, { SweetAlertOptions } from 'sweetalert2';

import Dropdown from '@/components/dropdown';
import IconCalendar from '@/components/icon/icon-calendar';
import IconEdit from '@/components/icon/icon-edit';
import IconHorizontalDots from '@/components/icon/icon-horizontal-dots';
import IconPlus from '@/components/icon/icon-plus';
import IconPlusCircle from '@/components/icon/icon-plus-circle';
import IconTag from '@/components/icon/icon-tag';
import IconTrashLines from '@/components/icon/icon-trash-lines';
import IconX from '@/components/icon/icon-x';

import { IRootState } from '@/store';

interface Task {
  projectId: number;
  id: number;
  title: string;
  description: string;
  image?: boolean;
  date: string;
  tags?: string[];
}

interface Project {
  id: number;
  title: string;
  tasks: Task[];
}

interface Params {
  id: number | null;
  title: string;
}

interface ParamsTask {
  projectId: number | null;
  id: number | null;
  title: string;
  description: string;
  tags: string;
  date: string;
}

const ComponentsAppsScrumBoard = () => {
  const [projectList, setProjectList] = useState<Project[]>([
    {
      id: 1,
      title: 'In Progress',
      tasks: [
        {
          projectId: 1,
          id: 1,
          title: 'Creating a new Portfolio on Dribble',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
          image: true,
          date: ' 08 Aug, 2020',
          tags: ['designing'],
        },
        {
          projectId: 1,
          id: 2,
          title: 'Singapore Team Meet',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit.',
          date: ' 09 Aug, 2020',
          tags: ['meeting'],
        },
      ],
    },
    {
      id: 2,
      title: 'Pending',
      tasks: [
        {
          projectId: 2,
          id: 3,
          title: 'Plan a trip to another country',
          description: '',
          date: ' 10 Sep, 2020',
        },
      ],
    },
    {
      id: 3,
      title: 'Complete',
      tasks: [
        {
          projectId: 3,
          id: 4,
          title: 'Dinner with Kelly Young',
          description: '',
          date: ' 08 Aug, 2020',
        },
        {
          projectId: 3,
          id: 5,
          title: 'Launch New SEO Wordpress Theme ',
          description:
            'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
          date: ' 09 Aug, 2020',
        },
      ],
    },
    {
      id: 4,
      title: 'Working',
      tasks: [],
    },
  ]);
  const isRtl =
    useSelector((state: IRootState) => state.themeConfig.rtlClass) === 'rtl';

  const changeValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, id } = e.target;
    setParams((prevParams: Params) => ({ ...prevParams, [id]: value }));
  };

  const [params, setParams] = useState<Params>({ id: null, title: '' });

  const [paramsTask, setParamsTask] = useState<ParamsTask>({
    projectId: null,
    id: null,
    title: '',
    description: '',
    tags: '',
    date: '',
  });

  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isAddProjectModal, setIsAddProjectModal] = useState(false);
  const [isAddTaskModal, setIsAddTaskModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);

  const addEditProject = (project: Project | null = null) => {
    setTimeout(() => {
      setParams({
        id: null,
        title: '',
      });
      if (project) {
        const projectData = JSON.parse(JSON.stringify(project));
        setParams(projectData);
      }
      setIsAddProjectModal(true);
    });
  };

  const showMessage = (msg: string, type: 'success' | 'error') => {
    const toast = Swal.mixin({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
    } as SweetAlertOptions);
    toast
      .fire({
        icon: type,
        title: msg,
      })
      .then(r => r);
  };

  const saveProject = () => {
    if (!params.title) {
      showMessage('Title is required.', 'error');
      return;
    }

    if (params.id) {
      // Find the project and check if it exists before updating
      const projectIndex = projectList.findIndex(
        project => project.id === params.id,
      );
      if (projectIndex !== -1) {
        const updatedProjectList = [...projectList];
        updatedProjectList[projectIndex] = {
          ...updatedProjectList[projectIndex],
          title: params.title,
        };
        setProjectList(updatedProjectList);
      }
    } else {
      // Add a new project
      const lastId = projectList.reduce(
        (max, project) => Math.max(project.id, max),
        0,
      );
      const newProject = {
        id: lastId + 1,
        title: params.title,
        tasks: [],
      };
      setProjectList([...projectList, newProject]);
    }

    showMessage('Project has been saved successfully.', 'success');
    setIsAddProjectModal(false);
  };

  const deleteProject = (projectToDelete: Project) => {
    setProjectList(
      projectList.filter(project => project.id !== projectToDelete.id),
    );
    showMessage('Project has been deleted successfully.', 'success');
  };

  const clearProjects = (projectId: number) => {
    setProjectList(currentProjects =>
      currentProjects.map(project => {
        if (project.id === projectId) {
          return { ...project, tasks: [] };
        }
        return project;
      }),
    );
  };

  const addTaskData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, id } = e.target;
    setParamsTask(prevState => ({ ...prevState, [id]: value }));
  };

  const addEditTask = (projectId: number, task: Task | null = null) => {
    setParamsTask({
      projectId: projectId,
      id: null,
      title: '',
      description: '',
      tags: '',
      date: '',
    });
    if (task) {
      const data = JSON.parse(JSON.stringify(task));
      data.projectId = projectId;
      data.tags = data.tags ? data.tags.toString() : '';
      setParamsTask(data);
    }
    setIsAddTaskModal(true);
  };

  const saveTask = () => {
    if (!paramsTask.title) {
      showMessage('Title is required.', 'error');
      return false;
    }

    const projectIndex = projectList.findIndex(
      project => project.id === paramsTask.projectId,
    );
    if (projectIndex === -1) {
      showMessage('Project not found.', 'error');
      return false;
    }

    if (paramsTask.id) {
      updateTaskInProject(projectIndex);
    } else {
      addTaskToProject(projectIndex);
    }

    showMessage('Task has been saved successfully.', 'success');
    resetTaskForm();
    setIsAddTaskModal(false);

    return true;
  };

  const addTaskToProject = (projectIndex: number) => {
    const newTask: Task = {
      projectId: projectList[projectIndex].id,
      id: Math.max(0, ...projectList[projectIndex].tasks.map(t => t.id)) + 1,
      title: paramsTask.title,
      description: paramsTask.description,
      tags: paramsTask.tags ? paramsTask.tags.split(',') : [],
      date: paramsTask.date,
    };
    const updatedProjectList = [...projectList];
    updatedProjectList[projectIndex].tasks.push(newTask);
    setProjectList(updatedProjectList);
  };

  const updateTaskInProject = (projectIndex: number) => {
    const taskIndex = projectList[projectIndex].tasks.findIndex(
      t => t.id === paramsTask.id,
    );
    if (taskIndex !== -1) {
      const updatedProjectList = [...projectList];
      updatedProjectList[projectIndex].tasks[taskIndex] = {
        ...updatedProjectList[projectIndex].tasks[taskIndex],
        title: paramsTask.title,
        description: paramsTask.description,
        tags: paramsTask.tags ? paramsTask.tags.split(',') : [],
        date: paramsTask.date,
      };
      setProjectList(updatedProjectList);
    }
  };

  const resetTaskForm = () => {
    setParamsTask({
      projectId: null,
      id: null,
      title: '',
      description: '',
      tags: '',
      date: '',
    });
  };

  const deleteConfirmModal = (task: Task | null = null) => {
    setSelectedTask(task);
    setTimeout(() => {
      setIsDeleteModal(true);
    }, 10);
  };

  const updateProjectListForDeletedTask = (
    projectId: number,
    taskId: number,
  ) => {
    return projectList.map(project => {
      if (project.id === projectId) {
        const filteredTasks = project.tasks.filter(task => task.id !== taskId);
        return { ...project, tasks: filteredTasks };
      }
      return project;
    });
  };

  const deleteTask = () => {
    if (selectedTask) {
      const updatedProjects = updateProjectListForDeletedTask(
        selectedTask.projectId,
        selectedTask.id,
      );
      setProjectList(updatedProjects);
      showMessage('Task has been deleted successfully.', 'success');
    }
    setIsDeleteModal(false);
  };

  return (
    <div>
      <div>
        <button
          type='button'
          className='btn btn-primary flex'
          onClick={() => {
            addEditProject();
          }}
        >
          <IconPlus className='h-5 w-5 ltr:mr-3 rtl:ml-3' />
          Add Project
        </button>
      </div>
      {/* project list  */}
      <div className='relative pt-5'>
        <div className='perfect-scrollbar -mx-2 h-full'>
          <div className='flex flex-nowrap items-start gap-5 overflow-x-auto px-2 pb-2'>
            {projectList.map((project: Project) => {
              return (
                <div
                  key={project.id}
                  className='panel w-80 flex-none'
                  data-group={project.id}
                >
                  <div className='mb-5 flex justify-between'>
                    <h4 className='text-base font-semibold'>{project.title}</h4>

                    <div className='flex items-center'>
                      <button
                        onClick={() => addEditTask(project.id)}
                        type='button'
                        className='hover:text-primary ltr:mr-2 rtl:ml-2'
                      >
                        <IconPlusCircle />
                      </button>
                      <div className='dropdown'>
                        <Dropdown
                          offset={[0, 5]}
                          placement={`${isRtl ? 'bottom-start' : 'bottom-end'}`}
                          button={
                            <IconHorizontalDots className='opacity-70 hover:opacity-100' />
                          }
                        >
                          <ul>
                            <li>
                              <button
                                type='button'
                                onClick={() => addEditProject(project)}
                              >
                                Edit
                              </button>
                            </li>
                            <li>
                              <button
                                type='button'
                                onClick={() => deleteProject(project)}
                              >
                                Delete
                              </button>
                            </li>
                            <li>
                              <button
                                type='button'
                                onClick={() => clearProjects(project.id)}
                              >
                                Clear All
                              </button>
                            </li>
                          </ul>
                        </Dropdown>
                      </div>
                    </div>
                  </div>
                  <ReactSortable
                    list={project.tasks}
                    setList={(newState: Task[], sortable) => {
                      const groupId =
                        sortable?.el
                          ?.closest('[data-group]')
                          ?.getAttribute('data-group') ?? '0';
                      const parsedGroupId = parseInt(groupId, 10);
                      const newList = projectList.map(project => {
                        if (project.id === parsedGroupId) {
                          return { ...project, tasks: newState };
                        }
                        return project;
                      });
                      setProjectList(newList);
                    }}
                    animation={200}
                    group={{ name: 'shared', pull: true, put: true }}
                    ghostClass='sortable-ghost'
                    dragClass='sortable-drag'
                    className='connect-sorting-content min-h-[150px]'
                  >
                    {project.tasks.map((task: Task) => {
                      return (
                        <div
                          className='sortable-list '
                          key={project.id + '' + task.id}
                        >
                          <div className='dark:bg-white-dark/20 mb-5 cursor-move space-y-3 rounded-md bg-[#f4f4f4] p-3 pb-5 shadow'>
                            {task.image ? (
                              <Image
                                src='/assets/images/carousel1.jpeg'
                                alt='images'
                                className='h-32 w-full rounded-md object-cover'
                              />
                            ) : (
                              ''
                            )}
                            <div className='text-base font-medium'>
                              {task.title}
                            </div>
                            <p className='break-all'>{task.description}</p>
                            <div className='flex flex-wrap items-center gap-2'>
                              {task.tags?.length ? (
                                task.tags.map((tag: string) => {
                                  return (
                                    <div
                                      key={tag}
                                      className='btn btn-outline-primary flex px-2 py-1'
                                    >
                                      <IconTag className='shrink-0' />
                                      <span className='ltr:ml-2 rtl:mr-2'>
                                        {tag}
                                      </span>
                                    </div>
                                  );
                                })
                              ) : (
                                <div className='btn text-white-dark dark:border-white-dark/50 flex px-2 py-1 shadow-none'>
                                  <IconTag className='shrink-0' />
                                  <span className='ltr:ml-2 rtl:mr-2'>
                                    No Tags
                                  </span>
                                </div>
                              )}
                            </div>
                            <div className='flex items-center justify-between'>
                              <div className='hover:text-primary flex items-center font-medium'>
                                <IconCalendar className='shrink-0 ltr:mr-3 rtl:ml-3' />
                                <span>{task.date}</span>
                              </div>
                              <div className='flex items-center'>
                                <button
                                  onClick={() => addEditTask(project.id, task)}
                                  type='button'
                                  className='hover:text-info'
                                >
                                  <IconEdit className='ltr:mr-3 rtl:ml-3' />
                                </button>
                                <button
                                  onClick={() => deleteConfirmModal(task)}
                                  type='button'
                                  className='hover:text-danger'
                                >
                                  <IconTrashLines />
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </ReactSortable>
                  <div className='pt-3'>
                    <button
                      type='button'
                      className='btn btn-primary mx-auto'
                      onClick={() => addEditTask(project.id)}
                    >
                      <IconPlus />
                      Add Task
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
      {/* add project modal */}
      <Transition appear show={isAddProjectModal} as={Fragment}>
        <Dialog
          as='div'
          open={isAddProjectModal}
          onClose={() => setIsAddProjectModal(false)}
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
          <div className='fixed inset-0 z-[999] overflow-y-auto bg-[black]/60 px-4'>
            <div className='flex min-h-screen items-center justify-center'>
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
                    onClick={() => setIsAddProjectModal(false)}
                    className='absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600'
                  >
                    <IconX />
                  </button>
                  <div className='bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]'>
                    {params.id ? 'Edit Project' : 'Add Project'}
                  </div>
                  <div className='p-5'>
                    <form onSubmit={saveProject}>
                      <div className='grid gap-5'>
                        <div>
                          <label htmlFor='title'>Name</label>
                          <input
                            id='title'
                            value={params.title}
                            onChange={changeValue}
                            type='text'
                            className='form-input mt-1'
                            placeholder='Enter Name'
                          />
                        </div>
                      </div>

                      <div className='mt-8 flex items-center justify-end'>
                        <button
                          type='button'
                          className='btn btn-outline-danger'
                          onClick={() => setIsAddProjectModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type='submit'
                          className='btn btn-primary ltr:ml-4 rtl:mr-4'
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
      {/* add task modal */}
      <Transition appear show={isAddTaskModal} as={Fragment}>
        <Dialog
          as='div'
          open={isAddTaskModal}
          onClose={() => setIsAddTaskModal(false)}
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
          <div className='fixed inset-0 z-[999] overflow-y-auto'>
            <div className='flex min-h-screen items-center justify-center px-4'>
              <Dialog.Panel className='panel dark:text-white-dark w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black'>
                <button
                  onClick={() => setIsAddTaskModal(false)}
                  type='button'
                  className='text-white-dark hover:text-dark absolute top-4 ltr:right-4 rtl:left-4'
                >
                  <IconX />
                </button>
                <div className='bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]'>
                  {paramsTask.id ? 'Edit Task' : 'Add Task'}
                </div>
                <div className='p-5'>
                  <form onSubmit={saveTask}>
                    <div className='grid gap-5'>
                      <div>
                        <label htmlFor='taskTitle'>Name</label>
                        <input
                          id='title'
                          value={paramsTask.title}
                          onChange={addTaskData}
                          type='text'
                          className='form-input'
                          placeholder='Enter Name'
                        />
                      </div>
                      <div>
                        <label htmlFor='taskTag'>Tag</label>
                        <input
                          id='tags'
                          value={paramsTask.tags}
                          onChange={addTaskData}
                          type='text'
                          className='form-input'
                          placeholder='Enter Tag'
                        />
                      </div>
                      <div>
                        <label htmlFor='taskdesc'>Description</label>
                        <textarea
                          id='description'
                          value={paramsTask.description}
                          onChange={addTaskData}
                          className='form-textarea min-h-[130px]'
                          placeholder='Enter Description'
                        ></textarea>
                      </div>
                    </div>
                    <div className='mt-8 flex items-center justify-end'>
                      <button
                        onClick={() => setIsAddTaskModal(false)}
                        type='button'
                        className='btn btn-outline-danger'
                      >
                        Cancel
                      </button>
                      <button
                        type='submit'
                        className='btn btn-primary ltr:ml-4 rtl:mr-4'
                      >
                        {paramsTask.id ? 'Update' : 'Add'}
                      </button>
                    </div>
                  </form>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Dialog>
      </Transition>
      {/* delete task modal */}
      <Transition appear show={isDeleteModal} as={Fragment}>
        <Dialog
          as='div'
          open={isDeleteModal}
          onClose={() => setIsDeleteModal(false)}
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
          <div className='fixed inset-0 z-[999] overflow-y-auto'>
            <div className='flex min-h-screen items-center justify-center px-4 '>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >
                <Dialog.Panel className='panel my-8 w-[90%] max-w-lg overflow-hidden rounded-lg border-0 p-0 md:w-full'>
                  <button
                    type='button'
                    onClick={() => {
                      setIsDeleteModal(false);
                    }}
                    className='text-white-dark absolute top-4 ltr:right-4 rtl:left-4'
                  >
                    <IconX />
                  </button>
                  <div className='bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]'>
                    Delete Task
                  </div>
                  <div className='p-5 text-center'>
                    <div className='bg-danger ring-danger/30 mx-auto w-fit rounded-full p-4 text-white ring-4'>
                      <IconTrashLines />
                    </div>
                    <div className='mx-auto mt-5 text-base sm:w-3/4'>
                      Are you sure you want to delete Task?
                    </div>

                    <div className='mt-8 flex items-center justify-center'>
                      <button
                        onClick={() => {
                          setIsDeleteModal(false);
                        }}
                        type='button'
                        className='btn btn-outline-danger'
                      >
                        Cancel
                      </button>
                      <button
                        onClick={deleteTask}
                        type='button'
                        className='btn btn-primary ltr:ml-4 rtl:mr-4'
                      >
                        Delete
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
  );
};

export default ComponentsAppsScrumBoard;
