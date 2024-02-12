let activePlayer = 'player-1'

window.onresize = function () {
    const cardTable = document.getElementById('card-table')
    const cardSection = document.getElementById('card-section')
    const playerSection = document.getElementById('player-section')

    if (window.innerWidth < window.innerHeight) {
        cardTable.classList.remove('vp-wide')
        cardTable.classList.add('vp-tall')
    }
    else {
        cardTable.classList.remove('vp-tall')
        cardTable.classList.add('vp-wide')
    }

    const cardMaxWidth = cardSection.clientWidth / 7 / 1.15
    const cardMaxHeight = cardSection.clientHeight / 2 / 1.15

    const rootStyle = document.querySelector(':root').style
    rootStyle.setProperty('--card-max-width', cardMaxWidth + 'px')
    rootStyle.setProperty('--card-max-height', cardMaxHeight + 'px')

    const chipMaxHeight = playerSection.clientHeight;

    rootStyle.setProperty('--chip-max-height', chipMaxHeight + 'px')

    rootStyle.setProperty('--player-1-color', 'darkblue')
    rootStyle.setProperty('--player-2-color', 'darkred')
    rootStyle.setProperty('--player-3-color', 'darkgreen')
    rootStyle.setProperty('--player-4-color', 'darkorange')

    const activeChip = document.getElementById(activePlayer + '-main-chip')
    rootStyle.setProperty('--small-chip-width', (activeChip.clientWidth / 2) + 'px')
}

window.onload = function () {
    window.onresize()
    for (const playerId of ['player-1', 'player-2', 'player-3', 'player-4']) {
        loadChipSVG(playerId)
    }
}

const suits = ['spades', 'hearts', 'diamonds', 'clubs']
const denominations = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']

const allCards = []
let availableCards = []

suits.forEach(suit => {
    denominations.forEach(denom => {
        const card = {suit: suit, denom: denom}
        allCards.push(card)
    });
});

availableCards = Array.from(allCards)

function changeDeckCount(newCount) {
    document.getElementById('deck-counter').innerHTML = newCount
}

function getRandomCardIndex() {
    return Math.floor(Math.random() * availableCards.length)
}

function drawWinnerCard() {
    const cardIndex = getRandomCardIndex()
    const card = availableCards[cardIndex]
    availableCards.splice(cardIndex, 1)
    
    const cardSrc = './images/cards/fronts/' + card.suit + '_' + card.denom + '.svg'

    document.getElementById('winner-card').src = cardSrc
}

function drawLoserCard() {
    const cardIndex = getRandomCardIndex()
    const card = availableCards[cardIndex]
    availableCards.splice(cardIndex, 1)

    const cardSrc = './images/cards/fronts/' + card.suit + '_' + card.denom + '.svg'

    document.getElementById('loser-card').src = cardSrc
}

function toggleSettings() {
    const exSettings = document.getElementById('expandable-settings')
    exSettings.toggleAttribute('hidden')

    const exSettingsLabel = document.getElementById('show-hide-settings-btn')
    if (exSettings.hasAttribute('hidden')) {
        exSettingsLabel.innerText = 'Show Settings'
    }
    else {
        exSettingsLabel.innerText = 'Hide Settings'
    }
}

function changeChipColor(chipSvgText, playerId) {
    const color = document.querySelector(':root').style.getPropertyValue('--' + playerId + '-color')

    const chipRoot = (new DOMParser()).parseFromString(chipSvgText, 'image/svg+xml').documentElement

    const chipSvgElement = chipRoot.querySelector('*')
    chipSvgElement.setAttribute('fill', color)

    const coloredChip = new XMLSerializer().serializeToString(chipRoot)

    return coloredChip
}

function loadChipSVG(playerId) {
    const chipTag = document.getElementById(playerId + '-main-chip');

    fetch(chipTag.src)
        .then(response => response.text())
        .then(chipSvgText => {
            const coloredChip = changeChipColor(chipSvgText, playerId);

            chipTag.src = 'data:image/svg+xml;base64,' + btoa(coloredChip);
        })
        .catch(error => {
            console.error('Error fetching SVG:', error);
        });
}

function changeActivePlayer(playerId) {
    const oldActivePlayerSection = document.getElementById(activePlayer)
    oldActivePlayerSection.classList.remove(activePlayer + '-active')

    const newActivePlayerSection = document.getElementById(playerId)
    newActivePlayerSection.classList.add(playerId + '-active')

    activePlayer = playerId
}

const allCardIds = [
    'card-spades-ace',
    'card-spades-2',
    'card-spades-3',
    'card-spades-4',
    'card-spades-5',
    'card-spades-6',
    'card-spades-7',
    'card-spades-8',
    'card-spades-9',
    'card-spades-10',
    'card-spades-jack',
    'card-spades-queen',
    'card-spades-king',
]
const betsByCard = {}
for (const cardId of allCardIds) {
    betsByCard[cardId] = {
        'player-1': {count: 0, coppered: false},
        'player-2': {count: 0, coppered: false},
        'player-3': {count: 0, coppered: false},
        'player-4': {count: 0, coppered: false}
    }
}

function getSmallChip() {
    const chipTag = document.getElementById(activePlayer + '-main-chip').cloneNode(true);
    chipTag.classList.remove('chip')
    chipTag.classList.add('small-chip')
    chipTag.removeAttribute('id')
    return chipTag
}

function positionSmallChipOnCard(cardId) {
    const cardContainer = document.getElementById('container-' + cardId)
    const smallChip = getSmallChip()
    smallChip.setAttribute('id', 'chip-' + cardId + '-' + activePlayer)
    const smallChipWidth = document.querySelector(':root').style.getPropertyValue('--small-chip-width')

    if (activePlayer == 'player-1') {
        smallChip.style.setProperty('left', '0px')
        smallChip.style.setProperty('bottom', smallChipWidth)
    }
    else if (activePlayer == 'player-2') {
        smallChip.style.setProperty('right', '0px')
        smallChip.style.setProperty('bottom', smallChipWidth)
    }
    else if (activePlayer == 'player-3') {
        smallChip.style.setProperty('left', '0px')
        smallChip.style.setProperty('bottom', '0px')
    }
    else if (activePlayer == 'player-4') {
        smallChip.style.setProperty('right', '0px')
        smallChip.style.setProperty('bottom', '0px')
    }

    cardContainer.innerHTML += smallChip.outerHTML
}

function betOnCard(cardId) {
    betsByCard[cardId][activePlayer].count += 1

    let smallChip = document.getElementById('chip-' + cardId + '-' + activePlayer)
    if (!(smallChip)) {
        positionSmallChipOnCard(cardId)
        smallChip = document.getElementById('chip-' + cardId + '-' + activePlayer)
    }
    
    smallChip.setAttribute('title', betsByCard[cardId][activePlayer].count)
}

function decBetOnCard(cardId) {
    const activeBet = betsByCard[cardId][activePlayer]

    if (activeBet.count == 0) {
        return
    }

    let smallChip = document.getElementById('chip-' + cardId + '-' + activePlayer)

    smallChip.setAttribute('title', --activeBet.count)

    if (activeBet.count == 0) {
        smallChip.remove()
    }
}

document.addEventListener('click', (event) => {
    for (const cardId of allCardIds) {
        if (cardId == event.target.id) {
            if (event.shiftKey) {
                decBetOnCard(cardId)
            }
            else {
                betOnCard(cardId)
            }
        }
    }
})

function toggleCopperBetOnCard(cardId) {
    betsByCard[cardId][activePlayer].coppered = !betsByCard[cardId][activePlayer].coppered
}