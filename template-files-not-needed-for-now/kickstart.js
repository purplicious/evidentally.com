
// domready (c) Dustin Diaz 2012 - License MIT
// altered to stay in Soon scope
var domready;
!function(t){domready=t()}(function(e){function p(e){h=1;while(e=t.shift())e()}var t=[],n,r=!1,i=document,s=i.documentElement,o=s.doScroll,u="DOMContentLoaded",a="addEventListener",f="onreadystatechange",l="readyState",c=o?/^loaded|^c/:/^loaded|c/,h=c.test(i[l]);return i[a]&&i[a](u,n=function(){i.removeEventListener(u,n,r),p()},r),o&&i.attachEvent(f,n=function(){/^c/.test(i[l])&&(i.detachEvent(f,n),p())}),e=o?function(n){self!=top?h?n():t.push(n):function(){try{s.doScroll("left")}catch(t){return setTimeout(function(){e(n)},50)}n()}()}:function(e){h?e():t.push(e)}});

// if doc already loaded/complete than setup immediately, else wait for DOMContentLoaded
domready(function(){

    // test if should block kickstart
    var script = document.querySelector('script[src*=soon]');
    if (script && script.getAttribute('data-auto')==='false') {
        return;
    }

    // find all soon elements
    var elements = document.getElementsByClassName ? document.getElementsByClassName('soon') : document.querySelectorAll('.soon');
    var i=0;
    var l=elements.length;

    for(;i<l;i++) {
        createByElement(elements[i]);
    }

});