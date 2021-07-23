import React from "react";
import { Controller } from "react-hook-form";
import MUIRichTextEditor from "mui-rte";
import { convertToHTML } from "draft-convert";
import { useTranslation } from "react-i18next";

const TextEditor = ({ name, label, control, defaultValue = "" }) => {

  const { t } = useTranslation();

  return (
    <Controller
      name={name}
      control={control}
      defaultValue={false}
      render={props =>
        <MUIRichTextEditor
          defaultValue={defaultValue}
          controls={[
            "title",
            "bold",
            "italic",
            "underline",
            "numberList",
            "bulletList",
            "clear",
            "strikethrough",
            "highlight",
          ]}
          onChange={e => {
            props.onChange(convertToHTML(e.getCurrentContent()));
          }}
          label={t(label) + "..."}
        />
      }
    />
  );
};

export default TextEditor;
