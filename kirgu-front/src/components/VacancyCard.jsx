import React from "react";
import { motion } from "framer-motion";
import "../styles/vacancies.scss";

const VacancyCard = ({ vacancy }) => {
  return (
    <motion.div
      className="vacancy-card"
      variants={{
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0 },
      }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.03 }}
    >
      <div className="vacancy-card__header">
        <h3>{vacancy.Title}</h3>
        {/* {vacancy.isNew && <span className="vacancy-badge">Новая</span>} */}
      </div>
      <p className="vacancy-card__city">{vacancy.City}</p>
      <p className="vacancy-card__salary">
        {vacancy.SalaryMin} – {vacancy.SalaryMax} ₽
      </p>
      <p className="vacancy-card__desc">
        {vacancy.Description.slice(0, 120)}...
      </p>
      <a className="vacancy-card__btn" href={`/vacancies/${vacancy.Id}`}>
        Подробнее
      </a>
    </motion.div>
  );
};

export default VacancyCard;
