import React, { useState, useEffect } from 'react';
import { fire, db } from '../config/Fire';
import { 
    ListItemText,
    MenuItem,
    FormControl,
    Select
} from '@material-ui/core';

import FeatAbilitySelector from './featAbilitySelector';

function ASIChoice(props) {
    
    // const [charClass, setCharClass] = useState("");
    const [levelUpChoice, setLevelUpChoice] = useState([]);
    const [abilityToggle, setAbilityToggle] = useState(false);
    const [featToggle, setFeatToggle] = useState(false);
    const [abilityOneChoice, setAbilityOne] = useState();
    const [abilityTwoChoice, setAbilityTwo] = useState();
    const [featsFound, setFeatsFound] = useState(false);
    const [featList, setFeatList] = useState([]);
    const [featSelected, setFeatSelected] = useState();
    const [featEntries, setFeatEntries] = useState([]);
    const [featPreReq, setFeatPreReq] = useState([]);
    const [featSpells, setFeatSpells] = useState([]);
    const [featAbility, setFeatAbility] = useState([]);
    const [featHTML, setFeatHTML] = useState([]);
    const [featAbilityChooser, setFeatAbilityChooser] = useState();
    const [featAbilityChoice, setFeatAbilityChoice] = useState();

    useEffect(() => {
        if (!featsFound) {
            fetchFeats();
        }

        featDisplay();

    }, [levelUpChoice, featSelected, featEntries])

    const handleASIChange = (event) => {
        let choice = event.target.value;

        if (choice === "scoreImprove") {
            setLevelUpChoice("Ability Score Improvement");
            setAbilityToggle(true);
            setFeatToggle(false);
            setFeatSelected(null);
            setFeatEntries([]);
            setFeatPreReq([]);
            setFeatSpells([]);
            setFeatAbility([]);
        } else if (choice === "featImprove") {
            setLevelUpChoice("Feat");
            setAbilityToggle(false);
            setFeatToggle(true);
            setAbilityOne();
            setAbilityTwo();
        } else if (choice === 0) {
            setLevelUpChoice("- Choose an Option -");
            setAbilityToggle(false);
            setFeatToggle(false);
            setAbilityOne();
            setAbilityTwo();
            setFeatSelected(null);
            setFeatEntries([]);
            setFeatPreReq([]);
            setFeatSpells([]);
            setFeatAbility([]);
        }
    }

    const handleAbilityChange = (event) => {
        let currChangeArray = event.target.value.split(";");

        if (currChangeArray[1] === "1") {
            props.abilityChoiceOne(props.level + ":" + currChangeArray[0])
        } else if (currChangeArray[1] === "2") {
            props.abilityChoiceTwo(props.level + ":" + currChangeArray[0])
        }
    }

    const handleFeatAbilityChange = (event) => {
        setFeatAbilityChoice(event);
        props.featAbilityChoice(props.level + ":" + event);
    }

    const handleFeatChange = (event) => {
        const featName = event.target.value;

        featList.forEach(feat => {
            if (feat.name === featName) {
                setFeatSelected(featName);
                setFeatEntries(feat.entries);

                if (feat.prerequisite) {
                    setFeatPreReq(feat.prerequisite);
                } else {
                    setFeatPreReq([]);
                }

                if (feat.additionalSpells) {
                    setFeatSpells(feat.additionalSpells);
                } else {
                    setFeatSpells([]);
                }

                if (feat.ability) {
                    if (feat.ability[0].choose) {
                        const featAbilityStats = [];
                        feat.ability[0].choose.from.forEach(stat => {
                            featAbilityStats.push(stat);
                        });
                        const featAbilityChooser = (
                            <FeatAbilitySelector level={props.level} chosenAbility={handleFeatAbilityChange} stats={featAbilityStats} />
                        );
                        setFeatAbilityChooser(featAbilityChooser);
                    } else {
                        setFeatAbilityChoice(props.level + ":" + String(Object.keys(feat.ability[0])));
                        setFeatAbilityChooser([]);
                        props.featAbilityChoice(props.level + ":" + String(Object.keys(feat.ability[0])));
                    }
                } else {
                    setFeatAbilityChoice();
                    setFeatAbilityChooser([]);
                    props.featAbilityChoice();
                }   
            }
        });

        props.featChoice(props.level + ":" + event.target.value);
    }
    
    const featDisplay = () => {
        let featDisplayVar = [];
        
        featDisplayVar.push(<h3>{featSelected}</h3>);
        

        let prereqArray = [];

        if (featPreReq.length > 0) {
            if (featPreReq[0].constructor === Object) {
                if (featPreReq[0].race) {
                    let prereq = (
                        featPreReq[0].race.map((req, index) => {
                        if (req.subrace) {
                            return(<p className="ability-description">Prerequisites: {req.subrace + " " + req.name}</p>);
                        } else {
                            return(<p className="ability-description">Prerequisites: {req.name}</p>);
                        }
                    }));
                    prereqArray.push(prereq);
                } else if (featPreReq[0].ability) {
                    let prereq = (
                        featPreReq[0].ability.map((req, index) => {
                            return(<p className="ability-description">Prerequisites: {Object.keys(req) + " " + req[Object.keys(req)]}</p>);
                        })
                    );
                    prereqArray.push(prereq);
                } else if (featPreReq[0].other) {
                    prereqArray.push(<p className="ability-description">Prerequisites: {featPreReq[0].other}</p>);
                } else if (featPreReq[0].proficiency) {
                    let prereq = (
                        featPreReq[0].proficiency.map((req, index) => {
                            return(<p className="ability-description">Prerequisites: {req[Object.keys(req)] + " " + Object.keys(req)}</p>);
                        })
                    );
                    prereqArray.push(prereq);
                } else if (featPreReq[0].spellcasting) {
                    prereqArray.push(<p className="ability-description">Prerequisites: The ability to cast at least one spell</p>);
                }
            }
        }
        featDisplayVar.push(prereqArray);

        featEntries.map((entry, index) => {
                if (entry.constructor === Object) {
                    let subEntryArray = [];
                    for(const key in entry.items) {
                        let entryStr = entry.items[key].replaceAll(/[{@}]/g, "");
                        featDisplayVar.push(<li>{entryStr}</li>);
                    }
                    return (subEntryArray)
                } else {
                    featDisplayVar.push(<p key={index} className="ability-description">{entry}</p>)
                }
            })
        setFeatHTML(featDisplayVar);
    }

    function fetchFeats() {
        const featArray = [];

        db.ref('feats/feat').on("value", snapshot => {
            snapshot.val().forEach(snap => {
                if (!snap.source.includes("UA")) {
                    featArray.push(snap);
                }
            })
        });

        setFeatList(featArray);
        setFeatsFound(true);
    }

    return (
        <>
            <FormControl className="form-control">
                <Select
                    labelID="demo-simple-select-label"
                    id="demo-simple-select"
                    value={levelUpChoice}
                    onChange={handleASIChange}
                >
                    <MenuItem value={0}>
                        <ListItemText primary="- Choose an Option -" />
                    </MenuItem>
                    <MenuItem value="scoreImprove">
                        <ListItemText primary="Ability Score Improvement" />
                    </MenuItem>
                    <MenuItem value="featImprove">
                        <ListItemText primary="Feat" />
                    </MenuItem>
                </Select>
            </FormControl>
            {abilityToggle
                ?   (<>
                        <FormControl className="form-control">
                            <Select
                                labelID="demo-simple-select-label"
                                id="demo-simple-select"
                                value={abilityOneChoice}
                                onChange={handleAbilityChange}
                            >
                                <MenuItem value={0}>
                                    <ListItemText primary="- Choose an Ability Score -" />
                                </MenuItem>
                                <MenuItem value="strength;1">
                                    <ListItemText primary="Strength Score" />
                                </MenuItem>
                                <MenuItem value="dexterity;1">
                                    <ListItemText primary="Dexterity Score" />
                                </MenuItem>
                                <MenuItem value="constitution;1">
                                    <ListItemText primary="Constitution Score" />
                                </MenuItem>
                                <MenuItem value="intelligence;1">
                                    <ListItemText primary="Intelligence Score" />
                                </MenuItem>
                                <MenuItem value="wisdom;1">
                                    <ListItemText primary="Wisdom Score" />
                                </MenuItem>
                                <MenuItem value="charisma;1">
                                    <ListItemText primary="Charisma Score" />
                                </MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl className="form-control">
                            <Select
                                labelID="demo-simple-select-label"
                                id="demo-simple-select"
                                value={abilityTwoChoice}
                                onChange={handleAbilityChange}
                            >
                                <MenuItem value={0}>
                                    <ListItemText primary="- Choose an Ability Score -" />
                                </MenuItem>
                                <MenuItem value="strength;2">
                                    <ListItemText primary="Strength Score" />
                                </MenuItem>
                                <MenuItem value="dexterity;2">
                                    <ListItemText primary="Dexterity Score" />
                                </MenuItem>
                                <MenuItem value="constitution;2">
                                    <ListItemText primary="Constitution Score" />
                                </MenuItem>
                                <MenuItem value="intelligence;2">
                                    <ListItemText primary="Intelligence Score" />
                                </MenuItem>
                                <MenuItem value="wisdom;2">
                                    <ListItemText primary="Wisdom Score" />
                                </MenuItem>
                                <MenuItem value="charisma;2">
                                    <ListItemText primary="Charisma Score" />
                                </MenuItem>
                            </Select>
                        </FormControl>
                    </>)
                :   <></>
            }
            {featToggle
                ?   (featList.length > 0
                        ?   (<>
                                <FormControl className="form-control">
                                    <Select
                                        labelID="demo-simple-select-label"
                                        id="demo-simple-select"
                                        value={abilityTwoChoice}
                                        onChange={handleFeatChange}
                                    >
                                        <MenuItem value={0}>
                                            <ListItemText primary="- Choose a Feat -" />
                                        </MenuItem>
                                        {featList.map((feat, index) => (
                                            <MenuItem value={feat.name}>
                                                <ListItemText primary={feat.name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                                {featSelected
                                    ?   (featHTML)
                                    :   <></>
                                }
                                {featAbilityChooser}
                            </>)
                        :   <></>)
                :   <></>
            }
        </>
    )

} export default ASIChoice