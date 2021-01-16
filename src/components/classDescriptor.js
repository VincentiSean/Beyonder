import React, { useState, useEffect } from 'react';
import { fire, db } from '../config/Fire';


function ClassDescriptor(props) {

    const [divToggled, setDivToggled] = useState(false);
    const [currClass, setCurrClass] = useState();
    const [classNum, setClassNum] = useState(0);

    const handleToggle = () => setDivToggled(!divToggled);

    const informationDiv = divToggled
        ? (<div>
                
                <h2 className="toggle-header">{currClass.class[0].name}</h2>
                <p className="toggle-description">{currClass.class[classNum].fluff.entries[0]}</p> 
                <div className="toggle-sm-details-div">
                    <p className="toggle-sm-details-text"> 
                        <span className="toggle-sm-details-bold">Hit Die: </span>
                        d{currClass.class[0].hd.faces}
                    </p>
                    <p className="toggle-sm-details-text"> 
                        <span className="toggle-sm-details-bold">Primary Ability: </span>
                        {currClass.class[0].proficiency.fullNames[0]}
                    </p>
                    <p className="toggle-sm-details-text"> 
                        <span className="toggle-sm-details-bold">Saves: </span>
                        {currClass.class[0].proficiency.fullNames[0]}, {currClass.class[0].proficiency.fullNames[1]}
                    </p>
                </div>
                <div className="class-abilities">
                    {currClass.classFeature.map((feature, index) => {
                        {if (feature.source !== "UAClassFeatureVariants") {
                            if (!feature.isClassFeatureVariant) {
                                if (feature.name !== "Ability Score Improvement") {
                                    if(!feature.name.toLowerCase().includes("feature")) {
                                        return (<div className="class-ability" key={index}>
                                                    <h3 className="ability-header">{feature.name}</h3>
                                                    <p className="ability-level">{feature.level}</p>
                                                    {feature.entries.map((entry, index) => {
                                                        
                                                        if (entry.constructor === Object) {
                                                            let subEntryArray = [];
                                                            for(const key in entry.items) {
                                                                let entryStr = entry.items[key].replaceAll(/[{@}]/g, "");
                                                                subEntryArray.push(<li>{entryStr}</li>);
                                                            }
                                                            return (subEntryArray)
                                                        }
                                                        else {
                                                            // Try to replace all the noise in the JSON...
                                                            // This is cursed ----v
                                                            let entryStr = entry.replaceAll("@book", "");
                                                            entryStr = entryStr.replaceAll("@filter", "");
                                                            entryStr = entryStr.replaceAll("@condition", "");
                                                            entryStr = entryStr.replaceAll("@action", "");
                                                            entryStr = entryStr.replaceAll("@dice", "");
                                                            entryStr = entryStr.replaceAll(/[\|*$]/g, " ");
                                                            entryStr = entryStr.replaceAll("spells class", "");
                                                            entryStr = entryStr.replaceAll(/=.*}/g, ".");
                                                            // entryStr = entryStr.replaceAll(/[\d\d]}/g, "");      // Tried to get rid of the extra numbers after chapter, maybe revisit later
                                                            entryStr = entryStr.replaceAll(/[{}]/g, "");
                                                            entryStr = entryStr.replaceAll("..", ".");
                                                            entryStr = entryStr.replaceAll(" .", ".");

                                                            return (<p key={index} className="ability-description">{entryStr}</p>)
                                                        }
                                                    })}
                                                </div>)
                                    }
                                }
                            }
                        }}
                    })}
                </div>
                <div className="class-proficiencies">
                    <h3 className="ability-header">Proficiencies</h3>
                    <p className="ability-level">1st level</p>
                    {currClass.class[classNum].startingProficiencies.armor 
                        ?   (<p className="toggle-sm-details-text">
                                <span className="toggle-sm-details-bold">Armor: </span>
                                {currClass.class[classNum].startingProficiencies.armor.join(", ").replaceAll(/\|.*\}|\{@/g, "")}
                            </p>)
                        :   <></>
                    }
                    {currClass.class[classNum].startingProficiencies.weapons 
                        ?   (<p className="toggle-sm-details-text">
                                <span className="toggle-sm-details-bold">Weapons: </span>
                                {currClass.class[classNum].startingProficiencies.weapons.join(", ").replaceAll(/\|.*\}|\{@/g, "")}
                            </p>)
                        :   <></>
                    }
                    {currClass.class[classNum].startingProficiencies.tools 
                        ?   (<p className="toggle-sm-details-text">
                                <span className="toggle-sm-details-bold">Tools: </span>
                                {currClass.class[classNum].startingProficiencies.tools.join(", ").replaceAll(/\|PHB}|\{@item|musical instrument\|PHB\||\}/g, "")}
                            </p>)
                        :   <></>
                    }
                    <p className="toggle-sm-details-text"> 
                        <span className="toggle-sm-details-bold">Saving Throws: </span>
                        {currClass.class[classNum].proficiency.fullNames[0]}, {currClass.class[classNum].proficiency.fullNames[1]}
                    </p>
                    <p className="toggle-sm-details-text">
                        <span className="toggle-sm-details-bold">Skills: </span>
                        Choose {currClass.class[classNum].startingProficiencies.skills[0].choose.count} from {currClass.class[classNum].startingProficiencies.skills[0].choose.from.join(", ").replaceAll(/\|.*\}|\{@/g, "")}
                    </p>
                </div>
                <div className="class-hitpoints">
                    <h3 className="ability-header">Hit Points</h3>
                    <p className="ability-level">1st level</p>
                    <p className="toggle-sm-details-text">
                        <span className="toggle-sm-details-bold">Hit Dice: </span>
                        d{currClass.class[classNum].hd.faces}
                    </p>
                    <p className="toggle-sm-details-text">
                        <span className="toggle-sm-details-bold">Hit Points at 1st Level: </span>
                        {currClass.class[classNum].hd.faces} + your Constitution modifer
                    </p>
                    <p className="toggle-sm-details-text">
                        <span className="toggle-sm-details-bold">Hit Points at Higher Levels: </span>
                        1d{currClass.class[classNum].hd.faces} + your Constitution modifer per {currClass.class[classNum].name} level after 1st
                    </p>
                </div>
            </div>)
        : <></>

    useEffect(() => {
        getClassInfo(props.descName);
    }, [])
    
    function getClassInfo(className) {
        if (className === "Artificer") {
            setClassNum(2);
        }

        db.ref(`classes/`).on("value", snapshot => {
            let allClasses = snapshot.val();
            snapshot.forEach(snap => {
                if (snap.val().class[0].name === className) {
                    setCurrClass(snap.val());
                }
                
            });
        });
    }

    function displayFeature(feature, index) {
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
    }

    return (
        <>
            <div onClick={handleToggle}>
                <h3>{props.descName}</h3>
                {currClass
                    ?   informationDiv
                    :   <></>
                }
            </div>
        </>
    )

} export default ClassDescriptor