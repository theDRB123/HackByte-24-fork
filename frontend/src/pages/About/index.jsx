import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { JsonToTable } from "react-json-to-table";
import { redirect, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

import CustomActiveShapePieChart from "../../components/chart";

const About = () => {
    const [resdata, setresData] = useState([]);
    const [url, seturl] = useState("");
    const [chartdata, setechartdata] = useState([]);
    const { id } = useParams();
    const myJson = {
        Student: { name: "Jack", email: "jack@xyz.com" },
        "Student id": 888,
        Sponsors: [
            { name: "john", email: "john@@xyz.com" },
            { name: "jane", email: "jane@@xyz.com" },
        ],
    };
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

    useEffect(() => {
        const fetchcart = async () => {
            const { data } = await axios.get(
                `http://localhost:5000/surveys/${id}/responses`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log(data);
            setresData(data);
            const newData = [
                { name: "Anomaly", value: data["Anomaly"] },
                { name: "Not Anomaly", value: data["Not Anomaly"] },
                { name: "Not Checked", value: data["Not Checked"] },
            ];
            setechartdata(newData);
        };
        fetchcart();
    }, []);
    useEffect(() => {
        const temp = async () => {
            const { data } = await axios.get(
                `http://localhost:5000/buy/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Access-Control-Allow-Origin": "*",
                    },
                }
            );
            console.log(data.url);
            seturl(data.url);
        };
        temp();
    }, []);
    const handleClick = async () => {
        try {
            toast.success("Checks successfully scheduled");
            const { data } = await axios.get(
                `http://localhost:5000/anomaly_detection/${id}`,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            console.log("sent");
            toast.success("Checks run successfully");
        } catch (error) {
            toast.error(error.response.data.error || "An error occurred");
        }
    };

    return (
        <div>
            <div className="flex mx-4 my-4 justify-around">
                <div className="py-12 w-[50%]">
                    <div className="text-[35px] max-md:text-[24px]  leading-tight custom ">
                        {surdata.title}
                    </div>
                    <br />
                    <div className="text-[16px] max-md:text-[16px]  leading-[28px] italic ">
                        {surdata.description}
                    </div>
                </div>
                <div className="w-[30%]">
                    <CustomActiveShapePieChart data={chartdata} />
                </div>
            </div>
            <button onClick={handleClick}>Run checks</button>
            <br />
            <a href={url} target="_blank">
                <button>buy now</button>
            </a>
            <div className="w-[70%] m-auto">
                <JsonToTable json={resdata.responses} className="w-[70%]" />
            </div>
        </div>
    );
};

export default About;
