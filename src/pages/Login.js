import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import UserContext from '../UserContext';
import { Navigate } from 'react-router-dom';
import Swal from 'sweetalert2';


export default function Login() {

	// Allows us to consume the User context and it's properties to use for validation
	const { user, setUser } = useContext(UserContext);

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const [isActive, setIsActive] = useState(false);

	function authenticate(e) {

		// Prevent page redirection via form submission
		e.preventDefault()

		fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			},
			body: JSON.stringify({
				email: email,
				password: password
			}) 
		})
		.then(res => res.json())
		.then(data => {
			if(data.access){

				// Set the token of the authenticated user in the local storage
				/*
					Syntax:
						localStorage.setItem('propertyName', value);
				*/
				localStorage.setItem("token", data.access);

				// function for retrieving user details
				retrieveUserDetails(data.access);

				Swal.fire({
					title: "Login Successful",
					icon: "success",
					text: "Welcome to Zuitt"
				});

			} else {
				Swal.fire({
					title: "Authentication failed",
					icon: "error",
					text: "Check your login details and try again"
				});
			}
		})

		// Clearing our input fields after submission
		setEmail('');
		setPassword('');

	}

	const retrieveUserDetails = (token) => {

		fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})
		.then(res => res.json())
		.then(data => {

			console.log(data);

			setUser({
				id: data._id,
				isAdmin: data.isAdmin
			})

		})

	}


	useEffect(() => {

		if(email !== '' && password !== '') {
			setIsActive(true);
		} else {
			setIsActive(false);
		}

	}, [email, password])

	return (
		(user.id !== null) ?
		<Navigate to='/products' />
		:
	<Container className="p-5">
	<div className="p-5">
		<Form onSubmit={(e) => authenticate(e)} >
		  <h1 className="my-5 text-center">Login</h1>
		    <Form.Group controlId="userEmail">
		        <Form.Label>Email address</Form.Label>
		        <Form.Control 
		            type="email" 
		            placeholder="Enter email" 
		            value={email}
		            onChange={(e) => setEmail(e.target.value)}
		            required
		        />
		    </Form.Group>

		    <Form.Group controlId="password">
		        <Form.Label>Password</Form.Label>
		        <Form.Control 
		            type="password" 
		            placeholder="Password" 
		            value={password}
		            onChange={(e) => setPassword(e.target.value)}
		            required
		        />
		    </Form.Group>


		    { isActive ?
		    	<Button variant="dark" type="submit" id="submitBtn" className="my-2">
		    	  Submit
		    	</Button>
		     :

			    <Button variant="secondary" type="submit" id="submitBtn" className="my-2" disabled>
			       Submit
			    </Button>
		    }
		</Form>
	</div>
	</Container>
	)
}