import React from "react";
import ArtistList from "./ArtistList";
import TrackList from "./TrackList";

export default function Main(props) {
    const CLIENT_ID = "0dce0dbd163a43faa4f4898c97ccbeeb";
    const REDIRECT_URI = "http://localhost:3000/";
    const AUTH_ENDPOINT = "https://accounts.spotify.com/authorize";
    const RESPONSE_TYPE = "token";
    const SCOPE =
        "user-top-read playlist-modify-public playlist-modify-private user-read-private user-read-email";
    const [token, setToken] = React.useState("");
    const [showData, setShowData] = React.useState(false);
    const [loggedIn, setLoggedIn] = React.useState(false);
    const [artists, setArtists] = React.useState({});
    const [tracks, setTracks] = React.useState({});
    const [showArtists, setShowArtists] = React.useState(true);

    React.useEffect(() => {
        const hash = window.location.hash;
        let token = window.localStorage.getItem("token");

        if (!token && hash) {
            token = hash
                .substring(1)
                .split("&")
                .find((elem) => elem.startsWith("access_token"))
                .split("=")[1];

            window.location.hash = "";
            window.localStorage.setItem("token", token);
        }

        setToken(token);
    }, []);

    const logout = () => {
        setToken("");
        window.localStorage.removeItem("token");
        setShowData(false);
        setLoggedIn(false);
        setArtists({});
        setTracks({});
    };

    React.useEffect(() => {
        if (token) {
            fetch("https://api.spotify.com/v1/me/top/artists", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setArtists(data.items));
        }
    }, [token]);

    React.useEffect(() => {
        if (token) {
            fetch("https://api.spotify.com/v1/me/top/tracks", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            })
                .then((res) => res.json())
                .then((data) => setTracks(data.items))
                .then(() => setLoggedIn(true));
        }
    }, [token]);

    return (
        <main>
            {!showData && <h1>Click to get your top artists!</h1>}
            {!loggedIn && (
                <a
                    href={`${AUTH_ENDPOINT}?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=${RESPONSE_TYPE}&scope=${SCOPE}`}
                >
                    Login to Spotify
                </a>
            )}
            {!showData && loggedIn && (
                <button onClick={() => setShowData(true)}> get data </button>
            )}
            {loggedIn && showData && (
                <div className="data">
                    <div className="selectionButtons">
                        <button onClick={() => setShowArtists(true)}>
                            Artists
                        </button>
                        <button onClick={() => setShowArtists(false)}>
                            Tracks
                        </button>
                    </div>
                    {showArtists && (
                        <ArtistList artists={artists} token={token} />
                    )}
                    {!showArtists && (
                        <TrackList tracks={tracks} token={token} />
                    )}
                </div>
            )}
            {loggedIn && (
                <button className="logout" onClick={logout}>
                    {" "}
                    logout{" "}
                </button>
            )}
        </main>
    );
}
