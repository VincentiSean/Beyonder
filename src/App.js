import './App.css';
import fire from './config/Fire';
import React, { useState, useEffect } from 'react';

import Login from './components/login';
import Home from './components/home';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  let screen = loggedIn
    ? (<Home user={user} />)
    : (<Login />);

  useEffect(() => {
    authListener();
  }, []); 

  function authListener() {
    fire.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
        setUser(user);
      } else {
        setLoggedIn(false);
        setUser(null);
      }
    })
  }

  return (
    <div className="App">
      {screen}
    </div>
  );
}

export default App;
