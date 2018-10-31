transform.duplicate = function(count) {
    var arr = new Array(count);
    var i;
    return function (value){
        i = count;
        while (i--) {
            arr[i] = value;
        }
        return arr;
    }
};