import React, { useEffect, useState } from 'react';
import CategoryCard from "../../components/Category-card";


const Categories = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

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

    // setData([
    //     {
    //         image: "https://images.unsplash.com/photo-1603145733190-59811e523c72?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //         name: "dataset1",
    //         description: "description1 long long long loooong description for testing purposes only, mooore long really loong description...",
    //         id: 1,
    //         price: 149,
    //     },
    //     {
    //         image: "https://images.unsplash.com/photo-1603145733190-59811e523c72?q=80&w=2970&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    //         name: "dataset2",
    //         description: "description2",
    //         id: 2,
    //         price: 149,
    //     },        
    // ])
    // fetchData();
    
    const todisplay = data.map((item) => <CategoryCard key={item.id} {...item} />);

    if (loading) {
        return <h1>Loading...</h1>;
    }

    return (
        <div>
            <div className="text-center p-10">
                <h1 className="categories text-4xl mb-4 font-medium">Explore our amazing Categories!</h1>
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
