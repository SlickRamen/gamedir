interface Props {
    platform: Platform
}

function PlatformChip({ platform }: Props){
    let iconSuff = "pc";

    if (platform.name == "Mobile") {
        iconSuff = "mobile"
    } else if (platform.name == "Playstation 5") {
        iconSuff = "ps5"
    } else if (platform.name == "Xbox") {
        iconSuff = "xbox"
    } else if (platform.name == "Nintendo Switch") {
        iconSuff = "switch"
    }

    return (
        <span className="game-platform no-margin" key={platform.platformId}><i className={"icon-" + iconSuff}/>{platform.name}</span>
    )
}

export default PlatformChip;