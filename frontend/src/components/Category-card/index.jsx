import { Link } from "react-router-dom";
import img0 from "../../assets/dataset1.png"


const Productcard = ({ image, name, description, id, price, time }) => {

    // image = "../../assets/dataset1.png";
    return (
        <div
            className="w-72 bg-white shadow-[2px_4px_35px_4px_rgba(0,0,0,0.10)] rounded-xl duration-500 hover:scale-105 hover:shadow-xl"
            key={id}
        >   
            <Link to={id}>
                <img
                    src={img0}
                    alt="Product"
                    className="h-40 w-72 object-cover rounded-t-xl"
                />
                <div className="flex flex-col items-start justify-center mt-3 pl-3 pr-3 w-72 truncate">
                    <p className="text-lg font-bold text-black truncate block capitalize mt-1 mb-1">
                        {name}
                    </p>

                    <div className="text-sm font-mono text-gray-800 max-h-[50px] capitalize mb-3">
                        {description.split(" ").slice(0, 15).join(" ")}
                    </div>

                    <span className="text-gray-500 mr-3 uppercase text-s">${price}</span>
                    <span className="text-gray-500 mr-3 uppercase text-xs">{time}</span>
                </div>

                <div className="px-2 py-1 w-72 flex">
                    <div className="flex items-center">
                    </div>
                </div>
            </Link>
        </div>
    );
};

export default Productcard;
