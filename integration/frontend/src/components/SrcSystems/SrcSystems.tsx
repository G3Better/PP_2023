import { TableCell, TableRow } from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import TableData from "../../UI/Table/TableData";
import {
  addSrcSystems,
  deleteSrcSystems,
  editSrcSystems,
  getSrcSystems,
  getResponsible,
  getIps
} from "../../controllers/SrcSystemsController";
import { dateConverter } from "../../utills/dateUtills";
import Header from "../Header/Header";
import styles from "./SrcSystems.module.sass";
import {checkIsArrayDataFromModal, uniqArrayForModal} from "../../utills/dataUtil";

const columns: GridColDef[] = [
  { field: "name", headerName: "Название", type: "string" },
  { field: "responsible", headerName: "Отвественный" },
  { field: "responsibleSelect", headerName: "Responsible", type: "select" },
  { field: "test", headerName: "Тестовый хост" },
  { field: "test_ip", headerName: "Тестовый ip" },
  { field: "test_ipSelect", headerName: "Test_ip", type: "select" },
  { field: "cert", headerName: "Серт хост" },
  { field: "cert_ip", headerName: "Сертовый ip" },
  { field: "cert_ipSelect", headerName: "Cert_ip", type: "select" },
  { field: "prod", headerName: "Продовый хост" },
  { field: "prod_ip", headerName: "Продуктивный ip" },
  { field: "prod_ipSelect", headerName: "Prod_ip", type: "select" }
];

const SrcSystems: React.FC = () => {
  const [responsibleSelect, setResponsible] = React.useState<any>([]);
  const [test_ipSelect, setTest_ip] = React.useState<any>([]);
  const [cert_ipSelect, setCert_ip] = React.useState<any>([]);
  const [prod_ipSelect, setProd_ip] = React.useState<any>([]);
  const [data, setData] = React.useState([]);
  const [open, setOpen] = React.useState(false);
  const [id, setId] = React.useState<string | undefined>(undefined);
  const [editData, setEditData] = React.useState<any>(null);
  const fetchData = React.useCallback(async () => {
    fetchResponsible();
    fetchTest_ip();
    fetchCert_ip();
    fetchProd_ip();
    const dataTable = await getSrcSystems();
    if (dataTable.length) {
      setData(dataTable);
    } else {
      setData([]);
    }
  }, []);

  const fetchResponsible = React.useCallback(async () => {
    const responsibleSelect = await getResponsible();
    if (responsibleSelect.length) {
      setResponsible(responsibleSelect);
    } else {
      setResponsible([]);
    }
  }, []);

  const fetchTest_ip = React.useCallback(async () => {
    const test_ipSelect = await getIps();
    if (test_ipSelect.length) {
      setTest_ip(test_ipSelect);
    } else {
      setTest_ip([]);
    }
  }, []);

  const fetchCert_ip = React.useCallback(async () => {
    const cert_ipSelect = await getIps();
    if (cert_ipSelect.length) {
      setCert_ip(cert_ipSelect);
    } else {
      setCert_ip([]);
    }
  }, []);

  const fetchProd_ip = React.useCallback(async () => {
    const prod_ipSelect = await getIps();
    if (prod_ipSelect.length) {
      setProd_ip(prod_ipSelect);
    } else {
      setProd_ip([]);
    }
  }, []);

  const handleOpen = React.useCallback((id?: string) => {
    setOpen((openModal) => !openModal);
    setId(id);
  }, []);

  const handleSetCurrentData = React.useCallback((currentData: any) => {
    let newObj = uniqArrayForModal(responsibleSelect, currentData, "responsible");
    newObj = uniqArrayForModal(test_ipSelect, currentData, "test_ip");
    newObj = uniqArrayForModal(cert_ipSelect, currentData, "cert_ip");
    newObj = uniqArrayForModal(prod_ipSelect, currentData, "prod_ip");
    console.log("New fucking obj");
    console.log(newObj);
    setEditData(newObj);
    setEditData(currentData);
  }, [responsibleSelect, test_ipSelect, cert_ipSelect, prod_ipSelect]);

  const handleAdd = React.useCallback((data: any) => {
    addSrcSystems(
        data.name,
        checkIsArrayDataFromModal(data.responsibleSelect),
        data.test,
        checkIsArrayDataFromModal(data.test_ipSelect),
        data.cert,
        checkIsArrayDataFromModal(data.cert_ipSelect),
        data.prod,
        checkIsArrayDataFromModal(data.prod_ipSelect),
    );
    fetchData();
  }, [fetchData, responsibleSelect, test_ipSelect, cert_ipSelect, prod_ipSelect]);

  const handleEdit = React.useCallback(
      (data: any) => {
        editSrcSystems(
            data.id,
            data.name,
            checkIsArrayDataFromModal(data.responsibleSelect),
            data.test,
            checkIsArrayDataFromModal(data.test_ipSelect),
            data.cert,
            checkIsArrayDataFromModal(data.cert_ipSelect),
            data.prod,
            checkIsArrayDataFromModal(data.prod_ipSelect),
        );
        fetchData();
        setOpen(false);
      },
      [fetchData, responsibleSelect, test_ipSelect, cert_ipSelect, prod_ipSelect]
  );

  const handleDelete = React.useCallback(async () => {
    if (id) {
      const data = await deleteSrcSystems(id);
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
        <h2 className={styles.systems_title}>Source Systems</h2>
        <TableData
            columns={columns}
            openModal={open}
            data={editData || {
              responsibleSelect: responsibleSelect,
              test_ipSelect: test_ipSelect,
              cert_ipSelect: cert_ipSelect,
              prod_ipSelect: prod_ipSelect,
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
                    <TableCell align="left">{row.test}</TableCell>
                    <TableCell align="left">{row.test_ip}</TableCell>
                    <TableCell align="left">{row.cert}</TableCell>
                    <TableCell align="left">{row.cert_ip}</TableCell>
                    <TableCell align="left">{row.prod}</TableCell>
                    <TableCell align="left">{row.prod_ip}</TableCell>
                  </TableRow>
              ))}
        </TableData>
      </>
  );
};
export default SrcSystems;
