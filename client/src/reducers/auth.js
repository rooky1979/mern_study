import { REGISTER_SUCCESS, REGISTER_FAIL } from '../actions/types';

const initialState = {
  //store the token locally
  token: localStorage.getItem('token'),
  //sets to true when authenticated on success
  isAuthenticated: null,
  //ensures that the loading is done with regard to requests to the backend
  loading: true,
  //user information name/email/avatar
  user: null,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case REGISTER_SUCCESS:
      localStorage.setItem('token', payload.token);
      return { ...state, ...payload, isAuthenticated: true, loading: false };

    case REGISTER_FAIL:
      localStorage.removeItem('token');
      return { ...state, isAuthenticated: false, loading: false };
    default:
      return state;
  }
}
