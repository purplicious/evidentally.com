transform.event = function(test,callback) {
    return function(value) {
        if (test(value)) {
            callback();
        }
        return value;
    }
};