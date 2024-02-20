import { useState, useEffect, useContext} from 'react';
import { Container, Card, Button, Row, Col, Image } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import UserContext from '../UserContext'




export default function ProductView() {

	const { productId } = useParams();

	const { user } = useContext(UserContext);

	const [name, setName] = useState('');
	const [description, setDescription] = useState('');
	const [price, setPrice] = useState(0);
	const [quantity, setQuantity] = useState(1);
	const [imagePath, setImagePath] = useState(1);
	const [sellerId, setSellerId] = useState("");


	const addToCart = (productId) => {

		if (quantity > 0 && !isNaN(quantity)) {
			
		   fetch(`${process.env.REACT_APP_API_URL}/cart/add-to-cart`, {
		     method: 'POST',
		     headers: {
		       'Content-Type': 'application/json',
		       Authorization: `Bearer ${localStorage.getItem('token')}`,
		     },
		     body: JSON.stringify({
		       productId: productId,
		       quantity: quantity,
		       name: name,
		       price: price,
		       userId: sellerId
		     }),
		   })
		     .then((res) => res.json())
		     .then((data) => {
		       if (data !== '') {
		         Swal.fire({
		           title: 'Added to Cart!',
		           icon: 'success',
		         });
		       } else {
		         Swal.fire({
		           title: 'Something went wrong',
		           icon: 'error',
		           text: 'Please try again.',
		         });
		       }
		       setQuantity(1);
		     });
		 } else {
		   Swal.fire({
		     title: 'Add at least 1 quantity',
		     icon: 'error',
		     text: 'Please try again.',
		   });
		 }

	}

	 const decrement = () => {
	     setQuantity(quantity - 1);
	 };

	 const increment = () => {
	   setQuantity(quantity + 1);
	 };

	 const handleQuantityChange = (event) => {
	   const value = event.target.value;
	   if (/^\d*$|^$/.test(value)) {
	       setQuantity(value === '' ? '' : parseInt(value));
	    }
	 };

useEffect(() => {

	fetch(`${ process.env.REACT_APP_API_URL}/products/${productId}`)
	.then(res => res.json())
	.then(data => {

		setName(data.name);
		setDescription(data.description);
		setPrice(data.price)
		setImagePath(data.imagePath)
		setSellerId(data.userId)
	})
},[productId]);


	return (

<Container className="my-5">
    <Row>
        <Col xs={12} md={6} className="p-2 align-items-center justify-content-center d-grid">
            <Card>
                <Image
                    src={`${process.env.REACT_APP_API_URL}/${imagePath}`} // Use imagePath directly as src
                    alt={name}
                />
            </Card>
        </Col>
        <Col xs={12} md={6} className="p-2 justify-content-center d-grid">
            <Card className="p-5">
                <Card.Body>
                    <Card.Title className="mb-3">{name}</Card.Title>
                    <Card.Subtitle>Price:</Card.Subtitle>
                    <Card.Text className="text-danger">₱ {price}</Card.Text>
                    <div>
                        <Card.Subtitle className="mb-2">Quantity:</Card.Subtitle>
                        <button variant="dark" onClick={decrement} className="count-button" disabled={quantity <= 1}> - </button>
                        <input
                            type="text"
                            value={quantity}
                            onChange={handleQuantityChange}
                            style={{ width: '50px' }}
                            className="text-center"
                        />
                        <button variant="dark" onClick={increment} className="count-button"> + </button>
                    </div>
                    <div className="my-2">
                        {(user.id !== null && user.isAdmin === false) ?
                            <Button variant="dark" block onClick={() => addToCart(productId)}>Add to Cart</Button>
                            :
                            <Link className="btn btn-secondary btn-block" to="/login">Add to Cart</Link>
                        }
                    </div>
                    <Card.Subtitle className="mt-4">Description:</Card.Subtitle>
                    <Card.Text className="mt-3">{description}</Card.Text>
                    <Card.Subtitle className="mt-4">Seller:</Card.Subtitle>
                    <Card.Text className="mt-3">{sellerId}</Card.Text>
                </Card.Body>
            </Card>
        </Col>
    </Row>
</Container>
		
		)
	}