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
    database: "integration",
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
    const { fio, login, password } = req.body;

    pool.query(`INSERT INTO users (id_users, FIO, email, post, role, login, password) VALUES ('NULL','${fio}','необходимо заполнить','необходимо заполнить','1','${login}','${password}')`, (err, data) => {
        if (err) return console.error(err);
        return res.json("Успещно зарегистрирован");
    })
})

// Получение всех пользователей
server.get("/api/users", function(req, res){
    pool.query("SELECT FIO as fio, roles.name as role, users.id_users as id, users.email as email, users.post as post FROM users INNER JOIN roles ON role=roles.id_roles", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, fio: elem.fio, role: elem.role, email: elem.email, post: elem.post  }
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
    const { id, fio, email, post, idRole } = req.body;
    pool.query(`UPDATE users SET FIO ='${fio}', email ='${email}', post ='${post}', role ='${idRole}' WHERE users.id_users = '${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('user updated');
    });
});

// Получение всех Систем
server.get("/api/systems", function(req, res){
    pool.query("SELECT id_it_system as id, name as name, FIO as responsible, ip_address as ip FROM it_system, users WHERE responsible=users.id_users", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name, responsible: elem.responsible, ip: elem.ip   }
        })
        res.json(newData);
    });
});

// Получение всех ответсвенных
server.get("/api/responsible", function(req, res){
    pool.query("SELECT id_users as id, FIO as fio FROM users WHERE role=2", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.fio }
        })
        res.json(newData);
    });
});

// Удаление системы
server.delete("/api/systems/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query(`DELETE FROM it_system WHERE id_it_system='${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('game_place deleted');
    });
});

// Редактирование системы
server.put("/api/systems/edit/:id", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { id, name, responsible, ip } = req.body;
    pool.query(`UPDATE it_system SET name='${name}', responsible='${responsible}', ip_address='${ip}' WHERE id_it_system='${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('game_place updated');
    });
});

// Добавление системы
server.post("/api/systems/add", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { name, responsible, ip } = req.body;
    pool.query(`INSERT INTO it_system ( id_it_system, name, responsible, ip_address) VALUES ('NULL','${name}','${responsible}','${ip}')`, function(err, data) {
        if (err) return console.error(err);
        res.json('game_place added');
    });
});

// Получение всех систем для модалки
server.get("/api/game_places_model", function(req, res){
    pool.query("SELECT * FROM `it_systems`", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id_it_system, name: elem.name  }
        })
        res.json(newData);
    });
});



// Получение всех заказов
server.get("/api/orders", function(req, res){
    pool.query("SELECT id_order, it_system.name as source_system, destination_system, users.FIO as customer, autorization.name as autorization, requests.rate as requests_rate, status.name AS status, `description` FROM `order`, it_system, users, autorization, requests, status WHERE source_system=it_system.id_it_system AND customer=users.id_users AND autorization=autorization.id_autorization AND requests_rate=requests.id_requests AND status=status.id_status", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id_order, source_systems: elem.source_system, dist_systems: elem.destination_system, customers: elem.customer, authorizations: elem.autorization, requests_rates: elem.requests_rate, statuses: elem.status, description: elem.description   }
        })
        res.json(newData);
    });
});

// Удаление заказов
server.delete("/api/orders/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query("DELETE FROM order WHERE id_order='${id}'", function(err, data) {
        if (err) return console.error(err);
        res.json('delete booking');
    });
});


// Редактирование заказов
server.put("/api/orders/edit/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id, source_system, destination_system, customer, autorization, requests_rate, status, description } = req.body;
    console.log(req.body);
    pool.query("UPDATE `order` SET source_system='${source_system}', destination_system='${destination_system}', customer='${customer}', autorization='${autorization}', requests_rate='${requests_rate}', status='${status}', description='${description}' WHERE id_order='${id}'", function(err, data) {
        if (err) return console.error(err);
        res.json('orders updated');
    });
});

// Добавление заказов
server.post("/api/orders/add", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { source_system, destination_system, customer, autorization, requests_rate, status, description } = req.body;
    console.log(req.body);
    console.log(Incoming_DateTime);
    pool.query("INSERT INTO `order`(id_order, source_system, destination_system, customer, autorization, requests_rate, status, description) VALUES ('Null','${source_system}','${destination_system}','${customer}','${autorization}','${requests_rate}','${status}','${description}')", function(err, data) {
        if (err) return console.error(err);
        res.json('orders updated');
    });
});

// Получение всех исходных систем
server.get("/api/source_systems", function(req, res){
    pool.query("SELECT id_it_system as id, name as name FROM it_system", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name }
        })
        res.json(newData);
    });
});

// Получение всех конечных систем
server.get("/api/dist_systems", function(req, res){
    pool.query("SELECT id_it_system as id, name as name FROM it_system", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name }
        })
        res.json(newData);
    });
});

// Получение всех заказчиков
server.get("/api/customers", function(req, res){
    pool.query("SELECT id_users as id, FIO as fio FROM users WHERE role=1", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.fio }
        })
        res.json(newData);
    });
});

// Получение всех авторизаций
server.get("/api/authorizations", function(req, res){
    pool.query("SELECT id_autorization as id, name as name FROM autorization", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name }
        })
        res.json(newData);
    });
});

// Получение всех частот запроса
server.get("/api/requests_rates", function(req, res){
    pool.query("SELECT id_requests as id, rate as name FROM requests", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name }
        })
        res.json(newData);
    });
});

// Получение всех статусов
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