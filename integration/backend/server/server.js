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
    database: "game_club",
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

    pool.query(`Select * from users INNER JOIN users_type ON Users_Type_REG_Number = users_type.REG_Number where users.Name = '${login}' AND Password = '${password}'`, (err, data) => {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        console.log(data);
        return res.json({ role:data[0]?.Name, id:data[0]?.REG_Number, fio:data[0]?.FIO})
    })
})


// Регистрация
server.post('/api/signUp/:login', (req, res) => {
    if(!req.body) return res.sendStatus(400);
    const { fio, login, password } = req.body;
    pool.query(`INSERT INTO users (REG_Number, Name, Password, FIO, Users_Type_REG_Number) VALUES (NULL, '${login}', '${password}', '${fio}', '1')`, (err, data) => {
        if (err) return console.error(err);
        return res.json("Успещно зарегистрирован");
    })
})

// Получение всех пользователей
server.get("/api/employees", function(req, res){
    pool.query("SELECT FIO, users_type.Name as role, users.REG_Number as id FROM users INNER JOIN users_type ON Users_Type_REG_Number=users_type.REG_Number", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, fio: elem.FIO, role: elem.role  }
        })
        res.json(newData);
    });
});

// Получение всех ролей
server.get("/api/roles", function(req, res){
    pool.query("SELECT * FROM `users_type`", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.REG_Number, role: elem.Name  }
        })
        res.json(newData);
    });
});

// Удаление пользователя
server.delete("/api/employee/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query(`Delete From users where REG_Number = '${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('delete user');
    });
});

// Редактирование пользователя
server.put("/api/employee/edit/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id, fio, idRole } = req.body;
    pool.query(`UPDATE users SET FIO = '${fio}', Users_Type_REG_Number = '${idRole}' WHERE users.REG_Number = '${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('user updated');
    });
});

// Получение всех бронирований
server.get("/api/booking", function(req, res){
    pool.query("SELECT * FROM `бронирования`", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.REG_Number, Incoming_DateTime: elem.Incoming_DateTIme, FIO: elem.FIO, Rental_Time: elem.Rental_Time, game_place: elem.game_place   }
        })
        res.json(newData);
    });
});

// Получение всех Игровых мест
server.get("/api/game_places", function(req, res){
    pool.query("SELECT game_places.`REG_Number` as id, game_places.`Name` as name, `Cost` as cost, computers.Name as computer, status.Name as status, game_places_category.Name as category FROM `game_places`, computers, game_places_category, status WHERE Computers_REG_Number=computers.REG_Number and game_places.Status_REG_Number=status.REG_Number and Game_Places_Category_REG_Number=game_places_category.REG_Number;", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.id, name: elem.name, cost: elem.cost, computer: elem.computer, status: elem.status, category: elem.category   }
        })
        res.json(newData);
    });
});

// Получение всех игровых мест для модалки
server.get("/api/game_places_model", function(req, res){
    pool.query("SELECT * FROM `game_places`", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.REG_Number, name: elem.Name  }
        })
        res.json(newData);
    });
});

// Получение всех статусов игрового места
server.get("/api/statuses", function(req, res){
    pool.query("SELECT * FROM `status` WHERE REG_Number=5 or REG_Number=6 or REG_Number=7", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.REG_Number, name: elem.Name  }
        })
        res.json(newData);
    });
});

// Получение всех компьютеров
server.get("/api/computers", function(req, res){
    pool.query("SELECT * FROM `computers`", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.REG_Number, name: elem.Name  }
        })
        res.json(newData);
    });
});

// Получение всех категорий игровых мест
server.get("/api/game_places_category", function(req, res){
    pool.query("SELECT * FROM `game_places_category`", function(err, data) {
        if (err) return console.error(err);
        if(!data.length) return res.sendStatus(400);
        const newData = data.map((elem) => {
            return { id: elem.REG_Number, name: elem.Name }
        })
        res.json(newData);
    });
});

// Удаление игрового места
server.delete("/api/game_places/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query(`DELETE FROM game_places WHERE REG_Number = '${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('game_place deleted');
    });
});

// Редактирование игрового места
server.put("/api/game_places/edit/:id", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { id, name, cost, computer, status, category } = req.body;
    pool.query(`UPDATE  game_places  SET  Name ='${name}', Cost ='${cost}', Computers_REG_Number ='${computer}', Status_REG_Number ='${status}', Game_Places_Category_REG_Number ='${category}' where game_places.REG_Number='${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('game_place updated');
    });
});

// Добавление игрового места
server.post("/api/game_places/add", function (req, res) {
    if (!req.body) return res.sendStatus(400);
    const { name, cost, computer, status, category } = req.body;
    pool.query(`INSERT INTO  game_places ( REG_Number ,  Name ,  Cost ,  Computers_REG_Number ,  Status_REG_Number ,  Game_Places_Category_REG_Number ) VALUES (Null,'${name}','${cost}','${computer}','${status}','${category}')`, function(err, data) {
        if (err) return console.error(err);
        res.json('game_place added');
    });
});

// Удаление booking
server.delete("/api/booking/delete/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id } = req.body;
    pool.query(`Delete From booking where REG_Number = '${id}'`, function(err, data) {
        if (err) return console.error(err);
        res.json('delete booking');
    });
});


// Редактирование booking
server.put("/api/booking/edit/:id", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { id, Incoming_DateTime, FIO, Rental_Time, game_place } = req.body;
    console.log(req.body);
    pool.query(`UPDATE booking SET Incoming_DateTIme='${Incoming_DateTime}', Rental_Time=${Rental_Time}, Users_REG_Number='${FIO}', Game_Places_REG_Number=${game_place} WHERE REG_Number=${id}`, function(err, data) {
        if (err) return console.error(err);
        res.json('booking updated');
    });
});

// Добавление booking
server.post("/api/booking/add", function (req, res) {
    if(!req.body) return res.sendStatus(400);
    const { Incoming_DateTime, FIO, Rental_Time, game_place } = req.body;
    console.log(req.body);
    console.log(Incoming_DateTime);
    pool.query(`INSERT INTO booking (REG_Number, Incoming_DateTIme, Rental_Time, Users_REG_Number, Game_Places_REG_Number) VALUES (Null,'${Incoming_DateTime}','${Rental_Time}','${FIO}','${game_place}')`, function(err, data) {
        if (err) return console.error(err);
        res.json('booking updated');
    });
});
