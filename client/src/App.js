import React from 'react';
import {BrowserRouter as Router, Route} from 'react-router-dom';
import PrivateRoute from './hocs/PrivateRoute';
import UnPrivateRoute from './hocs/UnPrivateRoute';
import Navbar from './components/Navbar';
import Map from './components/Map';
import Home from './components/Home';
import CreateMap from './components/CreateMap';
import CreateMarker from './components/CreateMarker';
import MarkerModal from './components/MarkerModal';
import Signup from './components/Signup';
import Login from './components/Login';
import UserProvider from './contexts/UserContext';
import './bootstrap.min.css'; 
import './index.css';

function App() {
  return (
    <div className="App">
      <UserProvider>
        <Router>
          <Route path="/home" component={Home}/>
          <Route path="/map/:mapID" component={Map}/>
          <PrivateRoute path="/create/map" component={CreateMap}/>
          <PrivateRoute path="/create/marker" component={CreateMarker}/>
          <UnPrivateRoute path="/signup" component={Signup}/>
          <UnPrivateRoute path="/login" component={Login}/>
        </Router>
      </UserProvider>
    </div>
  );
}

export default App;
