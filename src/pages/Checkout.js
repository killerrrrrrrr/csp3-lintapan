import { useState, useEffect, useContext } from 'react';
import { Form, Button, Table, Row, Col, Container, Accordion } from 'react-bootstrap';
import UserContext from '../UserContext'
import { Navigate, useNavigate,useLocation   } from 'react-router-dom'
import Swal from 'sweetalert2';



export default function Checkout() {

  const navigate = useNavigate();
  const { user } = useContext(UserContext);
  const { state } = useLocation();

  const [subTotalAmount, setSubTotalAmount] = useState(0);
  const [streetAddress, setStreetAddress] = useState("");
  const [city, setCity] = useState("");
  const [province, setProvince] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [countryList, setCountryList] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState("");
  const [selectedCountryCode, setSelectedCountryCode] = useState("Choose...");
  const [mobileNo, setMobileNo] = useState("");
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingFee, setShippingFee] = useState(0);
  const [orderStatus, setOrderStatus] = useState("Processing");
  const [totalAmount, setTotalAmount] = useState(0);
  const [subShippingFee, setSubShippingFee] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [item, setItem] = useState([]);
  const [groupedItems, setGroupedItems] = useState({});




  function createOrder(e) {

    e.preventDefault();

    fetch(`${process.env.REACT_APP_API_URL}/orders/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }, 
      body: JSON.stringify({
        shippingInformation: {
          streetAddress: streetAddress,
          city: city,
          province: province,
          zipCode: zipCode,
          country: selectedCountry,
          mobileNo: mobileNo
        },
        subShippingFee: subShippingFee,
        shippingMethod: shippingMethod,
        shippingFee: shippingFee,
        orderStatus: orderStatus,
      })
    })
    .then(res => res.json())
    .then(data => {

      if (data) {

        console.log(data)

        setStreetAddress("");
        setCity("");
        setProvince("");
        setZipCode("");
        setSelectedCountry("");
        setMobileNo("");
        setShippingMethod("");
        setShippingFee(0);
        setOrderStatus("");
        setTotalAmount(0);
        setSubShippingFee(0);

        Swal.fire({
          icon: "success",
          title: "Thank you for your order!"
        })
        navigate("/products");

      } else {

        Swal.fire({
          icon: "error",
          title: "Please try again later.",
        })

      }


    })

  }

  const handleShippingMethodChange = (e) => {
    const selectedMethod = e.target.value;

    // Set shipping fee based on the selected shipping method
    if (selectedMethod === "Standard") {
      setSubShippingFee(250); // Standard shipping fee



    } else if (selectedMethod === "Express") {

      setSubShippingFee(350); // Express shipping fee


      
    } else {
      setSubShippingFee(0);
      
    }

    const shippingFee = subShippingFee * groupedItems.length;
    setShippingFee(shippingFee);

  };

  useEffect(() => {

  // Calculate shipping fee based on the updated subShippingFee
  const shippingFee = subShippingFee * Object.keys(groupedItems).length;
  setShippingFee(shippingFee);
  
}, [subShippingFee, groupedItems]);

  useEffect(() => {
    if (
      streetAddress !== "" &&
      city !== "" &&
      province !== "" &&
      zipCode !== "" &&
      selectedCountryCode !== "Choose..." && // Check against the country code
      shippingMethod !== ""
    ) {
      setIsActive(true);
    } else {
      setIsActive(false);
    }
  }, [streetAddress, city, province, zipCode, selectedCountryCode, shippingMethod]);



useEffect(() => {
  const total = subTotalAmount + shippingFee;
  setTotalAmount(total);
}, [subTotalAmount, shippingFee]);

useEffect(() => {
if (state && state.subTotalAmount) {
  setSubTotalAmount(state.subTotalAmount);
}
}, [state]);

  useEffect(() => {
    fetch('https://restcountries.com/v2/all')
      .then((response) => response.json())
      .then((data) => {
        const countries = data.map((country) => ({
          name: country.name,
          code: country.alpha2Code,
        }));
        setCountryList(countries);
      })
      .catch((error) => {
        console.error('Error fetching countries:', error);
      });
  }, []);

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

        setItem(data.items);

       // Group items by seller's ID
        const itemsBySeller = data.items.reduce((acc, item) => {
          const sellerId = item.userId; // Assuming userId is the seller's ID

          if (!acc[sellerId]) {
            acc[sellerId] = {
              items: [],
            };
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
      // Optionally, display a user-friendly error message
    });
};

   useEffect(() => {

      fetchCart()

  },[]); 



  return (

    (user.id === null) 

    ?

    <Navigate to='/products' />

    :
        
        <>
        <Container>
        <Row>
          <h1 className="my-5 text-center">Checkout</h1>

          <Col md={6}>  
            <Form onSubmit={(e) => createOrder(e)}>
              <Form.Group>
                <Form.Label>Street Address:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Street Address" 
                  required
                  value={streetAddress}
                  onChange={e => {setStreetAddress(e.target.value)}}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>City:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter City" 
                  required
                  value={city}
                  onChange={e => {setCity(e.target.value)}}
                />
              </Form.Group>
              <Form.Group>
                <Form.Label>Province:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Province" 
                  required
                  value={province}
                  onChange={e => {setProvince(e.target.value)}}
                  />          
              </Form.Group>
              <Form.Group>
                <Form.Label>Zip Code:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Zip Code"
                  required
                  value={zipCode}
                  onChange={e => {setZipCode(e.target.value)}}
                  />
              </Form.Group>
              <Form.Group>
                <Form.Label>Country</Form.Label>
               <Form.Select
                 defaultValue="Choose..."
                 value={selectedCountryCode}
                 onChange={(e) => {
                   const code = e.target.value;
                   setSelectedCountryCode(code);
                   const country = countryList.find((c) => c.code === code);
                   if (country) {
                     setSelectedCountry(country.code); // Store the country code, not the name
                   }
                 }}
               >
                 <option>Choose...</option>
                 {countryList.map((countryItem) => (
                   <option key={countryItem.code} value={countryItem.code}>
                     {countryItem.name}
                   </option>
                 ))}
               </Form.Select>
              </Form.Group>
              <Form.Group>
                <Form.Label>Mobile No.:</Form.Label>
                <Form.Control 
                  type="text" 
                  placeholder="Enter Mobile No."
                  required
                  value={mobileNo}
                  onChange={e => {setMobileNo(e.target.value)}}
                  />
              </Form.Group>
                <Form.Group>
                   <Form.Label>Shipping Method:</Form.Label>
                   <Form.Select
                     aria-label="Default select example"
                     required
                     value={shippingMethod}
                     onChange={(e) => {
                       handleShippingMethodChange(e);
                       setShippingMethod(e.target.value)
                     }}
                   >
                     <option>Select</option>
                     <option value="Standard">Standard</option>
                     <option value="Express">Express</option>
                   </Form.Select>
                 </Form.Group>

              {
                isActive
                ?
                <Button variant="dark" type="submit" id="submitBtn" className="my-2">Confirm & Pay</Button>
                :
                <Button variant="secondary" type="submit" id="submitBtn" className="my-2" disabled>Confirm & Pay</Button>
              }
              
                
            </Form>
          </Col>
          <Col md={6}>
            <Table striped bordered hover responsive>
                <thead >
                    <tr>
                        <th className="bg-dark text-white" colSpan="5">Items</th>
                    </tr>
                </thead>   
                <tbody>
                 <Accordion defaultActiveKey="0" alwaysOpen>

                     {Object.keys(groupedItems).map((sellerId, index) => (
                       <Accordion.Item key={index} eventKey={index.toString()}>
                         <Accordion.Header>
                           Seller Id: {sellerId}
                         </Accordion.Header>
                         <Accordion.Body>
                           <Table striped bordered hover responsive>
                             <thead>
                               <tr className="text-center">
                                 <th>Name</th>
                                 <th>Price</th>
                                 <th>Quantity</th>
                                 <th>Subtotal</th>
                               </tr>
                             </thead>
                             <tbody>
                               {groupedItems[sellerId].items.map(item => {
                                 const formattedPrice = new Intl.NumberFormat('en-PH', {
                                   style: 'currency',
                                   currency: 'Php',
                                 }).format(item.price);

                                 const formattedSubtotal = new Intl.NumberFormat('en-PH', {
                                   style: 'currency',
                                   currency: 'Php',
                                 }).format(item.itemSubtotal);

                                 return (
                                   <tr key={item._id}>
                                     <td>{item.name}</td>
                                     <td>{formattedPrice}</td>
                                     <td className="text-center">
                                       {item.quantity}
                                     </td>
                                     <td>{formattedSubtotal}</td>
                                   </tr>
                                 );
                               })}
                             </tbody>
                             <tfoot>
                                <tr>
                                  <td colspan="2">Sub-shipping Fee: </td>
                                  <td colspan="2">{new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'Php' }).format(subShippingFee)}</td>
                                </tr>
                             </tfoot>
                           </Table>
                         </Accordion.Body>
                       </Accordion.Item>
                     ))}
                   </Accordion>
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
          </Col>
          
        </Row>
        </Container>
        </>

        
    )
}
