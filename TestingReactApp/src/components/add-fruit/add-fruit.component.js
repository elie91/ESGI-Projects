import React, {useState} from "react";
import {withRouter} from "react-router-dom";
import {checkResponse} from "../../utils/responseUtils";
import Error from "../error/error.component";
import {ENTRYPOINT} from "../../config/entrypoint";

const AddFruit = ({history, fruits, setFruits}) => {

  const [fruitAdd, setFruitAdd] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    fetch(ENTRYPOINT+'/fruits', {
      method: 'POST',
      body: JSON.stringify({name: fruitAdd}),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(values => checkResponse(values, () => setFruits([...fruits, values])))
      .then(() => history.push('/'))
      .catch(error => setError(error))
  }

  const handleChange = event => setFruitAdd(event.target.value)

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-5">
        {error && <Error error={error} />}
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="card">
              <div className="card-body">
                <label htmlFor="fruit">Nom du fruit</label>
                <input type="text" required id='fruit' className='form-control' onChange={handleChange}/>
                <button className='btn btn-block btn-primary mt-4' type='submit'>Valider</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default withRouter(AddFruit);
