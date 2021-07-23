import React, { useEffect, useState } from "react";
import {
  RT_ADMIN_USERS_ADD,
  RT_ADMIN_USERS_EDIT,
} from "../../../config/routes";
import TableEntity from "../../Custom/Table/TableEntity";
import useUser from "../../../hooks/useUser";
import { useSnackbar } from "notistack";
import { formatErrors } from "../../../helpers/Utils";

const headCells = [
  { id: "email" },
  { id: "lastname" },
  { id: "firstname" },
  { id: "actions" },
];

const ListUser = () => {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const { actions, selectors } = useUser();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    actions.getUsers()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = (multiple = true, id) => {
    if (multiple) {
      selected.forEach((item, index, array) => {
        actions.deleteUser(item)
          .catch(e => {
            formatErrors(e, null, enqueueSnackbar);
          });
        if (index === array.length - 1) {
          setSelected([]);
        }
      });
    } else {
      actions.deleteUser(id)
        .then(() => setSelected([]))
        .catch(e => {
          formatErrors(e, null, enqueueSnackbar);
        });
    }
  };

  const onSwitch = (e, type, object) => {
    actions.updateUser({
      [type]: !object[type],
      id: object.id,
    }).catch(e => {
      formatErrors(e, null, enqueueSnackbar);
    });
  };

  const onSearch = (data) => {
    if (data.search.length > 2) {
      actions.getUsers({
        lastname: data.search,
        firstname: data.search,
        email: data.search,
      }).catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
    } else {
      actions.getUsers().catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
    }
  };

  const onChangePage = (newPage) => {
    if (newPage > page) {
      actions.getUsers({
        page: newPage + 1,
      }).then(() => {
        setPage(newPage);
      }).catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
    } else {
      setPage(newPage);
    }
  };

  const onRefresh = () => {
    actions.getUsers({
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
      addLink={RT_ADMIN_USERS_ADD}
      editLink={RT_ADMIN_USERS_EDIT}
      data={selectors.getUsers()}
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
      keyTranslate={"user"}
    />
  );
};

export default ListUser;
