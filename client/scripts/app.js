var AppContainer = React.createClass({
  SCrequest: function (searchText) {
    SC.initialize({
      client_id: SOUND_CLOUD_KEY
    });

    var component = this;

    SC.get('/tracks', {
      q: searchText
    }).then(function (tracks) {
      console.log(tracks);
      component.setState({data: tracks});
    });
  },

  addToPlaylist: function (song) {
    var playlist = this.state.songs;
    playlist.push(song);

    console.log("playlist", playlist);

    this.setState({songs: playlist});
  },

  getInitialState: function () {
    return {
      data: [],
      songs: []
    };
  },

  render: function () {
    return (
      <div className="AppContainer">
        <h1>Search</h1>
        <SearchInput onSearchSubmit={this.SCrequest}/>
        <SearchResults data={this.state.data} onSelectClick={this.addToPlaylist}/>
        <Playlist songs={this.state.songs} />
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
        <Song key={song.id} title={song.title} song={song} onSelectClick={component.handleSelect}></Song>
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

  render: function () {
    return (
      <div className='song'>
        <h4 className='songTitle' onClick={this.handleSelect}>
          {this.props.title}
        </h4>
      </div>
    );
  }
});

var Playlist = React.createClass({
  handleSelect: function () {
    this.props.onSelectClick(); //handle play here
  },

  render: function () {
    var component = this;

    var songNodes = this.props.songs.map(function (song) {
      return (
        <Song key={song.id} title={song.title} song={song} onSelectClick={component.handleSelect}></Song>
      );
    });
    return (
      <div>
        <h2>Playlist</h2>
        <div>
          <div className='searchResults'>
            {songNodes}
          </div>
        </div>
      </div>
    );
  }
});

ReactDOM.render(
  <AppContainer />,
  document.getElementById('content')
);

// anytime we change state, render should get called automatically
// setState vs. updateState
