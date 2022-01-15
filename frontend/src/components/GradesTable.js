import React from "react";
import { Table } from "react-bootstrap";
import "../css/gradesTable.css";

const GradesTable = (props) => {
  if (props.item === {} || props.item === null) {
    return <></>;
  } else {
    const type = props.type;
    var data = type === "lab" ? props.item.labs : props.item.exercises;
    //   const exercises = props.item.exercises;
    //   console.log("1", labs);
    //   console.log("2", exercises);

    const compare = (a, b) => {
      if (type === "lab") {
        if (a.labNumber < b.labNumber) return -1;
        if (a.labNumber > b.labNumber) return 1;
        return 0;
      } else {
        if (a.exerciseNumber < b.exerciseNumber) return -1;
        if (a.exerciseNumber > b.exerciseNumber) return 1;
        return 0;
      }
    };

    let sortedData = data.sort(compare);
    data = sortedData;
    // console.log(sortedData);
    return data ? (
      <div className="table">
        <Table bordered hover responsive size="sm">
          <thead className="t-head">
            <tr className="t-row">
              <th>{type} No.</th>
              <th>{type} Grade</th>
            </tr>
          </thead>
          <tbody className="t-body">
            {data.map((rowData, i) => (
              <tr key={i}>
                <td className="t-data">
                  {type === "lab" ? rowData.labNumber : rowData.exerciseNumber}
                </td>
                <td className="t-data">
                  {type === "lab" ? rowData.labGrade : rowData.exerciseGrade}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    ) : (
      ""
    );
  }
};

export default GradesTable;
