import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './MyParks.css';
// LogOutButton from '../LogOutButton/LogOutButton';

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`

class MyParks extends Component {

  componentDidMount = () => {
    this.getMyParks();
  }

  getMyParks = () => {
    axios.get('/myparks')
      .then((response) => {
        this.props.dispatch({ type: 'SET_MY_PARKS', payload: response.data })
      }).catch(error => {
        console.log('error in my parks client get request', error);
      });
  }


  render() {
    console.log(this.props.parks)
    return (
      <div>
        <h1 id="welcome">
          My Parks
      </h1>
        {/* <LogOutButton className="log-in" /> */}
        <div>
          {this.props.parks.map(park =>
            <div key={park.all_parks_id}>
              <div>{park.park_full_name}</div>
              <img className="parkImage" alt={park.park_description} src={park.image_path_1}/>
              <div>{park.date_visited_1}</div>
              <div>{park.date_visited_2}</div>
              <div>{park.date_visited_3}</div>
              <div>{park.notes}</div>
            </div>
          )}
        </div>
      </div>
    )
  }
}

// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
  parks: state.parks,
});

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(MyParks);
