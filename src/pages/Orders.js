import { useEffect, useState, useContext } from 'react'
import UserContext from '../UserContext';
import { Container, Accordion, Table } from 'react-bootstrap';
import UpdateOrder from '../components/UpdateOrder'




export default function Orders() {

	const { user } = useContext(UserContext);

	const [orders, setOrders] = useState([])
	const [users, setUsers] = useState([])
	const [groupedOrders, setGroupedOrders] = useState({});


	const fetchOrderData = () => {

		fetch(`${process.env.REACT_APP_API_URL}/orders/all-orders`, {
		headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`
		}
		})

		.then(res => res.json())
		.then(data => {

			setOrders(data);
			
			const uniqueUserIds = [...new Set(data.map(order => order.userId))];
        	setUsers(uniqueUserIds)

		})
	}


	useEffect(() => {

		fetchOrderData()

	}, []);


	useEffect(() => {

	  if (orders && orders.length > 0) {

	    const ordersByUserId = orders.reduce((acc, order) => {

	      if (!acc[order.userId]) {
	        acc[order.userId] = [];
	      }

	      acc[order.userId].push(order);
	      return acc;

	    }, {});

	    setGroupedOrders(ordersByUserId);
	    
	  }

	}, [orders]);

	return (
		<>
		<Container className="pb-5">
			<h1 className="text-center my-4">Orders</h1>
			      <Accordion defaultActiveKey="0" alwaysOpen>
			        {Object.keys(groupedOrders).map(userId => (
			          <Accordion.Item key={userId} eventKey={userId}>
			            <Accordion.Header>Orders for user: {groupedOrders[userId][0].email}</Accordion.Header>
			            <Accordion.Body>
			              <Table striped bordered hover responsive>
			                <thead>
			                  <tr>
			                    <th>Purchased On</th>
			                    <th>Order Id</th>
			                    <th>Tracking Link</th>
			                    <th>Order Status</th>
			                    <th>Update</th>
			                  </tr>
			                </thead>
			                <tbody>
			                  {groupedOrders[userId].map(order => (
			                    <tr key={order._id}>
			                      <td>{order.purchasedOn}</td>
			                      <td>{order._id}</td>
			                      <td>{order.trackingInformation}</td>
			                      <td>{order.orderStatus}</td>
			                      <td><UpdateOrder fetchOrderData={fetchOrderData} orderId={order._id} userId={user.id}/></td>
			                    </tr>
			                  ))}
			                </tbody>
			              </Table>
			            </Accordion.Body>
			          </Accordion.Item>
			        ))}
			      </Accordion>
		</Container>
		</>

		)
}	