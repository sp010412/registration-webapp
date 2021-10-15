module.exports = function (regInsta) {


    async function home(req, res) {
        res.render('index', {
            output: await regInsta.allRegistrations()
        })
    }

    async function actions(req, res) {

        try {
    
            const regex = /^((CA|PA|WC)\s\d{3}\-\d{3})$|^((CA|PA|WC)\s\d{3}\s\d{3})$|^((CA|PA|WC)\s\d{4})$/;
            var plateIn = req.body.inputBox;
    
            if (plateIn) {
                var listDi = await regInsta.dupli(plateIn);
                if (regex.test(plateIn) === false) {
                    req.flash('infoRed', 'Not a registration plate! eg; CA 12345 ');
                }
                else if (listDi.rowCount === 1) {
                    req.flash('infoRed', 'Registration already exists!');
                }
                else if (regex.test(plateIn)) {
                    req.flash('infoIn', 'Plate Added!');
                    await regInsta.platesIn(plateIn);
                }
            }
            else if (plateIn === "") {
                req.flash('infoRed', 'Enter a registration plate!');
            }
    
            res.render('index', {
                output: await regInsta.allRegistrations()
            }
            );
        } catch (err) {
            console.log(err)
        }
    
    }

    async function show(req, res) {
        var showFromTown = req.body.slct;
        var list = await regInsta.findFromTown(showFromTown);
    
        if (list.length === 0 && showFromTown === "1") {
            req.flash('infoRed', 'No registration plates from Cape Town!');
        }
        else if (list.length === 0 && showFromTown === "2") {
            req.flash('infoRed', 'No registration plates from Pretoria!');
        }
        else if (list.length === 0 && showFromTown === "3") {
            req.flash('infoRed', 'No registration plates from Worcester!');
        }
        else if (list.length === 0 && showFromTown === "0") {
            req.flash('infoRed', 'Select prefered town!');
        }
    
    
        res.render('index', {
            output: list
        }
        );
    }

    async function showAll(req, res) {
        res.render('index', { output: await regInsta.allRegistrations() });
    }

    async function reset(req, res) {
        req.flash('infoIn', 'Database is successfully cleared!');
        await regInsta.clearTable();
        res.redirect('/');
    }



    return {
        home,
        actions,
        show,
        showAll,
        reset,
    }


}