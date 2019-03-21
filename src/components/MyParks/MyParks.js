import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './MyParks.css';
import Card from '@material-ui/core/Card';
import Grid from '@material-ui/core/Grid';
import { CardContent, CardActions, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';

// LogOutButton from '../LogOutButton/LogOutButton';

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`
const styles = {
  card: {
    minWidth: 275,
    maxWidth: 350,
    margin: 22,
  }
}

class MyParks extends Component {
  state = {
    displayParkInfo: false,
    currentPark: 0
  }

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

  displayParkInfo = (parks_visited_id) => {
    return () => {
      this.props.dispatch({ type: 'FETCH_CURRENT_PARK', payload: parks_visited_id })
      this.setState({
        displayParkInfo: true,
        currentPark: parks_visited_id,
      })
    }
  }

  //this will delete park from the database 
  deletePark = (parks_visited_id) => {
    return () => {
      console.log('delete was clicked', parks_visited_id);
      const r = window.confirm("Are you sure you want to delete this park?");
      if (r === true) {
        axios({
          method: 'DELETE',
          url: '/myparks/' + parks_visited_id,
        }).then((response) => {
          this.getMyParks();
        });
      }
      else {
        window.alert("Feedback saved");
      }
    }
  }

  createMyParks = () => {
    return this.props.parks.map(park =>
      <Card className={this.props.classes.card} key={park.all_parks_id}><h3>{park.park_full_name}</h3>
        <Divider />
        <CardContent>
        <img onClick={this.displayParkInfo(park.all_parks_id)} alt={park.park_description} src={park.image_path_1} />
        <pre></pre>
        Date Visited: {park.date_visited_1}
        <pre></pre>
        Notes: {park.notes}
        </CardContent>
        <CardActions>
        {/* <button>Update</button> */}
        <button onClick={this.deletePark(park.parks_visited_id)}>Delete</button>
        <pre></pre>
        </CardActions>
      </Card>
    )
  }

closeParkDisplay = () => {
  console.log('closing park display');
  this.setState({
    displayParkInfo: false,
  })
}

  render() {
    let currentParkDisplay;
    if (this.state.displayParkInfo) {
      currentParkDisplay = <div>
        {this.props.parkdisplay[0] && 
        <div>
          <h3>{this.props.parkdisplay[0].park_full_name}</h3>
          <pre></pre>
          {this.props.parkdisplay[0].park_description}
          <pre></pre>
          <img alt={this.props.parkdisplay[0].park_description} src={this.props.parkdisplay[0].image_path_1}/>
          <pre></pre>
          <button onClick={this.closeParkDisplay}>OK</button>
        </div>
        }
      </div>;
    }
    else {
      currentParkDisplay = null;
    }
    return (
      <Grid>
        <h1 id="welcome">
          My Parks
      </h1>
        {/* <LogOutButton className="log-in" /> */}
        <div>
          {this.createMyParks()}
        </div>
        {currentParkDisplay}
      </Grid>
    )
  }
}

// Instead of taking everything from state, we just want the user info.
// if you wanted you could write this code like this:
// const mapStateToProps = ({user}) => ({ user });
const mapStateToProps = state => ({
  user: state.user,
  parks: state.parks,
  parkdisplay: state.parkdisplay,
});

// this allows us to use <App /> in index.js
export default withStyles(styles)(connect(mapStateToProps)(MyParks));
