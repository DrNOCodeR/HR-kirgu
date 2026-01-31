import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import ApplyForm from "../components/ApplyForm";
import axios from "axios";
import "../styles/vacancies.scss";

const VacancyDetails = () => {
  const { id } = useParams();
  const [vacancy, setVacancy] = useState(null);
  useEffect(() => {
    const fetchVacancy = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/vacancies/${id}`,
        );
        if (res.data.success && res.data.empData.length > 0) {
          setVacancy(res.data.empData[0]); // берем первый элемент массива
        } else {
          console.error(res.data.message);
        }
      } catch (err) {
        console.error("Ошибка при загрузке вакансии:", err);
      }
    };

    fetchVacancy();
  }, [id]);

  if (!vacancy) return <p>Загрузка...</p>;

  const des = vacancy.Description.split(/[:;]/)
    .map((item) => item.trim())
    .filter(Boolean);

  const keywords = ["требования", "предстоит", "предлагаем"];

  return (
    <div className="vacancy-details-page">
      <h1 className="vacancy-details-title">{vacancy.Title}</h1>
      <p className="vacancy-details-city">{vacancy.City}</p>
      <p className="vacancy-details-salary">
        {vacancy.SalaryMin} – {vacancy.SalaryMax} ₽
      </p>

      <div className="vacancy-details-description">
        {des.map((d, idx) =>
          keywords.some((keyword) => d.toLowerCase().includes(keyword)) ? (
            <p key={idx}>
              <strong>{d}:</strong>
            </p>
          ) : (
            <pre key={idx}> - {d}</pre>
          ),
        )}
      </div>

      <h2>Откликнуться на вакансию</h2>
      <ApplyForm vacancyId={vacancy.Id} />
    </div>
  );
};

export default VacancyDetails;
