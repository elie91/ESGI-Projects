let PropAccess = Object.prototype.prop_access = function(str) {

    if (!str || typeof str !== 'string') return this;

    let args = str.split('.');

    let obj = this;

    for (let i = 0; i < args.length; i++) {

        if (!obj || !obj.hasOwnProperty(args[i])) {
            console.log(str+ ' not exist')
        }
        obj = obj[args[i]];
    }
    return obj;
};

export default PropAccess;
