describe('Registration Exersice', function () {
    it('it should get regstrations set', function () {
        let tests = registrationNumbers()
        tests.storePlates("CA 1534")
        tests.storePlates("CA 1634")
        tests.storePlates("CA 1734")

        assert.deepEqual(tests.getStorePlates(), ["CA 1534", "CA 1634", "CA 1734"]);
    });

    it('it should prevent duplication of regstrations from being added', function () {
        let tests = registrationNumbers()
        tests.storePlates("CA 7589")
        tests.storePlates("CA 7888")
        tests.storePlates("PA 7586")
        tests.storePlates("WC 7852")
        tests.storePlates("WC 7852")

        assert.deepEqual(tests.getStorePlates(), ['CA 7589', 'CA 7888', 'PA 7586', 'WC 7852']);
    });

    it('it should take in lower case letters and display in upperCase letters', function () {
        let tests = registrationNumbers()
        tests.storePlates("ca 7589")
        tests.storePlates("ca 7888")
        tests.storePlates("pa 7586")
        tests.storePlates("wc 7852")

        assert.deepEqual(tests.getStorePlates(), ['CA 7589', 'CA 7888', 'PA 7586', 'WC 7852']);
    });

    it('it should return all the registration plates from Cape Town', function () {
        let tests = registrationNumbers()
        tests.storePlates("ca 7589")
        tests.storePlates("CA 563-859")
        tests.storePlates("pa 758 889")
        tests.storePlates("wc 7852")

        assert.deepEqual(tests.filtered('CA'), ['CA 7589', 'CA 563-859']);
    });

    it('it should return all the registration plates from Pretoria', function () {
        let tests = registrationNumbers()
        tests.storePlates("ca 7589")
        tests.storePlates("CA 563-859")
        tests.storePlates("pa 758 889")
        tests.storePlates("wc 7852")

        assert.deepEqual(tests.filtered('PA'), ['PA 758 889']);
    });

    it('it should return all the registration plates from Worcester', function () {
        let tests = registrationNumbers()
        tests.storePlates("ca 7589")
        tests.storePlates("CA 563-859")
        tests.storePlates("pa 758 889")
        tests.storePlates("wc 7852")

        assert.deepEqual(tests.filtered('WC'), ['WC 7852']);
    });

});