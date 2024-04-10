var { executeSQL, executeSQLs } = require('./db_helper')
const { v4: uuidv4 } = require('uuid');

class AdminService {
    async addTask(caseItem) {
        const create_date = caseItem?.createDate ? new Date(caseItem?.createDate) : new Date();
        const task_name = caseItem?.taskName || create_date.toString();
        const case_no = uuidv4();
        const sqls = [];
        caseItem.cases.forEach(task => {
            const sqlQuery = 'INSERT INTO `cases` (`create_date`, `user`, `amount`, `casename`, `caseno`) VALUES (?,?,?,?,?);'
            sqls.push({ sql: sqlQuery, args: [create_date, task.user.id, task.amount, task_name, case_no] })
        });

        try {
            await executeSQLs(sqls);
            return true; Y

        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async updateTask(caseItem) {
        const create_date = caseItem?.createDate ? new Date(caseItem?.createDate) : new Date();
        const task_name = caseItem?.taskName || create_date.toString();
        // const case_no = caseItem.caseno;

        const sqls = [];
        caseItem.cases.forEach(task => {
            const sqlQuery = 'UPDATE cases SET create_date=?, amount=?, casename=?, user=? WHERE id=?;'
            sqls.push({ sql: sqlQuery, args: [create_date,  task.amount, task_name, task.user.id, task.id] })
        });

        try {
            await executeSQLs(sqls);
            return true;

        } catch (error) {
            console.log(error)
            return false;
        }
    }

    async deleteTask(caseno) {
        try {
            const sqlQuery = 'DELETE FROM cases where caseno=?;'
            await executeSQL(sqlQuery,[caseno]);
            return true;
        } catch (error) {
            console.log(error);
            return false;
        }
    }


    async getAllTasks() {
        const sqlQuery = 'SELECT c.create_date, c.amount,c.casename, c.caseno, u.username FROM `majiang`.`cases` as c left join `majiang`.`users` as u on c.user = u.id;'
        return await executeSQL(sqlQuery)
    }
}

module.exports = AdminService