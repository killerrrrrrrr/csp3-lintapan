import { Container, Navbar, Nav } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import UserContext from '../UserContext';
import { Cart } from 'react-bootstrap-icons'




export default function AppNavBar() {

	const { user } = useContext(UserContext);

	return (
		<Navbar expand="lg" bg="dark" data-bs-theme="dark">
		    <Container fluid>
		        <Navbar.Brand as={NavLink} to="/" exact className="text-danger">Tensai. 天才</Navbar.Brand>
		        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
		        <Navbar.Collapse id="basic-navbar-nav">
		            <Nav className="mx-auto">
			            <Nav.Link as={NavLink} to="/" exact >Home</Nav.Link>
			            <Nav.Link as={NavLink} to="/products" exact>Products</Nav.Link>

			            {(user.id !== null) 
			            ?
			            	user.isAdmin 
			            	?
			            	<>
				            	<Nav.Link as={NavLink} to="/orders" exact>Orders</Nav.Link>
				            	<Nav.Link as={NavLink} to="/logout" exact>Logout</Nav.Link>
			            	</>	
			            	:

			            	<>
				            	<Nav.Link as={NavLink} to="/profile" exact>Profile</Nav.Link>
				            	<Nav.Link as={NavLink} to="/myorders" exact>Orders</Nav.Link>
				            	<Nav.Link as={NavLink} to="/logout" exact>Logout</Nav.Link>
				            	<Nav.Link as={NavLink} to="/cart" exact >
				            		<Cart color="white" />
				            	</Nav.Link>
			            	</>
			            :
			            	<>
				            	<Nav.Link as={NavLink} to="/login" exact>Login</Nav.Link>
				            	<Nav.Link as={NavLink} to="/register" exact>Register</Nav.Link>

			            	</>
			            }
			            
		            </Nav>
		        </Navbar.Collapse>
		    </Container>
		</Navbar>


		)
}
