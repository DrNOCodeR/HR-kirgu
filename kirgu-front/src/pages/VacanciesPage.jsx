import React, { useEffect, useState } from "react";
import VacanciesList from "../components/VacanciesList";
import FilterBar from "../components/FilterBar";
import axios from "axios";

const API_URL = "http://localhost:5000/api/vacancies";

const VacanciesPage = () => {
  const [vacancies, setVacancies] = useState([]);
  const [filteredVacancies, setFilteredVacancies] = useState([]);
  const [filters, setFilters] = useState({
    q: "",
    city: "",
    salaryMin: "",
    salaryMax: "",
  });

  useEffect(() => {
    const fetchVacancies = async () => {
      try {
        const res = await axios.get(API_URL);
        setVacancies(res.data.empData);
        setFilteredVacancies(res.data.empData);
      } catch (err) {
        console.error("Ошибка получения вакансий:", err);
      }
    };
    fetchVacancies();
  }, []);

  // Фильтр по названию срабатывает сразу
  useEffect(() => {
    if (!filters.q) {
      setFilteredVacancies(vacancies);
    } else {
      const filtered = vacancies.filter((v) =>
        v.Title.toLowerCase().includes(filters.q.toLowerCase())
      );
      setFilteredVacancies(filtered);
    }
  }, [filters.q, vacancies]);

  // Применяем фильтры города и зарплаты по кнопке
  const handleFiltersApply = (newFilters) => {
    let filtered = [...vacancies];

    if (filters.q) {
      filtered = filtered.filter((v) =>
        v.Title.toLowerCase().includes(filters.q.toLowerCase())
      );
    }

    if (newFilters.city) {
      filtered = filtered.filter(
        (v) => v.City.toLowerCase() === newFilters.city.toLowerCase()
      );
    }

    if (newFilters.salaryMin) {
      filtered = filtered.filter(
        (v) => v.SalaryMin >= parseInt(newFilters.salaryMin)
      );
    }

    if (newFilters.salaryMax) {
      filtered = filtered.filter(
        (v) => v.SalaryMax <= parseInt(newFilters.salaryMax)
      );
    }

    setFilteredVacancies(filtered);
    setFilters(newFilters);
  };

  // Генерируем список городов для select
  const cities = [...new Set(vacancies.map((v) => v.City))];

  return (
    <div className="vacancies-page">
      <h1 className="vacancies-title">Актуальные вакансии</h1>
      <FilterBar
        filters={filters}
        onApply={handleFiltersApply}
        cities={cities}
      />
      <VacanciesList vacancies={filteredVacancies} />
    </div>
  );
};

export default VacanciesPage;

