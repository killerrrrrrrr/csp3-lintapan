import { useState, useEffect } from 'react';
import { CardGroup } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import PreviewProduct from './PreviewProduct';
 

export default function FeaturedProduct () {

	// the list of featured courses using the PreviewCourses component
	const [previews, setPreviews] = useState([]);

	useEffect(() => {

		fetch(`${ process.env.REACT_APP_API_URL}/products/all-products`)
		.then(res => res.json())
		.then(data => {

			// Simple Recommendation Algorithm

			// Step 1: Store our featured courses in an array

			const featured = [];

			// Step 2: Generate Random numbers and store in the "numbers" array

			const numbers = [];

			const generateRandomNumbers = () => {

				//Math.floor() is a built-in JS method to make the number whole number
				let randomNum = Math.floor(Math.random() * data.length);

				if(numbers.indexOf(randomNum) === -1) {

					numbers.push(randomNum);

				} else {

					//Recursion - invoking a function inside its logic
					generateRandomNumbers();
				}
			}

			// Step 3: Select random courses to be added in the "featured" array

			for (let i = 0; i < 5; i++) {

				generateRandomNumbers();

				featured.push(

					<PreviewProduct data={data[numbers[i]]} key={data[numbers[i]]._id} breakPoint={2} />

					)
			}

			// Step 4: Update the "previews" state using the "featured" array
			setPreviews(featured);


		})
	}, [])

	return (

		<>
			<h2 className="text-center mt-4">Featured Products</h2>
			<CardGroup className="justify-content-center">
				{/*add the state here*/}
				{previews}
			</CardGroup>
		</>

		)
}