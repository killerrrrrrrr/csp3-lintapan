import { Card, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

export default function PreviewProduct({ data, breakPoint }) {
  const { _id, name, description, price, imagePath } = data;

  return (
    <Col xs={12} md={breakPoint} className="my-3">
      <Card className="cardHighlight mx-2">
        <Card.Img
          variant="top"
          src={`${process.env.REACT_APP_API_URL}/${imagePath}`} // Use imagePath directly as src
          alt={name}
          className="p-3"
        />
        <Card.Body>
          <Card.Title className="text-center">
            <Link to={`/products/${_id}`} className="text-dark" style={{ textDecoration: 'none' }} >
              {name}
            </Link>
          </Card.Title>
        </Card.Body>
        <Card.Footer>
          <h5 className="text-center">₱{price}</h5>
          <Link className="btn btn-dark d-block" to={`/products/${_id}`}>
            Buy now
          </Link>
        </Card.Footer>
      </Card>
    </Col>
  );
}
