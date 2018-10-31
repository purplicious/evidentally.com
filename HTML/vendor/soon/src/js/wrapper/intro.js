(function(win,jQuery,undefined){

    // if no query selector or soon has already been loaded / when using a module loader the test is irrelevant
    if (!document.querySelectorAll || win.Soon) {return;}

    var exports = {};
    var utils = {};
    var view = {};
    var transform = {};

    // setup resizer
    var resizer = {
        timer:0,
        cbs:[],
        register:function(cb) {
            resizer.cbs.push(cb);
        },
        deregister:function(cb){
            var i=resizer.cbs.length-1;
            for(;i>=0;i--) {
                if (resizer.cbs[i]===cb) {
                    resizer.cbs.splice(i,1);
                }
            }
        },
        onresize:function(){
            clearTimeout(resizer.timer);
            resizer.timer = setTimeout(function(){
                resizer.resize();
            },100);
        },
        resize:function(){
            var i= 0,l=resizer.cbs.length;
            for(;i<l;i++) {
                resizer.cbs[i]();
            }
        },
        init:function(){
            if (!win.addEventListener){return;}
            win.addEventListener('resize',resizer.onresize,false);
        }
    };

    resizer.init();
