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
              { name: 'Anomaly', value: data["Anomaly"] },
              { name: 'Not Anomaly', value: data["Not Anomaly"] },
              { name: 'Not Checked', value: data["Not Checked"] }
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
            <div className="flex justify-end mx-4">
              <div>
                <CustomActiveShapePieChart data={chartdata} />
              </div>
            </div>
            <button onClick={handleClick}>Run checks</button>
            <br />
            <a href={url} target="_blank">
                <button>buy now</button>
            </a>
            <div className="">
                <JsonToTable json={resdata.responses} />
            </div>
        </div>
    );
};

export default About;
