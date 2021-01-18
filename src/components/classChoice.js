import React, { useState, useEffect } from 'react';
import { fire, db } from '../config/Fire';
import { Link } from 'react-router-dom';
import { 
    Button,
    InputLabel,
    FormControl,
    Select,
    NativeSelect
} from '@material-ui/core';

import ClassDescriptor from './classDescriptor';

function ClassChoice(props) {
    
    const [charClass, setCharClass] = useState("");
    const [userChar, setUserChar] = useState([]);


    // Change the class selected and send to userChar, keeping anything else in userChar
    const handleClassChange = (event) => {
        setCharClass(event.target.value);
        const { name, value } = event.target;
        setUserChar(prevState => ({
            ...prevState,
            [name]: value
        }));
    }

    return (
        <>
            <div>
                <h3>Choose a Class</h3>
                <FormControl className={"form-control"}>
                    <InputLabel htmlFor="class-native-simple">Class</InputLabel>
                    <Select 
                        native
                        value={charClass}
                        onChange={handleClassChange}
                        inputProps = {{
                            name: 'class',
                            id: 'class-native-simple',
                        }}
                    >
                        <option aria-label="None" value="" />
                        <option value={'Artificer'}>Artificer</option>
                        <option value={'Barbarian'}>Barbarian</option>
                        <option value={'Bard'}>Bard</option>
                        <option value={'Cleric'}>Cleric</option>
                        <option value={'Druid'}>Druid</option>
                        <option value={'Fighter'}>Fighter</option>
                        <option value={'Monk'}>Monk</option>
                        <option value={'Paladin'}>Paladin</option>
                        <option value={'Ranger'}>Ranger</option>
                        <option value={'Rogue'}>Rogue</option>
                        <option value={'Sorcerer'}>Sorcerer</option>
                        <option value={'Warlock'}>Warlock</option>
                        <option value={'Wizard'}>Wizard</option>
                    </Select>
                    <Button 
                        component={Link}
                        to={{
                            pathname: '/class/manager',
                            state: { classSelected: charClass, userChar: userChar }
                        }}>
                            Select Class
                    </Button>
                </FormControl>
            </div>
            <div className="class-descript-container">
                <ClassDescriptor descName={'Artificer'} />
                <ClassDescriptor descName={'Barbarian'} />
                <ClassDescriptor descName={'Bard'} />
                <ClassDescriptor descName={'Cleric'} />
                <ClassDescriptor descName={'Druid'} />
                <ClassDescriptor descName={'Fighter'} />
                <ClassDescriptor descName={'Monk'} />
                <ClassDescriptor descName={'Paladin'} />
                <ClassDescriptor descName={'Ranger'} />
                <ClassDescriptor descName={'Rogue'} />
                <ClassDescriptor descName={'Sorcerer'} />
                <ClassDescriptor descName={'Warlock'} />
                <ClassDescriptor descName={'Wizard'} />
            </div>
        </>
    )

} export default ClassChoice