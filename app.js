/****************************************************************************** *** * 
 * ITE5315 – Assignment 4 * I declare that this assignment is my own work in accordance with Humber Academic Policy. 
 * * No part of this assignment has been copied manually or electronically from any other source 
 * * (including web sites) or distributed to other students. 

* * Name: STEVEN MARTY M. CES Student ID: N01639939 Date: November 26, 2023* 
* ****************************************************************************** **/

var express  = require('express');
var mongoose = require('mongoose');
var app      = express();
var database = require('./config/database');
var bodyParser = require('body-parser');         // pull information from HTML POST (express4)
 
var port     = process.env.PORT || 8000;
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json

//loads the path module
const path = require('path');

//declaring constant variable fs(File system)
const fs = require('fs');

//load the handlebars module
const exphbs = require('express-handlebars');

// Import the 'handlebars' module
const handlebars = require('handlebars');

// Import the 'handlebars-helpers' module
const handlebarsHelpers = require('handlebars-helpers');

// Register the handlebars helpers
handlebarsHelpers({ handlebars: handlebars });

//sets the connection of the web app to the directory "Public"
app.use(express.static(path.join(__dirname, 'public')));

//sets handlebars configurations
//app.engine('.hbs', exphbs.engine({ extname: '.hbs' })); // no .engine at the exphbs that's why the error says "TypeError: exphbs is not a function" xD
// Set up Handlebars as the view engine
app.engine('.hbs', exphbs.engine({ 
	extname: '.hbs', 
	defaultLayout: 'main',
	layoutsDir: path.join(__dirname, 'views/layouts'),
	runtimeOptions: {
		allowProtoPropertiesByDefault: true, //disable the warning for accessing non-own properties
		allowProtoMethodsByDefault: true //disable the warning for accessing non-own methods
	}
  }));


//configures the Express application in order to use the Handlebars templating engine
//therefore allowing the main, index and error handlebars to work automatically
app.set('view engine', 'hbs');


mongoose.connect(database.url);

var Cars = require('./models/cars');
/************************************************************************************************************************************************* */
//Question 2. Step 3
//get all employee data from db
//app.get('/api/employees', function(req, res) {

//get all cars data from db
	app.get('/api/cars', function(req, res) {
	// use mongoose to get all todos in the database
	Cars.find({}, function(err, cars) {
		//send the error if there is an error retrieving
		if (err) {
		  res.status(500).send(err);
		} else {
		console.log(cars);
		  //render the 'table' view with the retrieved cars
		  console.log(cars);
		  res.render('table', { cars: cars });
		}
	  });
	});
/************************************************************************************************************************************************* */
//reference to assignment #2, using index to search each cars one by one according to their _id number
app.get('/api/cars/:index', (req, res) => {
	const index = parseInt(req.params.index);
	
	//use Mongoose to get all cars in the database
	Cars.find({}, function(err, cars) {
	  if (err) {
		//executes when there's an error reading from the database, log the error and send a 500 status response
		console.error(err);
		res.status(500).send('Error loading data from database');
		return;
	  }
	
	  if (index >= 0 && index < cars.length) {
		// Retrieves the car data at the specified index when the statement is true
		const carData = cars[index];
	
		//render the 'table' view with the car data
		res.render('table', { cars: [carData] }, (err, html) => {
		  if (err) {
			//log an error and send a 500 status response when there's an error rendering the template
			console.error(err);
			res.status(500).send('Error rendering template');
			return;
		  }
		  
		  //send the rendered HTML as the response
		  res.send(html);
		});
	  } else {
		//log an error and send a 404 status response when the index is invalid
		console.log(`Invalid index: ${index}`);
		res.status(404).send(`Invalid index: ${index}`);
	  }
	});
  });
/************************************************************************************************************************************************* */  
//reference to assignment #2, using index to search each cars one by one according to their Invoice_ID
  app.set('view engine', '.hbs');
app.post('/api/cars/search', (req, res) => {
	app.use(express.static(path.join(__dirname, 'public')));
	app.engine('.hbs', exphbs.engine({ 
		extname: '.hbs', 
		defaultLayout: 'main',
		layoutsDir: path.join(__dirname, 'views/layouts'),
		runtimeOptions: {
			allowProtoPropertiesByDefault: true, //disable the warning for accessing non-own properties
			allowProtoMethodsByDefault: true //disable the warning for accessing non-own methods
		}
	  }));
	res.render('search');
  });
  
  app.post('/searched', (req, res) => {
	const keyword = req.body.keyword;
  
	//use Mongoose to get all cars in the database
	Cars.find({}, function(err, cars) {
	  if (err) {
		console.error(err);
		res.status(500).send('Error loading data from database');
		return;
	  }
  
	  const filteredData = cars.filter(
		item =>
		  item.InvoiceNo.toLowerCase().includes(keyword.toLowerCase()) ||
		  item.Manufacturer.toLowerCase().includes(keyword.toLowerCase())
	  );
  
	  if (filteredData.length > 0) {
		res.render('manufacturer', { carSalesData: filteredData });
	  } else {
		res.send('No results found');
	  }
	});
  });
  
/************************************************************************************************************************************************* */  
  //https://previews.123rf.com/images/usataro/usataro2008/usataro200800015/152755482-anaheim-ca-usa-nov-26-2010-cars-lightning-mcqueen-in-the-disney-pixar-california-advance-parade-at.jpg
  app.post('/api/addcars', function(req, res) {
    //log the request body to the console
    console.log(req.body);

    //create a new document in the Cars collection
    Cars.create({
        _id: mongoose.Types.ObjectId(),
        InvoiceNo: req.body.InvoiceNo,
        image: Buffer.from(req.body.image, 'base64'),
        Manufacturer: req.body.Manufacturer,
        class: req.body.class,
        Sales_in_thousands: req.body.Sales_in_thousands,
        __year_resale_value: req.body.__year_resale_value ? mongoose.Types.Decimal128.fromString(req.body.__year_resale_value) : undefined,
        Vehicle_type: req.body.Vehicle_type,
        Price_in_thousands: req.body.Price_in_thousands,
        Engine_size: req.body.Engine_size,
        Horsepower: req.body.Horsepower,
        Wheelbase: req.body.Wheelbase,
        Width: req.body.Width,
        Length: req.body.Length,
        Curb_weight: req.body.Curb_weight,
        Fuel_capacity: req.body.Fuel_capacity,
        Fuel_efficiency: req.body.Fuel_efficiency,
        Latest_Launch: new Date(req.body.Latest_Launch),
        Power_perf_factor: req.body.Power_perf_factor,
        features: req.body.features,
        specs: req.body.specs,
        isElectric: req.body.isElectric
    }, function(err, car) {
        if (err) {
            res.status(500).send(err);
        } else {
            // Get and return all the cars after the newly created car record
            Cars.find(function(err, cars) {
                if (err) {
                    res.status(500).send(err);
                } else {
                    res.json(cars);
                }
            });
        }
    });
});
/************************************************************************************************************************************************* */  
//updating car
app.put('/api/updatecars/:invoice_no/:manufacturer/:sales_in_thousands', function(req, res) {
    console.log(req.body);

    let invoice_no = req.params.invoice_no;
    let manufacturer = req.params.manufacturer;
    let sales_in_thousands = req.params.sales_in_thousands;
    var data = {
        Manufacturer: manufacturer,
        Sales_in_thousands: sales_in_thousands
    }

    Cars.findOneAndUpdate({InvoiceNo: invoice_no, Manufacturer: manufacturer, Sales_in_thousands: sales_in_thousands}, data, {new: true, upsert: true}, function(err, car) {
        if (err) {
            console.error(err);
            res.status(500).send('Internal server error');
            return;
        }
    
        if (car) {
            res.send('Successfully! Car updated - '+car.Manufacturer);
        } else {
            res.send('No car found with the provided details.');
        }
    });
});

/************************************************************************************************************************************************* */  
//deleting the record using invoice_id

var Invoice = require('./models/cars'); 
app.delete('/api/deletecars/:invoice_id', function(req, res) {
    console.log(req.params.invoice_id);
    let id = req.params.invoice_id;
    Invoice.deleteOne({InvoiceNo: id}, function(err, result) {
		if (err) {
			res.send(err);
		} else if (result.deletedCount == 0) {
			res.send('No invoice with ID ' + id + ' was found.');
		} else {
			res.send('Successfully! Invoice with ID ' + id + ' has been deleted.');
		}
	});
});



/************************************************************************************************************************************************* */  
// get a employee with ID of 1
app.get('/api/employees/:employee_id', function(req, res) {
	let id = req.params.employee_id;
	Employee.findById(id, function(err, employee) {
		if (err)
			res.send(err)
 
		res.json(employee);
	});
 
});
// create employee and send back all employees after creation
app.post('/api/employees', function(req, res) {

    // create mongose method to create a new record into collection
    console.log(req.body);

	Employee.create({
		name : req.body.name,
		salary : req.body.salary,
		age : req.body.age
	}, function(err, employee) {
		if (err)
			res.send(err);
 
		// get and return all the employees after newly created employe record
		Employee.find(function(err, employees) {
			if (err)
				res.send(err)
			res.json(employees);
		});
	});
 
});

// create employee and send back all employees after creation
app.put('/api/employees/:employee_id', function(req, res) {
	// create mongose method to update an existing record into collection
    console.log(req.body);

	let id = req.params.employee_id;
	var data = {
		name : req.body.name,
		salary : req.body.salary,
		age : req.body.age
	}

	// save the user
	Employee.findByIdAndUpdate(id, data, function(err, employee) {
	if (err) throw err;

	res.send('Successfully! Employee updated - '+employee.name);
	});
});

// delete a employee by id
app.delete('/api/employees/:employee_id', function(req, res) {
	console.log(req.params.employee_id);
	let id = req.params.employee_id;
	Employee.remove({
		_id : id
	}, function(err) {
		if (err)
			res.send(err);
		else
			res.send('Successfully! Employee has been Deleted.');	
	});
});

app.listen(port);
console.log("App listening on port : " + port);