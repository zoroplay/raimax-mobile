export const periods = [
    {value: 'today', label: 'Today'},
    {value: '3hour', label: '3H'},
    {value: '24hour', label: '24H'},
    {value: '72hour', label: '72H'},
    {value: 'all', label: 'All'}
];

export const matchStatus = (status) => {
    switch (status) {
        case 0:
            return 'Not Set';
            break;
        case 3:
            return '1st Period';
            break;
        case 4:
            return '2nd Period';
            break;
        case 8:
            return '1st Set';
            break;
        case 9:
            return '2nd Set';
            break;
        case 10:
            return '3rd Set';
            break;
        case 11:
            return '4th Set';
            break;
        case 15:
            return '1st Quarter';
            break;
        case 16:
            return '2nd Quarter';
            break;
        case 17:
            return '3rd Quarter';
            break;
        case 18:
            return '4th Quarter';
        case 26:
            return 'Overtime';
        case 30:
            return '2nd Period Overtime';
            break;
        case 35:
            return 'Ended';
            break;
        case 89:
            return 'After Sudden Death';
            break;
        case 90:
            return 'In Progress';
            break;
        case 104:
            return 'Lunch Break';
        case 107:
            return 'Injury Break';
            break;
        case 118:
            return '1st Game';
            break;
        case 119:
            return '2nd Game';
            break;
        case 120:
            return '3rd Game';
            break;
        default:
            break;
    }
    if(status === 3){
        return '1st Half';
    }else if(status === 4){
        return '2nd Half';
    }else{
        return 'Not Set';
    }
}

export const widgetTabs = [
    // {value: 'season.liveTable', label: 'League Table'},
    {value: 'matchhead2head', label: 'Head to Head'},
    {value: 'livetable', label: 'League Table'},
    // {value: 'headToHead.standalone', label: 'Head to Head'},
]
