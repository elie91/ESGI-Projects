import React from "react";
import { Avatar } from "@material-ui/core";
import { getFirstLetter } from "../../helpers/Utils";

const CustomAvatar = ({ user, fontSize = 16, ...props }) => {
  return (
    <>
      {user &&
      <>
        {user.image && user.image !== "" ?
          <Avatar {...props} alt="default" src={user.image}/>
          :
          <Avatar
            style={{ fontSize: fontSize }}
            {...props}>{getFirstLetter(user.lastname) + getFirstLetter(user.firstname)}
          </Avatar>}
      </>
      }
    </>
  );
};

export default CustomAvatar;
