import { useEffect, useState, useContext } from 'react'
import UserContext from '../UserContext'
import AdminView from '../components/AdminView';
import UserView from '../components/UserView';


export default function Products() {

	const { user } = useContext(UserContext);;

	const [products, setProducts] = useState([])

	const fetchData = () => {

		fetch(`${process.env.REACT_APP_API_URL}/products/all-products`)
		.then(res => res.json())
		.then(data => {

			setProducts(data);
		})
	}


	useEffect(() => {

		fetchData()

	}, []);

	return (

		(user.isAdmin === true)
		?
		<AdminView key={products.id} productsData={products} fetchData={fetchData} userId={user.id}/>
		:
		<UserView key={products.id} productsData={products} fetchData={fetchData}/>

		)
}