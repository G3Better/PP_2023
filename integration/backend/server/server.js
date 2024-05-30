const express = require("express");
const mysql = require("mysql2");
const cors = require('cors');

const host = "localhost";
const port = 5000;
const server = express();

server.use('/public', express.static('public'));
server.use(cors())
server.use(express.json())
server.use(express.urlencoded({extended:false}))

const pool = mysql.createPool({
    connectionLimit: 5,
    host: "localhost",
    user: "root",
    database: "integration_v2",
    password: ""
  });


server.set("view engine", "hbs");

server.listen(port, host, ( error) => {
  error
    ? console.error("error = ", error)
    : console.log(`Server is running on http://${host}:${port}`);
});




// Авторизация
server.post('/api/signIn/:login', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    const { login, password } = req.body;

    pool.query(`Select * from users INNER JOIN roles ON role = roles.id_roles where users.login = '${login}' AND users.password = '${password}'`, (err, data) => {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        console.log(data);
        return res.json({ role:data[0]?.name, id:data[0]?.id_user, fio:data[0]?.FIO})
    })
})


// Регистрация
server.post('/api/signUp/:login', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    const { fio, email, post, contacts, login, password } = req.body;

    pool.query(`INSERT INTO users (id_users, FIO, email, post, contacts, role, login, password) VALUES ('NULL','${fio}','${email}','${post}','${contacts}','1','${login}','${password}')`, (err, data) => {
        if (err) return console.error(err);
        return res.json("Успещно зарегистрирован");
    })
})

// Получение всех пользователей
server.get("/api/users", function(req, res){
    pool.query("SELECT FIO as fio, roles.name as role, users.id_users as id, users.email as email, users.post as post, users.contacts as contacts FROM users INNER JOIN roles ON role=roles.id_roles", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, fio: elem.fio, role: elem.role, email: elem.email, post: elem.post, contacts: elem.contacts  }
        })
        res.json(newData);
    });
});

// Получение всех ролей
server.get("/api/roles", function(req, res){
    pool.query("SELECT * FROM `roles`", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id_roles, role: elem.name}
        })
        res.json(newData);
    });
});

// Удаление пользователя
server.delete("/api/users/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query(`Delete From users where id_users = '${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('delete user');
    });
});

// Редактирование пользователя
server.put("/api/users/edit/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id, fio, email, post, idRole, contacts } = req.body;
    pool.query(`UPDATE users SET FIO ='${fio}', email ='${email}', post ='${post}', role ='${idRole}', contacts = '${contacts}' WHERE users.id_users = '${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('user updated');
    });
});

// Получение всех ответсвенных
server.get("/api/responsible", function(req, res){
    pool.query("SELECT id_users as id, FIO as fio FROM users WHERE role!='5'", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.fio }
        })
        res.json(newData);
    });
});

// Получение всех Систем-Источников
server.get("/api/src_systems", function(req, res){
    pool.query("SELECT its.id_it_system_src AS id, its.name AS name, u.FIO AS responsible, its.test_host AS test, test_ip.ip AS test_ip, its.cert_host AS cert, cert_ip.ip AS cert_ip, its.prod_host AS prod, prod_ip.ip AS prod_ip  FROM it_system_src its JOIN users u ON its.responsible = u.id_users LEFT JOIN ip_address test_ip ON its.test_ip = test_ip.id_ip LEFT JOIN ip_address cert_ip ON its.cert_ip = cert_ip.id_ip LEFT JOIN ip_address prod_ip ON its.prod_ip = prod_ip.id_ip", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name, responsible: elem.responsible, test: elem.test, test_ip: elem.test_ip, cert: elem.cert, cert_ip: elem.cert_ip, prod: elem.prod, prod_ip: elem.prod_ip }
        })
        res.json(newData);
    });
});

// Удаление Системы-Источника
server.delete("/api/src_systems/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query(`DELETE FROM it_system_src WHERE id_it_system_src='${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('Src It System deleted');
    });
});

// Редактирование системы источника
server.put("/api/src_systems/edit/:id", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { id, name, responsible, test, test_ip, cert, cert_ip, prod, prod_ip } = req.body;
    pool.query(`UPDATE it_system_src SET name='${name}', responsible='${responsible}', test_host='${test}', test_ip='${test_ip}', cert_host='${cert}', cert_ip='${cert_ip}', prod_host='${prod}', prod_ip='${prod_ip}' WHERE id_it_system_src='${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('Src It System updated');
    });
});

// Добавление системы источника
server.post("/api/src_systems/add", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { name, responsible, test, test_ip, cert, cert_ip, prod, prod_ip } = req.body;
    pool.query(`INSERT INTO it_system_src (id_it_system_src, name, responsible, test_host, test_ip, cert_host, cert_ip, prod_host, prod_ip) VALUES ('NULL','${name}','${responsible}','${test}','${test_ip}','${cert}','${cert_ip}','${prod}','${prod_ip}')`, function(err, data) {
        if (err) return console.error(err);
        res.json('Src It System added');
    });
});

// Получение всех Систем-Получателей
server.get("/api/dst_systems", function(req, res){
    pool.query("SELECT its.id_it_system_dst AS id, its.name AS name, u.FIO AS responsible, its.test_host AS test, test_ip.ip AS test_ip, its.cert_host AS cert, cert_ip.ip AS cert_ip, its.prod_host AS prod, prod_ip.ip AS prod_ip  FROM it_system_dst its JOIN users u ON its.responsible = u.id_users LEFT JOIN ip_address test_ip ON its.test_ip = test_ip.id_ip LEFT JOIN ip_address cert_ip ON its.cert_ip = cert_ip.id_ip LEFT JOIN ip_address prod_ip ON its.prod_ip = prod_ip.id_ip", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name, responsible: elem.responsible, test: elem.test, test_ip: elem.test_ip, cert: elem.cert, cert_ip: elem.cert_ip, prod: elem.prod, prod_ip: elem.prod_ip   }
        })
        res.json(newData);
    });
});

// Удаление системы получателя
server.delete("/api/dst_systems/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query(`DELETE FROM it_system_dst WHERE id_it_system_dst='${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('It Dst System deleted');
    });
});

// Редактирование системы получателя
server.put("/api/dst_systems/edit/:id", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { id, name, responsible, ip } = req.body;
    pool.query(`UPDATE it_system_dst SET name='${name}', responsible='${responsible}', test_host='${test}', test_ip='${test_ip}', cert_host='${cert}', cert_ip='${cert_ip}', prod_host='${prod}', prod_ip='${prod_ip}' WHERE id_it_system_dst='${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('It Dst System updated');
    });
});

// Добавление системы получателя
server.post("/api/dst_systems/add", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { name, responsible, ip } = req.body;
    pool.query(`INSERT INTO it_system_dst (id_it_system_dst, name, responsible, test_host, test_ip, cert_host, cert_ip, prod_host, prod_ip) VALUES ('NULL','${name}','${responsible}','${test}','${test_ip}','${cert}','${cert_ip}','${prod}','${prod_ip}')`, function(err, data) {
        if (err) return console.error(err);
        res.json('It Dst System added');
    });
});

// Получение систем-источников для заказов
server.get("/api/src_systems_order", function(req, res){
    pool.query("SELECT id_it_system_src as id, name as name FROM it_system_src", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name }
        })
        res.json(newData);
    });
});

// Получение систем-получателей для заказов
server.get("/api/dst_systems_order", function(req, res){
    pool.query("SELECT id_it_system_dst as id, name as name FROM it_system_dst", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name }
        })
        res.json(newData);
    });
});

// Получение владельца для заявки
server.get("/api/users_order", function(req, res){
    pool.query("SELECT id_users as id, FIO as name FROM users", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name }
        })
        res.json(newData);
    });
});

// Получение частоты вызова для заказов
server.get("/api/requests_rate", function(req, res){
    pool.query("SELECT id_request_rate as id, rate as rate FROM request_rate", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.rate }
        })
        res.json(newData);
    });
});

// Получение статусов для заказов
server.get("/api/statuses", function(req, res){
    pool.query("SELECT id_status as id, name as name FROM status", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name }
        })
        res.json(newData);
    });
});

// Получение типов авторизации для заказов
server.get("/api/authorization", function(req, res){
    pool.query("SELECT id_authorization as id, name as name FROM authorization", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name }
        })
        res.json(newData);
    });
});

// Получение заявок
server.get("/api/orders", function(req, res){
    pool.query("SELECT id_order as id_order, it_system_src.name as source_system, it_system_dst.name as dest_system, users.FIO as customer, authorization.name as authorization, request_rate.rate as request_rate, status.name AS status, description, swagger FROM `order`, it_system_src, it_system_dst, users, authorization, request_rate, status WHERE source_system=it_system_src.id_it_system_src AND dest_system=it_system_dst.id_it_system_dst AND customer=users.id_users AND authorization=authorization.id_authorization AND request_rate=request_rate.id_request_rate AND status=status.id_status", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id_order, source: elem.source_system, dest: elem.dest_system, customer: elem.customer, authorization: elem.authorization, request_rate: elem.request_rate, status: elem.status, description: elem.description, swagger: elem.swagger   }
        })
        res.json(newData);
    });
});

// Удаление заявки
server.delete("/api/orders/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query("DELETE FROM `order` WHERE id_order='"+id+"'", function(err, data) {
        if (err) return console.error(err);
        res.json('Order deleted');
    });
});

// Редактирование заказов
server.put("/api/orders/edit/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id, source_system, dest_system, request_rate, status, authorization, customer, description, swagger } = req.body;
    console.log(req.body);
    pool.query("UPDATE `order` SET source_system="+source_system+", dest_system="+dest_system+", customer="+customer+", authorization='"+authorization+"', request_rate='"+request_rate+"', status='"+status+"', description='"+description+"', swagger='"+swagger+"' WHERE id_order='"+id+"'", function(err, data) {
        if (err) return console.error(err);
        res.json('orders updated');
    });
});

// Добавление заказов
server.post("/api/orders/add", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { source_system, dest_system, request_rate, status, authorization, customer, description, swagger } = req.body;
    pool.query("INSERT INTO `order` (id_order, source_system, dest_system, customer, authorization, request_rate, status, description, swagger) VALUES ('Null','"+source_system+"','"+dest_system+"','"+customer+"','"+authorization+"','"+request_rate+"','"+status+"','"+description+"','"+swagger+"')", function(err, data) {
        if (err) return console.error(err);
        res.json('orders updated');
    });
});

// Получение всех Ip
server.get("/api/ips", function(req, res){
    pool.query("SELECT id_ip as id, ip as name, description FROM ip_address", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name, desc: elem.description}
        })
        res.json(newData);
    });
});

// Удаление Ip
server.delete("/api/ips/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query(`DELETE FROM ip_address WHERE id_ip='${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('Ip deleted');
    });
});

// Редактирование Ip
server.put("/api/ips/edit/:id", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { id, name, desc } = req.body;
    pool.query(`UPDATE ip_address SET ip='${name}', description='${desc}' WHERE id_ip='${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('Ip updated');
    });
});

// Добавление Ip
server.post("/api/ips/add", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { name, desc } = req.body;
    pool.query(`INSERT INTO ip_address(id_ip, ip, description) VALUES ('Null','${name}','${desc}')`, function(err, data) {
        if (err) return console.error(err);
        res.json('Ip added');
    });
});