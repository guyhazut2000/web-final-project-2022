import { createSlice } from "@reduxjs/toolkit";

const courseSlice = createSlice({
  name: "course",
  initialState: {
    coursesList: null,
    currentCourse: null,
    isFetching: false,
    error: false,
  },
  reducers: {
    setCurrentCourse: (state, action) => {
      state.currentCourse = action.payload;
    },
    setCoursesListStart: (state) => {
      state.isFetching = true;
    },
    setCoursesListSuccess: (state, action) => {
      state.coursesList = action.payload;
      state.isFetching = false;
      state.error = false;
    },
    setCoursesListFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    resetCoursesData: (state, action) => {
      state.coursesList = null;
      state.currentCourse = null;
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const {
  setCoursesListStart,
  setCoursesListSuccess,
  setCoursesListFailure,
  resetCoursesData,
  setCurrentCourse,
} = courseSlice.actions;
export default courseSlice.reducer;
