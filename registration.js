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

    async function display() {
        return allregs
    }

    //Adds registration numbers into the table
    async function platesIn(regIn) {

        if (regIn != '' && /^((CA|PA|WC)\s\d{3}\-\d{3})$|^((CA|PA|WC)\s\d{3}\s\d{3})$|^((CA|PA|WC)\s\d{4})$/.test(regIn)) {

            let plate = regIn;
            const db = await pool.query('SELECT registration_numbers FROM registrations WHERE registration_numbers = $1', [plate]);
            let chart = plate.substring(0, 2);
            var townId = await pool.query('SELECT id FROM towns WHERE town_str = $1', [chart]);

            //first checks if the parameter exist
            if (db.rowCount === 0) {     
                await pool.query('INSERT INTO registrations (registration_numbers, town_id) values ($1,$2)',[ plate, townId.rows[0].id]);
            }
            // else {
            //     return 'Registration already exists';
            // }
        }

    }


    return {
        platesIn,
        regsIn,
        display,
    }

}
