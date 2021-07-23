import {
    REQUEST_EXPERIENCES,
    RECEIVE_EXPERIENCES,
    RECEIVE_ADD_EXPERIENCES,
    RECEIVE_DELETE_EXPERIENCES,
    RECEIVE_UPDATE_EXPERIENCES,
} from "../actions/experience";

export const initialState = {
    experiences: [],
    loading: false,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case REQUEST_EXPERIENCES:
            return {
                ...state,
                loading: true,
            };
        case RECEIVE_EXPERIENCES:
            return {
                ...state,
                experiences: action.payload.experiences,
                loading: false,
            };
        case RECEIVE_ADD_EXPERIENCES:
            return {
                ...state,
                experiences: [...state.experiences, action.payload.experience],
            };
        case RECEIVE_UPDATE_EXPERIENCES:
            return {
                ...state,
                experiences: state.experiences.map(item => {
                    if (item.id === action.payload.experience.id) {
                        return action.payload.experience;
                    }
                    return item;
                }),
            };
        case RECEIVE_DELETE_EXPERIENCES:
            return {
                ...state,
                experiences: state.experiences.filter(item => item.id !== action.payload.id),
            };
        default:
            return state;
    }
};
