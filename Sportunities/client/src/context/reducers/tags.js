import {tagsActions} from "../actions/tags";

export const initialState = {
    tags: [],
    loading: false,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case tagsActions.FETCH_TAGS_START:
            return {
                ...state,
                loading: true,
            };

        case tagsActions.FETCH_TAGS_SUCCESS:
            return {
                ...state,
                tags: action.payload.tags,
                loading: false
            };

        default:
            return state;
    }
}