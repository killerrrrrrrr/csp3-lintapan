import { useState, useEffect } from 'react';
import { Table, Button, Container } from 'react-bootstrap';
import { Navigate, useNavigate } from 'react-router-dom';
import EditProduct from './EditProduct';
import ArchiveProduct from './ArchiveProduct';
import UploadImage from './UploadImage';
import AddProduct from '../pages/AddProduct';

export default function AdminView({ productsData, fetchData, userId }) {
    const navigate = useNavigate();

    const [products, setProducts] = useState([]);

    useEffect(() => {
        const filteredProducts = productsData.filter(product => product.userId === userId);

        const productsArr = filteredProducts.map(product => (
            <tr key={product._id}>
                <td>{product._id}</td>
                <td>{product.name}</td>
                <td>{product.description}</td>
                <td>{product.price}</td>
                <td>{product.category}</td>
                <td className={product.isActive ? "text-dark" : "text-danger"}>
                    {product.isActive ? "Available" : "Unavailable"}
                </td>
                <td><EditProduct productId={product._id} fetchData={fetchData} /></td>
                <td><ArchiveProduct productId={product._id} isActive={product.isActive} fetchData={fetchData} /></td>
                <td><UploadImage productId={product._id} fetchData={fetchData} /></td>
            </tr>
        ));

        setProducts(productsArr);
    }, [productsData]);

    const addProduct = () => {
        navigate('/addProduct');
    };

    return (
        <>
            <Container className="pb-5">
                <h1 className="text-center my-4">Admin Dashboard</h1>
                <Button variant="dark" onClick={addProduct} className="mb-3 mx-auto d-block"> Add Product </Button>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr className="text-center">
                            <th>ID</th>
                            <th>Name</th>
                            <th>Description</th>
                            <th>Price</th>
                            <th>Category</th>
                            <th>Availability</th>
                            <th colSpan="2">Actions</th>
                            <th>Upload Image</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products}
                    </tbody>
                </Table>
            </Container>
        </>
    );
}
