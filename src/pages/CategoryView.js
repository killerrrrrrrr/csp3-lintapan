import React, { useState, useEffect } from 'react';
import { CardGroup, Nav, Row, Col } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

export default function CategoryView() {

  const { category } = useParams();
  const [products, setProducts] = useState([]);
  const [mappedProducts, setMappedProducts] = useState([]);


  const fetchData = (category) => {
    fetch(`${process.env.REACT_APP_API_URL}/products/category/${category}`)
      .then((res) => res.json())
      .then((data) => {
        setProducts(data);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
      });
  };



  useEffect(() => {
    fetchData(category);
  }, [category]);

  useEffect(() => {
    const productsArr = products.map((product) => {
      if (product.isActive === true) {
        return <ProductCard productProp={product} key={product._id} />;
      } else {
        return null;
      }
    });
    setMappedProducts(productsArr);
  }, [products]);


return (
    <Row>
      <Col md={2} className="bg-dark">
        <Nav className="flex-column">
          <Nav.Link className="text-white" as={Link} to="/products" >
              All Products
            </Nav.Link>
          <Nav.Link as={Link} to="/products/category/Cowboy Bebop" exact className="text-white">Cowboy Bebop</Nav.Link>
          <Nav.Link as={Link} to="/products/category/Attack on Titan" exact className="text-white">Attack on Titan</Nav.Link>
        </Nav>
      </Col>
      <Col className="m-2 productCard">
        <h1 className="text-center m-3">Category: {category}</h1>
        <CardGroup className="justify-content-center">
            {mappedProducts}
        </CardGroup>
      </Col>
    </Row>
  );
}

