export default function ArtistList(props) {
    const artists = props.artists.map((artist) => (
        <div>
            <input
                key={artist.name}
                id={artist.name}
                type="checkbox"
                name="artists"
                value={artist.id}
            />
            <label htmlFor={artist.name}>{artist.name}</label>
        </div>
    ));

    async function processForm(formData) {
        const chosen = formData.getAll("artists");

        try {
            const playlistResponse = await fetch(
                `https://api.spotify.com/v1/me/playlists`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${props.token}`,
                    },
                    body: JSON.stringify({
                        name: "New Playlist",
                        description: "New playlist description",
                        public: false,
                    }),
                }
            );
            const playlistData = await playlistResponse.json();
            const playlistID = playlistData.id;
            console.log("playlist created");
            chosen.forEach(async (id) => {
                const topTracksResponse = await fetch(
                    `https://api.spotify.com/v1/artists/${id}/top-tracks`,
                    {
                        headers: {
                            Authorization: `Bearer ${props.token}`,
                        },
                    }
                );
                const topTracksData = await topTracksResponse.json();
                console.log("tracks received");
                const ids = topTracksData.tracks.map((song) => song.uri);
                await fetch(
                    `https://api.spotify.com/v1/playlists/${playlistID}/tracks`,
                    {
                        method: "POST",
                        headers: {
                            Authorization: `Bearer ${props.token}`,
                        },
                        body: JSON.stringify({
                            uris: ids,
                        }),
                    }
                );
                console.log("tracks added");
            });
        } catch (error) {
            console.log("OOGLy boogly");
        }
    }

    return (
        <form action={processForm}>
            {artists}
            <h3>
                Click to generate a playlist featuring your selected artists!
            </h3>
            <button>generate playlist</button>
        </form>
    );
}
