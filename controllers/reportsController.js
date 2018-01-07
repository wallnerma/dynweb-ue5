const reports = require('./../models/reportsModel');
const reportsView = require('./../views/reportsView');

function handleGetReports(req, res) {
    res.send(reportsView.render(reports.getData(), req.session.user));
}

module.exports = {
    getReports: handleGetReports
};