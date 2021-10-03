import React, { useEffect, useState } from "react";
import { RT_ADMIN_AGENTS_EDIT, } from "../../../config/routes";
import TableEntity from "../../Custom/Table/TableEntity";
import { useSnackbar } from "notistack";
import { formatErrors } from "../../../helpers/Utils";
import useAgent from "../../../hooks/useAgent";

const headCells = [
  { id: "user", keyObject: "email", label: "email" },
  { id: "user", keyObject: "lastname", label: "lastname" },
  { id: "user", keyObject: "firstname", label: "firstname" },
  { id: "actions" },
];

const ListAgent = () => {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const { actions, selectors } = useAgent();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    actions.getAgents()
      .catch(e => formatErrors(e, null, enqueueSnackbar));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSearch = (data) => {
    if (data.full_text.length > 2) {
      actions.getAgents({
        lastname: data.full_text,
        firstname: data.full_text,
        email: data.full_text,
      }).catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
    } else {
      actions.getAgents().catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
    }
  };

  const onChangePage = (newPage) => {
    if (newPage > page) {
      actions.getAgents({
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
    actions.getAgents({
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
      editLink={RT_ADMIN_AGENTS_EDIT}
      data={selectors.getAgents()}
      metadata={selectors.getMetadata()}
      loading={selectors.isLoading()}
      isEmpty={selectors.isEmpty()}
      onChangePage={onChangePage}
      onSearch={onSearch}
      onRefresh={onRefresh}
      selected={selected}
      setSelected={setSelected}
      keyTranslate={"agent"}
    />
  );
};

export default ListAgent;
