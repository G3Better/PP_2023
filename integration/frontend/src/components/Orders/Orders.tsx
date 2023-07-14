import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import {
  getOrders,
  getSourceSystems,
  getDistSystems,
  getAuthorizations,
  getRequestsRates,
  getStatuses,
  getCustomers,
  deleteOrders,
  editOrders,
  addOrders
} from "../../controllers/OrdersController";
import { dateConverter, dateForModal } from "../../utills/dateUtills";
import Header from "../Header/Header";
import styles from "./Orders.module.sass";
import {checkIsArrayDataFromModal, uniqArrayForModal} from "../../utills/dataUtil";


const columns: GridColDef[] = [
  { field: "source_systems", headerName: "Система-источник" },
  { field: "source_systemsSelect", headerName: "Система-источник", type: "select" },
  { field: "dist_systems", headerName: "Система-получатель" },
  { field: "dist_systemsSelect", headerName: "Система-получатель", type: "select" },
  { field: "authorizations", headerName: "Авторизация" },
  { field: "authorizationsSelect", headerName: "Авторизация", type: "select" },
  { field: "requests_rates", headerName: "Частота запросов" },
  { field: "requests_ratesSelect", headerName: "Частота запросов", type: "select" },
  { field: "statuses", headerName: "Статус" },
  { field: "statusesSelect", headerName: "Статус", type: "select" },
  { field: "customers", headerName: "Заказчик" },
  { field: "customresSelect", headerName: "Заказчик", type: "select" },
  { field: "description", headerName: "Описание", type: "string" },
];

const Orders: React.FC = () => {
  const [source, setSource] = React.useState<any>([]);
  const [auth, setAuth] = React.useState<any>([]);
  const [destination, setDest] = React.useState<any>([]);
  const [req_rate, setReqRate] = React.useState<any>([]);
  const [status, setStatus] = React.useState<any>([]);
  const [customer, setCustomer] = React.useState<any>([]);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);

  const fetchDest = React.useCallback(async () => {
    const destination = await getDistSystems();
    console.log("destination = ", destination);
    if (destination.length) {
      setDest(destination);
    } else {
      setDest([]);
    }
  }, []);

  const fetchSources = React.useCallback(async () => {
    const source = await getSourceSystems();
    if (source.length) {
      setSource(source);
    } else {
      setSource([]);
    }
  }, []);

  const fetchAuth = React.useCallback(async () => {
    const auth = await getAuthorizations();
    if (auth.length) {
      setAuth(auth);
    } else {
      setAuth([]);
    }
  }, []);

  const fetchReqRate = React.useCallback(async () => {
    const req_rate = await getRequestsRates();
    if (req_rate.length) {
      setReqRate(req_rate);
    } else {
      setReqRate([]);
    }
  }, []);

  const fetchStatus = React.useCallback(async () => {
    const status = await getStatuses();
    if (status.length) {
      setStatus(status);
    } else {
      setStatus([]);
    }
  }, []);

  const fetchCustomers = React.useCallback(async () => {
    const customer = await getCustomers();
    if (customer.length) {
      setCustomer(customer);
    } else {
      setCustomer([]);
    }
  }, []);

  const fetchData = React.useCallback(async () => {
    const dataTable = await getOrders();
    fetchSources();
    fetchDest();
    fetchAuth();
    fetchReqRate();
    fetchStatus();
    fetchCustomers();
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
    let newObj = uniqArrayForModal(source, currentData, "source_systems");
    console.log("newObj dist before = ", newObj);
    newObj = uniqArrayForModal(destination, currentData, "dist_systems");
    console.log("newObj dist after = ", newObj);
    newObj = uniqArrayForModal(auth, currentData, "authorizations");
    newObj = uniqArrayForModal(req_rate, currentData, "requests_rates");
    newObj = uniqArrayForModal(status, currentData, "statuses");
    newObj = uniqArrayForModal(customer, currentData, "customers");
    setEditData(newObj);
  }, []);

  const handleAdd = async(data: any) => {
    console.log("data qweqwsadasds = ", data);
    const dataTable=await addOrders(
        checkIsArrayDataFromModal(data.source_systemsSelect),
        checkIsArrayDataFromModal(data.dest_systemsSelect),
        checkIsArrayDataFromModal(data.authorizationsSelect),
        checkIsArrayDataFromModal(data.requests_ratesSelect),
        checkIsArrayDataFromModal(data.statusesSelect),
        checkIsArrayDataFromModal(data.customresSelect),
        data.description,
    );
    setData(dataTable);
  }

  const handleEdit =
      (data: any) => {
      console.log("edit-data = ", data);
      editOrders(
            data.id,
            checkIsArrayDataFromModal(data.source_systemsSelect),
            checkIsArrayDataFromModal(data.dest_systemsSelect),
            checkIsArrayDataFromModal(data.authorizationsSelect),
            checkIsArrayDataFromModal(data.requests_ratesSelect),
            checkIsArrayDataFromModal(data.statusesSelect),
            checkIsArrayDataFromModal(data.customresSelect),
            data.description,
        );
        fetchData();
        setOpen(false);
      }

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
        <h2 className={styles.orders_title}>Orders</h2>
        <TableData
            columns={columns}
            openModal={open}
            data={editData || {
              source_systemsSelect: source,
              //dist_systemsSelect: destination,
              authorizationsSelect: auth,
              requests_ratesSelect: req_rate,
              statusesSelect: status,
              customresSelect: customer
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
                    <TableCell align="left">{row.source_systems}</TableCell>
                    <TableCell align="left">{row.dist_systems}</TableCell>
                    <TableCell align="left">{row.customers}</TableCell>
                    <TableCell align="left">{row.authorizations}</TableCell>
                    <TableCell align="left">{row.requests_rates}</TableCell>
                    <TableCell align="left">{row.statuses}</TableCell>
                    <TableCell align="left">{row.description}</TableCell>
                  </TableRow>
              ))}
        </TableData>
      </>
  );
};
export default Orders;
