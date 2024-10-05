import { Link } from "react-router-dom";
import Header from "../components/Header";
import { CandidateType } from "../types/CandidatesTypes";
import './candidatesPage.css'

const CandidatesPage = () => {

    const candidates: CandidateType[] = [
        {   name: 'Иван',
            surname: 'Иванов',
            phone: '+79999999999',
            level: 'middle',
            resume: 'link',
            source: 'hh.ru',
            status: 'Новый кандидат',
            vacancies: ['a', 'b'],
            responsible: 'Петров Анастасия',
            date: '10.10.2024'
        },
        {   name: 'Иван',
            surname: 'Иванов',
            phone: '+79999999999',
            level: 'middle',
            resume: 'link',
            source: 'hh.ru',
            status: 'Новый кандидат',
            vacancies: ['a', 'b'],
            responsible: 'Петров Петр',
            date: '10.10.2024'
        }
    ]

    return (
        <div className="CandidatesPage">
            <Header selectedTab="candidates"></Header>
            <div className="CandidatesPage-wrapper">
                <div className="CandidatesPage-header">
                    <div className="CandidatesPage-header-title">Кандидаты</div>
                    <div className="CandidatesPage-header-addButton red-button">Добавить кандидата</div>
                </div>
                <div className="CandidatesPage-content">
                    <table className="CandidatesPage-content-table">
                        <thead className="CandidatesPage-content-table-head">
                            <tr>
                                <th>Кандидат</th>
                                <th>Вакансия</th>
                                <th>Статус</th>
                                <th>Добавлено</th>
                                <th>Ответственный</th>
                                <th></th>
                            </tr>
                        </thead>
                        {candidates.map((candidates) => (
                            <tr className="">
                                <td className="">{candidates.name + candidates.surname}</td>
                                <td className="">{candidates.vacancies}</td>
                                <td className="">{candidates.status}</td>
                                <td className="">{candidates.date}</td>
                                <td className="">{candidates.responsible}</td>
                                <td>
                                    <div>редакт</div>
                                    <div>удалить</div>
                                </td>
                            </tr>
                        ))}
                    </table>
                </div>

            </div>
            {/* <Link to='/vacancies'></Link> */}
        </div>
    )
}

export default CandidatesPage;