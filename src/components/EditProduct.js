import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';
import UploadImage from './UploadImage'

export default function EditProduct({ productId, fetchData }) {


	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState('');
	const [category, setCategory] = useState('');


	const [showEdit, setShowEdit] = useState(false);

	const openEdit = (productId) => {
		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`)
		.then(res => res.json())
		.then(data => {

			console.log(data)

			setName(data.name);
			setDescription(data.description);
			setPrice(data.price);
			setCategory(data.category);
		})

		setShowEdit(true)
	}

	const closeEdit = () => {
		setShowEdit(false);
		setName('');
		setDescription('');
		setPrice(0);
		setCategory('');
	}

	const editProduct = (e, productId) => {

		e.preventDefault();

		fetch(`${process.env.REACT_APP_API_URL}/products/${productId}`,{
			method: 'PUT',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				name: name,
				description: description,
				price: price,
				category: category
			})
		})
		.then(res => res.json())
		.then(data => {
			console.log(data)

			if(data === true){
				Swal.fire({
					title: 'Success!',
					icon: 'success',
					text: 'Product Successfully Updated'
				})
				closeEdit();
				fetchData();
			} else {
				Swal.fire({
					title: 'Error!',
					icon: 'error',
					text: ' Please try again'
				})
				closeEdit();
				fetchData();
			}
		})
	}

	return (

		<>
			<Button variant="danger" size="sm" onClick={() => openEdit(productId)}> Edit </Button>

			{/*Edit Modal*/}
			<Modal show={showEdit} onHide={closeEdit}>
				<Form onSubmit={e => editProduct(e, productId)}>
                   <Modal.Header closeButton>
                       <Modal.Title>Edit Product</Modal.Title>
                   </Modal.Header>
                   <Modal.Body>    
                       <Form.Group>
                           <Form.Label>Name</Form.Label>
                           <Form.Control 
                           		type="text"
                           		value={name}
                           		onChange={e => setName(e.target.value)} 
                           		required/>
                       </Form.Group>
                       <Form.Group>
                           <Form.Label>Description</Form.Label>
                           <Form.Control 
                           		as="textarea" // Use textarea instead of input
                           		rows={6} // Set the number of visible rows
                           		value={description}
                           		onChange={e => setDescription(e.target.value)} 
                           		required/>
                       </Form.Group>
                       <Form.Group>
                           <Form.Label>Price</Form.Label>
                           <Form.Control 
                           		type="number"
                           		value={price}
                           		onChange={e => setPrice(e.target.value)} 
                           		required/>
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
                   </Modal.Body>
                   <Modal.Footer>
                       <Button variant="secondary" onClick={closeEdit}>Close</Button>
                       <Button variant="success" type="submit">Submit</Button>
                   </Modal.Footer>
               </Form>
           </Modal>
		</>

	)
}