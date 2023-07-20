/* eslint-disable camelcase */

exports.shorthands = undefined;

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.up = (pgm) => {
  pgm.addConstraint("playlist_songs", "playlist_songs_fk_songId", {
    foreignKeys: {
      columns: "songId",
      references: "songs(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  });

  pgm.addConstraint("playlist_songs", "playlist_songs_fk_playlistId", {
    foreignKeys: {
      columns: "playlistId",
      references: "playlists(id)",
      onDelete: "CASCADE",
      onUpdate: "CASCADE"
    }
  });
};

/** @param {import("node-pg-migrate").MigrationBuilder} pgm */
exports.down = (pgm) => {
  pgm.dropConstraint("playlist_songs", "playlist_songs_fk_songId");
  pgm.dropConstraint("playlist_songs", "playlist_songs_fk_playlistId");
};
