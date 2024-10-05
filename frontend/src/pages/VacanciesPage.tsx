import { Link } from "react-router-dom";
import Header from "../components/Header";

const VacanciesPage = () => {
    return (
        <div>
            <Header selectedTab="vacancies"></Header>
            {/* <Link to='/vacancies'></Link> */}
        </div>
    )
}

export default VacanciesPage;