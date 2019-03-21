import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './MyParks.css';
import Card from '@material-ui/core/Card';
import { CardContent, CardActions, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// LogOutButton from '../LogOutButton/LogOutButton';

// this could also be written with destructuring parameters as:
// const UserPage = ({ user }) => (
// and then instead of `props.user.username` you could use `user.username`

const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 50,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  card: {
    minWidth: 275,
    maxWidth: 500,
    margin: 22,
  },
  cardTitle: {
    padding: 15,
    textAlign: 'center',
  },
});

function rand() {
  return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
  const top = 50 + rand();
  const left = 50 + rand();

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

class MyParks extends Component {
  state = {
    open: false,
    currentPark: 0,
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
        open: true,
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
      <Card className={this.props.classes.card} key={park.all_parks_id}><Typography className={this.props.classes.cardTitle} variant="h4">{park.park_full_name}</Typography>
        <Divider />
        <CardContent>
        <img onClick={this.displayParkInfo(park.all_parks_id)} alt={park.park_description} src={park.image_path_1} />
        <pre></pre>
          <Typography>Date Visited: {park.date_visited_1}</Typography>
        <pre></pre>
          <Typography>Notes: {park.notes}</Typography>
        </CardContent>
        <Divider />
        <CardActions>
        {/* <button>Update</button> */}
        <Button onClick={this.deletePark(park.parks_visited_id)}>Delete From My Parks</Button>
        <pre></pre>
        </CardActions>
      </Card>
    )
  }

closeParkDisplay = () => {
  console.log('closing park display');
  this.setState({
    open: false,
  })
  this.props.dispatch({ type: 'FETCH_CURRENT_PARK', payload: '' })
}

  render() {
    const { classes } = this.props;
    let currentParkDisplay;
    if (this.state.open) {
      currentParkDisplay = <div>
        {this.props.parkdisplay[0] && 
          <Modal 
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.closeParkDisplay}>
          <div style={getModalStyle()} className={classes.paper}>
          <Typography variant="h4" id="modal-title">{this.props.parkdisplay[0].park_full_name}</Typography>
          <pre></pre>
          <Typography>{this.props.parkdisplay[0].park_description}</Typography>
          <pre></pre>
          <img alt={this.props.parkdisplay[0].park_description} src={this.props.parkdisplay[0].image_path_1}/>
          <pre></pre>
          <Button onClick={this.closeParkDisplay}>OK</Button>
          </div>
        </Modal>
        }
      </div>;
    }
    else {
      currentParkDisplay = null;
    }
    return (
      <div>
        <Typography variant="h3">
          My Parks
      </Typography>
        {/* <LogOutButton className="log-in" /> */}
        <div className="container">
          {this.createMyParks()}
        </div>
        {currentParkDisplay}
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
  parkdisplay: state.parkdisplay,
});

// this allows us to use <App /> in index.js
export default withStyles(styles)(connect(mapStateToProps)(MyParks));
