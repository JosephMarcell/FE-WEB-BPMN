'use client';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import React, { ReactNode, Suspense } from 'react';
import { Provider } from 'react-redux';

// import '@mantine/core/styles.css';
// import '@mantine/core/styles.layer.css';
// import 'mantine-datatable/styles.layer.css';
import '@/styles/globals.css';
import 'flatpickr/dist/flatpickr.css';
import 'tippy.js/dist/tippy.css';

import Loading from '@/components/layouts/loading';

import store from '@/store';

import App from '@/App';

interface IProps {
  children?: ReactNode;
}
const queryClient = new QueryClient();

const ProviderComponent = ({ children }: IProps) => {
  return (
    <QueryClientProvider client={queryClient}>
      <Provider store={store}>
        <ReactQueryDevtools initialIsOpen={true} />
        <Suspense fallback={<Loading />}>
          <App>{children} </App>
        </Suspense>
      </Provider>
    </QueryClientProvider>
  );
};

export default ProviderComponent;
