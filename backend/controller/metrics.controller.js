const db = require('../db');

class MetricsController {
    async getCommonMetrics(req, res) {
        try {
            const commonMetrics = await db.query(`
                SELECT 
                  COUNT(CASE WHEN finished_at IS NULL THEN 1 END) AS open_vacancies,   
                  COUNT(CASE WHEN finished_at IS NOT NULL THEN 1 END) AS closed_vacancies,
                  AVG(EXTRACT(EPOCH FROM (finished_at - created_at)) / 86400) AS avg_closing_days,
                  (SELECT COUNT(*) FROM Candidate) AS candidate_count,
                  (SELECT COUNT(*) FROM Task WHERE done = FALSE) AS open_tasks_count
                FROM 
                  Vacancy;
            `);

            res.json(commonMetrics.rows);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
    async getProcessedVacancies(req, res) {
        try {
            const ProcessedVacancies = await db.query(`SELECT 
                TO_CHAR(DATE_TRUNC('month', finished_at), 'YYYY-MM') AS month,  
                COUNT(*) AS processed_vacancies
                FROM 
                Vacancy
                WHERE 
                finished_at IS NOT NULL  
                GROUP BY 
                DATE_TRUNC('month', finished_at)
                ORDER BY 
                month;
            `);
            res.json(ProcessedVacancies.rows);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
    async getSelectionFunnel(req, res) {
        try {
            const SelectionFunnel = await db.query(`SELECT 
            dcs.title, 
            COUNT(cs.status_id) AS status_count
        FROM 
            Default_candedate_status dcs
        LEFT JOIN 
            Candidate_status cs ON dcs.id = cs.status_id
        GROUP BY 
            dcs.title;
            `);
            res.json(SelectionFunnel.rows);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
    async getRangeDiagram(req, res) {
        try {
            const rangeDiagramQuery = `
                WITH status_times AS (
                    SELECT
                        cs.status_id,
                        cs.updated_at AS start_time,  
                        LEAD(cs.updated_at) OVER (PARTITION BY cs.candidate_id ORDER BY cs.updated_at) AS end_time  
                    FROM Candidate_status cs
                )
                SELECT 
                    dcs.title, 
                    PERCENTILE_CONT(0.5) WITHIN GROUP (ORDER BY EXTRACT(EPOCH FROM (end_time - start_time)) / 3600) AS median_hours,
                    COUNT(cs.status_id) AS status_count
                FROM 
                    Default_candedate_status dcs
                LEFT JOIN 
                    Candidate_status cs ON dcs.id = cs.status_id
                LEFT JOIN 
                    status_times st ON cs.status_id = st.status_id
                WHERE st.end_time IS NOT NULL
                GROUP BY 
                    dcs.title;
            `;
            const result = await db.query(rangeDiagramQuery);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }
    async getRejectedVacancies(req, res) {
        try {
            const rejectedVacancies = `
SELECT cs1.*, 
    (SELECT cs2.status_id 
        FROM Candidate_status cs2 
        WHERE cs2.candidate_id = cs1.candidate_id 
        AND cs2.updated_at < cs1.updated_at 
        ORDER BY cs2.updated_at DESC 
        LIMIT 1) AS last_status_id,
    (SELECT cs2.updated_at 
        FROM Candidate_status cs2 
        WHERE cs2.candidate_id = cs1.candidate_id 
        AND cs2.updated_at < cs1.updated_at 
        ORDER BY cs2.updated_at DESC 
        LIMIT 1) AS last_status_updated_at
FROM Candidate_status cs1
WHERE cs1.status_id IN (4, 5);
            `;
            const result = await db.query(rejectedVacancies);
            res.json(result.rows);
        } catch (error) {
            res.status(500).json({ error: 'Ошибка при получении данных' });
        }
    }

}

module.exports = new MetricsController();