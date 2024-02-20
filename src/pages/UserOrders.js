import React, { useState, useEffect } from 'react';
import { Accordion, Table, Row, Col, Container, Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function UserOrders() {
  const [userOrders, setUserOrders] = useState([]);
  const [orders, setOrders] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});
  const [subShippingFee, setSubShippingFee] = useState(0);


  // Fetch user orders when the component mounts
  useEffect(() => {
    fetchUserOrders();
  }, []);

  // Fetch order details when userOrders change
  useEffect(() => {
    if (userOrders && userOrders.length > 0) {
      fetchOrderDetails();
    }
  }, [userOrders]);

  // Fetch user orders from the API
  const fetchUserOrders = () => {
    fetch(`${process.env.REACT_APP_API_URL}/users/myOrders`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    })
    .then(res => res.json())
    .then(data => {
      setUserOrders(data);
    })
    .catch(error => {
      console.error('Error fetching user orders:', error);
    });
  };

  // Fetch order details for each order
  const fetchOrderDetails = async () => {
    try {
      const fetchPromises = userOrders.map(orderId => fetchOrder(orderId));
      const fetchedOrders = await Promise.all(fetchPromises);
      setOrders(fetchedOrders.flat());
    } catch (error) {
      console.error('Error fetching order details:', error);
    }
  };

  // Fetch order details by order ID
  const fetchOrder = async (orderId) => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/orders/${orderId}`, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch order');
      }

      const data = await response.json();

      // Group items by seller
      const itemsBySeller = groupItemsBySeller(data);
      setGroupedItems(prevState => ({ ...prevState, [orderId]: itemsBySeller }));

      return data;
    } catch (error) {
      console.error(`Error fetching order with ID ${orderId}:`, error);
      return null;
    }
  };

  // Group items by seller for a given order
  const groupItemsBySeller = (orderData) => {
    return orderData.purchasedItems.items.reduce((acc, item) => {
      const sellerId = item.userId; // Assuming userId is the seller's ID

      if (!acc[sellerId]) {
        acc[sellerId] = {
          items: [],
        };
      }
      acc[sellerId].items.push(item);
      return acc;
    }, {});
  };

  useEffect(() => {
  if (orders.length > 0) {
    const updatedGroupedItems = {};

    orders.forEach(async (order) => {
      const itemsBySeller = groupItemsBySeller(order);
      updatedGroupedItems[order._id] = itemsBySeller;
    });

    setGroupedItems(updatedGroupedItems);
  }
}, [orders]);

  // Cancel an order
  const cancelOrder = (orderId) => {
    fetch(`${process.env.REACT_APP_API_URL}/orders/${orderId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        orderStatus: "Cancelled",
        trackingInformation: 'n/a'
      })
    })
    .then(res => res.json())
    .then(data => {
      if (data !== '') {
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: 'Order has been canceled!'
        });
      } else {
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: 'Please try again'
        });
      }
    });
  };

  useEffect(() => {
  if (Object.keys(groupedItems).length > 0) {

    // Loop through orders and their items to calculate total sub shipping fee
    orders.forEach(order => {
      Object.keys(groupedItems[order._id]).forEach(sellerId => {
        groupedItems[order._id][sellerId].items.forEach(item => {
          
        });
      });
    });

  }
}, [groupedItems, orders]);

  console.log(groupedItems)

  return (
    <Container className="pb-5">
      <h1 className="text-center my-4">Order History</h1>
      <Accordion defaultActiveKey="0" alwaysOpen>
        {orders.map((order, index) => (
          <Accordion.Item key={order._id || index} eventKey={order._id || index}>
            <Accordion.Header>Order: {order._id}</Accordion.Header>
            <Accordion.Body>
              {groupedItems[order._id] ? (
                Object.keys(groupedItems[order._id]).map((sellerId, sellerIndex) => (
                  <div key={sellerIndex}>
                    <h6 className='mt-3 text-danger'>Seller ID: {sellerId}</h6>
                    <Table striped bordered hover responsive>
                      <thead>
                        <tr className="text-center">
                          <th className="bg-dark text-white">Name</th>
                          <th className="bg-dark text-white">Price</th>
                          <th className="bg-dark text-white">Quantity</th>
                          <th className="bg-dark text-white">Subtotal</th>                          
                        </tr>
                      </thead>
                      <tbody>
                        {groupedItems[order._id][sellerId].items.map((item, itemIndex) => (
            
                            <tr className="text-center">
                              <td>{item.name}</td>
                              <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(item.price)}</td>
                              <td>{item.quantity}</td>
                              <td>{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(item.itemSubtotal)}</td>
                            </tr>
                        ))}
                      </tbody>
                      <tfoot>
                          <td colSpan="2">Sub-shipping Fee: </td>
                          <td colSpan="2">
                            {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(groupedItems[order._id][sellerId].items[0].subShippingFee)}
                          </td>
                      </tfoot>

                    </Table>
                  </div>
                ))
              ) : (
                <p>No items found for this order.</p>
              )}
              <Row className="mt-3">
                <Col>
                  <strong>Sub Total:</strong> {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(order.purchasedItems.subTotalAmount)}<br />
                  <strong>Shipping Fee:</strong> {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(order.shippingFee)}<br />
                  <strong>Total Amount:</strong> {new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(order.totalAmount)}<br />
                  <strong>Order Status:</strong> {order.orderStatus}<br />
                  <strong>Shipping Method:</strong> {order.shippingMethod}<br />
                  <strong>Tracking Link:</strong> {order.trackingInformation}<br /><br />
                  <strong>Date: </strong> {order.purchasedOn}<br />
                </Col>
                <Col>
                  <strong>Street Address:</strong> {order.shippingInformation.streetAddress}<br />
                  <strong>City:</strong> {order.shippingInformation.city}<br />
                  <strong>Province:</strong> {order.shippingInformation.province}<br />
                  <strong>Zip Code:</strong> {order.shippingInformation.zipCode}<br />
                  <strong>Country:</strong> {order.shippingInformation.country}<br />
                  <strong>Mobile No:</strong> {order.shippingInformation.mobileNo}<br />
                  {order.orderStatus === "Processing" ?
                    <Button variant="dark" size="sm" className="mt-3" onClick={() => cancelOrder(order._id)}>Cancel</Button>
                    :
                    <Button variant="secondary" size="sm" className="mt-3" onClick={() => cancelOrder(order._id)} disabled>Cancel</Button>
                  }
                </Col>
              </Row>
            </Accordion.Body>
          </Accordion.Item>
        ))}
      </Accordion>
    </Container>
  );
}
