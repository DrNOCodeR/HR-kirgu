import React from "react";
import VacancyCard from "./VacancyCard";
import { motion } from "framer-motion";

const VacanciesList = ({ vacancies }) => {
  if (!vacancies.length)
    return <p className="no-results">Вакансии не найдены</p>;

  return (
    <motion.div
      className="vacancies-grid"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
      }}
    >
      {vacancies.map((v) => (
        <VacancyCard key={v.Id} vacancy={v} />
      ))}
    </motion.div>
  );
};

export default VacanciesList;
