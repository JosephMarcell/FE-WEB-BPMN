import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import themeConfig from '@/lib/theme/theme.config';

const initialState = {
  isDarkMode: false,
  sidebar:
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('sidebar') || 'false')
      : false,
  theme: themeConfig.theme,
  menu: themeConfig.menu,
  layout: themeConfig.layout,
  rtlClass: themeConfig.rtlClass,
  animation: themeConfig.animation,
  navbar: themeConfig.navbar,
  locale: themeConfig.locale,
  semidark: themeConfig.semidark,
  modalForm: false,
  modalEdit: false,
  pkid: 0,
  languageList: [
    { code: 'ina', name: 'Indonesian' },
    { code: 'en', name: 'English' },
  ],
};

const themeConfigSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    toggleTheme(state, { payload }) {
      payload = payload || state.theme; // light | dark | system
      localStorage.setItem('theme', payload);
      state.theme = payload;
      if (payload === 'light') {
        state.isDarkMode = false;
      } else if (payload === 'dark') {
        state.isDarkMode = true;
      } else if (payload === 'system') {
        if (
          window.matchMedia &&
          window.matchMedia('(prefers-color-scheme: dark)').matches
        ) {
          state.isDarkMode = true;
        } else {
          state.isDarkMode = false;
        }
      }

      if (state.isDarkMode) {
        document.querySelector('body')?.classList.add('dark');
      } else {
        document.querySelector('body')?.classList.remove('dark');
      }
    },
    toggleMenu(state, { payload }) {
      payload = payload || state.menu; // vertical, collapsible-vertical, horizontal
      localStorage.setItem('menu', payload);
      state.menu = payload;
    },
    toggleLayout(state, { payload }) {
      payload = payload || state.layout; // full, boxed-layout
      localStorage.setItem('layout', payload);
      state.layout = payload;
    },
    toggleRTL(state, { payload }) {
      payload = payload || state.rtlClass; // rtl, ltr
      localStorage.setItem('rtlClass', payload);
      state.rtlClass = payload;
      document
        .querySelector('html')
        ?.setAttribute('dir', state.rtlClass || 'ltr');
    },
    toggleAnimation(state, { payload }) {
      payload = payload || state.animation; // animate__fadeIn, animate__fadeInDown, animate__fadeInUp, animate__fadeInLeft, animate__fadeInRight, animate__slideInDown, animate__slideInLeft, animate__slideInRight, animate__zoomIn
      payload = payload?.trim();
      localStorage.setItem('animation', payload);
      state.animation = payload;
    },
    toggleNavbar(state, { payload }) {
      payload = payload || state.navbar; // navbar-sticky, navbar-floating, navbar-static
      localStorage.setItem('navbar', payload);
      state.navbar = payload;
    },
    toggleSemidark(state, { payload }) {
      payload = payload === true || payload === 'true' ? true : false;
      localStorage.setItem('semidark', payload);
      state.semidark = payload;
    },
    toggleSidebar(state) {
      state.sidebar = !state.sidebar;
      localStorage.setItem('sidebar', JSON.stringify(state.sidebar));
    },
    resetToggleSidebar(state) {
      state.sidebar = false;
    },
    initializeSidebar(state) {
      const storedSidebarState = localStorage.getItem('sidebar');
      if (storedSidebarState === null) {
        state.sidebar = false;
        localStorage.setItem('sidebar', JSON.stringify(false));
      } else {
        state.sidebar = JSON.parse(storedSidebarState);
      }
    },
    setModalForm: (state, action: PayloadAction<boolean>) => {
      state.modalForm = action.payload;
    },
    setModalEdit: (state, action: PayloadAction<boolean>) => {
      state.modalEdit = action.payload;
    },
    setPkid: (state, action: PayloadAction<number>) => {
      state.pkid = action.payload;
    },
  },
});

export const {
  toggleTheme,
  toggleMenu,
  toggleLayout,
  toggleRTL,
  toggleAnimation,
  toggleNavbar,
  toggleSemidark,
  toggleSidebar,
  initializeSidebar,
  resetToggleSidebar,
  setModalForm,
  setModalEdit,
  setPkid,
} = themeConfigSlice.actions;

export default themeConfigSlice.reducer;
