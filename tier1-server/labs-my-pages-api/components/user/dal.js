const mysql = require('mysql');

exports.getUser = async (id) => {
    return new Promise(function (resolve, reject) {
        try {
            const db = mysql.createConnection({
                host: process.env.DBHOST,
                port: process.env.DBPORT,
                user: process.env.DBUSER,
                password: process.env.DBPASSWORD,
                database: process.env.DBNAME
            });

            db.connect((err) => {
                if (err) {
                    reject(err);
                }
                console.log('Connected to database');
            });

            const query = 'SELECT * FROM `users` WHERE PersonalNumber = ?';

            // execute query
            db.query(query, [id], (err, result) => {
                if (err) {
                    reject(err);
                }

                resolve(result);
            });

            db.end();
        } catch (error) {
            reject(error);
        }
    });
};
