import React, {useState, useEffect} from 'react';
import "./table.css"
import axios from "axios"


const EmployeeScheduleTable = () => {
  const [scheduleData, setScheduleData] = useState([])
  const [selectedShift, setSelectedShift] = useState(null);
  const [startDate, setStartDate] = useState('2023-05-01')
  const [endDate, setEndDate] = useState('2023-05-06')

  useEffect(() => {
    axios.get("./list.json").then(response => {
      setScheduleData(response.data)
    })
  }, [])

  let date1 = new Date(startDate)
  let date2 = new Date(endDate)

  // Вычисление разницы в миллисекундах
  let difference = date2 - date1

  // Перевод разницы в дни
  let daysDifference = Math.floor(difference / (1000 * 60 * 60 * 24)) + 1;

  const handleShiftClick = (shift) => {
    setSelectedShift(shift);
  }

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value)
  }
    
  const handleEndDateChange = (event) => {
    setEndDate(event.target.value)
  }

  const renderScheduleRows = () => {
    return scheduleData.map((item, index) => {
      return item.Расписание.map((scheduleItem, scheduleIndex) => {
        if (
          scheduleItem.Дата < startDate ||
          scheduleItem.Дата > endDate
          ) {
            return null
          }

        return (
          <tr
            key={`${index}-${scheduleIndex}`}
            onClick={() => handleShiftClick(scheduleItem)}
            className={selectedShift === scheduleItem ? 'selected-shift' : ''}
          >
            {scheduleIndex === 0 && (
              <>
                <td rowSpan={daysDifference}>{item.Сотрудник}</td>
                <td rowSpan={daysDifference}>{item.Магазин}</td>
                <td rowSpan={daysDifference}>{item.Должность}</td>
              </>
            )}
            <td>{scheduleItem.Дата}</td>
            <td>
              <div className={scheduleItem.ПланРаботы === "выходной" ? "time-bar weekend" : "time-bar plan"}>
                <span>{scheduleItem.ПланРаботы}</span>
              </div>
            </td>
            <td>
              <div className={scheduleItem.ФактРаботы === "прогул" ? "time-bar absenteeism" : "time-bar actual"}>
                <span>{scheduleItem.ФактРаботы}</span>
              </div>
            </td>
            <td>{scheduleItem.Прогулы}</td>
            <td>{scheduleItem.Опоздания}</td>
            <td>{scheduleItem.РанниеУходы}</td>
          </tr>
        )
      })
    })
  }

    return (
      <div className="main">
          <h1>Таблица расписания работы сотрудников</h1>
          <div className="filter-container">
            <label htmlFor="startDate">Начальная дата:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={handleStartDateChange}
            />
            <label htmlFor="endDate">Конечная дата:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={handleEndDateChange}
            />
          </div>
          <table className="employee-schedule-table">
            <thead>
            <tr>
              <th>Сотрудник</th>
              <th>Магазин</th>
              <th>Должность</th>
              <th>Дата</th>
              <th>План работы</th>
              <th>Фактическое время работы</th>
              <th>Прогулы</th>
              <th>Опоздания</th>
              <th>Ранние уходы</th>
            </tr>
            </thead>
            <tbody>{renderScheduleRows()}</tbody>
          </table>
          {selectedShift && (
            <div className="selected-shift-details">
              <h2>Плановая длительность смены</h2>
              <p>{selectedShift.ПланРаботы}</p>
            </div>
          )}
      </div>
    )
}


export default EmployeeScheduleTable;
