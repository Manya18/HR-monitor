import { Link } from "react-router-dom";
import "./header.css";

const Header = ({ selectedTab }: { selectedTab: string }) => {
  const tabs = [
    { name: "vacancies", title: "Вакансии" },
    { name: "candidates", title: "Кандидаты" },
    { name: "analisys", title: "Анализ" },
  ];
  const changeSelectedTab = (tabName: string) => {
    // добавить зустенд
    selectedTab = tabName
  }

  return (
    <div className="Header">
        <h1 className="Header-title">HR-монитор</h1>
        <div className="Header-tabSelector">
            {tabs.map((tab) => (
                <div
                    key={tab.name}
                    className={selectedTab === tab.name ? "Header-tabSelector-tab selected" : "Header-tabSelector-tab"}
                    onClick={() => changeSelectedTab(tab.name)}
                >
                    {tab.title}
                </div>
            ))}
        </div>
    </div>
  );
};

export default Header;
