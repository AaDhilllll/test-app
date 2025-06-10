'use client';

export default function WatchlistItem({ id }) {
  return (
    <div className="watchlist-placeholder">
      <p>Watchlist item #{id}</p>
      <div className="button-group">
        <button className="btn btn-secondary">Mark as Watched</button>
        <button className="btn btn-danger">Remove</button>
      </div>
    </div>
  );
}
