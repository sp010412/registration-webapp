const assert = require('assert');
const registrationNumbers = require("../registration");
const pg = require("pg");
const Pool = pg.Pool;

const connectionString = process.env.DATABASE_URL || 'postgresql://codex:pg123@localhost:5432/registration_app';

const pool = new Pool({
    connectionString,
    ssl: {
        rejectUnauthorized: false
    }
});


describe('Registration Exercise', async function () {
    it('it should get all regstrations inserted from database', async function () {
        

        let tests = registrationNumbers(pool)
        await tests. clearTable();
        await tests.platesIn("CA 1534");
        await tests.platesIn("PA 1734");

        assert.deepEqual(await tests.allRegistrations(), [
            { "registration_numbers": "CA 1534" },
            {"registration_numbers": "PA 1734"}]);
    });

    it('it should not add duplicates of plates', async function () {
        

        let tests = registrationNumbers(pool)
        await tests. clearTable();
        await tests.platesIn("CA 1534");
        await tests.platesIn("PA 1734");
        await tests.platesIn("PA 1734");

        assert.deepEqual(await tests.allRegistrations(), [
            { "registration_numbers": "CA 1534" },
            {"registration_numbers": "PA 1734"}]);
    });
    
    it('it should return all the registration plates from Worcester', async function () {
        
        let tests = registrationNumbers(pool)
        await tests. clearTable();
        await tests.platesIn("CA 785-999");
        await tests.platesIn("WC 1234");
        await tests.platesIn("PA 1234");

        assert.deepEqual(await tests.findFromTown('3'), [
            { "registration_numbers": "WC 1234" }]);
    });

    it('it should return all the registration plates from Cape Town', async function () {
        
        let tests = registrationNumbers(pool)
        await tests. clearTable();
        await tests.platesIn("CA 785-999");
        await tests.platesIn("WC 1234");
        await tests.platesIn("PA 1234");

        assert.deepEqual(await tests.findFromTown('1'), [
            { "registration_numbers": "CA 785-999" }]);
    });

    it('it should return all the registration plates from Pretoria', async function () {
        
        let tests = registrationNumbers(pool)
        await tests. clearTable();
        await tests.platesIn("CA 785-999");
        await tests.platesIn("WC 1234");
        await tests.platesIn("PA 1234");

        assert.deepEqual(await tests.findFromTown('2'), [
            { "registration_numbers": "PA 1234" }]);
    });

});