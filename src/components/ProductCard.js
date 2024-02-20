import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function ProductCard({ productProp }) {
  const { _id, name, description, price, imagePath } = productProp;

  return (
 
    <Col xs={12} sm={6} md={4} className="my-2 ">
      <Card className="cardHighlight mx-2">
        <Card.Img
          variant="top"
          src={`${process.env.REACT_APP_API_URL}/${imagePath}`} // Use imagePath directly as src
          alt={name}
          className="p-2"
        />
        <Card.Body>
          <Card.Title>{name}</Card.Title>
          <Card.Subtitle>Price:</Card.Subtitle>
          <Card.Text className="text-danger">₱ {price}</Card.Text>
          <Link className="btn btn-dark" to={`/products/${_id}`}>
            Buy now
          </Link>
        </Card.Body>
      </Card>
    </Col>
 
  );
}
