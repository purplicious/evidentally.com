transform.plural = function(single,plural) {
    return function(value) {
        return parseInt(value,10) === 1 ? single : plural;
    }
};