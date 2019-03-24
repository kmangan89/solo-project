import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './MyParks.css';

// -- Material UI components -- //
import Card from '@material-ui/core/Card';
import { CardContent, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

let editFormDisplay;

// -- styling for Material UI components -- //
const styles = theme => ({
  paper: {
    position: 'absolute',
    width: theme.spacing.unit * 70,
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: theme.spacing.unit * 4,
    outline: 'none',
  },
  card: {
    minWidth: 275,
    maxWidth: 500,
    margin: 20,
    padding: 20,
  },
  cardTitle: {
    padding: 15,
    textAlign: 'center',
  },
  button: {
    width: '50%',
    padding: 10,
  },
  header: {
    margin: 10,
  }
});

// -- styling for Material UI modal -- //
function getModalStyle() {
  const top = 50;
  const left = 50;

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
    edit_date: '',
    edit_notes: '',
    isInEditMode: false,
    editText: 'TEST!',
    dateVisited: '1/6/89',
    notes: 'Test notes',
  }

  componentDidMount = () => {
    this.getMyParks();
  }

  // retrieves list of parks visited from database and saves the information
  // in a reducer 
  getMyParks = () => {
    axios.get('/myparks')
      .then((response) => {
        this.props.dispatch({ type: 'SET_MY_PARKS', payload: response.data })
      }).catch(error => {
        console.log('error in my parks client get request', error);
      });
  }

  // determines which park was clicked and retrieves additional information
  // from the database; opens modal
  displayParkInfo = (parks_visited_id) => {
    return () => {
      this.props.dispatch({ type: 'FETCH_CURRENT_PARK', payload: parks_visited_id })
      this.setState({
        open: true,
        currentPark: parks_visited_id,
        isInEditMode: false,
      })
    }
  }

  // sets local state to input values
  handleChangeFor = (propertyName) => (event) => {
    this.setState({
      [propertyName]: event.target.value,
    });
  }

  //this will delete a park visit from the parks_visited table in the database 
  deletePark = (parks_visited_id) => {
    return () => {
      const r = window.confirm("Are you sure you want to delete this park?");
      if (r === true) {
        axios({
          method: 'DELETE',
          url: '/myparks/' + parks_visited_id,
        }).then((response) => {
          this.setState({
            open: false,
          })
          this.getMyParks();
        });
      }
    }
  }

  // displays list of parks visited on the dom in a material ui card
  createMyParks = () => {
    return this.props.parks.map(park =>
      <Card onClick={this.displayParkInfo(park.all_parks_id)} className={this.props.classes.card} key={park.all_parks_id}><Typography className={this.props.classes.cardTitle} variant="h4">{park.park_full_name}</Typography>
        <Divider />
        <CardContent>
          <img alt={park.park_description} src={park.image_path_1} />
          <pre></pre>
          <Typography>{park.park_description}</Typography>
          <pre></pre>
          <Divider />
          <pre></pre>
          <Typography variant="h5"> My Visit:</Typography>
          <Typography>Date: {park.date_visited_1}</Typography>
          <pre></pre>
          <Typography>Notes: {park.notes}</Typography>
        </CardContent>
      </Card>
    )
  }

  //closes modal on click of "ok" button or when clicking on the background page
  closeParkDisplay = () => {
    this.setState({
      open: false,
    })
  }

  //when save is clicked, the information that the user has typed into the input boxes
  //gets sent to the database and the parks_visited table for that park is updated.
  //the information is refreshed by calling the getMyParks function and is displayed on the DOM
  saveEditedInfo = () => {
    this.setState({
      isInEditMode: false,
      dateVisited: this.state.dateVisited,
      notes: this.state.notes,
    })
    axios({
      method: 'PUT',
      url: '/myparks/' + this.props.parkdisplay[0].id,
      data: {
        id: this.props.parkdisplay[0].id,
        date_visited_1: this.state.dateVisited,
        notes: this.state.notes,
      }
    }).then(() => {
      this.getMyParks();
    })
  }

  //this will toggle the park input information between text and input boxes with 
  //a save/cancel button
  changeEditMode = () => {
    this.setState({
      isInEditMode: !this.state.isInEditMode,
    })
  }

  //toggles park visited information on the modal between text and input fields for the user to update 
  displayEditFormDisplay = () => {
    if (this.state.isInEditMode) {
      editFormDisplay =
        <div>
          <div>
            <input type="date"
              onChange={this.handleChangeFor('dateVisited')}
            />
            <input type="text"
              defaultValue={this.props.parks[0].notes}
              onChange={this.handleChangeFor('notes')}
            />
          </div>
          <pre></pre>
          <Button onClick={this.saveEditedInfo}>Save</Button>
          <Button onClick={this.changeEditMode}>Cancel</Button>
        </div>
    }
    else {
      editFormDisplay =
        <div>
          Date Visited: {this.props.parks[0].date_visited_1}
          <pre></pre>
          Notes: {this.props.parks[0].notes}
          <pre></pre>
        <Button onClick={this.changeEditMode}>Edit</Button>
        </div>
    }
  }

  render() {
    const { classes } = this.props;
    let currentParkDisplay;

    // displays the current park information in a modal when the user clicks on the image
    if (this.state.open) {
      currentParkDisplay = <div>
        {this.props.parkdisplay[0] &&
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.closeParkDisplay}
            >
            <div style={getModalStyle()} className={classes.paper}>
              <Typography variant="h4" id="modal-title">{this.props.parkdisplay[0].park_full_name}</Typography>
              {this.displayEditFormDisplay()}
              {editFormDisplay}
              <img alt={this.props.parkdisplay[0].park_description} src={this.props.parkdisplay[0].image_path_1} />
              <Button variant="contained" color="default" className={this.props.classes.button} onClick={this.closeParkDisplay}>OK</Button>
              <Button variant="contained" color="default" className={this.props.classes.button} onClick={this.deletePark(this.props.parkdisplay[0].id)}>Delete This Visit</Button>
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
        <Typography className={classes.header} variant="h3">My Parks</Typography>
        <div className="container">{this.createMyParks()}</div>
        {currentParkDisplay}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  //user: state.user,
  parks: state.parks,
  parkdisplay: state.parkdisplay,
  editpark: state.editpark,
});

export default withStyles(styles)(connect(mapStateToProps)(MyParks));
