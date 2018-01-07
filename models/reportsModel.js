const month = function (name, newLeads, salesClosed, salesLost, salesClosedValue, salesLostValue) {
    return {
        name: name,
        newLeads: newLeads,
        salesClosed: salesClosed,
        salesLost: salesLost,
        salesClosedValue: salesClosedValue,
        salesLostValue: salesLostValue
    }
};

module.exports = {
    getData: function() {
        return [
            month('Jänner', 1, 3, 0, 75400, 0),
            month('Februar', 4, 0, 1, 0, 10000),
            month('März', 10, 0, 0, 0, 13200),
            month('April', 6, 1, 0, 162800, 0),
            month('Mai', 15, 1, 1, 32500, 65000),
            month('Juni', 7, 0, 0, 0, 0),
            month('Juli', 0, 0, 1, 0, 5200),
            month('August', 3, 1, 0, 22100, 0),
            month('September', 5, 0, 1, 0, 16000),
            month('Oktober', 6, 1, 0, 1750, 0),
            month('November', 1, 0, 0, 0, 0),
            month('Dezember', 3, 1, 0, 10600, 0),
        ];
    }
};