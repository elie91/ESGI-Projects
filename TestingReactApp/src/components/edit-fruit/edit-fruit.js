import React, {useState} from "react";
import Error from "../error/error.component";
import {checkResponse} from "../../utils/responseUtils";
import {withRouter} from "react-router-dom";
import {ENTRYPOINT} from "../../config/entrypoint";

const EditFruit = ({location: {state: {fruit}}, history, fruits, setFruits}) => {

  console.log(fruit)
  const [error, setError] = useState(null);
  const [fruitEdit, setFruitEdit] = useState(fruit);

  const handleSubmit = event => {
    event.preventDefault();
    fetch(ENTRYPOINT + fruitEdit["@id"], {
      method: 'put',
      body: JSON.stringify({name: fruitEdit.name}),
      headers: {
        'content-type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(values => {
        const filtered = fruits.map(fruit => {
          if (fruit.id === values.id) {
            fruit.name = fruitEdit.name
          }
          return fruit
        })
        checkResponse(values, () => setFruits(filtered))
      })
      .then(() => history.push('/'))
      .catch(error => setError(error.toString()))
  }

  const handleChange = event => setFruitEdit({...fruitEdit, name: event.target.value})

  return (
    <form onSubmit={handleSubmit}>
      <div className="mt-5">
        {error && <Error error={error}/>}
        <div className="row">
          <div className="col-md-4 offset-md-4">
            <div className="card">
              <div className="card-body">
                <label htmlFor="fruit">Nom du fruit</label>
                <input type="text" required id='fruit' value={fruitEdit.name} className='form-control fruit-input'
                       onChange={handleChange}/>
                <button className='btn btn-block btn-primary mt-4' type='submit'>Valider</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default withRouter(EditFruit);
