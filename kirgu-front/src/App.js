import { BrowserRouter, Routes, Route } from "react-router-dom";
import VacanciesPage from "./pages/VacanciesPage";
import VacancyDetails from "./pages/VacancyDetails";
import { VacanciesProvider } from "./context/VacanciesContext";
import { ThemeProvider } from "./context/ThemeContext";
import Header from "./components/Header";

function App() {
  return (
    <ThemeProvider>
      <VacanciesProvider>
        <BrowserRouter>
          <Header />
          <Routes>
            <Route path="/" element={<VacanciesPage />} />
            <Route path="/vacancies/:id" element={<VacancyDetails />} />
          </Routes>
        </BrowserRouter>
      </VacanciesProvider>
    </ThemeProvider>
  );
}

export default App;
