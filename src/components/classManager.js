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

function ClassManager(props) {

    const [charClass, setCharClass] = useState("");
    const [classSkelly, setClassSkelly] = useState();
    const [skillsSelected, setSkillsSelected] = useState([]);
    const [toolsSelected, setToolsSelected] = useState([]);
    const [numSkillSelected, setNumSkillSelected] = useState(0);
    const [classFeats, setClassFeats] = useState([]);
    const [levelSelected, setLevelSelected] = useState(1);
    const [userChar, setUserChar] = useState([]);
    const [boolTool, setBoolTool] = useState();
    const [toolsChoices, setToolsChoices] = useState([]);
    const [toolNum, setToolNum] = useState(0);
    const [numToolSelected, setNumToolSelected] = useState(0);
    const [subclassSelected, setSubclassSelected] = useState("");
    const [subclassShort, setSubclassShort] = useState();
    const [subclassList, setSubclassList] = useState([]);

    // ABILITIES
    const [asiFourFeat, setASIFourFeat] = useState();
    const [asiFourAbilOne, setASIFourAbilOne] = useState();
    const [asiFourAbilTwo, setASIFourAbilTwo] = useState();

    const [asiEightFeat, setASIEightFeat] = useState();
    const [asiEightAbilOne, setASIEightAbilOne] = useState();
    const [asiEightAbilTwo, setASIEightAbilTwo] = useState();

    const [asiTwelveFeat, setASITwelveFeat] = useState();
    const [asiTwelveAbilOne, setASITwelveAbilOne] = useState();
    const [asiTwelveAbilTwo, setASITwelveAbilTwo] = useState();

    const [asiSixteenFeat, setASISixteenFeat] = useState();
    const [asiSixteenAbilOne, setASISixteenAbilOne] = useState();
    const [asiSixteenAbilTwo, setASISixteenAbilTwo] = useState();

    const [asiNineteenFeat, setASINineteenFeat] = useState();
    const [asiNineteenAbilOne, setASINineteenAbilOne] = useState();
    const [asiNineteenAbilTwo, setASINineteenAbilTwo] = useState();

    const [userFourFeatAbilityChoice, setUserFourFeatAbilityChoice] = useState();
    const [userEightFeatAbilityChoice, setUserEightFeatAbilityChoice] = useState();
    const [userTwelveFeatAbilityChoice, setUserTwelveFeatAbilityChoice] = useState();
    const [userSixteenFeatAbilityChoice, setUserSixteenFeatAbilityChoice] = useState();
    const [userNineteenFeatAbilityChoice, setUserNineteenFeatAbilityChoice] = useState();



    useEffect(() => {
        // Make sure we can get the proper information
        if (props.location !== undefined) {
            // not best practice (props -> state), but set up some basic information for using later
            setCharClass(props.location.state.classSelected);
            setUserChar(props.location.state.userChar);

            // This prevents running this more than once, on initial run, let's fund some class information out
            if (toolsChoices.length <= 0) {
                getClassDetails(charClass);
            }

            // Keep running this every time levelSelected is changed
            getClassLevelFeats(levelSelected);
            
        }
    }, [props.time, 
        props.location.state, 
        charClass, 
        levelSelected, 
        boolTool, 
        toolsChoices, 
        subclassSelected])


    // Request information about the chosen class to get information to display/prompt user
    function getClassDetails(className) {
        db.ref(`classes/`).on("value", snapshot => {
            snapshot.forEach(snap => {
                if (snap.val().class[0].name === className) {
                    setClassSkelly(snap.val());         //  Will give us all the information about the class in one variable
                    getToolsSelect(snap.val());         //  This will check for a tool select and set it true/false; if true -> find out what tools and display options
                    getSubclassSelect(snap.val());      //  This will get all subclasses for the selected class and store them in a state variable
                }
            });
        });
    }


    // Check to see if the class has a Tool Proficiency choice and get the possible choices
    function getToolsSelect(classSkelly) {
        if (classSkelly.class[0].startingProficiencies.toolChoice) {
            const choiceType = classSkelly.class[0].startingProficiencies.toolChoice.choiceType;
            const choiceNum = classSkelly.class[0].startingProficiencies.toolChoice.choiceNum;
            const choiceArray = [];

            // Loop through all possible item categories from db
            //      For each catergory, find the item list for that itemGroup
            //      Then, add each item to a choice array
            choiceType.split(";").forEach(itemType => {
                db.ref('items/itemGroup').on("value", snapshot => {
                    snapshot.val().forEach(snap => {
                        if (snap.name === itemType) {
                            snap.items.forEach(eachItem => {
                                choiceArray.push(eachItem.split("|")[0]);
                            });
                        }
                    });
                });
            });

            setBoolTool(true);              //  This will tell the program to display/not display a tool selector  
            setToolsChoices(choiceArray);   //  The tools to select from in the selector
            setToolNum(choiceNum);          //  How many tool proficiencies the user can select
        } else {
            setBoolTool(false);             //  If no tool proficiency is available to the user, do not display
        }
    }


    // This collects all the subclass information and stores it in an object in state for later use
    function getSubclassSelect(classSkelly) {
        const subclassList = [];

        // Loop through all subclasses, eliminating certain edge cases/non-official subclasses
        classSkelly.class[0].subclasses.map((subclass) => {
            if (!subclass.name.includes("UA")) {
                if (!subclass.name.includes("PSA")) {
                    subclassList.push(subclass);
                }
            }
        });

        setSubclassList(subclassList);
    }

    // Handles only letting the user choose an appropriate amount of skills from the multi select dropdown
    const handleSkillSelect = (event) => {

        // If the user has selected less than the previous number of skill proficiencies,
        //      decrease the numberSelected so they can choose more
        if (event.target.value.length <= numSkillSelected) {
            setNumSkillSelected(numSkillSelected - 1);
            setSkillsSelected(event.target.value);
        }

        // If the number of selected skill proficiencies is less than the max number allowed
        //      increase the number selected and add newly selected skill to state
        if (numSkillSelected < parseInt(classSkelly.class[0].startingProficiencies.skills[0].choose.count)) {
            setSkillsSelected(event.target.value);
            setNumSkillSelected(numSkillSelected + 1);
        }
    }

    // Handles only letting the user choose an appropriate amount of skills from the multi select dropdown
    const handleToolSelect = (event) => {

        // If the user has selected less than the previous number of tools proficiencies,
        //      decrease the numberSelected so they can choose more
        if (event.target.value.length <= numToolSelected) {
            setNumToolSelected(numToolSelected - 1);
            setToolsSelected(event.target.value);
        }

        // If the number of selected tools proficiencies is less than the max number allowed
        //      increase the number selected and add newly selected tool to state
        if (numToolSelected < parseInt(toolNum)) {
            setToolsSelected(event.target.value);
            setNumToolSelected(numToolSelected + 1);
        }
    }


    // Handles changing the selected subclass in state
    const handleSubclassSelect = (event) => {

        // event.target.value needs to be split because of using two terms on each submit
        //      This was done to search accurately through the classSkelly state variable
        //      Each subclass = "Path of the Berserker;Berserker" etc
        let subclassFull = event.target.value.split(";");
        let subclassName = subclassFull[0];
        let subclassShort = subclassFull[1];
        
        setSubclassSelected(subclassName);
        setSubclassShort(subclassShort);
    }


    // Simply changes the level selected in state
    const handleLevelSelected = (event) => {
        setLevelSelected(event.target.value);
    }


    // Handles what feat was selected and at what level and 
    //      applies it to the approriate state variable
    //  Originally was an object but had issues and this is simpler
    //  Each selected variable is as follows:
    //          "level the feat was selected for:featName"
    const handleFeatSelect = (selected) => {
        let splitChoice = selected.split(":");
        let feat = splitChoice[1];

        switch(splitChoice[0]) {
            case 4:
                setASIFourFeat(feat);
                setASIFourAbilOne(null);
                setASIFourAbilTwo(null);
                break;
            
            case 8:
                setASIEightFeat(feat);
                setASIEightAbilOne(null);
                setASIEightAbilTwo(null);
                break;

            case 12:
                setASITwelveFeat(feat);
                setASITwelveAbilOne(null);
                setASITwelveAbilTwo(null);
                break;

            case 16:
                setASISixteenFeat(feat);
                setASISixteenAbilOne(null);
                setASISixteenAbilTwo(null);
                break;

            case 19:
                setASINineteenFeat(feat);
                setASINineteenAbilOne(null);
                setASINineteenAbilTwo(null);
                break;
            
            default:
                break;
        }
    }


    // Handles what ability score was selected and at what level and 
    //      applies it to the approriate state variable
    //  Originally was an object but had issues and this is simpler
    //  Each selected variable is as follows:
    //          "level the ability was selected for:ability"
    const handleASIOneChange = (selected) => {
        let splitChoice = selected.split(":");
        let ability = splitChoice[1];

        switch(splitChoice[0]) {
            case 4:
                setASIFourFeat(null);
                setASIFourAbilOne(ability);
                break;
            
            case 8:
                setASIEightFeat(null);
                setASIEightAbilOne(ability);
                break;

            case 12:
                setASITwelveFeat(null);
                setASITwelveAbilOne(ability);
                break;

            case 16:
                setASISixteenFeat(null);
                setASISixteenAbilOne(ability);
                break;

            case 19:
                setASINineteenFeat(null);
                setASINineteenAbilOne(ability);
                break;
            
            default:
                break;
        }
    }


    // Handles what ability score was selected and at what level and 
    //      applies it to the approriate state variable
    //  Originally was an object but had issues and this is simpler
    //  Each selected variable is as follows:
    //          "level the ability was selected for:ability"
    const handleASITwoChange = (selected) => {
        let splitChoice = selected.split(":");
        let ability = splitChoice[1];

        switch(splitChoice[0]) {
            case 4:
                setASIFourFeat(null);
                setASIFourAbilTwo(ability);
                break;
            
            case 8:
                setASIEightFeat(null);
                setASIEightAbilTwo(ability);
                break;

            case 12:
                setASITwelveFeat(null);
                setASITwelveAbilTwo(ability);
                break;

            case 16:
                setASISixteenFeat(null);
                setASISixteenAbilTwo(ability);
                break;

            case 19:
                setASINineteenFeat(null);
                setASINineteenAbilTwo(ability);
                break;
            
            default:
                break;
        }
    }

    // Handles what ability score was selected and at what level and 
    //      applies it to the approriate state variable
    //  Originally was an object but had issues and this is simpler
    //  Each selected variable is as follows:
    //          "level the ability was selected for:ability"

    // this only applies to feats that grant ability score increases as part of the feat
    const handleFeatAbilityChoice = (selected) => {

        if (selected !== undefined) {
            const splitSelected = selected.split(":");
            const level = splitSelected[0];

            switch(level) {
                case 4:
                    setUserFourFeatAbilityChoice(selected);
                    break;
                
                case 8:
                    setUserEightFeatAbilityChoice(selected);
                    break;
    
                case 12:
                    setUserTwelveFeatAbilityChoice(selected);
                    break;
    
                case 16:
                    setUserSixteenFeatAbilityChoice(selected);
                    break;
    
                case 19:
                    setUserNineteenFeatAbilityChoice(selected);
                    break;
                
                default:
                    break;
            }
        }
    }

    // If the user has the ability to choose a tool proficiency
    //      display this selector with the appropriate tools
    const toolSelect = boolTool
        ?   (<FormControl className="form-control">
                <InputLabel id="demo-multiple-checkbox-label">Tools</InputLabel>
                <Select
                    labelID="demo-multiple-checkbox-label"
                    id="demo-multiple-checkbox"
                    multiple
                    value={toolsSelected}
                    onChange={handleToolSelect}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {toolsChoices.map((tool) => (
                        <MenuItem key={tool} value={tool}>
                            <Checkbox checked={toolsSelected.indexOf(toolsChoices) > -1} />
                            <ListItemText primary={tool} />
                        </MenuItem>
                    ))}
                </Select>
            </FormControl>)
        :   (<></>)
    

    // Gets the appropriate class abilities for the requested level (only 1st level for now)
    const getClassLevelFeats = () => {
        const featInfoArray = [];
        const featNameArray = []

        if (classSkelly !== undefined) {

            // Find what level this class gets its path feature
            let pathArray = classSkelly.class[0].subclasses[0].subclassFeatures.join(";");
            let pathLevels = pathArray.replaceAll(/[^0-9]+/g, ";").split(";");

            // Loop through class feats excluding non-official ones and add them to an array
            classSkelly.class[0].classFeatures.map((fullString, index) => {
                if (!String(fullString).includes("UAClassFeatureVariants")) {
                    let featStr = "";
                    let subClassBool = "false;"
                    if (fullString.constructor === String) {
                        featStr = fullString
                    } else {
                        featStr = fullString.classFeature;
                        subClassBool = "true;";
                    }
    
                    featStr = featStr.replace("|"+userChar.class, "");
                    featStr = featStr.replace("||", ";");
                    featStr = featStr.replace("|TCE", ";TCE");
                    featStr = subClassBool + featStr;
                    featNameArray.push(featStr);
                }
            });


            featNameArray.map((featLine, index) => {
                const featSplit = featLine.split(";");
                const subClassBool = featSplit[0];
                const featName = featSplit[1];
                const featLevel = featSplit[2];
                let tasha = false;

                if (featSplit[3]) {
                    tasha = true;
                }
                
                if (parseInt(featLevel) <= parseInt(levelSelected)) {
                    if (subClassBool === "false") {
                        if (!tasha) {
                            let feat =  (
                                classSkelly.classFeature.map((feature, index) => {
                                    if (!feature.isClassFeatureVariant) {
                                        if (feature.name === featName) {
                                            if (parseInt(feature.level) === parseInt(featLevel)) {
                                                if (feature.name === "Ability Score Improvement") {
                                                    return (<div className="class-abilities">
                                                                <div className="class-ability" key={index}>
                                                                    <h3 className="ability-header">{feature.name}</h3>
                                                                    <p className="ability-level">{feature.level}</p>
                                                                    <p className="ability-level">
                                                                        When you reach {featLevel}th level, you can increase one ability score of your choice by 2, or you can increase two ability scores of your choice by 1. As normal, you can't increase an ability score above 20 using this feature. 
                                                                    </p>
                                                                    <ASIChoice 
                                                                        level={featLevel} 
                                                                        abilityChoiceOne={handleASIOneChange} 
                                                                        abilityChoiceTwo={handleASITwoChange} 
                                                                        featChoice={handleFeatSelect} 
                                                                        featAbilityChoice={handleFeatAbilityChoice} 
                                                                    />
                                                                </div>
                                                            </div>)
                                                    } else {
                                                        return (<div className="class-abilities">
                                                                    <div className="class-ability" key={index}>
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
                                                                                // entryStr = entryStr.replaceAll(/[\d\d]}/g, "");      // Tried to get rid of the extra numbers after chapter, mayberevisit later
                                                                                entryStr = entryStr.replaceAll(/[{}]/g, "");
                                                                                entryStr = entryStr.replaceAll("..", ".");
                                                                                entryStr = entryStr.replaceAll(" .", ".");
                                                                                return (<p key={index} className="ability-description">{entryStr}</p>)
                                                                            }
                                                                        })}
                                                                    </div>
                                                                </div>)
                                                        }
                                                    }
                                                }
                                        }
                                    }))
                            featInfoArray.push(feat);
                        }
                    } else {
                        if (parseInt(featLevel) === parseInt(pathLevels[1])) {
                            let feat = classSkelly.classFeature.map((feature, index) => {
                                if (!feature.isClassFeatureVariant) {
                                    if (feature.name === featName) {
                                        return (<div className="class-abilities">
                                                    <div className="class-ability" key={index}>
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
                                                            } else {
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
                                                                entryStr = entryStr.replaceAll(/[{}]/g, "");
                                                                entryStr = entryStr.replaceAll("..", ".");
                                                                entryStr = entryStr.replaceAll(" .", ".");

                                                                return (<p key={index} className="ability-description">{entryStr}</p>)
                                                            }
                                                        })}
                                                        <FormControl className="form-control">
                                                            <InputLabel id="demo-simple-select-label">
                                                                {classSkelly.class[0].subclassTitle}
                                                            </InputLabel>
                                                            <Select
                                                                labelID="demo-simple-select-label"
                                                                id="demo-simple-select"
                                                                value={subclassSelected}
                                                                onChange={handleSubclassSelect}
                                                            >
                                                                {subclassList.map((subclass, index) => (
                                                                    <MenuItem key={index} value={subclass.name+";"+subclass.shortName}>
                                                                        <ListItemText primary={subclass.name} />
                                                                    </MenuItem>
                                                                ))}
                                                            </Select>
                                                        </FormControl>
                                                    </div>
                                                </div>)
                                            }
                                    }
                            });
                            featInfoArray.push(feat);

                            if (subclassSelected != undefined) {
                                let feat = classSkelly.subclassFeature.map((feature, index) => {
                                if (!feature.isClassFeatureVariant) {
                                    if (feature.subclassShortName === subclassShort) {
                                        if (feature.level === parseInt(pathLevels[1])) {
                                            return (<div className="class-abilities">
                                                        <div className="class-ability" key={index}>
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
                                                                } else {
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
                                                                    entryStr = entryStr.replaceAll(/[{}]/g, "");
                                                                    entryStr = entryStr.replaceAll("..", ".");
                                                                    entryStr = entryStr.replaceAll(" .", ".");

                                                                    return (<p key={index} className="ability-description">{entryStr}</p>)
                                                                }
                                                            })}
                                                        </div>
                                                    </div>)
                                                }
                                        }
                                    }
                                });
                                featInfoArray.push(feat);
                            }
                        } else if (parseInt(featLevel) === parseInt(pathLevels[2])) {
                            if (featName.includes("feature")) {
                                if (subclassSelected != undefined) {
                                    let feat = classSkelly.subclassFeature.map((feature, index) => {
                                        if (!feature.isClassFeatureVariant) {
                                            if (feature.subclassShortName === subclassShort) {
                                                if (feature.level === parseInt(pathLevels[2])) {
                                                    return (<div className="class-abilities">
                                                                <div className="class-ability" key={index}>
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
                                                                        } else {
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
                                                                            entryStr = entryStr.replaceAll(/[{}]/g, "");
                                                                            entryStr = entryStr.replaceAll("..", ".");
                                                                            entryStr = entryStr.replaceAll(" .", ".");
        
                                                                            return (<p key={index} className="ability-description">{entryStr}</p>)
                                                                        }
                                                                    })}
                                                                </div>
                                                            </div>)
                                                }
                                            }
                                        }
                                    });
                                    featInfoArray.push(feat);
                                }
                            }
                        } else if (parseInt(featLevel) === parseInt(pathLevels[3])) {
                            if (featName.includes("feature")) {
                                if (subclassSelected != undefined) {
                                    let feat = classSkelly.subclassFeature.map((feature, index) => {
                                        if (!feature.isClassFeatureVariant) {
                                            if (feature.subclassShortName === subclassShort) {
                                                if (feature.level === parseInt(pathLevels[3])) {
                                                    return (<div className="class-abilities">
                                                                <div className="class-ability" key={index}>
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
                                                                        } else {
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
                                                                            entryStr = entryStr.replaceAll(/[{}]/g, "");
                                                                            entryStr = entryStr.replaceAll("..", ".");
                                                                            entryStr = entryStr.replaceAll(" .", ".");
        
                                                                            return (<p key={index} className="ability-description">{entryStr}</p>)
                                                                        }
                                                                    })}
                                                                </div>
                                                            </div>)
                                                }
                                            }
                                        }
                                    });
                                    featInfoArray.push(feat);
                                }
                            }
                        } else if (parseInt(featLevel) === parseInt(pathLevels[4])) {
                            if (featName.includes("feature")) {
                                if (subclassSelected != undefined) {
                                    let feat = classSkelly.subclassFeature.map((feature, index) => {
                                        if (!feature.isClassFeatureVariant) {
                                            if (feature.subclassShortName === subclassShort) {
                                                if (feature.level === parseInt(pathLevels[4])) {
                                                    return (<div className="class-abilities">
                                                                <div className="class-ability" key={index}>
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
                                                                        } else {
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
                                                                            entryStr = entryStr.replaceAll(/[{}]/g, "");
                                                                            entryStr = entryStr.replaceAll("..", ".");
                                                                            entryStr = entryStr.replaceAll(" .", ".");
        
                                                                            return (<p key={index} className="ability-description">{entryStr}</p>)
                                                                        }
                                                                    })}
                                                                </div>
                                                            </div>)
                                                }
                                            }
                                        }
                                    });
                                    featInfoArray.push(feat);
                                }
                            }
                        }
                        
                    }
                }
            });
            setClassFeats(featInfoArray);
        }
    }

    console.log(classSkelly);
    return (
        <>
        {classSkelly 
            ?   <>
                    <div className="class-manager">
                    <Button
                        component={Link}
                        to={{
                            pathname: '/race',
                            state: { 
                                class: userChar.class,
                                skillsSelected: skillsSelected,
                                toolsSelected: toolsSelected,
                                levelSelected: levelSelected,
                                subclassSelected: subclassSelected,
                                // classFeats: classFeats,          // Will break on submitting to state?
                                classSkelly: classSkelly,
                                subclassShort: subclassShort,
                                asiFourFeat: asiFourFeat,
                                asiEightFeat: asiEightFeat,
                                asiTwelveFeat: asiTwelveFeat,
                                asiSixteenFeat: asiSixteenFeat,
                                asiNineteenFeat: asiNineteenFeat,
                                asiFourAbilOne: asiFourAbilOne,
                                asiFourAbilTwo: asiFourAbilTwo,
                                asiEightAbilOne: asiEightAbilOne,
                                asiEightAbilTwo: asiEightAbilTwo,
                                asiTwelveAbilOne: asiTwelveAbilOne,
                                asiTwelveAbilTwo: asiTwelveAbilTwo,
                                asiSixteenAbilOne: asiSixteenAbilOne,
                                asiSixteenAbilTwo: asiSixteenAbilTwo,
                                asiNineteenAbilOne: asiNineteenAbilOne,
                                asiNineteenAbilTwo: asiNineteenAbilTwo,
                                userFourFeatAbility: userFourFeatAbilityChoice,
                                userEightFeatAbility: userEightFeatAbilityChoice,
                                userTwelveFeatAbility: userTwelveFeatAbilityChoice,
                                userSixteenFeatAbility: userSixteenFeatAbilityChoice,
                                userNineteenFeatAbility: userNineteenFeatAbilityChoice, 
                            }
                        }}>
                            Choose Class
                    </Button>
                        <h2 className="class-maanger-header">{charClass}</h2>
                        <FormControl className="form-control">
                                <InputLabel id="demo-level-select-label">
                                    Level
                                </InputLabel>
                                <Select
                                    labelID="demo-level-select-label"
                                    id="demo-level-select"
                                    value={levelSelected}
                                    onChange={handleLevelSelected}
                                    input={<Input />}
                                >
                                    <MenuItem value={1}>1</MenuItem>
                                    <MenuItem value={2}>2</MenuItem>
                                    <MenuItem value={3}>3</MenuItem>
                                    <MenuItem value={4}>4</MenuItem>
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={6}>6</MenuItem>
                                    <MenuItem value={7}>7</MenuItem>
                                    <MenuItem value={8}>8</MenuItem>
                                    <MenuItem value={9}>9</MenuItem>
                                    <MenuItem value={10}>10</MenuItem>
                                    <MenuItem value={11}>11</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                    <MenuItem value={13}>13</MenuItem>
                                    <MenuItem value={14}>14</MenuItem>
                                    <MenuItem value={15}>15</MenuItem>
                                    <MenuItem value={16}>16</MenuItem>
                                    <MenuItem value={17}>17</MenuItem>
                                    <MenuItem value={18}>18</MenuItem>
                                    <MenuItem value={19}>19</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                </Select>
                            </FormControl>
                        <div className="class-feature">
                            <h3 className="ability-header">Hit Points</h3>
                            <p className="ability-level">1st level</p>
                            <p className="toggle-sm-details-text">
                                <span className="toggle-sm-details-bold">Hit Dice: </span>
                                d{classSkelly.class[0].hd.faces}
                            </p>
                            <p className="toggle-sm-details-text">
                                <span className="toggle-sm-details-bold">Hit Points at 1st Level: </span>
                                {classSkelly.class[0].hd.faces} + your Constitution modifer
                            </p>
                            <p className="toggle-sm-details-text">
                                <span className="toggle-sm-details-bold">Hit Points at Higher Levels: </span>
                                1d{classSkelly.class[0].hd.faces} + your Constitution modifer per {classSkelly.class[0].name} level after 1st
                            </p>
                        </div>
                        <div className="class-feature">
                            <h3 className="ability-header">Proficiencies</h3>
                            <p className="ability-level">1st level</p>

                            {/* Armor */}
                            {classSkelly.class[0].startingProficiencies.armor 
                                ?   (<p className="toggle-sm-details-text">
                                        <span className="toggle-sm-details-bold">Armor: </span>
                                        {classSkelly.class[0].startingProficiencies.armor.join(", ").replaceAll(/\|.*\}|\{@/g, "")}
                                    </p>)
                                :   <></>
                            }

                            {/* Weapons */}
                            {classSkelly.class[0].startingProficiencies.weapons 
                                ?   (<p className="toggle-sm-details-text">
                                        <span className="toggle-sm-details-bold">Weapons: </span>
                                        {classSkelly.class[0].startingProficiencies.weapons.join(", ").replaceAll(/\|.*\}|\{@/g, "")}
                                    </p>)
                                :   <></>
                            }

                            {/* Tools */}
                            {classSkelly.class[0].startingProficiencies.tools 
                                ?   (<p className="toggle-sm-details-text">
                                        <span className="toggle-sm-details-bold">Tools: </span>
                                        {classSkelly.class[0].startingProficiencies.tools.join(", ").replaceAll(/\|PHB}|\{@item|musical instrument\|PHB\||\}/g, "")}
                                    </p>)
                                :   <></>
                            }
                            {toolSelect}
                            
                            {/* Saving Throws */}
                            <p className="toggle-sm-details-text"> 
                                <span className="toggle-sm-details-bold">Saving Throws: </span>
                                {classSkelly.class[0].proficiency.fullNames[0]}, {classSkelly.class[0].proficiency.fullNames[1]}
                            </p>

                            {/* Skills */}
                            <p className="toggle-sm-details-text">
                                <span className="toggle-sm-details-bold">Skills: </span>
                                Choose {classSkelly.class[0].startingProficiencies.skills[0].choose.count} from {classSkelly.class[0].startingProficiencies.skills[0].choose.from.join(", ").replaceAll(/\|.*\}|\{@/g, "")}
                            </p>
                            <FormControl className="form-control">
                                <InputLabel id="demo-multiple-checkbox-label">Skills</InputLabel>
                                <Select
                                    labelID="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={skillsSelected}
                                    onChange={handleSkillSelect}
                                    input={<Input />}
                                    renderValue={(selected) => selected.join(', ')}
                                >
                                    
                                    {classSkelly.class[0].startingProficiencies.skills[0].choose.from.map((skill) => (
                                        <MenuItem key={skill} value={skill}>
                                            <Checkbox checked={skillsSelected.indexOf(classSkelly.class[0].startingProficiencies.skills[0].choose.from) > -1} />
                                            <ListItemText primary={skill} />
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </div>

                        {/* Display the feats appropriate for the player's level selected */}
                        {classFeats}
                    </div>
                </>
            :   (<div>
                    <h4>Something went wrong...</h4>
                </div>)
        }
        </>
    )

} export default ClassManager