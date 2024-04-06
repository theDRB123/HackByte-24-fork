import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
const Designer_home = () => {
    const [formData, setFormData] = React.useState({
        title: "",
        description: "",
        questions: [""],
        questions_type: [""],
        fees: ""
    });
    console.log(formData)
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
                        <div className="w-full p-8 my-4 md:px-12 lg:w-9/12 lg:pl-20 lg:pr-40 mr-auto rounded-2xl shadow-2xl text-right">
                            <div className="flex">
                                <div className="text-[45px] max-md:text-[36px]  leading-tight custom">
                                    Create a New Survey
                                </div>
                            </div>

                            <div className="my-4 gap-3 flex flex-col">
                                <input
                                    className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                    type="text"
                                    placeholder="Survey Title"
                                    onChange={handleChange}
                                    name="title"
                                    value={formData.title}
                                />

                                <textarea
                                    placeholder="Describe more about the survey"
                                    className="w-full h-32 bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                    onChange={handleChange}
                                    name="description"
                                    value={formData.description}
                                ></textarea>
                            </div>
                            <input
                                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                type="number"
                                placeholder="Enter the budget"
                                onChange={handleChange}
                                name="fees"
                                value={formData.fees}
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
                            <input type="button" value={"➕"} onClick={handleAddField} className=""/>
                            <br />
                            

                            <div className="my-2 w-1/2 lg:w-1/4">
                                <button
                                    className="text-sm tracking-wide bg-black text-gray-100 p-3 rounded-lg w-full 
                      focus:outline-none focus:shadow-outline"
                                >
                                    Publish Survey
                                </button>
                            </div>
                        </div>
                    </form>

                    <div className="font-serif w-full lg:-mt-96 lg:w-2/6 px-8 py-12 ml-auto bg-black rounded-2xl">
                        <div className="flex flex-col text-white">
                            <h1 className="text-4xl my-4">
                                Steps to follow :
                            </h1>
                            <p className="text-gray-200 leading-loose">
                                1. Add survey title, description and budget.<br/>
                                2. Add the necessary fields/questions in the survey.<br/>
                                3. Add the expected response data type of the questions.<br/>
                                4. Click on the ➕ button to add more questions.<br/>
                            </p>

                            {/* <div className="flex my-4 w-2/3 lg:w-1/2">
                                <div className="flex flex-col">
                                    <i className="fas fa-map-marker-alt pt-2 pr-2" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl">Main Office</h2>
                                    <p className="text-gray-400">
                                        B-401, Hall of Residance 4, IIITDMJ PIN-
                                        482005
                                    </p>
                                </div>
                            </div> */}

                            {/* <div className="flex my-4 w-2/3 lg:w-1/2">
                                <div className="flex flex-col">
                                    <i className="fas fa-phone-alt pt-2 pr-2" />
                                </div>
                                <div className="flex flex-col">
                                    <h2 className="text-2xl">Call Us</h2>
                                    <p className="text-gray-400">
                                        Tel: 90799-15245
                                    </p>
                                    <p className="text-gray-400">
                                        Fax: 88698-87160
                                    </p>
                                </div>
                            </div> */}
                        </div>
                    </div>
                </div>
            </div>
            <br />
            <br />
            <br />
            <br />
        </div>
    );
};

export default Designer_home;
