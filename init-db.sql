CREATE TABLE IF NOT EXISTS users (
  handle VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  pass VARCHAR(255) NOT NULL,
  created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status BOOLEAN DEFAULT TRUE,
  last_session TIMESTAMP
);

CREATE TABLE IF NOT EXISTS follows (
  handle VARCHAR(255) REFERENCES users(handle),
  followed_handle VARCHAR(255) REFERENCES users(handle),
  followed_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (handle, followed_handle)
);

CREATE TABLE IF NOT EXISTS sessions (
  session_id VARCHAR(36) PRIMARY KEY,
  handle VARCHAR(255) REFERENCES users(handle),
  start_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  end_time TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
  post_id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  created_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  session_id VARCHAR(36) REFERENCES sessions(session_id),
  replied_message INTEGER REFERENCES posts(post_id)
);