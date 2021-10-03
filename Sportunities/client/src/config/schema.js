import * as yup from "yup";
import { passwordRegex, phoneRegex } from "../helpers/Utils";
import { COUNTRIES, GENDERS } from "./constant";
import { subYears } from "date-fns";

//const SUPPORTED_FORMATS = ["image/jpg", "image/jpeg", "image/gif", "image/png"];
const SUPPORTED_FORMATS_AGENT = ["image/jpg", "image/jpeg", "image/png", "application/pdf"];
export const MIN_BIRTHDAY = subYears(new Date(), 100)
export const MAX_BIRTHDAY = subYears(new Date(), 8)

const FILE_SIZE = 10000000;

export const schemaSignUp = yup.object().shape({
  email: yup.string().email("user.errors.email").required("errors.required"),
  firstname: yup.string().required("errors.required"),
  lastname: yup.string().required("errors.required"),
  gender: yup.string().oneOf(GENDERS.map(item => item.value)).required("errors.required"),
  password: yup.string().required("errors.required").matches(
    passwordRegex,
    "user.errors.plainPassword",
  ),
  confirmPassword: yup.string()
    .oneOf([yup.ref("password"), null], "user.errors.samePassword").required("errors.required"),
  phone: yup.string().matches(phoneRegex, "user.errors.phone").required("errors.required"),
  birthday: yup.date().min(MIN_BIRTHDAY).max(MAX_BIRTHDAY).required("errors.required"),
  image: yup.mixed().nullable(true).test("fileSize", "errors.image.fileSize", (value) => {
    if (value.length > 0) {
      return value && value[0].size <= FILE_SIZE;
    }
    return true;
  })/*.test("fileType", "errors.documents.type", value => {
    if (value.length > 0) {
      console.log(value);
      return SUPPORTED_FORMATS.includes(value[0].type);
    }
    return true;
  }),*/
});

export const initialSchemaClub = {
  name: yup.string().required("errors.required"),
  postalCode: yup.string().required("errors.required"),
  city: yup.string().required("errors.required"),
  country: yup.string().required("errors.required"),
};

const initialSchemaPlayer = {
  height: yup.number().typeError("errors.number").min(120).max(250).required("errors.required"),
  weight: yup.number().typeError("errors.number").min(10).max(200).required("errors.required"),
  nationality: yup.string().oneOf(COUNTRIES.map(item => item.code), 'player.errors.nationality').required("errors.required"),
  position_id: yup.string().required("errors.required"),
  sport_id: yup.string().required("errors.required"),
};

export const schemaSignUpPlayerWithClub = yup.object().shape({
  ...initialSchemaPlayer,
  club_id: yup.string().nullable(),
});

export const schemaSignUpPlayerWithAddClub = yup.object().shape({
  ...initialSchemaPlayer,
  ...initialSchemaClub,
});

const initialSchemaAgent = {
  idCardFront: yup.mixed().required("errors.required").test("fileSize", "errors.documents.fileSize", (value) => {
    if (value.length > 0) {
      return value && value[0].size <= FILE_SIZE;
    }
    return true;
  }),
    /*.test("fileType", "errors.documents.type", value => {
      if (value.length > 0) {
        return SUPPORTED_FORMATS_AGENT.includes(value[0].type);
      }
      return true;
    }),*/
  idCardBack: yup.mixed().required("errors.required").test("fileSize", "errors.documents.fileSize", (value) => {
    if (value.length > 0) {
      return value && value[0].size <= FILE_SIZE;
    }
    return true;
  }).test("fileType", "errors.documents.type", value => {
    if (value.length > 0) {
      return SUPPORTED_FORMATS_AGENT.includes(value[0].type);
    }
    return true;
  }),
};

export const schemaSignUpAgentWithClub = yup.object().shape({
  ...initialSchemaAgent,
  club_id: yup.string().required("errors.required"),
});

export const schemaSignUpAgentWithAddClub = yup.object().shape({
  ...initialSchemaAgent,
  ...initialSchemaClub
});

export const schemaUpdateUser = yup.object().shape({
  email: yup.string().email("user.errors.email"),
  firstname: yup.string(),
  lastname: yup.string(),
  phone: yup.string().matches(phoneRegex, "user.errors.phone"),
});

export const schemaUpdatePassword = yup.object().shape({
  currentPassword: yup.string().required("errors.required"),
  plainPassword: yup.string().required("errors.required").matches(
    passwordRegex,
    "user.errors.plainPassword",
  ),
  confirmPassword: yup.string()
    .oneOf([yup.ref("plainPassword"), null], "user.errors.samePassword")
    .required("errors.required"),
});

export const schemaResetPassword = yup.object().shape({
  email: yup.string().email("user.errors.email").required("errors.required"),
});

export const schemaConfirmResetPassword = yup.object().shape({
  plainPassword: yup.string().required("errors.required").matches(
    passwordRegex,
    "user.errors.plainPassword",
  ),
  confirmPassword: yup.string()
    .oneOf([yup.ref("plainPassword"), null], "user.errors.samePassword")
    .required("errors.required"),
});

export const schemaSportAdd = yup.object().shape({
  name: yup.string().required("errors.required"),
  color: yup.string().required("errors.required"),
  description: yup.string().nullable(),
});

export const schemaPositionAdd = yup.object().shape({
  value: yup.string().required("errors.required"),
});

const schemaExperience = {
  titleExperience: yup.string().required("errors.required"),
  position: yup.string().required("errors.required"),
  startDate: yup.date().required("errors.required"),
  endDate: yup.date().nullable().when("startDate",
    (startDate, yup) => startDate && yup.min(startDate, "errors.endDate")),
  description: yup.string().nullable(),
};

export const schemaTraining = yup.object().shape({
  titleExperience: yup.string().required("errors.required"),
  startDate: yup.date().required("errors.required"),
  endDate: yup.date().nullable().when("startDate",
    (startDate, yup) => startDate && yup.min(startDate, "errors.endDate")),
  description: yup.string().nullable(),
});

export const schemaExperienceWithClub = yup.object().shape({
  ...schemaExperience,
  club: yup.string().required("errors.required"),
});

export const schemaExperienceWithAddClub = yup.object().shape({
  ...schemaExperience,
  ...initialSchemaClub,
});

export const schemaClubAdd = yup.object().shape(initialSchemaClub)

export const schemaUploadVideo = yup.object().shape({
  title: yup.string().required("errors.required"),
  description: yup.string().required("errors.required"),
  sport: yup.string().required("errors.required"),
  tags: yup.array(),
});

export const schemaMessage = yup.object().shape({
  content: yup.string().required("errors.required"),
});

