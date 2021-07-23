import React, { useEffect, useState } from "react";
import {
  RT_PLAYER_ADD_VIDEO,
  RT_PLAYER_EDIT_VIDEO,
} from "../../../config/routes";
import TableEntity from "../../Custom/Table/TableEntity";
import { useSnackbar } from "notistack";
import { formatErrors } from "../../../helpers/Utils";
import usePlayerVideos from "../../../hooks/usePlayerVideos";
import { useAuth } from "../../../context/AuthContext";

const headCells = [
  { id: "title" },
  { id: "createdAt", isDate: true },
  { id: "views" },
  { id: "likes" },
  { id: "comments" },
  { id: "actions" },
];

const ListVideos = () => {
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const { actions, selectors } = usePlayerVideos();
  const { enqueueSnackbar } = useSnackbar();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      actions.fetchVideos({
        owner_id: user.id,
      }).catch(e => formatErrors(e, null, enqueueSnackbar));
    }
  }, [user]);

  const onDelete = (multiple = true, id) => {
    if (multiple) {
      selected.forEach((item, index, array) => {
        actions.deleteVideo(item)
          .catch(e => {
            formatErrors(e, null, enqueueSnackbar);
          });
        if (index === array.length - 1) {
          setSelected([]);
        }
      });
    } else {
      actions.deleteVideo(id)
        .then(() => setSelected([]))
        .catch(e => {
          formatErrors(e, null, enqueueSnackbar);
        });
    }
  };

  const onSearch = (data) => {
    if (data.search.length > 2) {
      actions.fetchVideos({
        title: data.search,
        owner_id: user.id
      }).catch((e) => {
        formatErrors(e, null, enqueueSnackbar);
      });
    } else {
      actions.fetchVideos({
        owner_id: user.id
      }).catch((e) => {
          formatErrors(e, null, enqueueSnackbar);
        });
    }
  };

  const onChangePage = (newPage) => {
    if (newPage > page) {
      actions.fetchVideos({
        page: newPage + 1,
        owner_id: user.id
      }).then(() => {
        setPage(newPage);
      }).catch(e => {
        formatErrors(e, null, enqueueSnackbar);
      });
    } else {
      setPage(newPage);
    }
  };

  return (
    <TableEntity
      page={page}
      setPage={setPage}
      headCells={headCells}
      addLink={RT_PLAYER_ADD_VIDEO}
      editLink={RT_PLAYER_EDIT_VIDEO}
      data={selectors.getVideos()}
      metadata={selectors.getMetadata()}
      loading={selectors.isLoading()}
      isEmpty={selectors.isEmpty()}
      onDelete={onDelete}
      onChangePage={onChangePage}
      onSearch={onSearch}
      selected={selected}
      setSelected={setSelected}
      keyTranslate={"video"}
      columnNameDelete="title"
    />
  );
};

export default ListVideos;
