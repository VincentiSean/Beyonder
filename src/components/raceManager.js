import React, { useState, useEffect } from 'react';
import { fire, db } from '../config/Fire';
import ASIChoice from './asiChooser';
import { Link } from 'react-router-dom';
import { 
    Checkbox,
    ListItemText,
    MenuItem,
    Input,
    Button,
    InputLabel,
    FormControl,
    Select,
    NativeSelect
} from '@material-ui/core';

function RaceManager(props) {

    const [charRace, setCharRace] = useState("");
    const [userChar, setUserChar] = useState([]);
    const [raceSkelly, setRaceSkelly] = useState();
    const [needRaceSkelly, setNeedRaceSkelly] = useState(true);
    const [checkSubrace, setCheckSubrace] = useState(true);
    const [hasSubraces, setHasSubraces] = useState(false);
    const [subraceSelected, setSubraceSelected] = useState();
    const [subrace, setSubrace] = useState([]);
    const [subraceSelector, setSubraceSelector] = useState();
    const [subraceBool, setSubraceBool] = useState(false);
    const [baseTraits, setBaseTraits] = useState([]);
    const [baseTraitNames, setBaseTraitNames] = useState([]);
    const [subTraits, setSubTraits] = useState([]);

    useEffect(() => {
        if (props.location !== undefined) {
            setCharRace(props.location.state.raceSelected);
            setUserChar(props.location.state.userChar);

            // Get the information for the selected race and store in state
            if (needRaceSkelly) {
                getRaceDetails(props.location.state.raceSelected);
            }

            // Check to see if the race has a subrace
            if (checkSubrace) {
                if (raceSkelly) {
                    getSubraceInfo();
                }
            }

            handleApplyRace();
        }

    }, [props.time, props.location.state, charRace, hasSubraces, subrace, subraceBool, checkSubrace, baseTraits.length])

    // Request information about the chosen race to get information to display/prompt user
    function getRaceDetails(raceName) {
        setNeedRaceSkelly(false);   // Prevents subsequent calls

        // Look through the racial stat information and find the correct one --> add to allRaceInfo
        // Skip any race in the 'DMG'
        db.ref(`races/race`).on("value", snapshot => {   
            snapshot.forEach(snap => {
                if (snap.val().name === raceName) {
                    if (snap.val().source !== "DMG") {
                        setRaceSkelly(snap.val());
                        getBaseTraits(snap.val());
                    }
                }
            });
        });
    }

    function getBaseTraits(race) {
        let traitArray = [];
        let traitNameArr = [];
        let trait;

        race.entries.map((entry, index) => {
            let traitName = entry.name;
            traitNameArr.push(traitName);

            if (entry.constructor === Object) {
                trait = (<div className="toggle-sm-details-text">
                            <h3 className="ability-header">{entry.name}</h3>
                            {entry.entries.map(subentry => {
                                if (subentry.constructor === Object) {
                                } else {
                                    return (<p className="ability-description">{subentry}</p>);
                                }
                            })}
                        </div>
                    )         
            } else {
                trait = (<div key={index} className="toggle-sm-details-text">
                            <h3 className="ability-header">{entry.name}</h3>
                            <p className="ability-description">{entry.entries}</p>
                        </div>)
            }

            traitArray.push(trait);
        })

        setBaseTraitNames(traitNameArr);
        setBaseTraits(traitArray);
    }

    function getSubTraits(race) {
        let subTraitArr = [];
        let trait;

        if (race.entries.length > 0) { 
            race.entries.map((entry, index) => {
                if (entry.constructor === Object) {
                    trait = (<div className="toggle-sm-details-text">
                                <h3 className="ability-header">{entry.name}</h3>
                                {entry.entries.map(subentry => {
                                    if (subentry.constructor === Object) {
                                        console.log("CRAP!");
                                    } else {
                                        return (<p className="ability-description">{subentry}</p>);
                                    }
                                })}
                        </div>);

                    baseTraitNames.forEach(trait => {
                        if (trait === entry.name) {
                            const indexNum = baseTraitNames.indexOf(trait);
                            const baseTraitNamesCopy = baseTraitNames;
                            const baseTraitsCopy = baseTraits;

                            baseTraitsCopy.splice(indexNum, 1);
                            baseTraitNamesCopy.splice(indexNum, 1);

                            setBaseTraitNames(baseTraitNamesCopy);
                            setBaseTraits(baseTraitsCopy);
                        }
                    })

                } else {
                    trait = (<div key={index} className="toggle-sm-details-text">
                                <h3 className="ability-header">{entry.name}</h3>
                                <p className="ability-description">{entry.entries}</p>
                            </div>)
                }

                subTraitArr.push(trait);
            })

            setSubTraits(subTraitArr);
        }
    }


    // Check the race for the subrace value and if there, create a prompt for the user to select which one they want
    function getSubraceInfo() {
        setCheckSubrace(false);     // Prevents subsequent calls

        if (raceSkelly.subraces) {
            setHasSubraces(true);

            let subraceList = [];
            raceSkelly.subraces.forEach(subrace => {
                if (subrace.source) {
                    if (!subrace.source.includes("UA")) {
                        if (!subrace.source.includes("DMG")) {
                            if (!subrace.source.includes("PS")) {
                                if (!subrace.source.includes("MTF")) {
                                    console.log(subrace.name);
                                    subraceList.push(subrace);
                                }
                            }
                        }
                    }
                } else {
                    subraceList.push(subrace);
                }
                
            })

            let subraceSelector = (<FormControl className="form-control">
                                    <InputLabel id="demo-simple-select-label">
                                        Subrace
                                    </InputLabel>
                                    <Select
                                        labelID="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={subraceSelected}
                                        onChange={handleSubraceSelect}
                                    >
                                        {subraceList.map((subrace, index) => (
                                            <MenuItem key={index} value={subrace.name}>
                                                <ListItemText primary={subrace.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
            );

            setSubraceSelector(subraceSelector);
        }
    }

    function handleApplyRace() {
        // If we already checked for a subrace option and one was not found
        //   --> apply abilities to userChar
        if (!checkSubrace) {
            if (!subraceBool) {
                console.log(getRaceAbilities(raceSkelly));
            }
        }
    }

    function getRaceAbilities(race) {
        if (race !== undefined) {
            let traitArr = [];
            let abilityKeys = [];
            let abilityValues = [];

            if (race.ability[0].constructor === Object) {
                abilityKeys = Object.keys(race.ability[0]);
                abilityValues = Object.values(race.ability[0]);

                for (let i in abilityKeys) {
                    if (abilityKeys[i].includes("choose")) {
                        let traitStr = "+1 to " + abilityValues[i].count + " other Ability Scores";
                        traitArr.push(traitStr);
                    } else {
                        let traitStr = "+" + abilityValues[i] + " " + abilityKeys[i];
                        traitArr.push(traitStr);
                    }
                }
            }

            return(traitArr);
        }
    }

    const handleSubraceSelect = (event) => {
        const selectedName = event.target.value;
        setSubraceSelected(selectedName);
        setSubraceBool(true);

        raceSkelly.subraces.forEach(subrace => {
            if (subrace.source) {
                if (!subrace.source.includes("UA")) {
                    if (!subrace.source.includes("DMG")) {
                        if (!subrace.source.includes("PS")) {
                            if (!subrace.source.includes("MTF")) {
                                if (subrace.name === selectedName) {
                                    setSubrace(subrace);
                                    getSubTraits(subrace);
                                }
                            }
                        }
                    }
                }
            } else {
                if (subrace.name === selectedName) {
                    setSubrace(subrace);
                }
            }
        })
    }


    
    // console.log(userChar);
    console.log(baseTraits.length);
    console.log(baseTraitNames);
    return (
        <>
        {raceSkelly 
            ?   <>
                    <div className="class-manager">
                    <Button 
                        // onClick={}
                        component={Link}
                        to={{
                            pathname: '',
                            state: { }
                        }}>
                            Choose Race
                    </Button>
                        <h2 className="class-maanger-header">{charRace}</h2>
                        {subraceSelector}
                        {baseTraits.length > 0 && baseTraits}
                        {subraceBool
                            ?   subTraits
                            // ?   (subrace.entries 

                            //         ?    (subrace.entries.map((entry, index) => {
                            //                 if (entry.constructor === Object) {
                                                
                            //                     return (
                            //                         <div className="toggle-sm-details-text">
                            //                             <h3 className="ability-header">{entry.name}</h3>
                            //                             {entry.entries.map(subentry => {
                            //                                 if (subentry.constructor === Object) {

                            //                                 } else {
                            //                                     return (<p className="ability-description">{subentry}</p>);
                            //                                 }
                            //                             })}
                            //                         </div>
                            //                     )
                                                
                            //                 } else {
                            //                     return (<div key={index} className="toggle-sm-details-text">
                            //                                 <h3 className="ability-header">{entry.name}</h3>
                            //                                 <p className="ability-description">{entry.entries}</p>
                            //                             </div>)
                            //                 }
                            //             }))
                            //         : <></>
                                // )
                            :   <></>
                        }
                    </div>
                </>
            : <></>
        }
        </>
    )

} export default RaceManager