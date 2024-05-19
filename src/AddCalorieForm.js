/*Itay Vekselbum, Dor Bergel, Eyal Avni*/

/*Imports for all the components or stylesheets we would use*/
import idb from "./idb";
import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import AddIcon from '@mui/icons-material/Add';
import {useState} from "react";


export default function AddCalorieForm(props) {
    /*Set and handle the category of the meal selection */
    const [toggleCategory, setToggleCategory] = useState('');
    const [toggleClick, setToggleClick] = useState(false);

    const handleChange = (event, newCategory) => {
        if (!toggleClick) {
            setToggleClick(!toggleClick);
            setToggleCategory(newCategory);
        } else {
            setToggleCategory('');
            setToggleClick(!toggleClick);
        }
    };

    // Asynchronous function that works after clicking "Add" button in the form.
    const handleAddClick = async (event) => {

        let calorie, description, category;

        // Checking if all fields was filled.
        try {
            // Try to get the calorie, description & category before adding to the DB.
            calorie = parseInt(document.getElementById("outlined-error").value);
            description = document.getElementById("outlined-multiline-static").value;
            category = toggleCategory;

            // Check if all the fields was filled correctly.
            if (calorie === '' || description === '' || !Number.isInteger(calorie) || category === '') {
                throw Error;
            }
        }
            // In case one filled was missing or the calorie isn't number - alert.
        catch (e) {
            console.log('AddCalorieForm -> handleAddClick: Empty filled has found');
            alert("Check your fields");
            return;
        }

        console.log("AddCalorieForm -> handleAddClick: " +
            "calorie: " + calorie + "\ncategory: " + category + "\ndescription: " + description);

        // Reset the fields after adding new item
        document.getElementById("outlined-error").value = '';
        setToggleCategory('');
        document.getElementById("outlined-multiline-static").value = '';

        // Create new item by the data that entered.
        const curr_date = new Date();
        const item = {
            calorie: calorie, category: category, description: description,
            month: curr_date.getMonth() + 1, year: curr_date.getFullYear()
        };

        // Add the item
        await idb.openCaloriesDB('caloriesdb', 4);
        await idb.addCalories(item);

        console.log('curr DEBUG: ' + props.selectedDate);

        // After adding new item, we want the list will be refreshed.
        if (props.selectedDate) {
            props.filterFunc(props.selectedDate);
        } else {
            props.filterFunc('all');
        }
    };

    return (
        /*Set a div which define the component that make the list to add a meal*/
        <div className={'half-box left-box'}>
            <div className={'row'}>
                {/*Use the Material Ui Box component to create an input field for the calorie of the meal*/}
                <Box
                    component="form"
                    sx={{
                        '& .MuiTextField-root': {m: 1, width: '38.5ch'},
                    }}
                    noValidate
                    autoComplete="off">
                    {/*Use the Material Ui TextField component to create an input field*/}
                    <TextField
                        id="outlined-error"
                        label="Calories"
                        placeholder="Calories"
                        defaultValue=""/>
                </Box>
            </div>

            {/*Setting a div that define the categories of each record: Breakfast, Lunch, Dinner or Other.*/}
            <div className={'row'}>
                {/*Use the Material Ui ToggleButtonGroup to create a selection between the meal category*/}
                <ToggleButtonGroup
                    color="primary"
                    exclusive
                    value={toggleCategory}
                    onChange={handleChange}
                    aria-label="Platform"
                    sx={{padding: "0 0.5rem"}}>
                    {/*Use the Material Ui ToggleButton to create the breakfast meal category*/}
                    <ToggleButton
                        value="Breakfast"
                        id={'breakfast'}
                        // Set style to the breakfast ToggleButton meal category using the sx property
                        sx={{
                            '&.Mui-selected': {backgroundColor: "#6FF9D7", color: "black"},
                            boxShadow: toggleCategory === 'Breakfast' ? '0 0 10px 0 rgba(0,0,0,0.45) inset' : 'none'
                        }}
                        className={'ToggleBtn'}>
                        Breakfast
                    </ToggleButton>
                    {/*Use the Material Ui ToggleButton to create the lunch meal category*/}
                    <ToggleButton
                        value="Lunch"
                        id={'lunch'}
                        // Set style to the lunch ToggleButton meal category using the sx property
                        sx={{
                            '&.Mui-selected': {backgroundColor: "#3AE7BC", color: "black"},
                            boxShadow: toggleCategory === 'Lunch' ? '0 0 10px 0 rgba(0,0,0,0.45) inset' : 'none'
                        }}
                        className={'ToggleBtn'}>
                        Lunch
                    </ToggleButton>
                    {/*Use the Material Ui ToggleButton to create the dinner meal category*/}
                    <ToggleButton
                        value="Dinner"
                        id={'dinner'}
                        // Set style to the dinner ToggleButton meal category using the sx property
                        sx={{
                            '&.Mui-selected': {backgroundColor: "#6FF9D7", color: "black"},
                            boxShadow: toggleCategory === 'Dinner' ? '0 0 10px 0 rgba(0,0,0,0.45) inset' : 'none'
                        }}
                        className={'ToggleBtn'}>
                        Dinner
                    </ToggleButton>
                    {/*Use the Material Ui ToggleButton to create the other meal category*/}
                    <ToggleButton
                        value="Other"
                        id={'other'}
                        // Set style to the Breakfast other meal category using the sx property
                        sx={{
                            '&.Mui-selected': {backgroundColor: "#6FF9D7", color: "black"},
                            boxShadow: toggleCategory === 'Other' ? '0 0 10px 0 rgba(0,0,0,0.45) inset' : 'none'
                        }}
                        className={'ToggleBtn'}>
                        Other
                    </ToggleButton>
                </ToggleButtonGroup>
            </div>

            {/*Use the Material Ui Box component to create an input field for the description of the meal*/}
            <Box
                component="form"
                sx={{
                    '& .MuiTextField-root': {m: 1, width: '38.5ch'},
                }}
                noValidate
                autoComplete="off">
                {/*Use the Material Ui TextField component to create an input field*/}
                <TextField
                    id="outlined-multiline-static"
                    className={'description-box'}
                    label="Description"
                    placeholder="Description"
                    multiline
                    rows={4}
                    defaultValue=""/>
            </Box>

            {/*Use the Material Ui Stack component to create a button to add a meal to the DB*/}
            <Stack sx={{padding: "0.5rem"}} direction="row" spacing={2}>
                {/*Use the Material Ui Button component to create a button*/}
                <Button sx={{
                    '&:hover': {backgroundColor: "#21F3BE"},
                    backgroundColor: "#15DDAA", boxSizing: "content-box", width: "100%"
                }}
                        variant="contained"
                    // Use the onClick event call the function to add the meal to the DB
                        onClick={handleAddClick} endIcon={<AddIcon/>}>
                    Add
                </Button>
            </Stack>
        </div>
    );
}
