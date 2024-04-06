import React from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useParams, useSearchParams } from "react-router-dom";
const Contributors = () => {
    const { id } = useParams();
    const [formData, setFormData] = React.useState({
        answers: [""],
        wallet_address: "",
        survey_id: id,
    });
    const [surdata, setsurData] = React.useState("");

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
        if (name === "answers") {
            setFormData((prevFormData) => {
                const updatedAnswers = [...prevFormData.answers];
                // Update existing question or type
                updatedAnswers[index] =
                    name === "answers" ? value : updatedAnswers[index];
                return {
                    ...prevFormData,
                    answers: updatedAnswers,
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
    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const { data } = await axios.post(
                `http://localhost:5000/surveys/${id}/responses`,
                {...formData},
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response.data.error || "An error occurred");
        }
    };

    return (
        <div>
            <div className="flex justify-center items-center bg-white">
                <div className="container mx-auto my-4 px-4 lg:px-20">
                    <form onSubmit={handleSubmit}>
                        <div className="w-full p-8 my-4 md:px-12 lg:w-9/12 lg:pl-20 lg:pr-40 m-auto rounded-2xl shadow-2xl">
                            <div className="flex">
                                <div className="text-[45px] max-md:text-[36px]  leading-tight custom">
                                    Contribute to {surdata.title}
                                </div>
                            </div>
                            <br />
                            <div className="text-left">
                                {surdata.description}
                            </div>
                            <br />
                            <input
                                className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                type="text"
                                placeholder="Enter the bitcoin wallet address"
                                onChange={handleChange}
                                name="wallet_address"
                                value={formData.wallet_address}
                            />
                            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 auto-rows-auto mt-5">
                                {surdata
                                    ? surdata.questions.map(
                                          (question, index) => (
                                              <React.Fragment key={index}>
                                                  <textarea
                                                      readOnly
                                                      className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                                      type="text"
                                                      placeholder="Question"
                                                      name="questions"
                                                      value={
                                                          surdata.questions[
                                                              index
                                                          ]
                                                      }
                                                  />
                                                  <input
                                                      className="w-full bg-gray-100 text-gray-900 mt-2 p-3 rounded-lg focus:outline-none focus:shadow-outline"
                                                      type={
                                                          surdata
                                                              .questions_type[
                                                              index
                                                          ] === "number"
                                                              ? "number"
                                                              : "text"
                                                      }
                                                      placeholder="Answers"
                                                      onChange={(e) =>
                                                          handleChange(e, index)
                                                      }
                                                      name="answers"
                                                      value={
                                                          formData.answers[
                                                              index
                                                          ]
                                                      }
                                                  />
                                              </React.Fragment>
                                          )
                                      )
                                    : ""}
                            </div>
                            <br />
                            
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
