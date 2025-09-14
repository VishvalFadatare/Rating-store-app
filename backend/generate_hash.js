const bcrypt = require('bcrypt');
const password = 'MyNewPassword!123'; // <-- Your desired password
bcrypt.hash(password, 10, (err, hash) => {
    if (err) throw err;
    console.log('Your new password hash is:', hash);
});