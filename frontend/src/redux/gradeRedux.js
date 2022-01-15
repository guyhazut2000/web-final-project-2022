import { createSlice } from "@reduxjs/toolkit";

const gradeSlice = createSlice({
  name: "grade",
  initialState: {
    courseName: "",
    grades: { labs: [], exercises: [] },
    isFetching: false,
    error: false,
  },
  reducers: {
    setGradesStart: (state) => {
      state.isFetching = true;
    },
    setGradesSuccess: (state, action) => {
      state.courseName = action.payload.courseName;
      state.grades.labs = action.payload.labs;
      state.grades.exercises = action.payload.exercises;
      state.isFetching = false;
      state.error = false;
    },
    setGradesFailure: (state) => {
      state.isFetching = false;
      state.error = true;
    },
    resetGradesData: (state) => {
      state.courseName = "";
      state.grades.labs = [];
      state.grades.exercises = [];
      state.isFetching = false;
      state.error = false;
    },
  },
});

export const {
  setGradesStart,
  setGradesSuccess,
  setGradesFailure,
  resetGradesData,
} = gradeSlice.actions;
export default gradeSlice.reducer;
