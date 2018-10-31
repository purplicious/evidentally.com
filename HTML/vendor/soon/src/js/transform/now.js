transform.now = function() {

    // fixed date

    return function() {
        return new Date().getTime();
    }
};