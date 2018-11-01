transform.progress = function(offset,target){
    return function(value) {
        value = parseInt(value,10);
        if (target > offset) {
            return value / target;
        }
        return (offset - value) / offset;
    }
};