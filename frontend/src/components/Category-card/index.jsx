import { Link } from "react-router-dom";
import img0 from "../../assets/dataset1.png"


const Productcard = ({ image, name, description, id, price, time }) => {

    // image = "../../assets/dataset1.png";

    return (
        <div
            className="w-72 bg-white shadow-md rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
            key={id}
        >
            <Link to={`./../shop?type=${id}`}>
                <img
                    src={img0}
                    alt="Product"
                    className="h-40 w-72 object-cover rounded-t-xl"
                />
                <div className="flex flex-col items-start justify-center mt-3 ml-3 w-72">
                    <p className="text-lg font-bold text-black truncate block capitalize mt-1 mb-1">
                        {name}
                    </p>
                    <div className="fade">
                        <p className="text-sm font-mono text-gray-800 overflow-hidden max-h-[50px] block capitalize mb-3">
                            {description.split(" ").slice(0, 15).join(" ")}
                        </p>
                    </div>
                    <span className="text-gray-500 mr-3 uppercase text-s">${price}</span>
                    <span className="text-gray-500 mr-3 uppercase text-xs">{time}</span>
                </div>

                <div className="px-2 py-1 w-72 flex">
                    <div className="flex items-center">
                        {/* <p className="text-lg font-semibold text-black cursor-auto my-3">$149</p>
                    <del>
                        <p className="text-sm text-gray-600 cursor-auto ml-2">$199</p>
                    </del> */}
                        {/* <div className="ml-auto"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                            fill="currentColor" className="bi bi-bag-plus" viewBox="0 0 16 16">
                            <path fillRule="evenodd"
                                d="M8 7.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V12a.5.5 0 0 1-1 0v-1.5H6a.5.5 0 0 1 0-1h1.5V8a.5.5 0 0 1 .5-.5z" />
                            <path
                                d="M8 1a2.5 2.5 0 0 1 2.5 2.5V4h-5v-.5A2.5 2.5 0 0 1 8 1zm3.5 3v-.5a3.5 3.5 0 1 0-7 0V4H1v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4h-3.5zM2 5h12v9a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V5z" />
                        </svg></div> */}
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Productcard;
