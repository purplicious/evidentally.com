view.Matrix = (function(){

    var digits = {
        ' ':[
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0],
            [0,0,0,0,0]
        ],
        '0':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '1':[
            [0,0,1,1,0],
            [0,1,1,1,0],
            [0,0,1,1,0],
            [0,0,1,1,0],
            [0,0,1,1,0],
            [0,0,1,1,0],
            [0,1,1,1,1]
        ],
        '2':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [0,0,0,1,1],
            [0,0,1,1,0],
            [0,1,1,0,0],
            [1,1,0,0,0],
            [1,1,1,1,1]
        ],
        '3':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [0,0,0,1,1],
            [0,0,1,1,0],
            [0,0,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '4':[
            [0,0,1,1,1],
            [0,1,0,1,1],
            [1,1,0,1,1],
            [1,1,1,1,1],
            [0,0,0,1,1],
            [0,0,0,1,1],
            [0,0,0,1,1]
        ],
        '5':[
            [1,1,1,1,1],
            [1,1,0,0,0],
            [1,1,0,0,0],
            [1,1,1,1,0],
            [0,0,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '6':[
            [0,1,1,1,0],
            [1,1,0,0,0],
            [1,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '7':[
            [1,1,1,1,1],
            [0,0,0,1,1],
            [0,0,0,1,1],
            [0,0,1,1,0],
            [0,1,1,0,0],
            [1,1,0,0,0],
            [1,1,0,0,0]
        ],
        '8':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,0]
        ],
        '9':[
            [0,1,1,1,0],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [1,1,0,1,1],
            [0,1,1,1,1],
            [0,0,0,1,1],
            [0,1,1,1,0]
        ]
    };

    var rows = digits[0].length;
    var cols = digits[0][0].length;
    var i=0, j,html='';
    for(;i<rows;i++) {
        html+='<span class="soon-matrix-row">';
        j=0;
        for(;j<cols;j++) {
            html+='<span class="soon-matrix-dot"></span>';
        }
        html+='</span>';
    }

    var exports = function(options) {

        this._wrapper = document.createElement('span');
        this._wrapper.className = 'soon-matrix ' + (options.className || '');

        this._inner = document.createElement('span');
        this._inner.className = 'soon-matrix-inner';
        this._wrapper.appendChild(this._inner);

        this._transform = options.transform || function(value) {return value;};
        this._value = [];

    };

    exports.prototype = {

        redraw:function(){},

        destroy:function() {

            // no need to clean up, just node removal

            return this._wrapper;
        },

        getElement:function(){
            return this._wrapper;
        },

        _addChar:function() {

            var char = document.createElement('span');
            char.className = 'soon-matrix-char';
            char.innerHTML = html;
            return {
                node:char,
                ref:[]
            };

        },

        _updateChar:function(char,value) {

            // get dot layout
            var matrix = digits[value];

            // update character
            var j,i= 0,ref = char.ref;
            if(!ref.length) {
                var dots = char.node.getElementsByClassName('soon-matrix-dot');
                for(;i<rows;i++) {
                    ref[i] = [];
                    j=0;
                    for(;j<cols;j++) {
                        ref[i][j] = dots[(i * cols) + j];
                    }
                }
            }

            for(;i<rows;i++) {
                j=0;
                for(;j<cols;j++) {
                    ref[i][j].setAttribute('data-state',matrix[i][j]===1 ? '1' : '0');
                }
            }

        },


        setValue:function(value) {

            value = this._transform(value);
            value += '';
            value = value.split('');
            var i=0;
            var l=value.length;

            for(;i<l;i++) {
                var char = this._value[i];
                if(!char) {
                    char = this._addChar();
                    this._inner.appendChild(char.node);
                    this._value[i] = char;
                }
                this._updateChar(char,value[i]);
            }

        }
    };

    return exports;

}());