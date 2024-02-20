import { Button } from 'react-bootstrap';
import Swal from 'sweetalert2';

export default function RemoveItem({ itemId, fetchCart }) {

    const deleteItem = (productId) => {
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
        .then(res => res.json())
        .then(data => {
            console.log(data);
            if (data.message === 'Product removed from cart' || data.message === 'Product removed from cart and cart deleted') {
                Swal.fire({
                    title: "Success",
                    icon: "success",
                    text: "Product removed from cart"
                });
                // Trigger fetchCart to update the cart items
                fetchCart();
            } else {
                Swal.fire({
                    title: "Something went wrong",
                    icon: "error",
                    text: "Please Try Again"
                });
            }
        })
        .catch(error => {
            console.error('Error removing item:', error);
            Swal.fire({
                title: "Error",
                icon: "error",
                text: "Failed to remove item from cart"
            });
        });
    };

    return (
        <Button variant="dark" size="sm" onClick={() => deleteItem(itemId)}>Remove</Button>
    );
}
