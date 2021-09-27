import AbstractObserver from '../utils/abstract-observer.js';

export default class Movies extends AbstractObserver {
  constructor() {
    super();
    this._movies = [];
  }

  setMovies(updateType, movies) {
    this._movies = movies.slice();
    this._notify(updateType);
  }

  getMovies() {
    return this._movies;
  }

  updateMovie(updateType, update) {
    const index = this._movies.findIndex((movie) => movie.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t update unexisting task');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      update,
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType, update);
  }

  addMovie(updateType, update) {
    this._movies = [
      update,
      ...this._movies,
    ];

    this._notify(updateType, update);
  }

  deleteMovie(updateType, update) {
    const index = this._movies.findIndex((movies) => movies.id === update.id);

    if (index === -1) {
      throw new Error('Can\'t delete unexisting task');
    }

    this._movies = [
      ...this._movies.slice(0, index),
      ...this._movies.slice(index + 1),
    ];

    this._notify(updateType);
  }

  static adaptToClient(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        title: movie['film_info']['title'],
        alternativeTitle: movie['film_info']['alternative_title'],
        totalRating: movie['film_info']['total_rating'],
        poster: movie['film_info']['poster'],
        ageRating: movie['film_info']['age_rating'],
        director: movie['film_info']['director'],
        writers: movie['film_info']['writers'],
        actors: movie['film_info']['actors'],
        date: movie['film_info']['release']['date'],
        country: movie['film_info']['release']['country'],
        runtime: movie['film_info']['runtime'],
        genres: movie['film_info']['genre'],
        description: movie['film_info']['description'],
        watchlist: movie['user_details']['watchlist'],
        alreadyWatched: movie['user_details']['already_watched'],
        watchingDate: movie['user_details']['watching_date'],
        favorite: movie['user_details']['favorite'],
      },
    );

    delete adaptedMovie['film_info']['title'];
    delete adaptedMovie['film_info']['alternative_title'];
    delete adaptedMovie['film_info']['total_rating'];
    delete adaptedMovie['film_info']['poster'];
    delete adaptedMovie['film_info']['age_rating'];
    delete adaptedMovie['film_info']['director'];
    delete adaptedMovie['film_info']['writers'];
    delete adaptedMovie['film_info']['actors'];
    delete adaptedMovie['film_info']['release']['date'];
    delete adaptedMovie['film_info']['release']['country'];
    delete adaptedMovie['film_info']['runtime'];
    delete adaptedMovie['film_info']['genres'];
    delete adaptedMovie['film_info']['description'];
    delete adaptedMovie['user_details']['watchlist'];
    delete adaptedMovie['user_details']['already_watched'];
    delete adaptedMovie['user_details']['watching_date'];
    delete adaptedMovie['user_details']['favorite'];

    return adaptedMovie;
  }

  static adaptToServer(movie) {
    const adaptedMovie = Object.assign(
      {},
      movie,
      {
        'film_info': {
          'title': movie.title,
          'alternative_title': movie.alternativeTitle,
          'total_rating': movie.totalRating,
          'poster': movie.poster,
          'age_rating': movie.ageRating,
          'director': movie.director,
          'writers': movie.writers,
          'actors': movie.actors,
          'runtime': movie.runtime,
          'genres': movie.genres,
          'description': movie.description,
          'release': {
            'date': movie.date,
            'country': movie.country,
          },
        },
        'user_details': {
          'watchlist': movie.watchlist,
          'already_watched': movie.alreadyWatched,
          'watching_date': movie.watchingDate,
          'favorite': movie.favorite,
        },
      },
    );

    delete adaptedMovie.title;
    delete adaptedMovie.alternativeTitle;
    delete adaptedMovie.totalRating;
    delete adaptedMovie.poster;
    delete adaptedMovie.ageRating;
    delete adaptedMovie.director;
    delete adaptedMovie.writers;
    delete adaptedMovie.actors;
    delete adaptedMovie.date;
    delete adaptedMovie.country;
    delete adaptedMovie.runtime;
    delete adaptedMovie.genres;
    delete adaptedMovie.description;
    delete adaptedMovie.watchlist;
    delete adaptedMovie.alreadyWatched;
    delete adaptedMovie.watchingDate;
    delete adaptedMovie.favorite;

    return adaptedMovie;
  }
}
