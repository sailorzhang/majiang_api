const mysql = require('mysql2');
const _ = require('underscore');

// 创建与 MySQL 服务器的连接池
const pool = mysql.createPool({
    host: process.env.mysql_host, // MySQL 主机地址
    user: process.env.mysql_user,      // MySQL 登录用户名
    password: process.env.mysql_password,     // MySQL 密码（根据自己设置）
    database: process.env.mysql_database   // 要连接的数据库名称
});


executeSQL = (sqlQuery, args) => {
    return new Promise((resolve, reject) => {
        // 从连接池获取连接对象
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                // 执行 SQL 查询
                connection.execute(sqlQuery, args, (error, results) => {
                    connection.release(); // 释放连接对象
                    if (error) {
                        reject(error)
                    } else {
                        resolve(results)
                    }
                });
            }
        });
    })
}

executeSQLs = ((querys, usingTransaction=true) => {
    return new Promise((resolve, reject) => {
        // 从连接池获取连接对象
        pool.getConnection((err, connection) => {
            if (err) {
                reject(err);
            } else {
                // 执行 SQL 查询
                usingTransaction && connection.beginTransaction();
                querys = querys.map(query => {
                    return new Promise((res, rej) => {
                        const sql = _.isObject(query) ? query.sql : query;
                        const args = _.isObject(query) ? query.args : [];
                        connection.execute(sql, args, (error, results) => {
                            if (error) {
                                rej(error);
                            }
                            res(results);
                        });
                    });
                });

                Promise.all(querys).then((results) => {
                    usingTransaction && connection.commit();
                    resolve(results)
                }).catch((error) => {
                    usingTransaction && connection.rollback();
                    reject(error)
                }).finally(() => {
                    connection.release(); // 释放连接对象
                });
            }
        });
    });
});

module.exports = { executeSQL, executeSQLs }



