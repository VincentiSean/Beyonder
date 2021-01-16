import React, { useState, useEffect } from 'react';
import { fire, db } from '../config/Fire';
import { 
    ListItemText,
    MenuItem,
    FormControl,
    Select
} from '@material-ui/core';


function FeatAbilitySelector(props) {
    
    const [statChosen, setStatChosen] = useState();
    const [statsToChoose, setStatsToChoose] = useState([]);
    
    useEffect(() => {
        getStats();
    }, [statChosen, props.stats])

    const handleFeatAbility = (event) => {
        setStatChosen(event.target.value);
        props.chosenAbility(event.target.value);
    }

    const getStats = () => {
        setStatsToChoose(props.stats);
    }

    return (
        <>
            {statsToChoose.length > 0
                ?   (<FormControl className="form-control">
                        <Select
                            labelID="demo-simple-select-label"
                            id="demo-simple-select"
                            value={statChosen}
                            onChange={handleFeatAbility}
                        >
                            {statsToChoose.map((stat, index) => (
                                <MenuItem key={index} value={stat}>
                                    <ListItemText primary={stat} />
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>)
                :   <></>
            }
        </>
    )

} export default FeatAbilitySelector
