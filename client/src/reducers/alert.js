import { SET_ALERT, REMOVE_ALERT } from '../actions/types';

const initialState = [];

export default function alert(state = initialState, action) {
  //pull out type and payload from action
  const { type, payload } = action;

  switch (type) {
    //add an alert to the state array
    case SET_ALERT:
      return [...state, payload];
    //remove an alert by the alert ID
    case REMOVE_ALERT:
      return state.filter((alert) => alert.id !== payload);
    default:
      return state;
  }
}
