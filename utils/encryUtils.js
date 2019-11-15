
//加密
var crypto = require('crypto');
exports.encrypt = function(content){
    return crypto.createHash('md5').update(content).update('zfkey').digest('hex');
}