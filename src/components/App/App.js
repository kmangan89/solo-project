import React, {Component} from 'react';
import {
  HashRouter as Router,
  Route,
  Redirect,
  Switch,
} from 'react-router-dom';

import {connect} from 'react-redux';
import Nav from '../Nav/Nav';
import Footer from '../Footer/Footer';
import ProtectedRoute from '../ProtectedRoute/ProtectedRoute'
import ParksProfile from '../ParksProfile/ParksProfile';
import MyParks from '../MyParks/MyParks';
import FindAPark from '../FindAPark/FindAPark';
import GoogleMaps from '../GoogleMaps/GoogleMaps';
import './App.css';


class App extends Component {
  componentDidMount () {
    this.props.dispatch({type: 'FETCH_USER'})
  }

  render() {
    return (
      <Router>
        <div>
          <Nav />
          <Switch>
            {/* Visiting localhost:3000 will redirect to localhost:3000/home */}
            <Redirect exact from="/" to="/myparks" />
            {/* Visiting localhost:3000/about will show the about page.
            This is a route anyone can see, no login necessary */}
            <Route
              exact
              path="/profile"
              component={ParksProfile}
            />

            <ProtectedRoute
              exact
              path="/map"
              component={GoogleMaps}
            />

        
            {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:3000/home will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the 'Login' or 'Register' page.
            Even though it seems like they are different pages, the user is always on localhost:3000/home */}

            
            <ProtectedRoute
              exact
              path="/myparks"
              component={MyParks}
            />
          
            <ProtectedRoute
              exact
              path="/findpark"
              component={FindAPark}
            />
            {/* If none of the other routes matched, users will show a 404. */}
            <Route render={() => <h1>404</h1>} />
          </Switch>
          <Footer />
        </div>
      </Router>
  )}
}

export default connect()(App);
