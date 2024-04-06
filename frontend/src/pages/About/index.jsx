import React, { useEffect, useState } from 'react';
import { redirect, useParams, useSearchParams } from "react-router-dom";
import axios from "axios";

const About = () => {
  const [resdata, setresData] = useState([]);
  const [url, seturl] = useState("");
  const {id} = useParams();
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
    }
    fetchcart();
}, [])
  useEffect(() => {
    const temp = async () => {
      const { data } = await axios.get(
          `http://localhost:5000/buy/${id}`,
          {
              headers: {
                  "Content-Type": "application/json",
                  "Access-Control-Allow-Origin" : "*"
              },
          }
          );
          console.log(data.url)
          seturl(data.url);
    }
    temp();
}, [])

  return (
    <div>
      <a href={url} target='_blank'>
      <button>
        buy now
      </button>
      </a>

    </div>
  )
}

export default About