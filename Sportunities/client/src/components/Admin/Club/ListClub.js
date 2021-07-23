import React, { useEffect, useState } from "react";
import useClub from "../../../hooks/useClub";
import {
  RT_ADMIN_CLUBS_ADD,
  RT_ADMIN_CLUBS_EDIT,
} from "../../../config/routes";
import TableEntity from "../../Custom/Table/TableEntity";
import { useSnackbar } from "notistack";
import { formatErrors } from "../../../helpers/Utils";
import { Switch } from "@material-ui/core";

const headCells = [
  { id: "name" },
  {
    id: "approved", custom: (row, action) => {
      return (
        <Switch
          color="primary"
          checked={row.approved}
          onChange={(e) => action(e, "approved", row)}
          name="approved"
        />
      );
    },
    nameAction: "onSwitch",
  },
  { id: "actions" },
];

const ListClub = () => {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const { actions, selectors } = useClub();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    actions.getClubs()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = (multiple = true, id) => {
    if (multiple) {
      selected.forEach((item, index, array) => {
        actions.deleteClub(item)
          .catch(e => {
            formatErrors(e, null, enqueueSnackbar);
          });
        if (index === array.length - 1) {
          setSelected([]);
        }
      });
    } else {
      actions.deleteClub(id)
        .then(() => setSelected([]))
        .catch(e => {
          formatErrors(e, null, enqueueSnackbar);
        });
    }
  };

  const onSwitch = (e, type, object) => {
    actions.updateClub({
      [type]: !object[type],
      id: object.id,
    }).catch(e => {
      formatErrors(e, null, enqueueSnackbar);
    });
  };

  const onSearch = (data) => {
    if (data.search.length > 2) {
      actions.getClubs({
        name: data.search,
      }).catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
    } else {
      actions.getClubs()
        .catch((e) => {
          formatErrors(e, null, enqueueSnackbar);
        });
    }
  };

  const onChangePage = (newPage) => {
    if (newPage > page) {
      actions.getClubs({
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
    actions.getClubs({
      page: 1,
    }).then(() => {
      setPage(0);
    }).catch((e) => {
      formatErrors(e, null, enqueueSnackbar);
    });
  };

  return (
    <TableEntity
      page={page}
      setPage={setPage}
      headCells={headCells}
      addLink={RT_ADMIN_CLUBS_ADD}
      editLink={RT_ADMIN_CLUBS_EDIT}
      data={selectors.getClubs()}
      metadata={selectors.getMetadata()}
      loading={selectors.isLoading()}
      isEmpty={selectors.isEmpty()}
      onDelete={onDelete}
      onChangePage={onChangePage}
      onSearch={onSearch}
      onSwitch={onSwitch}
      onRefresh={onRefresh}
      selected={selected}
      setSelected={setSelected}
      keyTranslate={"club"}
    />
  );
};

export default ListClub;
