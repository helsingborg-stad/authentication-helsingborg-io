const mysql = require('mysql');

exports.saveForm = async (inputData) => {
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

            db.query('INSERT INTO forms SET ?', inputData, function (error, results, fields) {
                if (error) {
                    console.log(error);
                    reject(error);
                }
                resolve(results.insertId);
            });

            db.end();
        } catch (error) {
            reject(error);
        }
    });
};
