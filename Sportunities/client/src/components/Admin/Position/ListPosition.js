import React, { useState } from "react";
import {
  RT_ADMIN_POSITIONS_ADD, RT_ADMIN_POSITIONS_EDIT,
} from "../../../config/routes";
import TableEntity from "../../Custom/Table/TableEntity";
import { useSnackbar } from "notistack";
import { formatErrors } from "../../../helpers/Utils";
import usePosition from "../../../hooks/usePosition";
import { useParams } from "react-router-dom";

const headCells = [
  { id: "value" },
  { id: "actions" },
];

const ListPosition = () => {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const { id } = useParams();
  const { actions, selectors } = usePosition();
  const { enqueueSnackbar } = useSnackbar();

  const onDelete = (multiple = true, id) => {
    if (multiple) {
      selected.forEach((item, index, array) => {
        actions.deletePosition(item)
          .catch(e => {
            formatErrors(e, null, enqueueSnackbar);
          });
        if (index === array.length - 1) {
          setSelected([]);
        }
      });
    } else {
      actions.deletePosition(id)
        .then(() => setSelected([]))
        .catch(e => {
          formatErrors(e, null, enqueueSnackbar);
        });
    }
  };

  const onSearch = (data) => {
    if (data.search.length > 2) {
      actions.getPositions({
        name: data.search,
        sport_id: id,
      }).catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
    } else {
      actions.getPositions()
        .catch((e) => {
          formatErrors(e, null, enqueueSnackbar);
        });
    }
  };

  const onChangePage = (newPage) => {
    if (newPage > page) {
      actions.getPositions({
        sport_id: id,
        page: newPage + 1,
      }).then(() => {
        setPage(newPage);
      }).catch(e => {
        formatErrors(e, null, enqueueSnackbar);
      });
    } else {
      setPage(newPage);
    }
  };

  const onRefresh = () => {
    actions.getPositions({
      sport_id: id,
      page: 1,
    }).then(() => {
      setPage(0);
    }).catch((e) => {
      formatErrors(e, null, enqueueSnackbar);
    });
  };

  return (
    <TableEntity
      disableGutters={true}
      page={page}
      setPage={setPage}
      headCells={headCells}
      addLink={RT_ADMIN_POSITIONS_ADD.replace(":sport", id)}
      editLink={RT_ADMIN_POSITIONS_EDIT.replace(":sport", id)}
      data={selectors.getPositionsBySport(id)}
      metadata={selectors.getMetadata()}
      loading={selectors.isLoading()}
      isEmpty={selectors.isEmpty()}
      onDelete={onDelete}
      onChangePage={onChangePage}
      onSearch={onSearch}
      onRefresh={onRefresh}
      selected={selected}
      setSelected={setSelected}
      keyTranslate={"position"}
      container={false}
    />
  );
};

export default ListPosition;
