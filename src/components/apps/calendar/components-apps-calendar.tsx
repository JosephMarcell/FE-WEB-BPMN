'use client';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import FullCalendar from '@fullcalendar/react';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import Swal from 'sweetalert2';

import IconPlus from '@/components/icon/icon-plus';
import IconX from '@/components/icon/icon-x';

interface Event {
  id: number;
  title: string;
  start: string;
  end: string;
  className: string;
  description: string;
}

interface Params {
  id: number | null;
  title: string;
  start: string;
  end: string;
  description: string;
  type: string;
}

interface CalendarEvent {
  id: string;
  start: Date;
  end: Date;
  title: string;
}

const ComponentsAppsCalendar = () => {
  const now = new Date();
  const getMonth = (dt: Date, add = 0) => {
    const month = dt.getMonth() + 1 + add;
    return (month < 10 ? '0' + month : month).toString();
  };

  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'All Day Event',
      start: now.getFullYear() + '-' + getMonth(now) + '-01T14:30:00',
      end: now.getFullYear() + '-' + getMonth(now) + '-02T14:30:00',
      className: 'danger',
      description:
        'Aenean fermentum quam vel sapien rutrum cursus. Vestibulum imperdiet finibus odio, nec tincidunt felis facilisis eu.',
    },
    {
      id: 2,
      title: 'Site Visit',
      start: now.getFullYear() + '-' + getMonth(now) + '-07T19:30:00',
      end: now.getFullYear() + '-' + getMonth(now) + '-08T14:30:00',
      className: 'primary',
      description:
        'Etiam a odio eget enim aliquet laoreet. Vivamus auctor nunc ultrices varius lobortis.',
    },
    {
      id: 3,
      title: 'Product Lunching Event',
      start: now.getFullYear() + '-' + getMonth(now) + '-17T14:30:00',
      end: now.getFullYear() + '-' + getMonth(now) + '-18T14:30:00',
      className: 'info',
      description:
        'Proin et consectetur nibh. Mauris et mollis purus. Ut nec tincidunt lacus. Nam at rutrum justo, vitae egestas dolor.',
    },
    {
      id: 4,
      title: 'Meeting',
      start: now.getFullYear() + '-' + getMonth(now) + '-12T10:30:00',
      end: now.getFullYear() + '-' + getMonth(now) + '-13T10:30:00',
      className: 'danger',
      description:
        'Mauris ut mauris aliquam, fringilla sapien et, dignissim nisl. Pellentesque ornare velit non mollis fringilla.',
    },
    {
      id: 5,
      title: 'Lunch',
      start: now.getFullYear() + '-' + getMonth(now) + '-12T15:00:00',
      end: now.getFullYear() + '-' + getMonth(now) + '-13T15:00:00',
      className: 'info',
      description:
        'Integer fermentum bibendum elit in egestas. Interdum et malesuada fames ac ante ipsum primis in faucibus.',
    },
    {
      id: 6,
      title: 'Conference',
      start: now.getFullYear() + '-' + getMonth(now) + '-12T21:30:00',
      end: now.getFullYear() + '-' + getMonth(now) + '-13T21:30:00',
      className: 'success',
      description:
        'Curabitur facilisis vel elit sed dapibus. Nunc sagittis ex nec ante facilisis, sed sodales purus rhoncus. Donec est sapien, porttitor et feugiat sed, eleifend quis sapien. Sed sit amet maximus dolor.',
    },
    {
      id: 7,
      title: 'Happy Hour',
      start: now.getFullYear() + '-' + getMonth(now) + '-12T05:30:00',
      end: now.getFullYear() + '-' + getMonth(now) + '-13T05:30:00',
      className: 'info',
      description:
        ' odio lectus, porttitor molestie scelerisque blandit, hendrerit sed ex. Aenean malesuada iaculis erat, vitae blandit nisl accumsan ut.',
    },
    {
      id: 8,
      title: 'Dinner',
      start: now.getFullYear() + '-' + getMonth(now) + '-12T20:00:00',
      end: now.getFullYear() + '-' + getMonth(now) + '-13T20:00:00',
      className: 'danger',
      description:
        'Sed purus urna, aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 9,
      title: 'Birthday Party',
      start: now.getFullYear() + '-' + getMonth(now) + '-27T20:00:00',
      end: now.getFullYear() + '-' + getMonth(now) + '-28T20:00:00',
      className: 'success',
      description:
        'Sed purus urna, aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 10,
      title: 'New Talent Event',
      start: now.getFullYear() + '-' + getMonth(now, 1) + '-24T08:12:14',
      end: now.getFullYear() + '-' + getMonth(now, 1) + '-27T22:20:20',
      className: 'danger',
      description:
        'Sed purus urna, aliquam et pharetra ut, efficitur id mi. Pellentesque ut convallis velit. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 11,
      title: 'Other new',
      start: now.getFullYear() + '-' + getMonth(now, -1) + '-13T08:12:14',
      end: now.getFullYear() + '-' + getMonth(now, -1) + '-16T22:20:20',
      className: 'primary',
      description:
        'Pellentesque ut convallis velit. Sed purus urna, aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
    {
      id: 13,
      title: 'Upcoming Event',
      start: now.getFullYear() + '-' + getMonth(now, 1) + '-15T08:12:14',
      end: now.getFullYear() + '-' + getMonth(now, 1) + '-18T22:20:20',
      className: 'primary',
      description:
        'Pellentesque ut convallis velit. Sed purus urna, aliquam et pharetra ut, efficitur id mi. Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    },
  ]);
  const [isAddEventModal, setIsAddEventModal] = useState(false);
  const [minStartDate, setMinStartDate] = useState<string>('');
  const [minEndDate, setMinEndDate] = useState<string>('');
  const defaultParams = {
    id: null,
    title: '',
    start: '',
    end: '',
    description: '',
    type: 'primary',
  };
  const [params, setParams] = useState<Params>(defaultParams);
  const dateFormat = (dt: Date | string): string => {
    if (typeof dt === 'string') {
      dt = new Date(dt);
    }
    const month =
      dt.getMonth() + 1 < 10 ? '0' + (dt.getMonth() + 1) : dt.getMonth() + 1;
    const date = dt.getDate() < 10 ? '0' + dt.getDate() : dt.getDate();
    const hours = dt.getHours() < 10 ? '0' + dt.getHours() : dt.getHours();
    const mins = dt.getMinutes() < 10 ? '0' + dt.getMinutes() : dt.getMinutes();
    return (
      dt.getFullYear() + '-' + month + '-' + date + 'T' + hours + ':' + mins
    );
  };

  const editEvent = (data?: Partial<CalendarEvent>) => {
    const params = JSON.parse(JSON.stringify(defaultParams));
    setParams(params);

    if (data) {
      const startStr = data.start
        ? dateFormat(data.start)
        : dateFormat(new Date());
      const endStr = data.end ? dateFormat(data.end) : dateFormat(new Date());
      setParams({
        id: data.id ? parseInt(data.id) : null,
        title: data.title ?? '',
        start: startStr,
        end: endStr,
        type: 'primary',
        description: '',
      });

      setMinStartDate(dateFormat(new Date()));
      setMinEndDate(startStr);
    } else {
      const currentDateStr = dateFormat(new Date());
      setMinStartDate(currentDateStr);
      setMinEndDate(currentDateStr);
    }

    setIsAddEventModal(true);
  };

  const editDate = (start: string, end: string) => {
    editEvent({
      start: new Date(start),
      end: new Date(end),
    });
  };

  const saveEvent = () => {
    if (!params.title) {
      return true;
    }
    if (!params.start) {
      return true;
    }
    if (!params.end) {
      return true;
    }
    if (params.id !== null) {
      const dataevent = events || [];
      const eventIndex = dataevent.findIndex((d: Event) => d.id === params.id);
      if (eventIndex !== -1) {
        dataevent[eventIndex] = {
          ...dataevent[eventIndex],
          title: params.title,
          start: params.start,
          end: params.end,
          description: params.description,
          className: params.type,
        };
      } else {
        const maxEventId =
          events.length > 0
            ? Math.max(...events.map(event => event.id)) + 1
            : 1;
        const newEvent = {
          id: maxEventId,
          title: params.title,
          start: params.start,
          end: params.end,
          description: params.description,
          className: params.type,
        };
        dataevent.push(newEvent);
      }
      setEvents([...dataevent]);
    }
    showMessage('Event has been saved successfully.');
    setIsAddEventModal(false);
  };

  const startDateChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const dateStr = event.target.value;
    if (dateStr) {
      setMinEndDate(dateFormat(dateStr));
      setParams(prevParams => ({ ...prevParams, start: dateStr, end: '' }));
    }
  };

  const changeValue = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { value, id } = event.target as
      | HTMLInputElement
      | HTMLTextAreaElement;
    setParams(prevParams => ({ ...prevParams, [id]: value }));
  };

  const showMessage = (
    msg = '',
    type: 'success' | 'error' | 'warning' | 'info' | 'question' = 'success',
  ) => {
    Swal.mixin({
      toast: true,
      position: 'top',
      showConfirmButton: false,
      timer: 3000,
      customClass: { container: 'toast' },
    })
      .fire({
        icon: type,
        title: msg,
        padding: '10px 20px',
      })
      .then(() => {
        // If no follow-up action is required, you can leave this block empty or add a comment.
      });
  };

  const getFullCalendarEvents = (events: Event[]) => {
    return events.map(event => ({
      ...event,
      id: event.id.toString(),
    }));
  };

  return (
    <div>
      <div className='panel mb-5'>
        <div className='mb-4 flex flex-col items-center justify-center sm:flex-row sm:justify-between'>
          <div className='mb-4 sm:mb-0'>
            <div className='text-center text-lg font-semibold ltr:sm:text-left rtl:sm:text-right'>
              Calendar
            </div>
            <div className='mt-2 flex flex-wrap items-center justify-center sm:justify-start'>
              <div className='flex items-center ltr:mr-4 rtl:ml-4'>
                <div className='bg-primary h-2.5 w-2.5 rounded-sm ltr:mr-2 rtl:ml-2'></div>
                <div>Work</div>
              </div>
              <div className='flex items-center ltr:mr-4 rtl:ml-4'>
                <div className='bg-info h-2.5 w-2.5 rounded-sm ltr:mr-2 rtl:ml-2'></div>
                <div>Travel</div>
              </div>
              <div className='flex items-center ltr:mr-4 rtl:ml-4'>
                <div className='bg-success h-2.5 w-2.5 rounded-sm ltr:mr-2 rtl:ml-2'></div>
                <div>Personal</div>
              </div>
              <div className='flex items-center'>
                <div className='bg-danger h-2.5 w-2.5 rounded-sm ltr:mr-2 rtl:ml-2'></div>
                <div>Important</div>
              </div>
            </div>
          </div>
          <button
            type='button'
            className='btn btn-primary'
            onClick={() => editEvent()}
          >
            <IconPlus className='ltr:mr-2 rtl:ml-2' />
            Create Event
          </button>
        </div>
        <div className='calendar-wrapper'>
          <FullCalendar
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView='dayGridMonth'
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay',
            }}
            editable={true}
            dayMaxEvents={true}
            selectable={true}
            droppable={true}
            eventClick={clickInfo => {
              const { id, title, start, end } = clickInfo.event;
              editEvent({
                id: id || '',
                title: title || '',
                start: start || new Date(),
                end: end || new Date(),
              });
            }}
            select={({ start, end }: { start: Date; end: Date }) =>
              editDate(start.toISOString(), end.toISOString())
            }
            events={getFullCalendarEvents(events)}
          />
        </div>
      </div>

      {/* add event modal */}
      <Transition appear show={isAddEventModal} as={Fragment}>
        <Dialog
          as='div'
          onClose={() => setIsAddEventModal(false)}
          open={isAddEventModal}
          className='relative z-50'
        >
          <Transition.Child
            as={Fragment}
            enter='duration-300 ease-out'
            enter-from='opacity-0'
            enter-to='opacity-100'
            leave='duration-200 ease-in'
            leave-from='opacity-100'
            leave-to='opacity-0'
          >
            <Dialog.Overlay className='fixed inset-0 bg-[black]/60' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full items-center justify-center px-4 py-8'>
              <Transition.Child
                as={Fragment}
                enter='duration-300 ease-out'
                enter-from='opacity-0 scale-95'
                enter-to='opacity-100 scale-100'
                leave='duration-200 ease-in'
                leave-from='opacity-100 scale-100'
                leave-to='opacity-0 scale-95'
              >
                <Dialog.Panel className='panel dark:text-white-dark w-full max-w-lg overflow-hidden rounded-lg border-0 p-0 text-black'>
                  <button
                    type='button'
                    className='absolute top-4 text-gray-400 outline-none hover:text-gray-800 ltr:right-4 rtl:left-4 dark:hover:text-gray-600'
                    onClick={() => setIsAddEventModal(false)}
                  >
                    <IconX />
                  </button>
                  <div className='bg-[#fbfbfb] py-3 text-lg font-medium ltr:pl-5 ltr:pr-[50px] rtl:pl-[50px] rtl:pr-5 dark:bg-[#121c2c]'>
                    {params.id ? 'Edit Event' : 'Add Event'}
                  </div>
                  <div className='p-5'>
                    <form className='space-y-5'>
                      <div>
                        <label htmlFor='title'>Event Title :</label>
                        <input
                          id='title'
                          type='text'
                          name='title'
                          className='form-input'
                          placeholder='Enter Event Title'
                          value={params.title || ''}
                          onChange={e => changeValue(e)}
                          required
                        />
                        <div className='text-danger mt-2' id='titleErr'></div>
                      </div>

                      <div>
                        <label htmlFor='dateStart'>From :</label>
                        <input
                          id='start'
                          type='datetime-local'
                          name='start'
                          className='form-input'
                          placeholder='Event Start Date'
                          value={params.start || ''}
                          min={minStartDate}
                          onChange={(
                            event: React.ChangeEvent<HTMLInputElement>,
                          ) => startDateChange(event)}
                          required
                        />
                        <div
                          className='text-danger mt-2'
                          id='startDateErr'
                        ></div>
                      </div>
                      <div>
                        <label htmlFor='dateEnd'>To :</label>
                        <input
                          id='end'
                          type='datetime-local'
                          name='end'
                          className='form-input'
                          placeholder='Event End Date'
                          value={params.end || ''}
                          min={minEndDate}
                          onChange={e => changeValue(e)}
                          required
                        />
                        <div className='text-danger mt-2' id='endDateErr'></div>
                      </div>
                      <div>
                        <label htmlFor='description'>Event Description :</label>
                        <textarea
                          id='description'
                          name='description'
                          className='form-textarea min-h-[130px]'
                          placeholder='Enter Event Description'
                          value={params.description || ''}
                          onChange={e => changeValue(e)}
                        ></textarea>
                      </div>
                      <div>
                        <div className='mt-3'>
                          <label
                            htmlFor='badgePrimary'
                            className='inline-flex cursor-pointer ltr:mr-3 rtl:ml-3'
                          >
                            <input
                              type='radio'
                              id='badgePrimary'
                              className='form-radio'
                              name='type'
                              value='primary'
                              checked={params.type === 'primary'}
                              onChange={e =>
                                setParams({ ...params, type: e.target.value })
                              }
                            />
                            <span className='ltr:pl-2 rtl:pr-2'>Work</span>
                          </label>
                          <label className='inline-flex cursor-pointer ltr:mr-3 rtl:ml-3'>
                            <input
                              type='radio'
                              className='form-radio text-info'
                              name='type'
                              value='info'
                              checked={params.type === 'info'}
                              onChange={e =>
                                setParams({ ...params, type: e.target.value })
                              }
                            />
                            <span className='ltr:pl-2 rtl:pr-2'>Travel</span>
                          </label>
                          <label className='inline-flex cursor-pointer ltr:mr-3 rtl:ml-3'>
                            <input
                              type='radio'
                              className='form-radio text-success'
                              name='type'
                              value='success'
                              checked={params.type === 'success'}
                              onChange={e =>
                                setParams({ ...params, type: e.target.value })
                              }
                            />
                            <span className='ltr:pl-2 rtl:pr-2'>Personal</span>
                          </label>
                          <label className='inline-flex cursor-pointer'>
                            <input
                              type='radio'
                              className='form-radio text-danger'
                              name='type'
                              value='danger'
                              checked={params.type === 'danger'}
                              onChange={e =>
                                setParams({ ...params, type: e.target.value })
                              }
                            />
                            <span className='ltr:pl-2 rtl:pr-2'>Important</span>
                          </label>
                        </div>
                      </div>
                      <div className='!mt-8 flex items-center justify-end'>
                        <button
                          type='button'
                          className='btn btn-outline-danger'
                          onClick={() => setIsAddEventModal(false)}
                        >
                          Cancel
                        </button>
                        <button
                          type='button'
                          onClick={() => saveEvent()}
                          className='btn btn-primary ltr:ml-4 rtl:mr-4'
                        >
                          {params.id ? 'Update Event' : 'Create Event'}
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

export default ComponentsAppsCalendar;
