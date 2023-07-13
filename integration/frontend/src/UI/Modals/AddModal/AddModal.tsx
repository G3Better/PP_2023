import {
    Button,
    FormControl,
    InputLabel,
    MenuItem,
    OutlinedInput,
    Select,
} from "@mui/material";
import { GridColDef } from "@mui/x-data-grid";
import {
    DatePicker,
    DateTimePicker,
    LocalizationProvider,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React from "react";
import styles from "./AddModal.module.sass";

interface IAddModal {
    handleAdd?: (data: any) => void;
    onClose: () => void;
    isShow: boolean;
    fields: GridColDef[];
    data: any;
}

const AddModal: React.FC<IAddModal> = ({
                                           handleAdd,
                                           onClose,
                                           isShow,
                                           fields,
                                           data,
                                       }) => {
    const [anyData, setAnyData] = React.useState<any>({});
    const checkDisabled = React.useCallback(() => {
        const lengthFields = fields.reduce((acc: number, el: any) => {
            if (el["type"]) acc++;
            return acc;
        }, 0);
    }, [anyData, fields]);

    const setAnyDataFromModal = React.useCallback(
        (value: string, field: string) => {
            if (field.includes("Select")) {
                const id = data[field].find(
                    (el: { id: number; name: string }) => el.name === value
                ).id;
                setAnyData((prev: { [key: string]: string | object }) => ({
                    ...prev,
                    [field]: { id: id, name: value },
                }));
                checkDisabled();
                return;
            }
            setAnyData((prev: { [key: string]: string | object }) => ({
                ...prev,
                [field]: value,
            }));
            checkDisabled();
        },
        [checkDisabled, data]
    );

    const handleSave = React.useCallback(() => {
        if (typeof handleAdd === "function") {
            handleAdd(anyData);
            setAnyData(null);
            onClose();
        }
    }, [anyData, handleAdd, onClose]);

    const handleClose = React.useCallback(() => {
        setAnyData({});
        onClose();
    }, [onClose]);
    if (!isShow) return null;
    return (
        <>
            <div className={styles.body_bg}></div>
            <div className={styles.add_modal}>
                {fields.map((el) => (
                    <div key={el.field} className={styles["add_modal-block"]}>
                        <>
                            {el.type === "string" && (
                                <FormControl
                                    sx={{ m: 1, width: "50ch" }}
                                    variant="outlined"
                                    className={styles["add_modal-block-string"]}>
                                    <InputLabel htmlFor="outlined-adornment-string">
                                        {el.headerName}
                                    </InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-string"
                                        type="text"
                                        label={el.headerName}
                                        autoComplete="off"
                                        value={anyData?.[el.field] || ""}
                                        onChange={(event) =>
                                            setAnyDataFromModal(event.target.value, el.field)
                                        }
                                    />
                                </FormControl>
                            )}
                            {el.type === "number" && (
                                <FormControl
                                    sx={{ m: 1, width: "50ch" }}
                                    variant="outlined"
                                    className={styles["add_modal-block-number"]}>
                                    <InputLabel htmlFor="outlined-adornment-number">
                                        {el.headerName}
                                    </InputLabel>
                                    <OutlinedInput
                                        id="outlined-adornment-number"
                                        type="number"
                                        label={el.headerName}
                                        autoComplete="off"
                                        value={anyData?.[el.field] || ""}
                                        onChange={(event) =>
                                            setAnyDataFromModal(event.target.value, el.field)
                                        }
                                    />
                                </FormControl>
                            )}
                            {el.type === "dateTime" && (
                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DateTimePicker
                                        label={el.headerName}
                                        value={dayjs(anyData?.[el.field]) || ""}
                                        onChange={(event:any) => {
                                            setAnyDataFromModal(event.$d, el.field);
                                        }}
                                    />
                                </LocalizationProvider>
                            )}
                            {el.type === "date" && (
                                <LocalizationProvider dateAdapter={AdapterDateFns}>
                                    <DatePicker
                                        label={el.headerName}
                                        value={anyData?.[el.field] || ""}
                                        onChange={(value) => {
                                            setAnyDataFromModal(value, el.field);
                                        }}
                                    />
                                </LocalizationProvider>
                            )}
                            {el.type === "select" && Array.isArray(data[el.field]) && (
                                <FormControl
                                    variant="standard"
                                    sx={{ m: 1, minWidth: 120 }}
                                    className={styles["add_modal-block-select"]}>
                                    <InputLabel id="demo-simple-select-standard-label">
                                        {el.headerName}
                                    </InputLabel>
                                    <Select
                                        labelId="demo-simple-select-standard-label"
                                        id="demo-simple-select-standard"
                                        value={anyData?.[el.field]?.name || ""}
                                        onChange={(event) => {
                                            setAnyDataFromModal(event.target.value, el.field);
                                        }}
                                        label={el.headerName}>
                                        {data?.[el.field]?.map(
                                            (item: { id: number; name: string }, index: number) => (
                                                <MenuItem value={item.name} key={`${item.id}${index}`}>
                                                    {item.name}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                </FormControl>
                            )}
                        </>
                    </div>
                ))}
                <div className={styles["add_modal-btn"]}>
                    <Button
                        variant="contained"
                        size="medium"
                        sx={{ width: "25ch" }}
                        color="success"
                        onClick={handleSave}>
                        Save
                    </Button>
                    <Button
                        variant="contained"
                        size="medium"
                        sx={{ width: "25ch" }}
                        onClick={handleClose}>
                        No
                    </Button>
                </div>
            </div>
        </>
    );
};

export default React.memo(AddModal);