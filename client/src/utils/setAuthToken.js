//function that takes in a token. If the token is there then it adds it to the x-auth-token headers, if not it's going to delete it from the headers
//This function is called on every request

import axios from 'axios';

const setAuthToken = (token) => {
  if (token) {
    return (axios.defaults.headers.common['x-auth-token'] = token);
  } else {
    delete axios.defaults.headers.common['x-auth-token'];
  }
};

export default setAuthToken;
