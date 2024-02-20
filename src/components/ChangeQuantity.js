import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import debounce from 'lodash/debounce';


export default function ChangeQuantity({ productId, itemQty, fetchCart }) {
  const [quantity, setQuantity] = useState(itemQty);

const changeQuantity = (newQty) => {

    fetch(`${process.env.REACT_APP_API_URL}/cart/change-quantity`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      body: JSON.stringify({
        productId: productId,
        quantity: newQty,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        setQuantity(data.items.quantity);
        
      })
      .catch((error) => {
        console.error('Error occurred:', error);
      });
  }

  const decrement = () => {
    const newQty = Math.max(parseInt(quantity, 10) - 1, 1);
     if (newQty === 0) {
      deleteItem();
    } else {
      changeQuantity(newQty);
    }
  };

  const increment = () => {
    const newQty = parseInt(quantity, 10) + 1;
    changeQuantity(newQty);
  };

 

   const handleQuantityChange = (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value)) {
      const newQty = value === '' || 0 ? parseInt(0) :  parseInt(value, 10);

      setQuantity(newQty);
      changeQuantity(newQty);
    }
  };

  const handleBlur = () => {

    if (quantity === 0) {
      const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
          confirmButton: "btn btn-success",
          cancelButton: "btn btn-danger"
        },
        buttonsStyling: false
      });

      swalWithBootstrapButtons.fire({

        title: "Do you want to remove the product?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
        cancelButtonText: "No, cancel!",
        reverseButtons: true

      }).then((result) => {

        if (result.isConfirmed) {
          swalWithBootstrapButtons.fire({
            title: "Deleted!",
            text: "Product has been deleted.",
            icon: "success"
          });

          deleteItem();

        } else if (result.dismiss === Swal.DismissReason.cancel) {

          swalWithBootstrapButtons.fire({
            title: "Cancelled",
            icon: "error"
          });

          setQuantity(1);
      	  changeQuantity(1);
        }
      });
    } else {
      // If the quantity is not zero, trigger the changeQuantity function here
      changeQuantity(quantity);
    }
  };
 

  const deleteItem = () => {

  	fetch(`${process.env.REACT_APP_API_URL}/cart/remove-from-cart`, {
  		method: "DELETE",
  		headers: {
  			"Content-Type": "application/json",
  			"Authorization": `Bearer ${localStorage.getItem('token')}`
  		},
  		body: JSON.stringify({
  			productId: productId
  		})
  	})
  }

  useEffect(() => {
    setQuantity(itemQty); // Update the quantity when itemQty changes
  }, [itemQty]);

    useEffect(() => {
    fetchCart(); // Update the quantity when itemQty changes
  });


  return (
    <div>
      <button variant="dark" onClick={decrement} className="count-button" disabled={quantity <= 1}>
        -
      </button>
      <input
        type="text"
        value={quantity}
        onChange={handleQuantityChange}
        onBlur={handleBlur} 
        style={{ width: '50px' }}
        className="text-center"
      />
      <button variant="dark" onClick={increment} className="count-button">
        +
      </button>
    </div>
  );
}
