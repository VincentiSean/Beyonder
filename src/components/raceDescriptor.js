import React, { useState, useEffect } from 'react';
import { fire, db } from '../config/Fire';


function RaceDescriptor(props) {

    const [divToggled, setDivToggled] = useState(false);
    const [currRace, setCurrRace] = useState();
    const [currFluff, setCurrFluff] = useState();
    const [firstLoad, setFirstLoad] = useState(true);
    const [needString, setNeedString] = useState(false);
    const [traitArray, setTraitArray] = useState([]);

    useEffect(() => {
        if (firstLoad) {
            getRaceInfo(props.descName);
        }


        if (needString) { 
            if (currRace !== undefined) {
                buildTraitString();
            }
        }

    }, [currRace])
    
    function getRaceInfo(raceName) {
        

        // Look through the racial stat information and find the correct one 
        // Skip any race in the 'DMG'
        db.ref(`races/race`).on("value", snapshot => {   
            snapshot.forEach(snap => {
                if (snap.val().name === raceName) {
                    if (snap.val().source !== "DMG") {
                        setCurrRace(snap.val());
                    }
                }
            });
        });


        // Look through the racial fluff information and find the correct one 
        // Skip any race in the 'DMG'
        db.ref(`races/raceFluff`).on("value", snapshot => {   
            snapshot.forEach(snap => {
                if (snap.val().name === raceName) {
                    if (snap.val().source !== "DMG") {
                        setCurrFluff(snap.val());
                    }
                }
            });
        });
        setFirstLoad(false);    // Prevent doing this function again
        setNeedString(true);    // Tell useEffect to build the trait string
    }

    function buildTraitString() {
        let traitArr = [];
        let abilityKeys = [];
        let abilityValues = [];

        if (currRace.name === "Human") {
            traitArr.push("+1 to All Ability Scores");            
            // if (currRace.subraces[0].ability[0].constructor === Object) {
            //     abilityKeys = Object.keys(currRace.subraces[0].ability[0]);
            //     abilityValues = Object.values(currRace.subraces[0].ability[0]);


                // for (let i in abilityKeys) {
                //     if (abilityKeys[i].includes("choose")) {
                //         let traitStr = "+1 to " + abilityValues[i].count + " other Ability Scores";
                //         console.log(traitStr); 
                //     } else {
                //         let traitStr = "+" + abilityValues[i] + " " + abilityKeys[i];
                //         console.log(traitStr);
                //     }
                // }
            // }
        } else if (currRace.ability[0].constructor === Object) {
            abilityKeys = Object.keys(currRace.ability[0]);
            abilityValues = Object.values(currRace.ability[0]);

            for (let i in abilityKeys) {
                if (abilityKeys[i].includes("choose")) {
                    let traitStr = "+1 to " + abilityValues[i].count + " other Ability Scores";
                    traitArr.push(traitStr);
                    // console.log(traitStr); 
                } else {
                    let traitStr = "+" + abilityValues[i] + " " + abilityKeys[i];
                    traitArr.push(traitStr);
                    // console.log(traitStr);
                }
            }
        }

        setTraitArray(traitArr);
    }

    const handleToggle = () => setDivToggled(!divToggled);

    const informationDiv = divToggled
        ? (<div>
                <h2 className="toggle-header">{currRace.name}</h2>
                <p className="toggle-description">{currFluff.entries[0].entries[0].entries[0]}</p> 
                <div className="toggle-sm-details-div">
                    <p className="toggle-sm-details-text"> 
                        <span className="toggle-sm-details-bold">Racial Traits: </span>
                        {traitArray.join(", ")}
                    </p>
                </div>
                {currRace.entries.map((entry, index) => {
                    if (entry.constructor === Object) {
                        return (
                            <div className="toggle-sm-details-text">
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
                        return (<div key={index} className="toggle-sm-details-text">
                                    <h3 className="ability-header">{entry.name}</h3>
                                    <p className="ability-description">{entry.entries}</p>
                                </div>)
                    }
                })}
            </div>)
        : <></>



    /* function displayFeature(feature, index) {
        let renderFeat = false;
        let featureInfo = (<></>);

        if (feature.source !== "UAClassFeatureVariants") {
            renderFeat = true;
        }

        if (renderFeat) {
            return (<div className="class-ability" key={index}>
                                <h3 className="ability-header">{feature.name}</h3>
                                <p className="ability-level">{feature.level}</p>
                                {feature.entries.map((entry, index) => {
                                    <p className="ability-description">{entry}</p>
                                })}
                            </div>)
        } else {
            return <p>cat</p>
        }
    } */

    // console.log(currRace);
    return (
        <>
            <div onClick={handleToggle}>
                <h3>{props.descName}</h3>
                {currRace
                    ?   informationDiv
                    :   <></>
                }
            </div>
        </>
    )

} export default RaceDescriptor