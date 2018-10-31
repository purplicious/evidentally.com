transform.modulate = function(char) {
    return function(value) {
        return parseInt(value,10) % 2 === 0 ? char : '';
    }
};