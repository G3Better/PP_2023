import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import {
  addOrders,
  deleteOrders,
  editOrders,
  getOrders,
  getSrcSystem,
  getDstSystem,
  getCustomer,
  getRequestRate,
  getStatus,
  getAuthorization
} from "../../controllers/OrdersController";
import { dateConverter } from "../../utills/dateUtills";
import Header from "../Header/Header";
import styles from "./Orders.module.sass";
import {checkIsArrayDataFromModal, uniqArrayForModal} from "../../utills/dataUtil";

const columns: GridColDef[] = [
  { field: "id", headerName: "Номер заявки", type: "number" },
  { field: "source", headerName: "Система-источник" },
  { field: "sourceSelect", headerName: "Source", type: "select" },
  { field: "dest", headerName: "Система-получатель" },
  { field: "destSelect", headerName: "Dest", type: "select" },
  { field: "request_rate", headerName: "Частота запросов" },
  { field: "request_rateSelect", headerName: "Request_rate", type: "select" },
  { field: "status", headerName: "Статус заявки" },
  { field: "statusSelect", headerName: "Status", type: "select" },
  { field: "authorization", headerName: "Тип авторизации" },
  { field: "authorizationSelect", headerName: "Authorization", type: "select" },
  { field: "customer", headerName: "Заказчик" },
  { field: "customerSelect", headerName: "Сustomer", type: "select" },
  { field: "description", headerName: "Описание", type: "string" },
  { field: "swagger", headerName: "Сваггер или WSDL", type: "string" }
];

const Orders: React.FC = () => {
  const [sourceSelect, setSource] = React.useState<any>([]);
  const [destSelect, setDest] = React.useState<any>([]);
  const [request_rateSelect, setRequest_rate] = React.useState<any>([]);
  const [statusSelect, setStatus] = React.useState<any>([]);
  const [authorizationSelect, setAuthorization] = React.useState<any>([]);
  const [customerSelect, setСustomer] = React.useState<any>([]);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);
  const fetchData = React.useCallback(async () => {
    fetchSource();
    fetchDst();
    fetchRequest_rate();
    fetchStatus();
    fetchAuthorization();
    fetchСustomer();
    const dataTable = await getOrders();
    if (dataTable.length) {
      setData(dataTable);
    } else {
      setData([]);
    }
  }, []);

  const fetchSource = React.useCallback(async () => {
    const sourceSelect = await getSrcSystem();
    if (sourceSelect.length) {
      setSource(sourceSelect);
    } else {
      setSource([]);
    }
  }, []);

  const fetchDst = React.useCallback(async () => {
    const destSelect = await getDstSystem();
    if (destSelect.length) {
      setDest(destSelect);
    } else {
      setDest([]);
    }
  }, []);

  const fetchRequest_rate = React.useCallback(async () => {
    const request_rateSelect = await getRequestRate();
    if (request_rateSelect.length) {
      setRequest_rate(request_rateSelect);
    } else {
      setRequest_rate([]);
    }
  }, []);

  const fetchStatus = React.useCallback(async () => {
    const statusSelect = await getStatus();
    if (statusSelect.length) {
      setStatus(statusSelect);
    } else {
      setStatus([]);
    }
  }, []);

  const fetchAuthorization = React.useCallback(async () => {
    const authorizationSelect = await getAuthorization();
    if (authorizationSelect.length) {
      setAuthorization(authorizationSelect);
    } else {
      setAuthorization([]);
    }
  }, []);

  const fetchСustomer = React.useCallback(async () => {
    const customerSelect = await getCustomer();
    if (customerSelect.length) {
      setСustomer(customerSelect);
    } else {
      setСustomer([]);
    }
  }, []);

  const handleOpen = React.useCallback((id?: string) => {
    setOpen((openModal) => !openModal);
    setId(id);
  }, []);

  const handleSetCurrentData = React.useCallback((currentData: any) => {
    let newObj = uniqArrayForModal(sourceSelect, currentData, "source");
    newObj = uniqArrayForModal(destSelect, currentData, "dest");
    newObj = uniqArrayForModal(request_rateSelect, currentData, "request_rate");
    newObj = uniqArrayForModal(statusSelect, currentData, "status");
    newObj = uniqArrayForModal(authorizationSelect, currentData, "authorization");
    newObj = uniqArrayForModal(customerSelect, currentData, "customer");
    setEditData(newObj);
    setEditData(currentData);
  }, [sourceSelect, destSelect, request_rateSelect, statusSelect, authorizationSelect, customerSelect]);

  const handleAdd = React.useCallback((data: any) => {
    addOrders(
        checkIsArrayDataFromModal(data.sourceSelect),
        checkIsArrayDataFromModal(data.destSelect),
        checkIsArrayDataFromModal(data.request_rateSelect),
        checkIsArrayDataFromModal(data.statusSelect),
        checkIsArrayDataFromModal(data.authorizationSelect),
        checkIsArrayDataFromModal(data.customerSelect),
        data.description,
        data.swagger,
    );
    fetchData();
  }, [fetchData]);

  const handleEdit = React.useCallback(
      (data: any) => {
        editOrders(
            data.id,
            checkIsArrayDataFromModal(data.sourceSelect),
            checkIsArrayDataFromModal(data.destSelect),
            checkIsArrayDataFromModal(data.request_rateSelect),
            checkIsArrayDataFromModal(data.statusSelect),
            checkIsArrayDataFromModal(data.authorizationSelect),
            checkIsArrayDataFromModal(data.customerSelect),
            data.description,
            data.swagger,
        );
        fetchData();
        setOpen(false);
      },
      [fetchData]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteOrders(id);
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
        <h2 className={styles.systems_title}>Orders</h2>
        <TableData
            columns={columns}
            openModal={open}
            data={editData || {
              sourceSelect: sourceSelect,
              destSelect: destSelect,
              request_rateSelect: request_rateSelect,
              statusSelect: statusSelect,
              authorizationSelect: authorizationSelect,
              customerSelect: customerSelect,
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
                    <TableCell align="left">{row.id}</TableCell>
                    <TableCell align="left">{row.source}</TableCell>
                    <TableCell align="left">{row.dest}</TableCell>
                    <TableCell align="left">{row.request_rate}</TableCell>
                    <TableCell align="left">{row.status}</TableCell>
                    <TableCell align="left">{row.authorization}</TableCell>
                    <TableCell align="left">{row.customer}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                    <TableCell align="left">{row.swagger}</TableCell>
                  </TableRow>
              ))}
        </TableData>
      </>
  );
};
export default Orders;
