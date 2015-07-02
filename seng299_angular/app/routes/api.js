var bodyParser = require('body-parser'); 	// get body-parser
var User       = require('../models/user');
var Reservation= require('../models/reservation');
var jwt        = require('jsonwebtoken');
var config     = require('../../config/config.js');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

	var apiRouter = express.Router();

	// on routes that end in /users
	apiRouter.route('/users')

		// create a user (accessed at POST http://localhost:8080/users)
		.post(function(req, res) {
			
			var user = new User();		// create a new instance of the User model
			user.local.name = req.body.name;  // set the users name (comes from the request)
			user.local.email = req.body.email;  // set the users username (comes from the request)
			user.local.password = req.body.password;  // set the users password (comes from the request)

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

		})

		// get all the users (accessed at GET http://localhost:8080/api/users)
		.get(function(req, res) {

			User.find({}, function(err, users) {
				if (err) res.send(err);

				// return the users
				res.json(users);
			});
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
				if (req.body.name) user.name = req.body.name;
				if (req.body.username) user.username = req.body.username;
				if (req.body.password) user.password = req.body.password;

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

	// api endpoint to get user information
	apiRouter.get('/me', function(req, res) {
		res.send(req.decoded);
	});

	return apiRouter;
};
