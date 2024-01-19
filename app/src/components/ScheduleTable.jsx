import React from 'react';
import styled from 'styled-components';

const StyledTable = styled.table`
    font-size: 10px;
`;

const HeaderCell = styled.th`
    border-radius: 10%;
    background-color: lightgray !important;
`;

const TimeSlotCell = styled.td`
    width: 5%;
    border-radius: 10%;
    background-color: lightgrey !important;
`;

class ScheduleTable extends React.Component {
    setting = {
        columns: 8, // Total columns
        weekday: [
            '一', '二', '三', '四', '五', '六', '日'
        ],
        timeSlots: [
            {key: 'A', value: '7:00\n~\n7:50'},
            {key: '1', value: '8:10\n~\n9:00'},
            {key: '2', value: '9:10\n~\n10:00'},
            {key: '3', value: '10:10\n~\n11:00'},
            {key: '4', value: '11:10\n~\n12:00'},
            {key: 'B', value: '12:10\n~\n13:00'},
            {key: '5', value: '13:10\n~\n14:00'},
            {key: '6', value: '14:10\n~\n15:00'},
            {key: '7', value: '15:10\n~\n16:00'},
            {key: '8', value: '16:10\n~\n17:00'},
            {key: '9', value: '17:10\n~\n18:00'},
            {key: 'C', value: '18:20\n~\n19:10'},
            {key: 'D', value: '19:15\n~\n20:05'},
            {key: 'E', value: '20:10\n~\n21:00'},
            {key: 'F', value: '21:05\n~\n21:55'}
        ]
    }

    render() {
        return (
            <div className="table-responsive"> {/* Bootstrap 的響應式表格容器 */}
                <StyledTable
                    className="table table-bordered border-white border-5 rounded-5 table-secondary text-center">
                    <thead>
                    <tr>
                        <HeaderCell>期</HeaderCell>
                        {this.setting.weekday.map((d, index) => (
                            <HeaderCell key={index}>{d}</HeaderCell>
                        ))}
                    </tr>
                    </thead>
                    <tbody>
                    {this.setting.timeSlots.map((timeSlot, index) => (
                        <tr key={index}>
                            <TimeSlotCell>
                                <span className="fw-bold d-block">{timeSlot.key}</span>
                                <span>{timeSlot.value}</span>
                            </TimeSlotCell>
                            {Array.from({length: this.setting.columns - 1}, (_, n) => (
                                <td key={n} id={`${timeSlot.key}${n}`} className="rounded"></td>
                            ))}
                        </tr>
                    ))}
                    </tbody>
                </StyledTable>
            </div>
        );
    }
}

export default ScheduleTable;
