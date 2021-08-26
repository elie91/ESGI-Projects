import React, { useEffect, useState } from "react";
import { commentOrder } from "../../firebase";

const Comment = ({ order, user }) => {

  const [comment, setComment] = useState("");
  const [error, setError] = useState({});
  const [commented, setCommented] = useState(undefined);

  const _onSubmit = (e) => {
    e.preventDefault();
    let _error = "";
    if (comment.length === 0) {
      _error = "Vous ne pouvez pas envoyer de commentaire vide";
    }
    if (comment.length > 1000) {
      _error = "Votre commentaire ne peut pas faire plus de 1000 caractères";
    }
    if (_error.length > 0) {
      setError(_error);
    } else {
      setError("");
      setCommented(comment);
      commentOrder(order, user, comment).then(function () {
        console.log("Commented");
      }).catch(err => setError(err.message));
    }
  };

  useEffect(() => {
    if (order.comment) {
      setCommented(order.comment);
    }
  }, [order]);

  return (
    <>
      <h2 className="h4 mt-4 mb-3">{commented ? "Votre" : "Envoyer un"} commentaire</h2>
      {commented && <textarea className="form-control" disabled={true} value={commented}>{commented}</textarea>}
      {!commented &&
      <form onSubmit={_onSubmit}>
        <textarea className="form-control" defaultValue={comment} onChange={(e) => setComment(e.target.value)}/>
        {error.length > 0 && <p className="text-danger">{error}</p>}
        <div className="d-flex justify-content-between mt-2">
          <p className="text-muted">{comment.length}/1000</p>
          <button className={"btn btn-primary" + (comment.length === 0 ? " disabled" : "")}>Envoyer</button>
        </div>
      </form>}

    </>
  );
};

export default React.memo(Comment);
