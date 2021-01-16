import React, { useState, useEffect } from 'react';
import fire, { db } from '../config/Fire';

import { Link } from 'react-router-dom';
import { Button } from '@material-ui/core';

function CharSelect(props) {
    const [user, setUser] = useState("");
    const [userFound, setUserFound] = useState(true);
    const [hasChars, setHasChars] = useState(false);

    useEffect(() => {
        getUser(props.user);
    }, []);

    function getUser(userid) {
        
    }
    
    let username = props.user
        ?   (<h2>Welcome {props.user.email}!</h2>)
        :   (<></>)

    function logout() {
        fire.auth().signOut().then(function() {
            }, function(error) {
                console.error('Sign Out Error', error);
            });
    }


    console.log(props);
    return (
        <>
            <div>
                {username}
                <Button onClick={() => logout()}>Logout</Button>
                <Button component={Link} to={'/class'}>Create A Character</Button>
            </div>
        </>
    )

} export default CharSelect