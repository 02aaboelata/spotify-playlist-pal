export default function TrackList(props) {
    const tracks = props.tracks.map((track) => (
        <div>
            <input
                key={track.name}
                id={track.name}
                type="checkbox"
                name="tracks"
                value={track.id}
            />
            <label htmlFor={track.name}>{track.name}</label>
        </div>
    ));

    return (
        <form>
            {tracks}
            {/* <h3>
                Click to generate a playlist featuring your selected artists!
            </h3>
            <button>generate playlist</button> */}
        </form>
    );
}
