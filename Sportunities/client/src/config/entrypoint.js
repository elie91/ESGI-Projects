export const API_HOST = process.env.REACT_APP_API_URL;

export const API_PATH = API_HOST + "/";

export const API_SIGN_IN = API_PATH + "login_check";
export const API_RESET_PASSWORD = API_PATH + "reset_password";
export const API_TOKEN_RESET_PASSWORD = API_PATH + "token_reset_password";

export const API_USERS = API_PATH + "users";
export const API_SPORTS = API_PATH + "sports";
export const API_POSITIONS = API_PATH + "positions";
export const API_CONVERSATIONS = API_PATH + "conversations";
export const API_MESSAGES = API_PATH + "messages";
export const API_CLUBS = API_PATH + "clubs";
export const API_PLAYERS = API_PATH + "players";
export const API_PLAYERS_FAMOUS = API_PLAYERS + "/famous";
export const API_AGENTS = API_PATH + "agents";
export const API_SEARCH = API_PATH + "search";

export const API_TAGS = API_PATH + "tags";

export const API_EXPERIENCES = API_PATH + "experiences";
export const API_VIDEOS = API_PATH + "videos";
export const API_FOLLOW = API_PATH + "following";

export const MERCURE_HUB_URL = process.env.REACT_APP_MERCURE_HUB_URL ? `${process.env.REACT_APP_MERCURE_HUB_URL}/.well-known/mercure` : `${window.location.origin}/mercure/.well-known/mercure`;
