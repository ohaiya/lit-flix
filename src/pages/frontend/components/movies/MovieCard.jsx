import React from "react";
import { Rate, Progress, Divider } from "tdesign-react";
import {
  CheckCircleIcon,
  Icon,
  MovieClapperIcon,
  PlayCircleStrokeAddIcon,
  StarFilledIcon,
} from "tdesign-icons-react";
import "./MovieCard.less";

const MovieCard = ({ movie, onClick }) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case "finished":
        return (
          <CheckCircleIcon style={{ color: "#00a870", fontSize: "16px" }} />
        );
      case "watching":
        return (
          <MovieClapperIcon style={{ color: "#ff9c00", fontSize: "16px" }} />
        );
      case "wishlist":
        return (
          <PlayCircleStrokeAddIcon
            style={{ color: "#0052d9", fontSize: "16px" }}
          />
        );
      default:
        return null;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "finished":
        return "已看完";
      case "watching":
        return "正在看";
      case "wishlist":
        return "想看";
      default:
        return "";
    }
  };

  const getProgressStatus = (status) => {
    switch (status) {
      case "finished":
        return "success";
      case "watching":
        return "active";
      case "wishlist":
        return "warning";
      default:
        return "default";
    }
  };

  return (
    <div className="movies__card" onClick={() => onClick(movie)}>
      <div className="movies__cover">
        <img src={movie.cover} alt={movie.title} />
        <div className="movies__cover-info">
          <div className="movies__title">{movie.title}</div>
          <div className="movies__status">
            {movie.isFavorite && (
              <StarFilledIcon
                style={{
                  color: "#ffd700",
                  fontSize: "16px",
                  marginRight: "4px",
                }}
              />
            )}
            {getStatusIcon(movie.status)}
            <span className="movies__status-text">
              {getStatusText(movie.status)}
            </span>
          </div>
        </div>
      </div>
      <div className="movies__info">
        <div className="movies__meta">
          <div>
            <span className="movies__year">{movie.year}</span>
            <Divider layout="vertical" />
            <span className="movies__region">{movie.region}</span>
          </div>
          {movie.status !== "wishlist" && (
            <div className="movies__rating">
              <Rate value={movie.rating} disabled size="small" />
              <span className="movies__rating-value">{movie.rating}</span>
            </div>
          )}
        </div>

        <div className="movies__progress">
          <Progress
            percentage={movie.progress}
            status={getProgressStatus(movie.status)}
            size="small"
            label={
              movie.status !== "wishlist" || (
                <Icon
                  name="time"
                  style={{ color: "#0052d9", fontSize: "16px" }}
                />
              )
            }
            strokeWidth={4}
          />
        </div>
      </div>
    </div>
  );
};

export default MovieCard;
