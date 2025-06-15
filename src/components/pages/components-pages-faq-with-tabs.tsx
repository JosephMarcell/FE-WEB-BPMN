'use client';
import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';

import IconBox from '@/components/icon/icon-box';
import IconDesktop from '@/components/icon/icon-desktop';
import IconDollarSignCircle from '@/components/icon/icon-dollar-sign-circle';
import IconMinusCircle from '@/components/icon/icon-minus-circle';
import IconPlusCircle from '@/components/icon/icon-plus-circle';
import IconRouter from '@/components/icon/icon-router';
import IconUser from '@/components/icon/icon-user';

interface FaqItem {
  question: string;
  answer: string;
}

const faqData: FaqItem[] = [
  {
    question: 'How to install ERP Admin',
    answer: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit...',
  },
  {
    question: 'Where can I subscribe to your newsletter?',
    answer: 'You can subscribe to our newsletter on our homepage...',
  },
  // Add more FAQ items here...
];

interface ComponentsPagesFaqWithTabsProps {
  title?: string;
}

const ComponentsPagesFaqWithTabs = ({
  title = 'Some common <span className="text-primary">questions</span>',
}: ComponentsPagesFaqWithTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>('general');
  const [activeQuestionIndex, setActiveQuestionIndex] = useState<string | null>(
    null,
  );

  const toggleQuestion = (question: string) => {
    setActiveQuestionIndex(activeQuestionIndex === question ? null : question);
  };

  return (
    <>
      <div className='mb-12 flex items-center rounded-b-md bg-[#DBE7FF] dark:bg-[#141F31]'>
        <ul className='py-4.5 mx-auto flex items-center gap-5 overflow-auto whitespace-nowrap px-3 xl:gap-8'>
          {[
            'general',
            'quick-support',
            'free-updates',
            'pricing',
            'hosting',
          ].map(tab => (
            <li
              key={tab}
              className='group flex min-w-[120px] flex-col items-center justify-center gap-4 rounded-md px-8 py-2.5 text-center'
            >
              <button
                className={`hover:text-primary flex cursor-pointer items-center justify-center gap-4 rounded-md px-8 py-2.5 text-[#506690] duration-300 ${
                  activeTab === tab
                    ? 'text-primary bg-white dark:bg-[#1B2E4B]'
                    : 'hover:bg-white dark:hover:bg-[#1B2E4B]'
                }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === 'general' && <IconDesktop fill={true} />}
                {tab === 'quick-support' && <IconUser fill={true} />}
                {tab === 'free-updates' && <IconBox fill={true} />}
                {tab === 'pricing' && <IconDollarSignCircle fill={true} />}
                {tab === 'hosting' && <IconRouter fill={true} />}
                <span className='font-bold text-black dark:text-white'>
                  {tab.charAt(0).toUpperCase() +
                    tab.slice(1).replace(/-/g, ' ')}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </div>
      <h3
        className='mb-8 text-center text-xl font-semibold md:text-2xl'
        dangerouslySetInnerHTML={{ __html: title }}
      />
      <div className='mb-10 grid grid-cols-1 gap-10 md:grid-cols-2'>
        {/* FAQ Section */}
        <div className='rounded-md bg-white dark:bg-black'>
          <div className='border-white-light dark:border-dark border-b p-6 text-[22px] font-bold dark:text-white'>
            General topics?
          </div>
          <div className='divide-white-light py-4.5 dark:divide-dark divide-y px-6'>
            {faqData.map(item => (
              <div key={item.question}>
                <button
                  type='button'
                  className={`hover:bg-primary-light hover:text-primary dark:hover:text-primary flex cursor-pointer items-center justify-between gap-10 px-2.5 py-2 text-base font-semibold dark:text-white dark:hover:bg-[#1B2E4B] ${
                    activeQuestionIndex === item.question
                      ? 'bg-primary-light !text-primary dark:bg-[#1B2E4B]'
                      : ''
                  }`}
                  onClick={() => toggleQuestion(item.question)}
                >
                  <span>{item.question}</span>
                  {activeQuestionIndex !== item.question ? (
                    <IconPlusCircle />
                  ) : (
                    <IconMinusCircle fill={true} />
                  )}
                </button>
                <AnimateHeight
                  duration={300}
                  height={activeQuestionIndex === item.question ? 'auto' : 0}
                >
                  <div className='text-white-dark px-1 py-3 font-semibold'>
                    {item.answer}
                  </div>
                </AnimateHeight>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default ComponentsPagesFaqWithTabs;
