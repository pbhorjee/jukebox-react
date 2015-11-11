SC.initialize({
  client_id: SOUND_CLOUD_KEY
});

//TODO: error is remove logic - weird songs being added to currentSong prop

var AppContainer = React.createClass({
  SCrequest: function (searchText) {
    var component = this;

    SC.get('/tracks', {
      q: searchText
    }).then(function (tracks) {
      console.log(tracks);
      component.setState({data: tracks});
    });
  },

  addToPlaylist: function (song) {
    if (this.state.songs.indexOf(song) === -1) {
      var playlist = this.state.songs.slice(0);
      playlist.push(song);
      this.setState({songs: playlist});
    }
  },

  playSong: function(song) {
    var component = this;
    var track = "/tracks/" + song.id;
    SC.get(track)
      .then(function (track) {
        component.setState({currentSong: track});
      });
  },

  getInitialState: function () {
    return {
      data: [],
      songs: [],
      currentSong: {
        stream_url: ''
      }
    };
  },

  playNextSong: function() {
    // search playlist for the current song id
    var songIds = _.pluck(this.state.songs, 'id');
    var thisIndex = -1;
    for (var i = 0; i < songIds.length; i++) {
      if ( songIds[i] === this.state.currentSong.id ) {
        thisIndex = i;
      }
    }

    // set current song to the next song in the playlist
    var nextIndex = 0;
    if (thisIndex !== this.state.songs.length - 1) {
      nextIndex = thisIndex + 1;
    }

    this.playSong(this.state.songs[nextIndex]);
  },

  clearPlaylist: function() {
    this.setState({
      songs: [],
      currentSong: {}
    });
  },

  removeSong: function(song) {
    // search playlist for the id of the song that is being removed
    var songIds = _.pluck(this.state.songs, 'id');
    var thisIndex = -1;
    for (var i = 0; i < songIds.length; i++) {
      if ( songIds[i] === song.id ) {
        thisIndex = i;
      }
    }

    // if song being removed is the currentSong, playNextSong()
    if (song.id === this.state.currentSong.id) {
      this.playNextSong();
    }

    // if only one song left in playlist, clear playlist

    var playlist = this.state.songs.slice(0);
    playlist.splice(thisIndex,1);
    this.setState({songs: playlist});
  },

  render: function () {
    return (
      <div className="AppContainer">
        <h1>Search</h1>
        <AudioPlayer currentSong={this.state.currentSong} onSongEnded={this.playNextSong}/>
        <SearchInput onSearchSubmit={this.SCrequest}/>
        <SearchResults data={this.state.data} onSelectClick={this.addToPlaylist}/>
        <Playlist songs={this.state.songs}
                  clearPlaylist={this.clearPlaylist}
                  onSelectClick={this.playSong}
                  onRemoveSong={this.removeSong} />
      </div>
    );
  }
});

var SearchInput = React.createClass({
  handleSubmit: function () {
    var searchText = this.refs.searchInput.value.trim();
    if (!searchText) {
      return;
    }

    this.props.onSearchSubmit(searchText);
  },

  render: function () {
    return (
      <div>
        <input type="text" onChange={this.handleSubmit} id="txbSCSearch" ref='searchInput'></input>
      </div>
    );
  }
});

var SearchResults = React.createClass({
  handleSelect: function (song) {
    this.props.onSelectClick(song);
  },

  render: function () {
    var component = this;

    var songNodes = this.props.data.map(function (song) {
      return (
        <Song
          key={song.id} 
          title={song.title} 
          song={song} 
          onSelectClick={component.handleSelect}
          onRemoveSong={component.removeSong}
          showRemoveButton={false}
        ></Song>
      );
    });
    return (
      <div>
        <h2>Search results</h2>
        <div className='searchResults'>
          {songNodes}
        </div>
      </div>
    );
  }
});

var Song = React.createClass({
  handleSelect: function () {
    this.props.onSelectClick(this.props.song);
  },

  removeSong: function() {
    this.props.onRemoveSong(this.props.song);
  },

  render: function () {
    var removeButton;

    if (Boolean(this.props.showRemoveButton)) {
      removeButton = <button onClick={this.removeSong}>x</button>;
    }

    return (
      <div className='song'>
        <h4 className='songTitle' onClick={this.handleSelect}>
          {this.props.title}
          { removeButton }
        </h4>
      </div>
    );
  }
});

var Playlist = React.createClass({
  handleSelect: function (song) {
    this.props.onSelectClick(song);
  },

  removeSong: function(song) {
  this.props.onRemoveSong(song);
},

  render: function () {
    var component = this;

    var songNodes = this.props.songs.map(function (song) {
      return (
        <Song key={song.id}
              title={song.title}
              song={song}
              onRemoveSong={component.removeSong}
              onSelectClick={component.handleSelect}
              showRemoveButton={true} >
        </Song>
      );
    });
    return (
      <div>
        <h2>Playlist</h2>
        <button type='button' onClick={component.props.clearPlaylist}>Clear Playlist</button>
        <div>
          <div className='searchResults'>
            {songNodes}
          </div>
        </div>
      </div>
    );
  }
});

var AudioPlayer = React.createClass({
  render: function() {
    var srcString = '';
    if (this.props.currentSong.stream_url) {
      srcString = this.props.currentSong.stream_url.replace('http:','https:') + '?client_id=' + SOUND_CLOUD_KEY;
    }

    return (
      <audio controls autoPlay src={srcString} onEnded={this.props.onSongEnded} ref='audioPlayer'></audio>
    );
  }
});

ReactDOM.render(
  <AppContainer />,
  document.getElementById('content')
);

