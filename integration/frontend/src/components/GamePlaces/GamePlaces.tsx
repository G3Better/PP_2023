import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import {
  addGamePlaces,
  deleteGamePlaces,
  editGamePlaces,
  getGamePlaces,
} from "../../controllers/GamePlacesController";
import { dateConverter } from "../../utills/dateUtills";
import Header from "../Header/Header";
import styles from "./GamePlaces.module.sass";
import {getComputer, getStatus, getCategory} from "../../controllers/GamePlacesController";
import {checkIsArrayDataFromModal, uniqArrayForModal} from "../../utills/dataUtil";

const columns: GridColDef[] = [
  { field: "name", headerName: "Название", type: "string" },
  { field: "cost", headerName: "Цена", type: "number" },
  { field: "computer", headerName: "Компьютер"},
  { field: "computerSelect", headerName: "Компьютер", type: "select"},
  { field: "status", headerName: "Статус"},
  { field: "statusSelect", headerName: "Статус", type: "select"},
  { field: "category", headerName: "Категория" },
  { field: "categorySelect", headerName: "Категория", type: "select" }
];

const GamePlaces: React.FC = () => {
  const [computer_select, setComputer] = React.useState<any>([]);
  const [status_select, setStatus] = React.useState<any>([]);
  const [category_select, setCategory] = React.useState<any>([]);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);
  const fetchData = React.useCallback(async () => {
    fetchComputer();
    fetchStatus();
    fetchCategory();
    const dataTable = await getGamePlaces();
    if (dataTable.length) {
      setData(dataTable);
    } else {
      setData([]);
    }
  }, []);

  const fetchComputer = React.useCallback(async () => {
    const computer_select = await getComputer();
    if (computer_select.length) {
      setComputer(computer_select);
    } else {
      setComputer([]);
    }
  }, []);

  const fetchStatus = React.useCallback(async () => {
    const status_select = await getStatus();
    if (status_select.length) {
      setStatus(status_select);
    } else {
      setStatus([]);
    }
  }, []);

  const fetchCategory = React.useCallback(async () => {
    const category_select = await getCategory();
    if (category_select.length) {
      setCategory(category_select);
    } else {
      setCategory([]);
    }
  }, []);

  const handleOpen = React.useCallback((id?: string) => {
    setOpen((openModal) => !openModal);
    setId(id);
  }, []);

  const handleSetCurrentData = React.useCallback((currentData: any) => {
    let newObj = uniqArrayForModal(computer_select, currentData, "computer");
    newObj = uniqArrayForModal(status_select, currentData, "status");
    newObj = uniqArrayForModal(category_select, currentData, "category");
    setEditData(newObj);
    setEditData(currentData);
  }, [computer_select, status_select,  ]);

  const handleAdd = React.useCallback((data: any) => {
    addGamePlaces(
        data.name,
        data.cost,
        checkIsArrayDataFromModal(data.computerSelect),
        checkIsArrayDataFromModal(data.statusSelect),
        checkIsArrayDataFromModal(data.categorySelect),
    );
  }, []);

  const handleEdit = React.useCallback(
      (data: any) => {
        editGamePlaces(
            data.id,
            data.name,
            data.cost,
            checkIsArrayDataFromModal(data.computerSelect),
            checkIsArrayDataFromModal(data.statusSelect),
            checkIsArrayDataFromModal(data.categorySelect),
        );
        fetchData();
        setOpen(false);
      },
      [fetchData]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteGamePlaces(id);
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
        <h2 className={styles.booking_title}>Game Places</h2>
        <TableData
            columns={columns}
            openModal={open}
            data={editData || {
              computerSelect: computer_select,
              statusSelect: status_select,
              categorySelect: category_select,
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
                    <TableCell align="left">{row.cost}</TableCell>
                    <TableCell align="left">{row.computer}</TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                    <TableCell align="left">{row.category}</TableCell>
                  </TableRow>
              ))}
        </TableData>
      </>
  );
};
export default GamePlaces;
