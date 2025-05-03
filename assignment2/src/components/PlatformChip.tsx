interface Props {
    platform: Platform
}

function PlatformChip({ platform }: Props){
    return (
        <a href="#" className="game-platform no-margin" key={platform.platformId}><i className="icon-add"/>{platform.name}</a>
    )
}

export default PlatformChip;