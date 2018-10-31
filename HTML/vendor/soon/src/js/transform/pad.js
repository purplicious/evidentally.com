transform.pad = function(padding){
    padding = padding || '';
    return function(value) {
        return (padding + value).slice(-padding.length);
    }
};