const hbs = require('handlebars');
const layout = require('./layout');

hbs.registerPartial('sales-reports',
    `<h1>Sales this year</h1>
    <table>
    <thead><tr>
        <th>Monat</th><th>Neue Leads</th><th>Angebote gewonnen</th><th>Angebote verloren</th>
        <th>Angebotsvolumen gewonnen</th><th>Angebotsvolumen verloren</th>
    </tr></thead>
    <tbody>
    {{#each months}}
    <tr>
        <td>{{ this.name }}</td><td>{{ this.newLeads }}</td><td>{{ this.salesClosed }}</td><td>{{ this.salesLost }}</td>
        <td>{{ this.salesClosedValue }}</td><td>{{ this.salesLostValue }}</td>
    </tr>
    {{/each}}
    </tbody>
    </table>
     `);

function renderSalesReports (monthsData, user) {
    const viewModel = { months: monthsData, bodyPartial: 'sales-reports', user: user };
    return layout(viewModel);
}

module.exports = {
    render: renderSalesReports
};