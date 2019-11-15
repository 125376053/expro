const Sequelize = require('sequelize');
const sequelize = new Sequelize('zhang', 'root', 'Lbj19910115', {
    host: 'rm-uf6o1yx8qjr29zuc86o.mysql.rds.aliyuncs.com',
    dialect: 'mysql',
    port:3306,
    // 生产环境连接池子
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    },
    dialectOptions: {
        //字符集
        // charset:'utf8mb4',
        // collate:'utf8mb4_unicode_ci',
        // supportBigNumbers: true,
        // bigNumberStrings: true
    },
    define: {
        charset: 'utf8mb4'
    }
});
// 测试链接
sequelize.authenticate().then(() => {
    console.log('Connection has been established successfully.');
}).catch(err => {
    console.error('Unable to connect to the database:', err);
});

const User = sequelize.define('user', {
    // 属性
    user:{
        type: Sequelize.STRING,
        allowNull: false
    },
    pass:{
        type: Sequelize.STRING
    }
}, {
    // 参数
    timestamps: false, // 不应用默认生产行为
    tableName: 'user', // 设置表名
    freezeTableName:true
});

exports.create=async function create(append){
    await sequelize.sync()
    return await User.create(append)
}

exports.getOne = async function getOne(obj){
    return await User.findOne(obj)
}

exports.getAll=async function getAll(order){
    return await User.findAll(order)
}

exports.getPage=async function getPage(page){
    return await User.findAll(page)
}

exports.remove=async function remove(id){
    return await User.destroy(id)
}

exports.update=async function update(what,tj){
    return await User.update(what,tj)
}