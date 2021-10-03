import {useContext} from "react";
import {RootContext} from "../context/RootContext";
import {tagsActions, fetchTags} from "../context/actions/tags";


const useTags = () => {
    const {
        state: {tags: tagsState},
        dispatch,
    } = useContext(RootContext);

    const actions = {
        getTags: async (params) => {
            if (tagsState.loading) {
                return false;
            }
            dispatch({ type: tagsActions.FETCH_TAGS_START });
            const tags = await fetchTags(params);
            dispatch({
                type: tagsActions.FETCH_TAGS_SUCCESS,
                payload: { tags },
            });
            return tags;
        },
    }


    const selectors = {
        getTags: () => {
            return tagsState.tags;
        },
        isLoading: () => {
            return tagsState.loading;
        },
        isEmpty: () => {
            return tagsState.tags.length === 0;
        },
        getMetadata: () => {
            return {};
        },
    }

    return { actions, selectors };
}

export default useTags;