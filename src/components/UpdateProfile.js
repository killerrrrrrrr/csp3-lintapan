import React, { useState, useEffect } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';


const UpdateProfile = ({fetchProfile}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [mobileNo, setMobileNo] = useState('');
  const [showModal, setShowModal] = useState(false);


  
  const resetForm = () => {
    setFirstName('');
    setLastName('');
    setMobileNo('');
  };


  const handleSubmit = async (e) => {

    e.preventDefault();

    const token = localStorage.getItem('token'); // Retrieve JWT token from localStorage

    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/profile`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}` // Add JWT token to Authorization header
        },
        body: JSON.stringify({ 
          firstName: firstName, 
          lastName: lastName, 
          mobileNo: mobileNo })
      });

      if (response.ok) {
        Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: 'Profile updated successfully'
        })        
        resetForm();
        fetchProfile();
      } else {
         Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: ' Please try again'
        })
      }
    } catch (error) {
      console.error('Error updating profile:', error);
       Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: ' An error occurred while updating profile.'
        })
    }
  };

  const openEdit = () => {
    setShowModal(true); 
  };

  const closeEdit = () => {
    setShowModal(false); 
  };


  return (
    
    <>
      <Button className="mx-2" variant="outline-light" size="lg" onClick={openEdit}>Update Profile</Button>

      <Modal show={showModal} onHide={closeEdit}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Update Profile</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Mobile Number</Form.Label>
              <Form.Control
                type="text"
                value={mobileNo}
                onChange={e => setMobileNo(e.target.value)}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>Close</Button>
            <Button variant="dark" type="submit">Update</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default UpdateProfile;
