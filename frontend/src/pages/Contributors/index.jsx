import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
const Contributors = () => {
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        questions: [""],
        questions_type: [""],
        wallet_address: "",
    });
    const [surdata, setsurData] = React.useState("");
    const {id} = useParams();

    React.useEffect(() => {
        const fetchSurData = async () => {
            try {
                const { data } = await axios.get(
                    `http://localhost:5000/surveys/${id}`,
                    {
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }
                );
                setsurData(data.surveys[0]);
                console.log(data.surveys[0]);
            } catch (error) {
                console.error("Error fetching survey data:", error);
            }
        };
    
        fetchSurData();
    }, [id]); 


    const handleChange = (event, index) => {
        const { name, value, type, checked } = event.target;
        if (name === "questions" || name === "questions_type") {
            setFormData((prevFormData) => {
                const updatedQuestions = [...prevFormData.questions];
                const updatedTypes = [...prevFormData.questions_type];
                if (index === updatedQuestions.length) {
                    // Add new question and type
                    updatedQuestions.push("");
                    updatedTypes.push("");
                } else {
                    // Update existing question or type
                    updatedQuestions[index] =
                        name === "questions" ? value : updatedQuestions[index];
                    updatedTypes[index] =
                        name === "questions_type" ? value : updatedTypes[index];
                }
                return {
                    ...prevFormData,
                    questions: updatedQuestions,
                    questions_type: updatedTypes,
                };
            });
        } else {
            setFormData((prevFormData) => ({
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value,
            }));
        }
    };

    const handleAddField = () => {
        handleChange(
            { target: { name: "questions", value: "" } },
            formData.questions.length
        );
    };
    async function handleSubmit(event) {
        // console.log(formData);
        event.preventDefault();
        try {
            console.log(formData);
            const { data } = await axios.post(
                "http://localhost:5000/surveys",
                {
                    ...formData,
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("token"),
                    },
                    container,
                }
            );
            toast.success(data.message);
            // window.location.href = "/";
        } catch (error) {
            toast.error(error.response.data.message);
            // console.error(error);
        }
    }
    function handleClick(event) {}

    return (
        <div>
            <div className="flex justify-center items-center bg-white">
                <div className="container mx-auto my-4 px-4 lg:px-20">
                    <form onSubmit={handleSubmit}>
                        <div className="w-full p-8 my-4 md:px-12 lg:w-9/12 lg:pl-20 lg:pr-40 m-auto rounded-2xl shadow-2xl text-right">
                            <div className="flex">
                                <div className="text-[45px] max-md:text-[36px]  leading-tight custom">
                                    Contribute to {surdata.title}
                                </div>
                            </div>

                            <div className="text-left">
                                {surdata.description}
                            </div>
                            <br />
                            <input
                                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                type="number"
                                placeholder="Enter the bitcoin wallet address"
                                onChange={handleChange}
                                name="wallet_address"
                                value={formData.wallet_address}
                            />
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 mt-5">
                                {formData.questions.map((question, index) => (
                                    <React.Fragment key={index}>
                                        <input
                                            className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                            type="text"
                                            placeholder="Question"
                                            onChange={(e) =>
                                                handleChange(e, index)
                                            }
                                            name="questions"
                                            value={formData.questions[index]}
                                        />
                                        <select
                                            className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                            onChange={(e) =>
                                                handleChange(e, index)
                                            }
                                            name="questions_type"
                                            value={
                                                formData.questions_type[index]
                                            }
                                        >
                                            <option value="">
                                                Select Data Type
                                            </option>
                                            <option value="string">
                                                String
                                            </option>
                                            <option value="number">
                                                Number
                                            </option>
                                        </select>
                                    </React.Fragment>
                                ))}
                            </div>
                            <br />
                            <input
                                type="button"
                                value={"➕"}
                                onClick={handleAddField}
                                className=""
                            />
                            <br />

                            <div className="my-2 w-1/2 lg:w-1/4">
                                <button
                                    className="text-sm tracking-wide bg-black text-gray-100 p-3 rounded-lg w-full 
                      focus:outline-none focus:shadow-outline"
                                >
                                    Send Message
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
        </div>
    );
};

export default Contributors;
