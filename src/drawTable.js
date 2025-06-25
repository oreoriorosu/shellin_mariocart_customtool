export function drawDataTable($DOM, data, displayColumn) {
    let resultDom = $('<table>');
    let headerDom = $('<tr>')
    let bodyDom = $('<tbody>');
    displayColumn.forEach(element => {
        let headerCell = $('<th>').addClass(element.field).text(element.label);
        headerDom.append(headerCell);
    });
    resultDom.append(headerDom);
    data.forEach(element => {
        let line = $('<tr>').addClass("table_line");
        displayColumn.forEach(column => {
            let dataCell = $('<td>').addClass(column.field).text(element[column.field]);
            line.append(dataCell);
        });
        bodyDom.append(line);
    })
    resultDom.append(bodyDom);
    $DOM.html(resultDom);
    return true;
}