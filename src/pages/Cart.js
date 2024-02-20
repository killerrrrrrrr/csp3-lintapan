import React, { useState, useEffect, useContext } from 'react';
import { Table, Button, Container, Accordion } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import UserContext from '../UserContext';
import RemoveItem from '../components/RemoveItem';
import ChangeQuantity from '../components/ChangeQuantity';

export default function Cart() {
    const navigate = useNavigate();
    const { user } = useContext(UserContext);

    const [items, setItems] = useState([]);
    const [subTotalAmount, setSubTotalAmount] = useState(0);
    const [groupedItems, setGroupedItems] = useState({});

    useEffect(() => {
        fetchCart();
    },[]);

    const fetchCart = () => {

        fetch(`${process.env.REACT_APP_API_URL}/cart/`, {
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        .then(res => res.json())
        .then(data => {

            if (user.id !== null) {
                setItems(data.items || []);
                setSubTotalAmount(data.subTotalAmount || 0);

                const itemsBySeller = (data.items || []).reduce((acc, item) => {
                    const sellerId = item.userId;
                    if (!acc[sellerId]) {
                        acc[sellerId] = { items: [] };
                    }
                    acc[sellerId].items.push(item);
                    return acc;
                }, {});
                setGroupedItems(itemsBySeller);
            } else {
                navigate("/login");
            }

        })
        .catch(error => {
            console.error('Error fetching cart:', error);
            // Handle the error appropriately
        });
    };

    const handleCheckoutClick = () => {
        navigate('/checkout', { state: { subTotalAmount } });
    };

    return (
        (user.id === null) ?
        <Navigate to="/" /> :
        <>
            <Container>
                <h1 className="text-center my-4">Your Shopping Cart</h1>
                <Accordion defaultActiveKey="0" alwaysOpen>
                    {Object.keys(groupedItems).map((sellerId, index) => (
                        <Accordion.Item key={index} eventKey={index.toString()}>
                            <Accordion.Header>Seller Id: {sellerId}</Accordion.Header>
                            <Accordion.Body>
                                <Table striped bordered hover responsive>
                                    <thead>
                                        <tr className="text-center">
                                            <th>Name</th>
                                            <th>Price</th>
                                            <th>Quantity</th>
                                            <th>Subtotal</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {groupedItems[sellerId].items.map(item => (
                                            <tr key={item._id}>
                                                <td>{item.name}</td>
                                                <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(item.price)}</td>
                                                <td className="text-center">
                                                    <ChangeQuantity productId={item.productId} itemQty={item.quantity} fetchCart={fetchCart} />
                                                </td>
                                                <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(item.itemSubtotal)}</td>
                                                <td className="text-center">
                                                    <RemoveItem itemId={item.productId} fetchCart={fetchCart} />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </Accordion.Body>
                        </Accordion.Item>
                    ))}
                </Accordion>
                <div className="m-3">
                    <Button variant="dark" onClick={handleCheckoutClick} disabled={items.length === 0} className="mx-1">Checkout</Button>
                    <span className="ml-2">Subtotal: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(subTotalAmount ?? 0)}</span>
                </div>
            </Container>
        </>
    );
}
