var mysql = require('mysql');
var pool = mysql.createPool({
    connectionLimit: 10,
    host: 'rm-uf6o1yx8qjr29zuc86o.mysql.rds.aliyuncs.com',
    port: '3306',
    user: 'root',
    password: 'Lbj19910115',
    database: 'zhang'
});

//连接被创建
pool.on('connection',function(){
    console.log('创建一个连接');
});
//当一个回调压入队伍等待连接的时候触发入队事件
pool.on('enqueue',function(){
    console.log('入队');
});

// 这个db封装有bug
var db = {};
db.q = function (sql, params, callback) {
    // 取出链接
    pool.getConnection(function (err, connection) {
        if (err) {
            callback(err, null);
            return;
        }
        connection.query(sql, params, function (error, results, fields) {
            console.log(`${sql}=>${params}`);
            // 释放连接
            // connection.release();
            callback(error, results);
            // error是否为空由数据库查询结果决定
        });
    });
}


// 导出对象
module.exports = {
    db,pool
};
