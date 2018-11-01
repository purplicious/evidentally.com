transform.chars = function(){
    return function(value) {
        return (value + '').split('');
    }
};