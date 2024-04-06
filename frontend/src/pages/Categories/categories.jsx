import React, { useEffect, useState } from 'react';
import CategoryCard from "../../components/Category-card";
import searchSvg from "../../assets/icons/search.svg";

const Categories = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetch("http://localhost:5000/surveys")
            .then((res) => res.json())
            .then((data) => {
                const surveys = data.surveys;
                const formattedData = surveys.map((item) => {
                    return {
                        image: item.image,
                        name: item.title,
                        description: item.description,
                        id: item._id,
                        price: item.fees,
                        time: item.time,
                    };
                });
                setData(formattedData);
                setLoading(false);
            })
            .catch((error) => {
                console.error(error);
            });
    }, []);

    const todisplay = data
        .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
        .map((item) => <CategoryCard key={item.id} {...item} />);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <div className="text-center p-10">
                <h1 className="categories text-4xl mb-4 font-medium">Explore ongoing Surveys</h1>
                <div className='max-w-md mx-auto'>
                    <div className="border-2 border-gray-200 border-3  relative flex items-center w-full h-12 rounded-[50px] focus-within:shadow-lg focus-within:border-gray-600 bg-white overflow-hidden">
                        <div className="grid place-items-center h-full w-12 text-gray-300">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <input
                            className="peer h-full w-full outline-none text-sm text-gray-700 pr-2"
                            type='text'
                            value={searchTerm}
                            placeholder='Search'
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div
                id="Projects"
                className="w-fit mx-auto grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 justify-items-center justify-center gap-y-20 gap-x-14 mt-10 mb-5"
            >
                {!loading && todisplay}
            </div>
        </div>
    );
};

export default Categories;
