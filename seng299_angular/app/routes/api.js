var bodyParser  = require('body-parser'); 	// get body-parser
var User        = require('../models/user');
var Booth       = require('../models/booth');
var Reservation = require('../models/reservation');
var jwt         = require('jsonwebtoken');
var config      = require('../../config/config.js');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();


	// route the retrieve security question from username (POST http://localhost:8080/api/forgot)
	apiRouter.post('/forgot', function(req, res) {

		// find the user
		User.findOne({
			username: req.body.username
		}).select("security_question security_answer _id").exec(function(err, user) {

			if(err) throw err;

			// no user with that username found
			if(!user) {
				res.json({
					success: false,
					message: 'User not found.'
				});
			} else if (user) {
				// return the security question and answer
				res.json({
					success: true,
					message: 'User found',
					question: user.security_question,
					answer: user.security_answer,
					user_id: user._id
				});
			}

		});
	});

	// route to reset a user's password 
	apiRouter.put('/forgot', function(req, res) {

		// copy the code for updating a user
		User.findById(req.body.user_id, function(err, user) {

			if (err) res.send(err);

			// reset the password of the user 
			user.password = "password";

			// save the user
			user.save(function(err) {
				if (err) res.send(err);

				// return a message
				res.json({ message: 'Password reset to password.' });
			});

		});

	})
	
	// route to authenticate a user (POST http://localhost:8080/api/authenticate)
	apiRouter.post('/authenticate', function(req, res) {

	  // find the user
	  User.findOne({
	    username: req.body.username
	  }).select("username _id password isAdmin").exec(function(err, user) {

	    if (err) throw err;

	    // no user with that username was found
	    if (!user) {
	      res.json({ 
	      	success: false, 
	      	message: 'Authentication failed. User not found.' 
	    	});
	    } else if (user) {

	      // check if password matches
	      var validPassword = user.comparePassword(req.body.password);
	      if (!validPassword) {
	        res.json({ 
	        	success: false, 
	        	message: 'Authentication failed. Wrong password.' 
	      	});
	      } else {

	        // if user is found and password is right
	        // create a token
	        var token = jwt.sign({
	        	username: user.username,
			id: user._id,
			isAdmin: user.isAdmin
	        }, superSecret, {
	          expiresInMinutes: 1440 // expires in 24 hours
	        });

	        // return the information including token as JSON
	        res.json({
	          success: true,
	          message: 'Enjoy your token!',
	          token: token
	        });
	      }   

	    }

	  });
	});


	// only admin can access /users page
	apiRouter.route('/users')
		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
		});


	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.name = req.body.name;  // set the users name (comes from the request)
			user.email = req.body.email;  // set the users username (comes from the request)
			user.password = req.body.password;  // set the users password (comes from the request)
			user.username = req.body.username;
			user.phone = req.body.phone;
			user.description = req.body.description;
			user.security_question = req.body.security_question;
			user.security_answer = req.body.security_answer;
			user.dt_ban_end = req.body.dt_ban_end;
			user.isAdmin = req.body.isAdmin;

			user.save(function(err) {

				if (err) {
					// duplicate entry
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A user with that username already exists. '});
					else 
						return res.send(err);
				}

				// return a message
				res.json({ message: 'User created!' });
			});

		});

	//route middleware to verify token
	apiRouter.use(function(req, res, next) {
		
	  // do logging
	  console.log("Verifying user's token (middleware)");

	  // check header or url parameters or post parameters for token
	  var token = req.body.token || req.query.token || req.headers['x-access-token'];

	  // decode token
	  if (token) {

	    // verifies secret and checks exp
	    jwt.verify(token, superSecret, function(err, decoded) {      

	      if (err) {
	        res.status(403).send({ 
	        	success: false, 
	        	message: 'Failed to authenticate token.' 
	    	});  	   
	      } else { 
	        // if everything is good, save to request for use in other routes
	        req.decoded = decoded;
	        console.log("Success");
	          
	        next(); // make sure we go to the next routes and don't stop here
	      }
	    });

	  } else {

	    // if there is no token
	    // return an HTTP response of 403 (access forbidden) and an error message
   	 	res.status(403).send({ 
   	 		success: false, 
   	 		message: 'No token provided.' 
   	 	});
	    
	  }
	});



	// on routes that end in /users/:user_id
	// ----------------------------------------------------
	apiRouter.route('/users/:user_id')

		// get the user with that id
		.get(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {
				if (err) res.send(err);

				// return that user
				res.json(user);
			});
		})

		// update the user with this id
		.put(function(req, res) {
			User.findById(req.params.user_id, function(err, user) {

				if (err) res.send(err);

				// set the new user information if it exists in the request
				if (req.body.email) user.email = req.body.email;  // set the users username (comes from the request)
				if (req.body.phone) user.phone = req.body.phone;
				if (req.body.description) user.description = req.body.description;
				if (req.body.security_question) user.security_question = req.body.security_question;
				if (req.body.security_answer) user.security_answer = req.body.security_answer;
				if (req.body.dt_ban_end) user.dt_ban_end = req.body.dt_ban_end;
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;
				if (req.body.isAdmin) user.isAdmin = req.body.isAdmin;
				// save the user
				user.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'User updated!' });
				});

			});
		})

		// delete the user with this id
		.delete(function(req, res) {
			User.remove({
				_id: req.params.user_id
			}, function(err, user) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});


		// get all the users (accessed at GET http://localhost:8080/api/users)

	// on routes that end in /reservations
	// ----------------------------------------------------
	apiRouter.route('/reservations')

		// create a reservation (accessed at POST http://localhost:8080/reservations)
		.post(function(req, res) {
			
			var reservation = new Reservation();	
			reservation.booth_id = req.body.booth_id; 
			reservation.user_id = req.body.user_id;
			reservation.dt_start = req.body.dt_start;  
			reservation.dt_booked = req.body.dt_booked;
			reservation.dt_cancelled = req.body.dt_cancelled;

			reservation.save(function(err) {
				if (err) {
					if (err.code == 11000) 
						return res.json({ success: false, message: 'A reservation with that reservationname already exists. '});
					else 
						return res.send(err);
				}

				res.json({ message: 'Reservation created!' });
			});

		})

		// get all the reservations (accessed at GET http://localhost:8080/api/reservations)
		.get(function(req, res) {

			Reservation.find({}, function(err, reservations) {
				if (err) res.send(err);

				// return the reservations
				res.json(reservations);
			});
		});

	// on routes that end in /reservations/:reservation_id
	// ----------------------------------------------------
	apiRouter.route('/reservations/:reservation_id')

		// get the reservation with that id
		.get(function(req, res) {
			Reservation.findById(req.params.reservation_id, function(err, reservation) {
				if (err) res.send(err);

				// return that reservation
				res.json(reservation);
			});
		})

		// update the reservation with this id
		.put(function(req, res) {
			Reservation.findById(req.params.reservation_id, function(err, reservation) {

				if (err) res.send(err);

				// set the new reservation information if it exists in the request
				if(req.body.booth_id) reservation.booth_id = req.body.booth_id; 
				if(req.body.user_id) reservation.user_id = req.body.user_id;
				if(req.body.dt_start) reservation.dt_start = req.body.dt_start;  
				if(req.body.dt_booked) reservation.dt_booked = req.body.dt_booked;
				if(req.body.dt_cancelled) reservation.dt_cancelled = req.body.dt_cancelled;

				// save the reservation
				reservation.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Reservation updated!' });
				});

			});
		})

		// delete the reservation with this id
		.delete(function(req, res) {
			Reservation.remove({
				_id: req.params.reservation_id
			}, function(err, reservation) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});
	
	//get users by user_id
	apiRouter.route('/reservationsByUser/:user_id')
		.get(function(req, res) {
			Reservation.find({ 'user_id': req.params.user_id }, function(err, reservations) {
				if (err) res.send(err);

				// return that reservation
				res.json(reservations);
			});
		})
	
	apiRouter.route('/reservationsForDay/:dt_start')
		.get(function(req, res) {
			Reservation.find({$where : 'return this.dt_start.getMonth() == '+dt_start.getMonth()+' AND this.dt_start.getYear() == '+dt_start.getYear()+' AND this.dt_start.getDay() == '+dt_start.getDay()}, function(err, reservations) {
				if (err) res.send(err);

				// return that reservation
				res.json(reservations);
			});
		})
	apiRouter.route('/booths')

		// create a booth (accessed at POST http://localhost:8080/booths)
		.post(function(req, res) {
			
			var booth = new Booth();	
			booth.booth_title = req.body.booth_title;
			booth.booth_type = req.body.booth_type;  

			booth.save(function(err) {
				if (err) {
					if (err.code == 11000) 
						return res.json({ success: false, message: 'That booth already exists '});
					else 
						return res.send(err);
				}

				res.json({ message: 'Booth created!' });
			});

		})

		// get all the booths (accessed at GET http://localhost:8080/api/booths)
		.get(function(req, res) {

			Booth.find({}, function(err, booths) {
				if (err) res.send(err);

				// return the booths
				res.json(booths);
			});
		});

	// on routes that end in /booths/:booth_id
	// ----------------------------------------------------
	apiRouter.route('/booths/:booth_id')

		// get the booth with that id
		.get(function(req, res) {
			Booth.findById(req.params.booth_id, function(err, booth) {
				if (err) res.send(err);

				// return that booth
				res.json(booth);
			});
		})

		// update the booth with this id
		.put(function(req, res) {
			Booth.findById(req.params.booth_id, function(err, booth) {

				if (err) res.send(err);

				// set the new booth information if it exists in the request
				if(req.body.booth_type) booth.booth_type = req.body.booth_type; 
				if(req.body.booth_title) booth.booth_title = req.body.booth_title; 

				// save the booth
				booth.save(function(err) {
					if (err) res.send(err);

					// return a message
					res.json({ message: 'Booth updated!' });
				});

			});
		})

		// delete the booth with this id
		.delete(function(req, res) {
			Booth.remove({
				_id: req.params.booth_id
			}, function(err, booth) {
				if (err) res.send(err);

				res.json({ message: 'Successfully deleted' });
			});
		});


	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});



	// // middleware to prevent non-admin from accessing admin-only pages
	// apiRouter.use(function(req, res, next) {
	//   console.log("Checking if user has admin privileges to access page");

	//   if (req.decoded.isAdmin) {
	//         console.log("Success");        
	//         next(); // make sure we go to the next routes and don't stop here
	//   } else {

	//   	console.log("permission denied. User not admin.");
	//   }
	// });

	// // only admin can access /users page
	// apiRouter.route('/users')
	// 	// get all the users (accessed at GET http://localhost:8080/api/users)
	// 	.get(function(req, res) {

	// 		User.find({}, function(err, users) {
	// 			if (err) res.send(err);

	// 			// return the users
	// 			res.json(users);
	// 		});
	// 	});


	return apiRouter;
};
