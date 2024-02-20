import { useState, useEffect, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import UserContext from '../UserContext'
import { Navigate, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2';


export default function Register() {

	const navigate = useNavigate();

	const { user } = useContext(UserContext);

	// State hooks to store the values of the input fields
	const [ firstName, setFirstName ] = useState("");
	const [ lastName, setLastName ] = useState("");
	const [ email, setEmail ] = useState("");
	const [ mobileNo, setMobileNo ] = useState("");
	const [ password, setPassword] = useState("");
	const [ confirmPassword, setConfirmPassword ] = useState("");
	const  [ isAdmin, setIsAdmin] = useState()
	// State to determine whether the submit button is enabled or not
	const [ isActive, setIsActive ] = useState(false);


	function registerUser(e) {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/users/register`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json"
			}, 
			body: JSON.stringify({
				firstName: firstName,
				lastName: lastName,
				email: email,
				mobileNo: mobileNo,
				password: password,
				isAdmin: isAdmin

			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)

			if (data) {

				setFirstName("");
				setLastName("");
				setEmail("");
				setMobileNo("");
				setPassword("");
				setConfirmPassword("");

				Swal.fire({
					icon: "success",
					title: "Thank you for registering!"
				})
				navigate("/login");

			} else {

				Swal.fire({
					icon: "error",
					title: "Please try again later.",
				})

			}
		})
	}


	useEffect(() => {
		if((firstName !== "" && lastName !== "" && email !== "" && mobileNo !== "" && password !== "" && confirmPassword !== "" && isAdmin !== "" ) && (password === confirmPassword) && (mobileNo.length === 11)) {

			setIsActive(true)
		} else {
			setIsActive(false)
		}
		// dependencies
	}, [firstName, lastName, email, mobileNo, password, confirmPassword, isAdmin])

    return (
		(user.id !== null) ?
		<Navigate to='/products' />
		:
	<Container>
		<Form onSubmit={(e) => registerUser(e)}>
		<h1 className="my-5 text-center">Register</h1>
			<Form.Group>
				<Form.Label>First Name:</Form.Label>
				<Form.Control 
					type="text" 
					placeholder="Enter First Name" 
					required
					value={firstName}
					onChange={e => {setFirstName(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Last Name:</Form.Label>
				<Form.Control 
					type="text" 
					placeholder="Enter Last Name" 
					required
					value={lastName}
					onChange={e => {setLastName(e.target.value)}}
				/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Email:</Form.Label>
				<Form.Control 
					type="email" 
					placeholder="Enter Email" 
					required
					value={email}
					onChange={e => {setEmail(e.target.value)}}
					/>					
			</Form.Group>
			<Form.Group>
				<Form.Label>Mobile No:</Form.Label>
				<Form.Control 
					type="number" 
					placeholder="Enter 11 Digit No."
					required
					value={mobileNo}
					onChange={e => {setMobileNo(e.target.value)}}
					/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Password:</Form.Label>
				<Form.Control 
					type="password" 
					placeholder="Enter Password" 
					required
					value={password}
					onChange={e => {setPassword(e.target.value)}}
					/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Confirm Password:</Form.Label>
				<Form.Control 
					type="password" 
					placeholder="Confirm Password" 
					required
					value={confirmPassword}
					onChange={e => {setConfirmPassword(e.target.value)}}
					/>
			</Form.Group>
			<Form.Group>
				<Form.Label>Register As: </Form.Label>
				<Form.Select
			     aria-label="Default select example"
			     required
			     value={isAdmin}
			     onChange={(e) => {
			     	e.target.value === "true" ?
			       setIsAdmin(true)
			       :
			       setIsAdmin(false)
			     }}
			   >
			     <option>Select</option>
			     <option value="false">Buyer</option>
			     <option value="true">Seller</option>
			   </Form.Select>
			 </Form.Group>

			{/*conditionally renders the submit button based on the isActive state*/}
			{
				isActive
				?
				<Button variant="dark" type="submit" id="submitBtn" className="my-3">Register</Button>
				:
				<Button variant="secondary" type="submit" id="submitBtn" className="my-3" disabled>Register</Button>
			}
			
				
		</Form>
	</Container>
    )

}