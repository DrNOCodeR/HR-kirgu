import React, { useState } from "react";

const FilterBar = ({ filters, onApply, cities }) => {
  const [localFilters, setLocalFilters] = useState({
    city: filters.city,
    salaryMin: filters.salaryMin,
    salaryMax: filters.salaryMax,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLocalFilters({ ...localFilters, [name]: value });
  };

  const handleApply = () => {
    onApply({ ...filters, ...localFilters });
  };

  return (
    <div className="filter-bar">
      <input
        type="text"
        name="q"
        placeholder="Поиск по названию вакансии"
        value={filters.q}
        onChange={(e) => onApply({ ...filters, q: e.target.value })}
      />

      <select name="city" value={localFilters.city} onChange={handleChange}>
        <option value="">Все города</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>

      <input
        type="number"
        name="salaryMin"
        placeholder="От, ₽"
        value={localFilters.salaryMin}
        onChange={handleChange}
      />
      <input
        type="number"
        name="salaryMax"
        placeholder="До, ₽"
        value={localFilters.salaryMax}
        onChange={handleChange}
      />

      <button onClick={handleApply}>Применить</button>
    </div>
  );
};

export default FilterBar;
