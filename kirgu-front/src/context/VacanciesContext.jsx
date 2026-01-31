// src/context/VacanciesContext.jsx
import React, { createContext, useContext, useState, useMemo } from 'react';
import { mockVacancies } from '../mock/mockVacancies';

const VacanciesContext = createContext();

export const VacanciesProvider = ({ children }) => {
  const [vacancies] = useState(mockVacancies);
  const [searchQuery, setSearchQuery] = useState('');

  // Активные фильтры (по ним фильтруем список)
  const [filters, setFilters] = useState({
    city: '',
    salaryMin: '',
    salaryMax: '',
  });

  // Промежуточные значения фильтров (то, что вводит пользователь до нажатия)
  const [pendingFilters, setPendingFilters] = useState(filters);

  // Основная фильтрация
  const filteredVacancies = useMemo(() => {
    return vacancies.filter((vac) => {
      const matchesTitle = vac.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCity = filters.city ? vac.city === filters.city : true;
      const matchesSalaryMin = filters.salaryMin ? vac.salaryMin >= +filters.salaryMin : true;
      const matchesSalaryMax = filters.salaryMax ? vac.salaryMax <= +filters.salaryMax : true;

      return matchesTitle && matchesCity && matchesSalaryMin && matchesSalaryMax;
    });
  }, [vacancies, searchQuery, filters]);

  // Применение фильтров при клике на кнопку
  const applyFilters = () => {
    setFilters(pendingFilters);
  };

  return (
    <VacanciesContext.Provider
      value={{
        vacancies,
        filteredVacancies,
        searchQuery,
        setSearchQuery,
        filters,
        pendingFilters,
        setPendingFilters,
        applyFilters,
      }}
    >
      {children}
    </VacanciesContext.Provider>
  );
};

export const useVacancies = () => useContext(VacanciesContext);
