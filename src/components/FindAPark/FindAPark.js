import React, { Component } from 'react';
import { connect } from 'react-redux';
import axios from 'axios';
import './FindAPark.css';
//import { useAlert } from 'react-alert';

// -- Material UI Styling -- //
import Card from '@material-ui/core/Card';
import { CardContent, CardActions, Divider } from '@material-ui/core';
import { withStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import globalThemes from '../../utils/theme';

const styles = theme => ({
  ...globalThemes(theme),
  textField: {
    marginLeft: theme.spacing.unit,
    marginRight: theme.spacing.unit,
    width: 300,
  },
  cardTitle: {
    padding: 15,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    display: 'inline-block',
  },
  card: {
    maxWidth: 600,
    margin: 15,
    display: 'inline-block',
  },
  parkDescription: {
    marginTop: 20,
  }
});

//modal positioniong and style
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

class FindAPark extends Component {

  state = {
    parkDisplay: false,
    open: false,
    newPark: {
      park_id: 0,
      user_id: this.props.user.id,
      date_visited_1: '2019-06-01',
      date_visited_2: '',
      date_visited_3: '',
      notes: '',
    },
    parkSubmitted: false,
  }

  componentDidMount = () => {
    this.getParks();
  }

  //gets parks from database or national parks service api and sets the parks reducer equal to that information
  getParks = () => {
    axios.get('/parks')
      .then((response) => {
        this.props.dispatch({ type: 'SET_PARKS', payload: response.data })
      }).catch(error => {
        console.log('error in parks client get request', error);
      });
  }

  // determines which park was selected and fetches additional information from the database; sets current park reducer equal to that park's information
  handleParkChange = event => {
    axios.get('/currentpark/', {
      params: {
        id: event.target.value,
      }
    }).then((response) => {
      this.props.dispatch({ type: 'SET_CURRENT_PARK', payload: response.data })
      this.setState({
        park_id: this.props.currentpark.id,
        parkDisplay: true,
        parkSubmitted: false,
      })
    }).catch(error => {
      console.log('error in current park get request', error);
    });
  }

  //displays new park fields on the DOM when the function runs
  addVisit = () => {
    console.log('button clicked', this.props.currentpark[0].id);
    this.setState({
      open: true,
    })
  }

  // sets local state to input values
  handleChangeFor = (propertyName) => (event) => {
    this.setState({
      newPark: {
        ...this.state.newPark,
        [propertyName]: event.target.value,
      }
    });
  }

  //add park to parks_visited table 
  addPark = () => {
    axios({
      method: 'POST',
      url: '/currentpark/' + this.props.currentpark[0].id,
      data: {
        user_id: this.state.newPark.user_id,
        date_visited_1: this.state.newPark.date_visited_1,
        notes: this.state.newPark.notes,
        park_id: this.props.currentpark[0].id,
      }
    })
      .then(() => {
        this.setState({
          open: false,
          parkSubmitted: true,
          parkDisplay: true,
          newPark: {
            park_id: 0,
            user_id: this.props.user.id,
            date_visited_1: '2019-06-01',
            date_visited_2: '',
            date_visited_3: '',
            notes: '',
          },
        })
        window.alert('Success!');
      })
  }

  //closes park display
  closeParkDisplay = () => {
    this.setState({
      open: false,
      parkSubmitted: false,
      notes: '',
    })
  }

  render() {
    const { classes, currentpark } = this.props;
    let parkDOMDisplay
    let addParkDOMDisplay

    //displays Material UI card when a park is selected in the dropdown menu
    if (this.state.parkDisplay) {
      parkDOMDisplay = <div className="cardContainer">
        <Card className={classes.card}>
          <CardContent>
            <Typography className={classes.cardTitle} variant="h4">{currentpark[0].park_full_name}</Typography>
            <Divider />
            <img onClick={this.viewParkInfo} className="parkImages" alt={currentpark[0].park_description} src={currentpark[0].image_path_1} />
            <Typography className={classes.parkDescription}>{currentpark[0].park_description}</Typography>
          </CardContent>
          <CardActions>
          <Button variant="contained" color="primary" className={classes.button} onClick={this.addVisit}>Add Visit</Button>
          </CardActions>
        </Card>
      </div>
    }
    else {
      parkDOMDisplay = null;
    }

    //displays a modal that allows users to enter in information about their park visit
    if (this.state.open) {
      addParkDOMDisplay = <div>
        {this.props.currentpark[0] &&
          <Modal
            aria-labelledby="simple-modal-title"
            aria-describedby="simple-modal-description"
            open={this.state.open}
            onClose={this.closeParkDisplay}
           >
          <div style={getModalStyle()} className={classes.paper}>
            <Typography variant="h4"> Add Visit To {this.props.currentpark[0].park_full_name}</Typography>
            <pre></pre>
            <TextField
              value={this.state.newPark.date_visited_1}
              onChange={this.handleChangeFor('date_visited_1')}
              id="date"
              type="date"
              className={classes.textField}
              margin="normal"
            />
            <TextField
            value={this.state.newPark.notes}
            onChange={this.handleChangeFor('notes')}
              id="standard-multiline-static"
              label="Park Notes"
              multiline
              rows="4"
              className={classes.textField}
              margin="normal"
            />
            <Button variant="contained" color="primary" className={classes.button} onClick={this.addPark}>Add Park</Button>
          </div>
          </Modal>
        }
    
      </div>
    }
    else {
      addParkDOMDisplay = null;
    }

    return (
      <div>
        <h1 className="findAPark">Find A Park</h1>
        <div className="container">
        <select
          
          onChange={this.handleParkChange}
        >
          <option>-- Find A Park --</option>
          {this.props.parks && this.props.parks.map(park =>
            <option value={park.id} key={park.id}>{park.park_full_name}</option>
          )}
          </select>
        </div>
        <br />
        <br />
       {parkDOMDisplay}
        <br />
        <br />
        <div>{addParkDOMDisplay}</div>
      </div>
    );
  }
}

const mapReduxStateToProps = (reduxState) => {
  return reduxState;
}

export default withStyles(styles)(connect(mapReduxStateToProps)(FindAPark));
