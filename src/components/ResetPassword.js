import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import Swal from 'sweetalert2';


const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: ' Password did not matched'
        })
      return;
    }

    try {
      const token = localStorage.getItem('token'); 
      const response = await fetch(`${process.env.REACT_APP_API_URL}/users/reset-password`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newPassword: password }),
      });

      if (response.ok) {

        Swal.fire({
          title: 'Success!',
          icon: 'success',
          text: 'Password reset successfully'
        })
        setPassword('');
        setConfirmPassword('');
        setShowModal(false);
      } else {
        const errorData = await response.json();
        Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: ' Please try again'
        })
      }
    } catch (error) {
      Swal.fire({
          title: 'Error!',
          icon: 'error',
          text: ' Please try again'
        })
      console.error(error);
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
      <Button className="mx-2" variant="outline-light" size="lg" onClick={openEdit}>Reset Password</Button>

      <Modal show={showModal} onHide={closeEdit}>
        <Form onSubmit={handleResetPassword}>
          <Modal.Header closeButton>
            <Modal.Title>Reset Password</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group>
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={closeEdit}>Close</Button>
            <Button variant="dark" type="submit">Reset Password</Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};

export default ResetPassword;
