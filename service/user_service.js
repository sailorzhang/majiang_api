var { executeSQL, executeSQLs } = require('../service/db_helper')
var _ = require('underscore');
const util = require('util');

class UserService {
    async getTotalAmountByUser() {
        const sqlQuery = 'select username,amount from majiang.users u left join (select sum(amount) as amount,user from majiang.cases group by user) c on c.user = u.id;'
        return await executeSQL(sqlQuery)
    }

    async getCaseList() {
        const sqlQuery = 'SELECT c.*, u.username FROM cases as c left join users as u on c.user = u.id order by create_date desc;'
        const list = await executeSQL(sqlQuery);
        const groupList = _.groupBy(list, (item) => {
            return item.caseno;
        });

        return _.map(groupList, (l, key) => {
            const create_date = l[0].create_date;
            const casename = l[0].casename;
            return { 'caseno': key, 'create_date': create_date, 'casename': casename, 'cases': this._pick(l) };
        });
    }

    async getUserList() {
        const sqlQuery = 'SELECT id, username as label FROM users;'
        const list = await executeSQL(sqlQuery);
        return list;
    }

    async getTopBottom() {
        const sqlQuery = `
        SELECT c.create_date, amount, u.username
        FROM cases as c
        left join users as u
        on c.user = u.id
        order by amount %s LIMIT 1`
        const results = await executeSQLs([{sql: util.format(sqlQuery, 'desc')}, {sql: util.format(sqlQuery, 'asc')}], false);
        return {top: results[0][0], bottom: results[1][0]}
    }

    async getReportData() {
        const sqlQuery = `
        with User_CTE as
        (
        select id as user, username from users
        )
        ,Caseno_CTE as
        (
        select distinct caseno, create_date from cases
        )

        select
        u.username
        ,c.caseno
        ,u.user,
        create_date
        ,ifnull((select amount amount from cases c1 where c1.user = u.user and c.caseno = c1.caseno),0) as amount

        from  User_CTE u, Caseno_CTE c
        order by c.create_date desc, user
        `
        return await executeSQL(sqlQuery);
    }

    _pick(list) {
        return _.map(list, item => {
            const obj = _.pick(item, 'username', 'amount', 'user', 'id');
            return { id: obj.id, 'amount': obj.amount, user: { 'label': obj.username, 'id': obj.user } }
        })
    }
}

module.exports = UserService