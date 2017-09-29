var express = require('express');
var bodyParser = require('body-parser');
var mongoClient = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;

var app =express();
var jsonParser = bodyParser.json();
var url = 'mongodb://localhost:27017/usersdb';

app.use(express.static(__dirname + '/public'));

app.get('/api/users', function (request, response) {
    mongoClient.connect(url, function (err, db) {
        db.collection('users').find({}).toArray(function (err, users) {
            response.send(users);
            db.close();
        });
    });
});

app.get('/api/users/:id', function (request, response) {
    var id = new objectId(request.params.id);
    mongoClient.connect(url, function (err, db) {
        db.collection('users').findOne({_id: id}, function (err, user) {
            if (err) return res.status(400).send();
            response.send(user);
            db.close();
        });
    });

});

app.post('/api/users', jsonParser, function (request, response) {
   if(!request.body) return response.sendStatus(400);

   var userName = request.body.name;
   var userAge = request.body.age;
   var user = {name:  userName, age: userAge};

   mongoClient.connect(url, function (err, db) {
       db.collection('users').insertOne(user, function (err, result) {
           if (err) return response.status(400).send();

           response.send(user);
           db.close();
       });
   });
});

app.delete("/api/users/:id", function(request, response){

    var id = new objectId(request.params.id);
    mongoClient.connect(url, function(err, db){
        db.collection("users").findOneAndDelete({_id: id}, function(err, result){

            if(err) return response.status(400).send();

            var user = result.value;
            response.send(user);
            db.close();
        });
    });
});

app.put('/api/users', jsonParser, function (request, response) {
    if (!request.body) return response.sendStatus(400);

    var id = new objectId(request.body.id);
    var userName = request.body.name;
    var userAge = request.body.age;

    mongoClient.connect(url, function (err, db) {
        db.collection('users').findOneAndUpdate({_id:id}, {$set: {age:userAge, name:userName}}, {returnOriginal: false},function (err, result) {
            if(err) return response.status(400).send();

            var user = result.value;
            response.send(user);
            db.close();
        });
    });
});

app.listen(3000, function () {
    console.log('Сервер ожидает подключения...');
});