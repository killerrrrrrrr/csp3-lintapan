import { Carousel, Image, Container } from 'react-bootstrap';
import demonSlayerImg from '../images/demon-slayer.jpg';
import gojoImg from '../images/gojo.jpg';
import tokyoGhoulImg from '../images/tokyo-ghoul.jpg';
 

export default function Highlights() {
 return (
    <Container fluid className="d-flex justify-content-center align-items-center p-0">
      <Carousel>
        <Carousel.Item>
          <Image src={demonSlayerImg} alt="Demon Slayer" fluid />
        </Carousel.Item>
        <Carousel.Item>
          <Image src={gojoImg} alt="Gojo" fluid />
        </Carousel.Item>
        <Carousel.Item>
          <Image src={tokyoGhoulImg} alt="Tokyo Ghoul" fluid />
        </Carousel.Item>
      </Carousel>
    </Container>
  );
}