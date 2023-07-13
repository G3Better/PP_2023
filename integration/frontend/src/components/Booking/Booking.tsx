import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import {
  getPlaces,
  addBooking,
  deleteBooking,
  editBooking,
  getBooking,
} from "../../controllers/BookingController";
import { dateConverter, dateForModal } from "../../utills/dateUtills";
import Header from "../Header/Header";
import styles from "./Booking.module.sass";
import {checkIsArrayDataFromModal, uniqArrayForModal} from "../../utills/dataUtil";
import {getEmployees} from "../../controllers/EmployeeController";

const columns: GridColDef[] = [
  { field: "Incoming_DateTime", headerName: "Дата и время бронирования", type: "dateTime" },
  { field: "FIO", headerName: "ФИО"},
  { field: "FIOSelect", headerName: "ФИО", type: "select" },
  { field: "Rental_Time", headerName: "Время бронирования (ч)", type: "number" },
  { field: "game_place", headerName: "Игровое место" },
  { field: "game_placeSelect", headerName: "Игровое место", type: "select" }
];

const Booking: React.FC = () => {
  const [places, setGamePlaces] = React.useState<any>([]);
  const [FIO_select, setFIO] = React.useState<any>([]);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);

  const fetchPlaces = React.useCallback(async () => {
    const places = await getPlaces();
    if (places.length) {
      setGamePlaces(places);
    } else {
      setGamePlaces([]);
    }
  }, []);

  const fetchFIO = React.useCallback(async () => {
    const FIO_select = await getEmployees();
    if (FIO_select.length) {
      const res = FIO_select.map((el:any)=>({id:el.id, name:el.fio}))
      setFIO(res);
    } else {
      setFIO([]);
    }
  }, []);

  const fetchData = React.useCallback(async () => {
    const dataTable = await getBooking();
    fetchPlaces();
    fetchFIO();
    if (dataTable.length) {
      const res = dataTable.map((el:any)=>({...el,Incoming_DateTime:dateForModal(el.Incoming_DateTime,"dateTime")}))
      setData(res);
    } else {
      setData([]);
    }
  }, []);

  const handleOpen = React.useCallback((id?: string) => {
    setOpen((openModal) => !openModal);
    setId(id);
  }, []);

  const handleSetCurrentData = React.useCallback((currentData: any) => {
    let newObj = uniqArrayForModal(places, currentData, "game_place");
    newObj = uniqArrayForModal(FIO_select, currentData, "FIO");
    setEditData(newObj);
  }, [places, FIO_select]);

  const handleAdd = React.useCallback(async(data: any) => {
    console.log("data = ", data);
    const dataTable=await addBooking(
        data.Incoming_DateTime,
        checkIsArrayDataFromModal(data.FIOSelect),
        data.Rental_Time,
        checkIsArrayDataFromModal(data.game_placeSelect),
    );
    setData(dataTable);
  }, []);

  const handleEdit = React.useCallback(
      (data: any) => {
        editBooking(
            data.id,
            data.Incoming_DateTime,
            checkIsArrayDataFromModal(data.FIOSelect),
            data.Rental_Time,
            checkIsArrayDataFromModal(data.game_placeSelect),
        );
        console.log(data);
        fetchData();
        setOpen(false);
      },
      [fetchData]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteBooking(id);
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
        <h2 className={styles.booking_title}>Booking</h2>
        <TableData
            columns={columns}
            openModal={open}
            data={editData || {
              game_placeSelect: places,
              FIOSelect: FIO_select,
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
                    <TableCell align="left">{dateConverter(row.Incoming_DateTime, "dateTime")}</TableCell>
                    <TableCell align="left">{row.FIO}</TableCell>
                    <TableCell align="left">{row.Rental_Time}</TableCell>
                    <TableCell align="left">{row.game_place}</TableCell>
                  </TableRow>
              ))}
        </TableData>
      </>
  );
};
export default Booking;
