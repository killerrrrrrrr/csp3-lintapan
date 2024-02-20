import { useState, useContext } from 'react';
import { Form, Button, Container } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext';



export default function AddProduct() {

	const navigate = useNavigate();

	const { user } = useContext(UserContext);

	// input states
	const [name, setName] = useState("");
	const [description, setDescription] = useState("");
	const [price, setPrice] = useState("");
	const [category, setCategory] = useState("");

	function createProduct(e) {

		// Prevent submit event's default behavour
		e.preventDefault();

		let token = localStorage.getItem('token');

		fetch(`${process.env.REACT_APP_API_URL}/products/`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				"Authorization": `Bearer ${token}`
			},
			body: JSON.stringify({
				name,
				description,
				price,
				category
			})
		})
		.then(res => res.json())
		.then(data => {

			if(data) {
				Swal.fire({
					icon: "success",
					title: "Product Added!"
				})
				navigate("/products");
			} else {
				Swal.fire({
					icon: "error",
					title: "Unsuccessful Product Creation",
					text: data.message 
				})

			}

		})

		// Reset all the input fields
		setName("");
		setDescription("");
		setPrice("");

	}

	return (

		(user.isAdmin === true) 
		?
			<>  <Container>
				<h1 className="my-5 text-center">Add Product</h1>
				<Form onSubmit={e => createProduct(e)}>
					<Form.Group>
						<Form.Label>Name:</Form.Label>
						<Form.Control type="text" placeholder="Enter Name" required value={name} onChange={e => {setName(e.target.value)}}/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Description:</Form.Label>
						<Form.Control type="text" placeholder="Enter Description" required value={description} onChange={e => {setDescription(e.target.value)}}/>
					</Form.Group>
					<Form.Group>
						<Form.Label>Price:</Form.Label>
						<Form.Control type="number" placeholder="Enter Price" required value={price} onChange={e => {setPrice(e.target.value)}}/>
					</Form.Group>
					<Form.Group>
					   <Form.Label>Category:</Form.Label>
					   <Form.Select
					     aria-label="Default select example"
					     required
					     value={category}
					     onChange={(e) => {
					       setCategory(e.target.value)
					     }}
					   >
					     <option>Select</option>
					     <option value="Attack on Titan">Attack on Titan</option>
					     <option value="Cowboy Bebop">Cowboy Bebop</option>
					   </Form.Select>
					 </Form.Group>
					<Button variant="dark" type="submit" className="my-3">Submit</Button>
				</Form>
				</Container>

			</>
		:

			<Navigate to="/products" />

	)	
}