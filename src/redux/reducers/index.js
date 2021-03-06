import { combineReducers } from 'redux';
import errors from './errorsReducer';
import loginMode from './loginModeReducer';
import user from './userReducer';
import parks from './parksReducer';
import currentpark from './currentParkReducer';
import parkdisplay from './parkDisplayReducer';
import editpark from './editCurrentParkReducer';

// rootReducer is the primary reducer for this entire project
// It bundles up all of the other reducers so this project can use them.
// This is imported in index.js as rootSaga

// This is what we get when we use 'state' inside of 'mapStateToProps'
const rootReducer = combineReducers({
  errors, // contains registrationMessage and loginMessage
  loginMode, // will have a value of 'login' or 'registration' to control which screen is shown
  user, // will have an id and username if someone is logged in
  parks,
  currentpark,
  parkdisplay,
  editpark,
});

export default rootReducer;
