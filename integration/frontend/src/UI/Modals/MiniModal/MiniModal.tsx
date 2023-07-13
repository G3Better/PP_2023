import Button from "@mui/material/Button";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import DeleteModal from "../DeleteModal/DeleteModal";
import EditModal from "../EditModal/EditModal";
import styles from "./MiniModal.module.sass";

interface IMiniModal {
  open?: boolean;
  handleClose: () => void;
  handleEdit: (data: any) => void;
  handleDelete: () => void;
  data: any;
  fields: GridColDef[];
}

const MiniModal: React.FC<IMiniModal> = ({
                                           open = false,
                                           handleClose,
                                           handleEdit,
                                           handleDelete,
                                           data,
                                           fields,
                                         }) => {
  const [isShowDelete, setShowDelete] = React.useState(false);
  const [isShowEdit, setShowEdit] = React.useState(false);

  const onEdit = React.useCallback(() => {
    setShowEdit((prev) => !prev);
  }, []);

  const onDelete = React.useCallback(() => {
    setShowDelete((prev) => !prev);
  }, []);

  if (!open) return null;
  return (
      <>
        <div className={styles.body_bg}></div>
        <div className={styles.modal}>
          <div className={styles.group_btn}>
            <Button
                variant="contained"
                size="medium"
                sx={{ width: "12ch" }}
                onClick={onEdit}>
              Edit
            </Button>
            <Button
                variant="contained"
                size="medium"
                sx={{ width: "12ch" }}
                color="error"
                onClick={onDelete}>
              Delete
            </Button>
          </div>
          <div className={styles.close_btn}>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </div>
        <DeleteModal
            isShow={isShowDelete}
            onDelete={handleDelete}
            onClose={onDelete}
        />
        <EditModal
            isShow={isShowEdit}
            handleEdit={handleEdit}
            onClose={onEdit}
            data={data}
            fields={fields}
        />
      </>
  );
};

export default React.memo(MiniModal);