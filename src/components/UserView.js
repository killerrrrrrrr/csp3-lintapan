import React, { useState, useEffect } from 'react';
import { CardGroup, Nav, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import ProductCard from './ProductCard';

export default function UserView({ productsData }) {

  const [products, setProducts] = useState([]);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchedProducts, setSearchedProducts] = useState([]);
  const [error, setError] = useState(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {


    const productsArr = productsData.map((product) => {
      if (product.isActive === true) {
        return <ProductCard productProp={product} key={product._id} />;
      } else {
        return null;
      }
    });


    setProducts(productsArr);
  }, [productsData]);

  const handleSearch = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/search-by-price-range`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ minPrice, maxPrice }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data = await response.json();

      setSearchQuery('');
      setSearchResults([])
      setSearchedProducts(data.products);
      setError(null);
    } catch (error) {
      setError('Error fetching products. Please try again.');
      console.error('Error:', error);
    }
  };

  const handleSearchName = async () => {
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/products/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: searchQuery })
      });
      const data = await response.json();
      setMinPrice('');
      setMaxPrice('');
      setSearchedProducts([])
      setSearchResults(data);
    } catch (error) {
      console.error('Error searching for courses:', error);
    }
  };


  const handleAllProductsClick = () => {
  setMinPrice('');
  setMaxPrice('');
  setSearchedProducts([]);
  setSearchQuery('');
  setSearchResults([]);
};

  return (
    <>
      <Row>
        <Col md={2} className="bg-dark">
          <hr />
          <div className="m-3">
            <div className="form-group text-white">
              <label htmlFor="productName" className="mb-2">Search Name:</label>
              <input
                type="text"
                id="productName"
                className="form-control"
                value={searchQuery}
                onChange={event => setSearchQuery(event.target.value)}
              />
            </div>
           </div>
             <button className="btn btn-outline-light mx-3" onClick={handleSearchName}>
             Search
           </button>
           <hr />
          <div className="m-3">
            <h6 className="text-white">Price Range</h6>
            <div className="form-group text-white">
              <label htmlFor="minPrice">Min Price:</label>
              <input
                type="number"
                id="minPrice"
                className="form-control "
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
              />
            </div>
            <div className="form-group text-white">
              <label htmlFor="maxPrice">Max Price:</label>
              <input
                type="number"
                id="maxPrice"
                className="form-control"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
              />
            </div>
          </div>
          <button className="btn btn-outline-light mx-3" onClick={handleSearch}>
          Search
        </button>
        <hr />
        <Nav className="flex-column mt-3">
            <Nav.Link className="text-white" as={Link} to="/products" onClick={handleAllProductsClick}>
              All Products
            </Nav.Link>
            <Nav.Link as={Link} to="/products/category/Cowboy Bebop" exact className="text-white">
              Cowboy Bebop
            </Nav.Link>
            <Nav.Link as={Link} to="/products/category/Attack on Titan" exact className="text-white">
              Attack on Titan
            </Nav.Link>
          </Nav>
        </Col>
        <Col className="m-2 productCard">
          <h1 className="text-center m-3"> All products </h1>
          {error && <div className="alert alert-danger">{error}</div>}
          {/* Display search results */}
        <CardGroup className="justify-content-center">
          {searchedProducts.length > 0
            ? searchedProducts.map((product) => <ProductCard productProp={product} key={product._id} />)
            : searchResults.length > 0
            ? searchResults.map((product) => <ProductCard productProp={product} key={product._id} />)
            : products}
        </CardGroup>
        </Col>
      </Row>
    </>
  );
}


