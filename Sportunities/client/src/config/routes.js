export const RT_ROOT = "/";

// Front routes
export const RT_LOGIN = RT_ROOT + "sign-in";
export const RT_SIGNUP = RT_ROOT + "sign-up";
export const RT_PROFILE = RT_ROOT + "profile";
export const RT_RESET_PASSWORD = RT_ROOT + "reset-password";
export const RT_SIGNUP_NEXT_STEP = RT_SIGNUP + "/next-step";
export const RT_RESET_PASSWORD_TOKEN = RT_RESET_PASSWORD + "/token/:token";

// User routes
export const RT_SUBSCRIPTIONS = RT_ROOT + "subscriptions";

// Vidéos routes
export const RT_VIDEO = RT_ROOT + "video";
export const RT_PLAY_VIDEO = RT_ROOT + `@:player/video/:videoId`;
export const RT_PLAYER_VIDEOS = RT_ROOT + "videos";
export const RT_PLAYER_ADD_VIDEO = RT_PLAYER_VIDEOS + "/add";
export const RT_PLAYER_EDIT_VIDEO = RT_PLAYER_VIDEOS + "/:id/edit";

// Player routes
export const RT_PLAYER = RT_ROOT + "player";
export const RT_PLAYER_SHOW = RT_PLAYER + "/:id";
export const RT_PLAYER_EDIT = RT_PLAYER + "/:id/edit";
export const RT_PLAYER_SHOW_VIDEOS = RT_PLAYER + "/:id/videos";

export const RT_PLAYER_EXPERIENCES = RT_PLAYER + "/experiences";

export const RT_CONVERSATIONS = RT_ROOT + "conversations";

// Agent routes
export const RT_AGENTS = RT_ROOT + "agents";
export const RT_AGENT = RT_ROOT + "agent";
export const RT_AGENT_SHOW = RT_AGENTS + "/:id";
export const RT_AGENT_EDIT = RT_AGENTS + "/:id/edit";
export const RT_AGENT_CONVERSATIONS = RT_AGENT + "/conversations";

export const RT_AGENT_PLAYERS = RT_AGENT + "/players";

// Admin routes
export const RT_ADMIN = RT_ROOT + "admin";

export const RT_ADMIN_USERS = RT_ADMIN + "/users";
export const RT_ADMIN_USERS_ADD = RT_ADMIN_USERS + "/add";
export const RT_ADMIN_USERS_EDIT = RT_ADMIN_USERS + "/:id/edit";

export const RT_ADMIN_SPORTS = RT_ADMIN + "/sports";
export const RT_ADMIN_SPORTS_ADD = RT_ADMIN_SPORTS + "/add";
export const RT_ADMIN_SPORTS_EDIT = RT_ADMIN_SPORTS + "/:id/edit";

export const RT_ADMIN_POSITIONS = RT_ADMIN_SPORTS + "/:sport/positions";
export const RT_ADMIN_POSITIONS_ADD = RT_ADMIN_POSITIONS + "/add";
export const RT_ADMIN_POSITIONS_EDIT = RT_ADMIN_POSITIONS + "/:id/edit";

export const RT_ADMIN_CLUBS = RT_ADMIN + "/clubs";
export const RT_ADMIN_CLUBS_ADD = RT_ADMIN_CLUBS + "/add";
export const RT_ADMIN_CLUBS_EDIT = RT_ADMIN_CLUBS + "/:id/edit";

export const RT_ADMIN_AGENTS = RT_ADMIN + "/agents";
export const RT_ADMIN_AGENTS_EDIT = RT_ADMIN_AGENTS + "/:id/edit";



