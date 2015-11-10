SC.initialize({
  client_id: SOUND_CLOUD_KEY
});

var doSearch = function(query) {
  SC.get('/tracks', {
    q: query
  }).then(function(tracks) {
    console.log(tracks);
    return tracks;
  });
};