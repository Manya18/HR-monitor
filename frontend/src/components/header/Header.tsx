import { Link } from "react-router-dom";
import "./header.css";

const Header = ({ selectedTab }: { selectedTab: string }) => {
  const tabs = [
    { name: "", title: "Главная"},
    { name: "tasks", title: "Задачи" },
    { name: "vacancies", title: "Вакансии" },
    { name: "candidates", title: "Кандидаты" },
  ];

  return (
    <div className="Header">
        <h1 className="Header-title">HR-монитор</h1>
        <div className="Header-tabSelector">
            {tabs.map((tab) => (
                <Link
                    to={'/' + tab.name}
                    key={tab.name}
                    className={selectedTab === tab.name ? "Header-tabSelector-tab selected" : "Header-tabSelector-tab"}
                >
                    {tab.title}
                </Link>
            ))}
        </div>
    </div>
  );
};

export default Header;
