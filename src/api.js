import MoviesModel from './model/movies.js';

const Method = {
  GET: 'GET',
  PUT: 'PUT',
};

const SuccessHTTPStatusRange = {
  MIN: 200,
  MAX: 299,
};

export default class Api {
  constructor(endPoint, authorization) {
    this._endPoint = endPoint;
    this._authorization = authorization;
  }

  getMovies() {
    return this._request({url: 'movies'})
      .then(Api.toJSON)
      .then((movies) => movies.map(MoviesModel.adaptToClient));

  }

  updateFilm(movie) {
    return this._request({
      url: `movies/${movie.id}`,
      method: Method.PUT,
      body: JSON.stringify(movie),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  getComments(movie) {
    return this._request({url: `comments/${movie.id}`})
      .then(Api.toJSON);
  }

  setMovieComments (movie, localComment) {
    return this._request({
      url: `movies/${movie.id}`,
      method: Method.POST,
      body: JSON.stringify(localComment),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  removeMovieComment(movie, comment) {
    return this._request({
      url: `movies/${movie.id}`,
      method: Method.DELETE,
      body: JSON.stringify(comment.id),
      headers: new Headers({'Content-Type': 'application/json'}),
    })
      .then(Api.toJSON);
  }

  _request({
    url,
    method = Method.GET,
    body = null,
    headers = new Headers(),
  }) {
    headers.append('Authorization', this._authorization);

    return fetch(
      `${this._endPoint}/${url}`,
      {method, body, headers},
    )
      .then(Api.checkStatus)
      .catch(Api.catchError);
  }

  static checkStatus(response) {
    if (
      response.status < SuccessHTTPStatusRange.MIN ||
      response.status > SuccessHTTPStatusRange.MAX
    ) {
      throw new Error(`${response.status}: ${response.statusText}`);
    }

    return response;
  }

  static toJSON(response) {
    return response.json();
  }

  static catchError(err) {
    throw err;
  }
}
