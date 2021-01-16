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
import RaceDescriptor from './raceDescriptor';

function RaceChoice(props) {
    const [user, setUser] = useState(props.user);
    const [charRace, setCharRace] = useState("");
    const [classDetails, setClassDetails] = useState(false);

    useEffect(() => {

        if (!classDetails) {
            getClassDetails();
        }
    }, [user])

    function getClassDetails() {
        setUser(props.location.state);
        setClassDetails(true);
    }

    const handleRaceChange = (event) => {
        setCharRace(event.target.value);
    }

    console.log(user);
    return (
        <>
            <div>
                <h3>Choose a Race</h3>
                <FormControl className={"form-control"}>
                    <InputLabel htmlFor="class-native-simple">Race</InputLabel>
                    <Select 
                        native
                        value={charRace}
                        onChange={handleRaceChange}
                        inputProps = {{
                            name: 'race',
                            id: 'class-native-simple',
                        }}
                    >
                        <option aria-label="None" value="" />
                        <option value={'Aarakocra'}>Aarakocra</option>
                        <option value={'Aasimar'}>Aasimar</option>
                        <option value={'Dragonborn'}>Dragonborn</option>
                        <option value={'Dwarf'}>Dwarf</option>
                        <option value={'Elf'}>Elf</option>
                        <option value={'Genasi'}>Genasi</option>
                        <option value={'Gnome'}>Gnome</option>
                        <option value={'Goliath'}>Goliath</option>
                        <option value={'Half-Elf'}>Half-Elf</option>
                        <option value={'Half-Orc'}>Half-Orc</option>
                        <option value={'Halfling'}>Halfling</option>
                        <option value={'Human'}>Human</option>
                        <option value={'Tiefling'}>Tiefling</option>
                        <option value={''}></option>
                    </Select>
                    <Button 
                        component={Link}
                        to={{
                            pathname: '/race/manager',
                            state: { userChar: user, raceSelected: charRace }
                        }}>
                            Select Race
                    </Button>
                </FormControl>
            </div>
            <div className="class-descript-container">
                <RaceDescriptor descName={'Aarakocra'} />
                <RaceDescriptor descName={'Aasimar'} />
                <RaceDescriptor descName={'Dragonborn'} />
                <RaceDescriptor descName={'Dwarf'} />
                <RaceDescriptor descName={'Elf'} />
                <RaceDescriptor descName={'Genasi'} />
                <RaceDescriptor descName={'Gnome'} />
                <RaceDescriptor descName={'Goliath'} />
                <RaceDescriptor descName={'Half-Elf'} />
                <RaceDescriptor descName={'Half-Orc'} />
                <RaceDescriptor descName={'Halfling'} />
                <RaceDescriptor descName={'Human'} />
                <RaceDescriptor descName={'Tiefling'} />
                <RaceDescriptor descName={''} />
            </div>
        </>
    )

} export default RaceChoice