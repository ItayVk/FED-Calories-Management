/*Itay Vekselbum, Dor Bergel, Eyal Avni*/
import logo from './calorieslogo.png'

export default function Navbar() {
    return (
        /*Define a Navbar at the top of the web page include our logo*/
        <div className={"Navbar"}>
            <div>
                {/* Add the logo of the website to the navbar*/}
                <img src={logo} alt="calorielogo" className={"logo"}/>
            </div>
        </div>
    );
}