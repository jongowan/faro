const cardTable = document.getElementById('card-table')
const cardSection = document.getElementById('card-section')
const dealerSection = document.getElementById('dealer-section')
const cardFilesPrefix = './images/cards/fronts/'
const cardFilesSuitNames = [
    'spades_', 'hearts_', 'clubs_', 'diamonds_'
]
const cardFilesDenomNames = [
    '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace'
]
const cardFilesSuffix = '.svg'
const cardFiles = []
const tableCardFiles = []
const cardSeparationRatio = 0.05

function getCardImgTag(suit, denom) {
    const file = cardFilesPrefix + suit + denom + cardFilesSuffix
    return '<img src="' + file + '" class="playing-card" alt="' + file + '">'
}


if (window.innerWidth < window.innerHeight) {
    cardTable.classList.add('vp-tall')
}
else {
    cardTable.classList.add('vp-wide')
}

for (let i = 0; i < cardFilesSuitNames.length; i++) {
    const suit = cardFilesSuitNames[i]
    for (let j = 0; j < cardFilesDenomNames.length; j++) {
        const denom = cardFilesDenomNames[j]
        const cardFile = getCardImgTag(suit, denom)

        if (i == 0) {
            tableCardFiles.push(cardFile)
        }

        cardFiles.push(cardFile)
    }
}
console.log(cardFiles)
console.log(tableCardFiles)
