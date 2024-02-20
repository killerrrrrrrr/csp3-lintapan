import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Table } from 'react-bootstrap';
import Swal from 'sweetalert2';


export default function UpdateOrder({ fetchOrderData, orderId, userId }) {
  const [orderStatus, setOrderStatus] = useState('');
  const [trackingInformation, setTrackingInformation] = useState('');
  const [shippingInformation, setShippingInformation] = useState({
    streetAddress: '',
    city: '',
    province: '',
    zipCode: '',
    country: '',
    mobileNo: ''
  });
  const [purchasedItems, setPurchasedItems] = useState('');
  const [subTotalAmount, setSubTotalAmount] = useState(0)
  const [shippingMethod, setShippingMethod] = useState('');
  const [shippingFee, setShippingFee] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);

  const [showEdit, setShowEdit] = useState(false);

  const openEdit = () => {
  fetch(`${process.env.REACT_APP_API_URL}/orders/${orderId}`, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localStorage.getItem('token')}`
    }
  })
    .then(res => res.json())
    .then(data => {

      setOrderStatus(data.orderStatus);
      setTrackingInformation(data.trackingInformation || ''); // Handling null or undefined value
      setShippingInformation(data.shippingInformation || {});
      setShippingMethod(data.shippingMethod);

      // Filter items based on userId
      const filteredItems = data.purchasedItems.items.filter(
        item => item.userId === userId
      );

      setPurchasedItems(filteredItems); // Use filtered items here
      setShippingFee(filteredItems[0].subShippingFee);

      const sumSubTotal = filteredItems.reduce(
        (total, item) => total + item.itemSubtotal,
        0
      );

      setSubTotalAmount(sumSubTotal);
    });

  setShowEdit(true);
};

useEffect(() => {
    // Calculate totalAmount when subTotalAmount or shippingFee changes
    const calculateTotalAmount = () => {
      const totalAmount = subTotalAmount + shippingFee;
      setTotalAmount(totalAmount);
    };

    calculateTotalAmount(); // Initial calculation

    // Make sure to update totalAmount whenever subTotalAmount or shippingFee changes
    // This ensures the calculation is performed after the state updates
    // Use a dependency array to listen for changes in specific state variables
    const dependencies = [subTotalAmount, shippingFee];
    dependencies.forEach((dependency) => {
      calculateTotalAmount();
    });
  }, [subTotalAmount, shippingFee]);


  const closeEdit = () => {
    setShowEdit(false);
    setOrderStatus('');
    setTrackingInformation('');
  };

  const editOrder = e => {
    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        orderStatus,
        trackingInformation
      })
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);

        if (data !== '') {
          Swal.fire({
            title: 'Success!',
            icon: 'success',
            text: 'Order Successfully Updated'
          });
          closeEdit();
          fetchOrderData();
        } else {
          Swal.fire({
            title: 'Error!',
            icon: 'error',
            text: ' Please try again'
          });
          closeEdit();
          fetchOrderData();
        }
      });
  };


  return (
    <>
      {/* Button to open modal */}
      <Button variant="dark" size="sm" onClick={openEdit}>
        Open
      </Button>

      {/* Edit Modal */}
      <Modal show={showEdit} onHide={closeEdit}>
        <Form onSubmit={editOrder}>
          <Modal.Header closeButton>
            <Modal.Title>Order {orderId}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          	<h5>Shipping Information</h5>
            <Form.Group>
              <Form.Label>Street Address:</Form.Label>
              <Form.Control
                type="text"
                value={shippingInformation.streetAddress}
                disabled
              />
            </Form.Group> 
            <Form.Group>
              <Form.Label>City:</Form.Label>
              <Form.Control
                type="text"
                value={shippingInformation.city}
                disabled
              />
            </Form.Group> 
            <Form.Group>
              <Form.Label>Province:</Form.Label>
              <Form.Control
                type="text"
                value={shippingInformation.province}
                disabled
              />
            </Form.Group> 
            <Form.Group>
              <Form.Label>Zip Code:</Form.Label>
              <Form.Control
                type="text"
                value={shippingInformation.zipCode}
                disabled
              />
            </Form.Group>
             <Form.Group>
              <Form.Label>Country:</Form.Label>
              <Form.Control
                type="text"
                value={shippingInformation.country}
                disabled
              />
            </Form.Group>
             <Form.Group>
              <Form.Label>Mobile No.:</Form.Label>
              <Form.Control
                type="text"
                value={shippingInformation.mobileNo}
                disabled
              />
            </Form.Group>

              <h5 className="mt-4">Purchased Items</h5>
               <Table striped bordered hover responsive >
                <thead >
                    <tr className="text-center">
                        <th className="bg-dark text-white">Name</th>
                        <th className="bg-dark text-white">Price</th>
                        <th className="bg-dark text-white">Quantity</th>
                        <th className="bg-dark text-white">Total Price</th>
                    </tr>
                </thead>   
                <tbody>
                     {purchasedItems && purchasedItems.map(item => (
                       <tr key={item.id}>
                         <td>{item.name}</td>
                         <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(item.price)}</td>
                         <td className="text-center">{item.quantity}</td>
                         <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(item.itemSubtotal)}</td>
                       </tr>
                 ))}
                   </tbody>
                <tfoot>
                  <tr>
                    <td colSpan="5" >Subtotal: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(subTotalAmount)} </td>
                  </tr>
                  
                  <tr>
                    <td colSpan="5" >Shipping Fee: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(shippingFee)} </td>
                  </tr>
                  <tr>
                    <td colSpan="5" >Total: {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(totalAmount)} </td>
                  </tr>
                </tfoot>
            </Table> 

            <Form.Group className="mt-2">
              <Form.Label >Shipping Method</Form.Label>
              <Form.Control
                type="text"
                value={shippingMethod}
                disabled
              />
            </Form.Group> 
            <Form.Group>
              <Form.Label>Tracking Link</Form.Label>
              <Form.Control
                type="text"
                value={trackingInformation}
                onChange={e => setTrackingInformation(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Order Status</Form.Label>
              <Form.Select
                aria-label="Default select example"
                required
                value={orderStatus}
                onChange={e => {
                  setOrderStatus(e.target.value);
                }}
              >
                <option value="Processing">Processing</option>
                <option value="Shipped">Shipped</option>
                <option value="Delivered">Delivered</option>
                <option value="Cancelled">Cancelled</option>
              </Form.Select>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>
              Close
            </Button>
            <Button variant="dark" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}
