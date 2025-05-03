interface Props {
    platform: Platform
}

function PlatformChip({ platform }: Props){
    return (
        <span className="game-platform no-margin" key={platform.platformId}><i className="icon-add"/>{platform.name}</span>
    )
}

export default PlatformChip;