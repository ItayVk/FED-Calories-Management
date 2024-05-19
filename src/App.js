/*Itay Vekselbum, Dor Bergel, Eyal Avni*/

/*Imports for all the components or stylesheets we would use*/
import './App.css';
import AddCalorieForm from "./AddCalorieForm";
import CalorieList from "./CalorieList";
import {useEffect, useState} from "react";
import idb from "./idb";
import * as React from 'react';
import Card from '@mui/material/Card';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';
import {ThemeProvider, createTheme} from '@mui/material/styles';
import FreeBreakfastIcon from '@mui/icons-material/FreeBreakfast';
import LunchDiningIcon from '@mui/icons-material/LunchDining';
import BrunchDiningIcon from '@mui/icons-material/BrunchDining';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import Navbar from "./Navbar";

/*async function to initiate the database so it would recognize in the beginning of the project*/
async function initIdb() {
    await idb.openCaloriesDB('caloriesdb', 4);
}

/*Function to set the theme of the project to "Dark Mode"*/
const darkTheme = createTheme({
    palette: {
        mode: 'dark',
    },
});

/*The main function that controls the components that would be shown*/
function App() {
    /*Initiate the IndexDB for the first time*/
    const catchinit = initIdb();

    /*Define states using useState to control the calorie management*/
    const [caloriesList, setCaloriesList] = useState([]);
    const [caloriesSum, setCaloriesSum] = useState(0);
    const [selectedDate, setSelectedDate] = useState(null);

    /*Mapping the items from the database to show them to the user*/
    const mappingItems = function (items) {
        return (
            items.map((item) => {
                let icon;
                /*Define the icon for each meal using switch case*/
                switch (item.category) {
                    case 'Breakfast':
                        icon = <FreeBreakfastIcon sx={{marginRight: "0.5rem", fontSize: "40px"}}/>;
                        break;
                    case 'Lunch':
                        icon = <LunchDiningIcon sx={{marginRight: "0.5rem", fontSize: "40px"}}/>;
                        break;
                    case 'Dinner':
                        icon = <BrunchDiningIcon sx={{marginRight: "0.5rem", fontSize: "40px"}}/>;
                        break;
                    default:
                        icon = <RestaurantIcon sx={{marginRight: "0.5rem", fontSize: "40px"}}/>;
                        break;
                }
                /* return the data from the database as a card component using Material Ui*/
                return (
                    <Card variant="outlined" sx={{width: "98%", backgroundColor: "#212529"}}
                          className={'cal-ticket'} key={item.id}>
                        <Box sx={{p: 2, display: 'flex', alignItems: 'center'}}>
                            {icon}
                            <Box sx={{ml: 1, flexGrow: 1}}>
                                {/*Extract the category of the meal*/}
                                <Typography gutterBottom variant="h5" component="div">
                                    {item.category}
                                </Typography>
                                {/*Extract the description of the meal*/}
                                <Typography color="text.secondary" variant="body2">
                                    {item.description}
                                </Typography>
                            </Box>
                            {/*Extract the calorie of the meal*/}
                            <Typography sx={{whiteSpace: "nowrap", marginLeft: "5px"}} gutterBottom variant="h6"
                                        component="div">
                                {item.calorie} Cal.
                            </Typography>
                        </Box>
                        <Divider/>
                        <Box sx={{p: 2}}>
                            {/*extract the date that the meal was created*/}
                            <Typography gutterBottom variant="body2">
                                {item.month}/{item.year}
                            </Typography>
                        </Box>
                    </Card>

                );
            })
        );
    };

    /*Function that handle the use of the filters when watching the calorie meal list*/
    const handleFilterChange = async (filterValue) => {
        // Log the filter value
        console.log("Filter value:", filterValue);

        /*Open the database and parse the item*/
        await idb.openCaloriesDB("caloriesdb", 4);
        let dbItems = await idb.getCalories();

        dbItems = JSON.parse(dbItems);


        // Showing all records in the database.
        if (filterValue === "all" || !filterValue) {
            const monthFilterElement = document.getElementById('month-filter');

            if (monthFilterElement) {
                document.getElementById('month-filter').value = NaN;
                console.log('All is checked');
            }
        }

        // The process of showing records of specific month and year.
        else {
            const stringDate = filterValue.toISOString().split('-');
            const selectedMonth = parseInt(stringDate[1]);
            const selectedYear = parseInt(stringDate[0]);
            console.log('Selected Year:', selectedYear);
            console.log('Selected Month:', selectedMonth);

            document.getElementById('all-filter').checked = false;

            // Using the 'filter' method in order to show records of specific month and year.
            dbItems = dbItems.filter((item) => (item.month === selectedMonth && item.year === selectedYear));
            console.log('Filtered items:', dbItems); // Log filtered items
        }

        // Updating total calories, extracting the record's data in order to covert it to a card in calories list.
        countCalories(dbItems);
        dbItems = mappingItems(dbItems);
        console.log('Filtered calories list:', dbItems); // Log final filtered list
        setCaloriesList(dbItems);
    };

    // Function that handle changes with the date.
    const handleDateChange = async (selectedDate) => {
        console.log('Selected date: ', selectedDate);
        await handleFilterChange(selectedDate);
    }


    /*Function that counts the total calorie of all the meals in the database*/
    const countCalories = function (db) {
        let sum = 0;
        db.forEach(item => {
            sum += item['calorie'];
        });
        console.log('countCalories -> ' + sum);
        setCaloriesSum(sum);
    }

    useEffect(() => {
        handleFilterChange("all");
    }, []);

    /*return the components that would be shown to the user*/
    return (
        <div className="App">
            <Navbar/>
            <ThemeProvider theme={darkTheme}>
                {/*The AddCalorieForm component that allows the user to add meals to the database*/}
                <div className="AddCalForm">
                    <AddCalorieForm mappingFunc={mappingItems} filterFunc={handleFilterChange}
                                    selectedDate={selectedDate}/>
                </div>
                <div className="CalList">
                    {/*The CalorieList component that Present the meals and their total calories to the user*/}
                    <CalorieList caloriesList={caloriesList} setCaloriesList={setCaloriesList}
                                 mappingFunc={mappingItems} filterFunc={handleFilterChange}
                                 caloriesSum={caloriesSum} setCaloriesSum={setCaloriesSum}
                                 countCalories={countCalories} handleDateChange={handleDateChange}/>
                </div>
            </ThemeProvider>
        </div>
    );
}

/*export the App component*/
export default App;
