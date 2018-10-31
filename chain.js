transform.chain = (function(Utils){

    return function() {

        var transforms = Utils.toArray(arguments);
        var i;
        var l=transforms.length;

        return function(value) {
            for (i=0;i<l;i++) {
                value = transforms[i](value);
            }
            return value;
        }
    };

}(utils));
