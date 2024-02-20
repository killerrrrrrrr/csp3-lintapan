import { useContext, useEffect, useState } from 'react';
import { Row, Col, Container, Form, Image } from 'react-bootstrap';
import UserContext from '../UserContext';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import UserOrders from './UserOrders'
import ResetPassword from '../components/ResetPassword';
import UpdateProfile from '../components/UpdateProfile';


export default function Profile(){

	const { user } = useContext(UserContext);

	const [details, setDetails] = useState({});
	const [selectedFile, setSelectedFile] = useState(null);
	const [uploadStatus, setUploadStatus] = useState('');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
  try {
    const formData = new FormData();
    formData.append('image', selectedFile);
    formData.append('user.id', user.id); 


    const response = await axios.post(`${process.env.REACT_APP_API_URL}/users/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
      });

    console.log('Image uploaded:', response.data.message);
    setUploadStatus('Image uploaded successfully');
  } catch (error) {
    // Handle error
    console.error('Error uploading image:', error);
    setUploadStatus('Failed to upload image');
  }
};



	const fetchProfile = () => {

		fetch(`${process.env.REACT_APP_API_URL}/users/userDetails`, {
			headers: {
				"Authorization": `Bearer ${localStorage.getItem("token")}`
			}
		})
		.then(res => res.json())
		.then(data => {

			if(typeof data._id !== "undefined"){

				setDetails(data);
			}

		})
	}

	useEffect(() => {

		fetchProfile()

	}, []);


	return (
		(user.id === null) ?
			<Navigate to="/products" />
		:
			<>
		<Container fluid className="bg-dark text-white align-items-center p-5">
			<Row>
				<Col className="p-2 align-items-center justify-content-center d-grid">
				<Image 
				src={`${process.env.REACT_APP_API_URL}/${details.imagePath}`} 
				roundedCircle 
				style={{ width: '200px', height: '200px' }}
				className="m-3"
				/>
				<div >
                <input type="file" onChange={handleFileChange} />
                <button onClick={handleUpload} className="px-2">Upload</button>
              </div>
				</Col>
			</Row>
			<Row>
			<Col className="p-4">
				<h2 className="align-items-center justify-content-center d-grid">{`${details.firstName} ${details.lastName}`}</h2>
				<hr/>
			   	<Form>
		         <Form.Group className="mb-3"  as={Row} >
		           <Form.Label column sm={2}>Email address:</Form.Label>
		           <Col sm={10}>
		           <Form.Control disabled value={details.email} className="bg-dark text-white"/>
		            </Col>
		         </Form.Group>
		         <Form.Group className="mb-3"  as={Row}>
		           <Form.Label column sm={2}>Mobile No:</Form.Label>
		            <Col sm={10}>
		           <Form.Control disabled value={details.mobileNo} className="bg-dark text-white"/>
		            </Col>
		         </Form.Group>
		       	</Form>
				</Col>
			</Row>
			<Row className="align-items-center justify-content-center d-grid p-3">
				<Col>
					<ResetPassword />
					<UpdateProfile fetchProfile={fetchProfile} />
				</Col>
			</Row>
		</Container>
		< UserOrders />
	</>

	)

}