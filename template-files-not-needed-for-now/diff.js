transform.diff = function(diff){
    return function(value){
        return diff - value;
    }
};