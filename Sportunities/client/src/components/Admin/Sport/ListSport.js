import React, { useEffect, useState } from "react";
import useSport from "../../../hooks/useSport";
import {
  RT_ADMIN_SPORTS_ADD,
  RT_ADMIN_SPORTS_EDIT,
} from "../../../config/routes";
import TableEntity from "../../Custom/Table/TableEntity";
import { useSnackbar } from "notistack";
import { formatErrors } from "../../../helpers/Utils";

const headCells = [
  { id: "name" },
  { id: "actions" },
];

const ListSport = () => {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const { actions, selectors } = useSport();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    if (selectors.isEmpty()) {
      actions.getSports()
        .catch(e => formatErrors(e, null, enqueueSnackbar));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onDelete = (multiple = true, id) => {
    if (multiple) {
      selected.forEach((item, index, array) => {
        actions.deleteSport(item)
          .catch(e => {
            formatErrors(e, null, enqueueSnackbar);
          });
        if (index === array.length - 1) {
          setSelected([]);
        }
      });
    } else {
      actions.deleteSport(id)
        .then(() => setSelected([]))
        .catch(e => {
          formatErrors(e, null, enqueueSnackbar);
        });
    }
  };

  const onSwitch = (e, type, object) => {
    actions.updateSport({
      [type]: !object[type],
      id: object.id,
    }).catch(e => {
      formatErrors(e, null, enqueueSnackbar);
    });
  };


  const onSearch = (data) => {
    if (data.search.length > 2) {
      actions.getSports({
        name: data.search,
      }).catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
    } else {
      actions.getSports()
        .catch((e) => {
          formatErrors(e, null, enqueueSnackbar);
        });
    }
  };

  const onChangePage = (newPage) => {
    if (newPage > page) {
      actions.getSports({
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
    actions.getSports({
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
      addLink={RT_ADMIN_SPORTS_ADD}
      editLink={RT_ADMIN_SPORTS_EDIT}
      data={selectors.getSports()}
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
      keyTranslate={"sport"}
    />
  );
};

export default ListSport;
