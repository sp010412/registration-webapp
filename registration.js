module.exports = function registrationNumbers(existingPlates) {

    var pool = existingPlates;
    var allregs = []


    //Displaying inserted registration to the user
    async function regsIn(regIn) {
        if (regIn != '' && /^((CA|PA|WC)\s\d{3}\-\d{3})$|^((CA|PA|WC)\s\d{3}\s\d{3})$|^((CA|PA|WC)\s\d{4})$/.test(regIn)) {

            if (!allregs.includes(regIn)) {
                allregs.push(regIn)
                return true
            }
        }
    }

    async function display(){
        return allregs
    }

//Adds registration numbers into the table
    async function platesIn(regIn) {

        if (regIn != '' && /^((CA|PA|WC)\s\d{3}\-\d{3})$|^((CA|PA|WC)\s\d{3}\s\d{3})$|^((CA|PA|WC)\s\d{4})$/.test(regIn)) {

            const db = await pool.query('SELECT * FROM registrations WHERE registration_numbers = $1', [regIn]);
            const dbOne = await pool.query('SELECT * FROM towns WHERE town_str = $1', [CA]);
            const dbTwo = await pool.query('SELECT * FROM towns WHERE town_str = $1', [PA]);
            const dbThree = await pool.query('SELECT * FROM towns WHERE town_str = $1', [WC]);

            if (db.rows.length == 0) {
                await pool.query('insert into registrations (registration_numbers) values ($1)', [regIn]);
            }
        }
    } 
    

    
    
    return {
        platesIn,
        regsIn,
        display,
    }

}
