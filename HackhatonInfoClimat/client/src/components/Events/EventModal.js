import React from "react";
import {makeStyles, Modal} from '@material-ui/core';
import useEvent from "../../hooks/useEvent";
import EventDetail from "./EventDetail";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: '60vw',
    maxHeight: '60vh',
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[5],
    padding: 0,
    top: '60%',
    left: '60%',
    transform: 'translate(-50%, -60%)',
    overflowY: 'scroll'
  }
}));

const EventModal = () => {

  const classes = useStyles();
  const {actions, selectors} = useEvent();
  const event = selectors.getModalEvent();

  const handleClose = () => {
    actions.closeModal();
  }
  return (
      <Modal
          open={selectors.isModalOpen()}
          onClose={handleClose}
          aria-labelledby="simple-modal-title"
          aria-describedby="simple-modal-description"
      >
        <div className={classes.paper}>
          <EventDetail event={event}  />
        </div>
      </Modal>
  )
}

export default EventModal;
