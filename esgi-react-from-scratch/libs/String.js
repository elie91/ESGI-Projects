import PropAccess from './Object.js';

String.prototype.interpolate = function(object){
    return this.replace(/\{\{([^{}]*)\}\}/g,
        function (a, b) {
            return object.prop_access(b);
        }
    );

};

export default null;
