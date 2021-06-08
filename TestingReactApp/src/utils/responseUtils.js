export const checkResponse = (response, after) => {
  if(response.hasOwnProperty('violations')) {
    throw response['violations'][0]['message']
  }
  after()
}
