transform.offset = function(date){
    return function(value) {
        return date + value;
    }
};