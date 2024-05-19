/*Itay Vekselbum, Dor Bergel, Eyal Avni*/

/*Imports for all the components or stylesheets we would use*/
import * as React from 'react';
import {DemoContainer} from '@mui/x-date-pickers/internals/demo';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {LocalizationProvider} from '@mui/x-date-pickers/LocalizationProvider';
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {useState} from "react";
import {Stack, Button, Avatar} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';

export default function CaloriesList(allProps) {
    const [selectedDate, setSelectedDate] = useState(null);
    const [isChecked, setIsChecked] = useState(false);

    const handleDatePickerChange = async (date) => {
        setSelectedDate(date);
        if (isChecked)
            setIsChecked(!isChecked);
        await allProps.handleDateChange(date);
    }

    const handleClick = async () => {
        if (!isChecked) {
            setIsChecked(!isChecked);
            await handleDatePickerChange(null);
            await allProps.filterFunc('all');
        }
    }

    return (
        /*use a div to wrap and style the CalorieList component*/
        <div className={'half-box right-box'}>
            <div className={'row'}>
                {/*set a button to create an "all" filter to show all the meals in the DB*/}
                <Stack direction="row" spacing={2} style={{position: 'relative'}} sx={{alignItems: 'end'}}>
                    <Button variant="outlined" onClick={handleClick} id="all-filter">
                        All
                    </Button>
                    {/*A condition to make sure that checkIcon will appear when the user clicked on "All" filter*/}
                    {isChecked && (
                        <Avatar id="all-filter-check-icon">
                            <CheckIcon style={{fontSize: 16}}/>
                        </Avatar>
                    )}
                </Stack>

                {/*Set a button for choosing specific month and year*/}
                <div className={'calorieList-filter-outline'}>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DemoContainer components={['DatePicker']}>
                            {/*Using DatePicker of Material-UI for filtering a specific month and year*/}
                            <DatePicker id="month-filter" name="list-filter" label={'"month" and "year"'}
                                        views={['month', 'year']}
                                        value={selectedDate} onChange={handleDatePickerChange}/>
                        </DemoContainer>
                    </LocalizationProvider>
                </div>
            </div>

            {/*Present the calorie List from the DB by the filter that chose*/}
            <div className={'cal-lst'}>
                {allProps.caloriesList}
            </div>

            {/*Present the total calorie of all the meals that in the DB*/}
            <div className={'cal-sum'}>
                <h1>{allProps.caloriesSum} Calories</h1>
            </div>
        </div>
    );
}