import crypto from 'crypto';

const passworder = (function(){

    function generatePassword(password){
        // Generiranje pseudonasumičnog stringa 
        const salt = crypto.randomBytes(32).toString('hex');
        
        // Generiranje kriptografskog ključa
        const hash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
        
        return {
            salt: salt,
            hash: hash
        } ;
    };

        function checkPassword(password, hash, salt){
            const testHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

            return hash === testHash;
        };

    return {
        generatePassword,
        checkPassword
    };
        
})();

export default passworder;