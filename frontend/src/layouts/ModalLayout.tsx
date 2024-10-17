import { Modal, Box } from "@mui/material";
import { ReactNode } from "react";

const ModalLayout = ({ children, open, setOpen, style }: { children: ReactNode, open: boolean, setOpen: (isOpen: boolean) => void, style: any }) => {
    return(
        <Modal open={open} onClose={() => { setOpen(false) }}>
            <Box sx={style}>
                {children}
            </Box>
        </Modal>
    )
}

export default ModalLayout;