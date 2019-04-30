var express = require('express');
var mysql = require('mysql');
var app = express();
var RoboticHover = require('./roboticHover');
var connection = mysql.createConnection({
	//props
	host: 'localhost',
	user: 'root',
	password: '',
	database: '',
});

//setup db & table
connection.connect((err) => {
	if(err) throw err;
	connection.query("CREATE DATABASE IF NOT EXISTS `yoti-test`", (err, rows, fields) => {
		if(err) throw err;
		connection.query(
			"USE `yoti-test`", 
			(err, rows) => {
				if(err) throw err;
				//create table
				connection.query(
					"CREATE TABLE IF NOT EXISTS test (id int NOT NULL AUTO_INCREMENT PRIMARY KEY, input MEDIUMTEXT, output MEDIUMTEXT)",
					(err, rows, fields) => {
						if(!!err){
							console.log(err);
						}else{
							// console.log('table exists');
						}
					}
				)

			}
		)
	})
});

//func to persist user input & output to db
persist = (input, output) => {
	input = JSON.stringify(JSON.parse(input)).replace(/\'\"\\/g, '');
	output = JSON.stringify(output);
	connection.query(
		"INSERT INTO test (input, output) VALUES ('"+input+"', '"+output+"')",
		(err, rows, fields) => {
			if(err) throw err;
			console.log('');
			console.log('input:', input);
			console.log('output:', output);
			console.log('db entry successful');
			console.log('');
		}
	)
}

// app.use(express.json())
app.get('/', function(req, res){
	res.redirect('/RoboticHover.html');
})

app.get('/addInput/:input', function(req, res){
	let RoboticHover = require('./roboticHover');
	RoboticHover = new RoboticHover(req.params.input);
	if(RoboticHover.output){
		this.persist(req.params.input, RoboticHover.output);
	}
	res.send(RoboticHover.output);
})

app.get('/RoboticHover.html/:input', (req, res) => {
	let RoboticHover = require('./roboticHover');
	RoboticHover = new RoboticHover(req.params.input);
	if(RoboticHover.output){
		this.persist(req.params.input, RoboticHover.output);
	}
	res.send(RoboticHover.output);
});

app.use(express.static('.'))
app.listen(1111, () => {
	console.log('server running on localhost:1111');
});