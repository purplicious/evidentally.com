transform.cap = function(min,max) {
    min = min || 0;
    max = max || 1;
    return function (value){
        return Math.min(Math.max(value,min),max);
    }
};