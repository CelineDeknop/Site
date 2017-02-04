//js to encrypt user's password
var bcrypt = require('bcrypt-nodejs');

hashMDP = function(mdp) {
    return bcrypt.hashSync(mdp, bcrypt.genSaltSync(8), null);
};

validerMDP = function(mdp) {
    return bcrypt.compareSync(mdp, this.mdp);
};