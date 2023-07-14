import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import {
  addSystems,
  deleteSystems,
  editSystems,
  getSystems,
  getResponsible
} from "../../controllers/SystemsController";
import { dateConverter } from "../../utills/dateUtills";
import Header from "../Header/Header";
import styles from "./Systems.module.sass";
import {checkIsArrayDataFromModal, uniqArrayForModal} from "../../utills/dataUtil";

const columns: GridColDef[] = [
  { field: "name", headerName: "Название", type: "string" },
  { field: "responsible", headerName: "Ответственный" },
  { field: "responsibleSelect", headerName: "Responsible", type: "select" },
  { field: "ip", headerName: "ip", type: "string" }
];

const Systems: React.FC = () => {
  const [responsible_select, setResponsible] = React.useState<any>([]);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);
  const fetchData = React.useCallback(async () => {
    fetchResponsible();
    const dataTable = await getSystems();
    if (dataTable.length) {
      setData(dataTable);
    } else {
      setData([]);
    }
  }, []);

  const fetchResponsible = React.useCallback(async () => {
    const responsible_select = await getResponsible();
    if (responsible_select.length) {
      setResponsible(responsible_select);
    } else {
      setResponsible([]);
    }
  }, []);

  const handleOpen = React.useCallback((id?: string) => {
    setOpen((openModal) => !openModal);
    setId(id);
  }, []);

  const handleSetCurrentData = React.useCallback((currentData: any) => {
    let newObj = uniqArrayForModal(responsible_select, currentData, "responsible");
    setEditData(newObj);
    setEditData(currentData);
  }, [responsible_select]);

  const handleAdd = React.useCallback((data: any) => {
    addSystems(
        data.name,
        checkIsArrayDataFromModal(data.responsibleSelect),
        data.ip,
    );
  }, []);

  const handleEdit = React.useCallback(
      (data: any) => {
        editSystems(
            data.id,
            data.name,
            checkIsArrayDataFromModal(data.responsibleSelect),
            data.ip,
        );
        fetchData();
        setOpen(false);
      },
      [fetchData]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteSystems(id);
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
        <h2 className={styles.systems_title}>Systems</h2>
        <TableData
            columns={columns}
            openModal={open}
            data={editData || {
              responsibleSelect: responsible_select,
            }}
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
                    <TableCell align="left">{row.responsible}</TableCell>
                    <TableCell align="left">{row.ip}</TableCell>
                  </TableRow>
              ))}
        </TableData>
      </>
  );
};
export default Systems;
