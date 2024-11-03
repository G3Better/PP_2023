import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import {
  addIps,
  deleteIps,
  editIps,
  getIps
} from "../../controllers/IpsController";
import { dateConverter } from "../../utills/dateUtills";
import Header from "../Header/Header";
import styles from "./Ips.module.sass";
import {checkIsArrayDataFromModal, uniqArrayForModal} from "../../utills/dataUtil";

const columns: GridColDef[] = [
  { field: "name", headerName: "IP", type: "string" },
  { field: "desc", headerName: "Описание", type: "string" },
];

const Ips: React.FC = () => {
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);
  const fetchData = React.useCallback(async () => {
    const dataTable = await getIps();
    if (dataTable.length) {
      setData(dataTable);
    } else {
      setData([]);
    }
  }, []);

  const handleOpen = React.useCallback((id?: string) => {
    setOpen((openModal) => !openModal);
    setId(id);
  }, []);

  const handleSetCurrentData = React.useCallback((currentData: any) => {
    setEditData(currentData);
  }, []);

  const handleAdd = React.useCallback((data: any) => {
    addIps(
        data.name,
        data.desc,
    );
    fetchData();
  }, [fetchData]);

  const handleEdit = React.useCallback(
      (data: any) => {
        editIps(
            data.id,
            data.name,
            data.desc,
        );
        setOpen(false);
      },
      [fetchData]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteIps(id);
      await fetchData();
      if (data) setOpen(false);
    }
  }, [fetchData, id]);

  React.useEffect(() => {
    fetchData();
  }, [fetchData, open]);
  return (
      <>
        <Header />
        <h2 className={styles.systems_title}>Ips</h2>
        <TableData
            columns={columns}
            openModal={open}
            data={editData}
            handleEdit={handleEdit}
            handleAdd={handleAdd}
            handleClose={handleOpen}
            handleDelete={handleDelete}>
          {data.length &&
              data.map((row: any, index: number) => (
                  <TableRow
                      key={`${row.id}${index}`}
                      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                      className={styles.table_cell}
                      onClick={() => {
                        handleOpen(row.id);
                        handleSetCurrentData(row);
                      }}>
                    <TableCell align="left">{row.name}</TableCell>
                    <TableCell align="left">{row.desc}</TableCell>
                  </TableRow>
              ))}
        </TableData>
      </>
  );
};
export default Ips;
