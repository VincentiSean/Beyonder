import React, { useState, useEffect } from 'react';
import { fire, db } from '../config/Fire';

import {
    BrowserRouter as Router,
    Switch,
    Route
} from 'react-router-dom';

import CharSelect from './charSelect';
import ClassChoice from './classChoice';
import ClassManager from './classManager';
import RaceChoice from './raceChoice';
import RaceManager from './raceManager';

function Home(props) {
    const [user, setUser] = useState(props.user);

    useEffect(() => {
        setUser(props.user);
    }, [])

    return (
        <Router>
            
            <Switch>
                <Route exact path="/">
                    <CharSelect user={user} />
                </Route>
                <Route exact path="/class">
                    <ClassChoice user={user} />
                </Route>
                <Route 
                    exact path="/class/manager" 
                    render={props => (
                        <ClassManager {...props} time={new Date().toLocaleString()}/>
                    )}>
                </Route>
                <Route
                    exact path="/race"
                    render={props => (
                        <RaceChoice {...props} />
                    )}
                >
                </Route>
                <Route 
                    exact path="/race/manager" 
                    render={props => (
                        <RaceManager {...props} time={new Date().toLocaleString()}/>
                    )}>
                </Route>
            </Switch>
        </Router>
    )

} export default Home