interface Player {
  username: string;
  guildName: string;
}

interface SearchResultsProps {
  player: Player;
}

export default function SearchResults({ player }: SearchResultsProps) {
  return (
    <div className="mt-8 p-6">
      <p className="mb-4">
        Username: <span className="font-bold">{player.username}</span>
      </p>
      <p className="mb-4">
        Clan: <span className="font-bold">{player.guildName}</span>
      </p>
    </div>
  );
}
