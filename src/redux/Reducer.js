import { createSlice } from '@reduxjs/toolkit';


const initialState = {
  currentPose:null,
  posePayload: {

  },
  loading: false,
  userId: null,
  email: null,
  name: null
};

export const Slice = createSlice({
  name: 'store',
  initialState,
  reducers: {
    setPose: (state, action) => {
      state.currentPose = action.payload.pose;
      state.posePayload = action.payload.payload;
      console.log(action.payload)
    },
    clearPost: (state, action) => {
      state.currentPost = null;
      state.posePayload = {};
    },
    setUser: (state, action) => {
      state.userId = action.payload.userId
      state.email = action.payload.email
      state.name = action.payload.name
    },
  },
});

export const { setPose, clearPost, setUser } = Slice.actions;
export const getPose = (state) => state.store.currentPose;
export const getPosePayload = (state) => state.store.posePayload;
export const getUser = (state) => {return {userId:state.store.userId, username: state.store.username, name:state.store.name}};
export default Slice.reducer;