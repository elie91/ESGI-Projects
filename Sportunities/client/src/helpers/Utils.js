import {
  differenceInDays,
  differenceInHours, differenceInMinutes,
  differenceInMonths, differenceInSeconds,
  differenceInYears,
  isDate,
  parseISO as dfParseISO,
} from "date-fns";
import i18n from "../i18n";
import { ContentState, convertToRaw, convertFromHTML } from "draft-js";
import slugify from "slugify";

export const phoneRegex = new RegExp(/^((\+)33|0)?[1-9](\d{2}){4}$/);

export const passwordRegex = new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*.\-_])(?=.{8,})/);

export const parseISO = (date) => (isDate(date) ? date : dfParseISO(date));

export const dateFR = (date) => {
  date = date.split("-");
  return `${date[2]}/${date[1]}/${date[0]}`;
};

export const shortDescription = (text, length) => {
  if (text.length > length) {
    return text.substring(0, length) + "...";
  }
  return text;
};

export const formatDifferenceBetweenDate = (dateLeft, dateRight) => {
  let differenceInYear = differenceInYears(dateLeft, dateRight);
  if (differenceInYear === 0) {
    let differenceInMonth = differenceInMonths(dateLeft, dateRight);
    if (differenceInMonth === 0) {
      let differenceInDay = differenceInDays(dateLeft, dateRight);
      if (differenceInDay === 0) {
        let differenceInHour = differenceInHours(dateLeft, dateRight);
        if (differenceInHour === 0) {
          let differenceInMinute = differenceInMinutes(dateLeft, dateRight);
          if (differenceInMinute === 0) {
            let differenceInSecond = differenceInSeconds(dateLeft, dateRight);
            if (differenceInSecond === 0) {
              return i18n.t("date.instant");
            }
            return differenceInSecond + " " + i18n.t("date.second");
          }
          return differenceInMinute + " " + i18n.t("date.minute");
        }
        return differenceInHour + " " + i18n.t("date.hour");
      }
      return differenceInDay + " " + i18n.t("date.day");
    }
    return differenceInMonth + " " + i18n.t("date.month");
  }
  return differenceInYear + " " + i18n.t("date.year");
};

export const formatYupErrors = (errors) => {
  return errors.inner.reduce(
    (allErrors, currentError) => ({
      ...allErrors,
      [currentError.path]: {
        type: currentError.type ?? "validation",
        message: currentError.message,
      },
    }),
    {},
  );
};

export const slotIsAvailable = (slot, date, cutOff) => {
  slot = slot.split(":");
  let now = new Date();
  let dateSlot = new Date(date.getTime());
  dateSlot.setHours(slot[0], slot[1]);
  return dateSlot.getTime() > now.getTime();
};

export const sortByPosition = (a, b) => {
  if (a.position < b.position) {
    return -1;
  }
  if (a.position > b.position) {
    return 1;
  }
  return 0;
};

export const compareDay = (d1, d2) => {
  d1.setHours(0, 0, 0, 0);
  d2.setHours(0, 0, 0, 0);
  d1 = d1.getTime();
  d2 = d2.getTime();
  if (d1 < d2) {
    return -1;
  }
  if (d1 === d2) {
    return 0;
  }
  if (d1 > d2) {
    return 1;
  }
  return 2;
};

export const addDays = (date, days) => {
  date.setDate(date.getDate() + days);
  return date;
};

export const removeDays = (date, days) => {
  date.setDate(date.getDate() - days);
  return date;
};

export function objectIsEqual (object1, object2) {
  const keys1 = Object.keys(object1);
  const keys2 = Object.keys(object2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    const val1 = object1[key];
    const val2 = object2[key];
    const areObjects = isObject(val1) && isObject(val2);
    if ((areObjects && !objectIsEqual(val1, val2)) || (!areObjects && val1 !== val2)) {
      return false;
    }
  }

  return true;
}

function isObject (object) {
  return object != null && typeof object === "object";
}

export const formatUrlPlayerVideo = (video) => {
  return `/@${slugify(`${video.user.firstname}-${video.user.lastname}`, { lower: true })}/video/${video.id}`;
};

export const formatUrlPlayer = (user, player, route) => {
  return route.replace(":id", slugify(`${user.firstname}-${user.lastname}`, { lower: true }) + "-" + player.id);
};

export const formatErrors = (e, setError, enqueueSnackbar) => {
  switch (e.type) {
    case "request":
      enqueueSnackbar(i18n.t(e.message), { variant: "error" });
      break;
    case "fields":
      e.data.forEach((error) => {
        if (setError) {
          setError(error.field, {
            type: "manual",
            message: error.message,
          });
        } else {
          enqueueSnackbar(i18n.t(error.message), { variant: "error" });
        }
      });
      break;
    default:
      break;
  }
};

export const asyncForEach = async (array, callback) => {
  for (let index = 0; index < array.length; index++) {
    await callback(array[index], index, array);
  }
};

export const bindPageMetadata = (params) => {
  return params && params.page ? params.page : 1;
};

export const formatDescription = (description) => {
  if (description) {
    const contentHTML = convertFromHTML(description);
    const state = ContentState.createFromBlockArray(contentHTML.contentBlocks, contentHTML.entityMap);
    return JSON.stringify(convertToRaw(state));
  }
  return "";
};

export const formatPhone = (data) => {
  let phone;
  if (data.phone.startsWith("06") || data.phone.startsWith("07")) {
    phone = "+33" + data.phone.substr(1, data.phone.length);
  } else {
    phone = data.phone;
  }
  return phone;
};

export const generateSpacing = (theme) => {
  let object = {};
  let array = [
    {
      "name": "mt",
      "property": "marginTop",
    },
    {
      "name": "ml",
      "property": "marginLeft",
    },
    {
      "name": "mr",
      "property": "marginRight",
    }, {
      "name": "mb",
      "property": "marginBottom",
    },
    {
      "name": "my",
      "properties": ["marginTop", "marginBottom"],
    },
    {
      "name": "mx",
      "properties": ["marginLeft", "marginRight"],
    },
    {
      "name": "pt",
      "property": "paddingTop",
    },
    {
      "name": "pl",
      "property": "paddingLeft",
    },
    {
      "name": "pr",
      "property": "paddingRight",
    }, {
      "name": "pb",
      "property": "paddingBottom",
    },
    {
      "name": "py",
      "properties": ["paddingTop", "paddingBottom"],
    },
    {
      "name": "px",
      "properties": ["paddingLeft", "paddingRight"],
    },
    {
      "name": "p",
      "properties": ["padding"],
    },
    {
      "name": "m",
      "properties": ["margin"],
    },

  ];

  array.forEach(item => {
    for (let i = 0; i < 11; i++) {
      if (item.property) {
        object = {
          ...object,
          [item.name + "" + i]: {
            [item.property]: theme.spacing(i),
          },
        };
      } else {
        let properties = {};

        item.properties.forEach(item => {
          properties = {
            ...properties,
            [item]: theme.spacing(i),
          };
        });

        object = {
          ...object,
          [item.name + "" + i]: properties,
        };
      }
    }
  });
  return object;
};

export const reOrder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

export const getItemStyleDraggable = (isDragging, draggableStyle) => ({
  ...draggableStyle,
  ...(isDragging && {
    background: "rgb(235,235,235)",
  }),
});

export const spliceInSubArray = (data, date, count) => {
  let array = [];

  let i = 0;
  data.forEach(slot => {
    if (slotIsAvailable(slot.start, date)) {
      if (!array[i]) {
        array[i] = [];
      }
      array[i].push(slot);
      if (array[i].length === count) {
        i++;
      }
    }
  });
  return array;
};

export const handleRequestSort = (event, property, orderBy, order, setOrder, setOrderBy) => {
  const isAsc = orderBy === property && order === "asc";
  setOrder(isAsc ? "desc" : "asc");
  setOrderBy(property);
};

export const handleSelectAllClick = (event, selectors, setSelected) => {
  if (event.target.checked) {
    const newSelected = selectors.map((n) => n.name);
    setSelected(newSelected);
    return;
  }
  setSelected([]);
};

export const handleClick = (event, name, setSelected, selected) => {
  const selectedIndex = selected.indexOf(name);
  let newSelected = [];

  if (selectedIndex === -1) {
    newSelected = newSelected.concat(selected, name);
  } else if (selectedIndex === 0) {
    newSelected = newSelected.concat(selected.slice(1));
  } else if (selectedIndex === selected.length - 1) {
    newSelected = newSelected.concat(selected.slice(0, -1));
  } else if (selectedIndex > 0) {
    newSelected = newSelected.concat(
      selected.slice(0, selectedIndex),
      selected.slice(selectedIndex + 1),
    );
  }

  setSelected(newSelected);
};

export const handleChangeRowsPerPage = (event, setRowsPerPage, setPage) => {
  setRowsPerPage(parseInt(event.target.value, 10));
  setPage(0);
};

export const isSelected = (name, selected) => selected.indexOf(name) !== -1;

export const getStyles = (name, personName, theme) => {
  return {
    fontWeight:
      personName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
};

export const getSum = (data, key, isString = true) => {
  let result = data.reduce((a, b) => a + (b[key] || 0), 0);
  return isString ? result.toFixed(2) : result;
};

export const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  reader.readAsDataURL(file);
  reader.onload = () => resolve(reader.result);
  reader.onerror = error => reject(error);
});

export const decodeBase64 = (base) => {
  const image = new Image();
  return image.src = base;
};

export const formatHeight = (value) => {
  let height = (value / 100).toString();
  return height.replace(".", "m");
};

// String functions
export const ucFirst = (str) => {
  if (typeof str !== "string") {
    throw new TypeError(
      "ucFirst function fail because parameter is not a string",
    );
  }

  if (!str.length) {
    return str;
  }

  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const camelize = (str) => {
  if (typeof str !== "string") {
    throw new TypeError(
      "camelize function fail because the parameter is not a string",
    );
  }

  if (!str.length) {
    return str;
  }

  return str
    .split(/[^a-zA-Z0-9]/)
    .map((chunk) => ucFirst(chunk))
    .join("");
};

// array function

export const array_unique = (array, idField) => {
  const result = [];
  const map = new Map();
  for (const item of array) {
    const value = idField ? item[idField] : item;
    if (!map.has(value)) {
      map.set(value, true); // set any value to Map
      result.push(item);
    }
  }
  return result;
};

export const removeItemIfExist = (array, idField) => {
  let result = [];
  const map = new Map();
  for (const item of array) {
    const value = idField ? item[idField] : item;
    if (!map.has(value)) {
      map.set(value, true); // set any value to Map
      result.push(item);
    } else {
      result = result.filter(_item => _item[idField] !== value);
    }
  }
  return result;
};

export const mergeArray = (arr1 = [], arr2 = [], func) => {
  const result = [];
  arr1.forEach((item, index) => {
    let data;
    if ((data = arr2.find((item2) => func(item, item2))) !== undefined) {
      result[index] = data;
    } else {
      result[index] = item;
    }
  });

  return result;
};

// object function

const object_path_access = (object, path, throwError = true) => {
  object = object || {};
  if (!path) {
    return object;
  }
  const pathArray = path.split(".");

  for (let i = 0; i < pathArray.length; i++) {
    const prevObject = object;
    object = object[pathArray[i]];
    if (object === undefined) {
      if (throwError) {
        throw new Error(
          pathArray.slice(0, i + 1).join(".") +
          " does not exist, expected : " +
          JSON.stringify(Object.keys(prevObject)),
        );
      } else {
        return false;
      }
    }
  }

  return object;
};

export const PropertyAccessor = {
  has: (obj, key) =>
    obj instanceof Map ? obj.has(key) : object_path_access(obj, key, false),
  get: (obj, key) =>
    obj instanceof Map ? obj.get(key) : object_path_access(obj, key),
  set: (obj, key, value) =>
    obj instanceof Map ? obj.set(key, value) : (obj[key] = value),
  delete: (obj, key) =>
    obj instanceof Map ? obj.delete(key) : delete obj[key],
};

export const object_filter = (obj, callback) => {
  let result = {},
    p;
  for (p in obj) {
    if (obj.hasOwnProperty(p)) {
      if (callback(obj[p], p)) {
        result[p] = obj[p];
      }
    }
  }
  return result;
};

export const toQueryString = (obj, prefix) => {
  const str = [];
  const keys = obj instanceof Map ? obj.keys() : Object.keys(obj);

  for (const p of keys) {
    let k = prefix ? prefix + "[" + p + "]" : p,
      v = obj instanceof Map ? obj.get(p) : obj[p];
    str.push(
      v !== null && typeof v === "object"
        ? toQueryString(v, k)
        : encodeURIComponent(k) + "=" + encodeURIComponent(v),
    );
  }
  return str.join("&");
};

export const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

export const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

export const stableSort = (array, comparator) => {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
};

export function debounce (callback, delay) {
  let timer;
  return function () {
    const args = arguments;
    const context = this;
    clearTimeout(timer);
    timer = setTimeout(function () {
      callback.apply(context, args);
    }, delay);
  };
}

export function cutLongText (text, length) {
  if (text.length > length) {
    text = text.substring(0, length) + "...";
  }
  return text;
}

export function formatVideoData (video) {
  return {
    ...video,
    description: cutLongText(video.description, 100),
    comments: video.comments ? video.comments.length : 0,
    likes: video.likes ? video.likes.length : 0,
    views: video.views ? video.views.length : 0,
  };
}

export const getFirstLetter = (string) => {
  return string.substring(0, 1);
};

export const generateTags = (video) => {
  return video.tags.map(tag => `${tag.name} `).join("");
};

