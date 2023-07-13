import { Button } from "@mui/material";
import React from "react";
import styles from "./DeleteModal.module.sass";

interface IDeleteModal {
    onDelete: () => void;
    onClose: () => void;
    isShow: boolean;
}

const DeleteModal: React.FC<IDeleteModal> = ({ onDelete, onClose, isShow }) => {

    if (!isShow) return null;
    return (
        <div className={styles.delete_modal}>
            <p className={styles["delete_modal-title"]}>
                Do you exact want to delete?
            </p>
            <div className={styles.buttton_group}>
                <Button
                    variant="contained"
                    size="medium"
                    sx={{ width: "12ch" }}
                    color="error"
                    onClick={onDelete}>
                    Yes
                </Button>
                <Button
                    variant="contained"
                    size="medium"
                    sx={{ width: "12ch" }}
                    onClick={onClose}>
                    No
                </Button>
            </div>
        </div>
    );
};

export default React.memo(DeleteModal);