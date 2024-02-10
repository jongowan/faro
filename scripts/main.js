window.onload = function () {
    const cardTable = document.getElementById('card-table')
    const cardSection = document.getElementById('card-section')
    const leftCardSection = document.getElementById('left-card-section')
    const rightCardSection = document.getElementById('right-card-section')
    const dealerSection = document.getElementById('dealer-section')
    const cardFilesPrefix = './images/cards/fronts/'
    const cardFilesSuitNames = [
        'spades', 'hearts', 'clubs', 'diamonds'
    ]
    const cardFilesDenomNames = [
        'ace', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king'
    ]
    const cardFilesSuffix = '.svg'
    const cardFiles = []
    const tableCardFiles = []


    if (window.innerWidth < window.innerHeight) {
        cardTable.classList.add('vp-tall')
    }
    else {
        cardTable.classList.add('vp-wide')
    }

    window.onresize = function () {
        const cardMaxWidth = cardSection.clientWidth / 7 / 1.15
        const cardMaxHeight = cardSection.clientHeight / 2 / 1.15
    
        const rootStyle = document.querySelector(':root').style
        rootStyle.setProperty('--card-max-width', cardMaxWidth + 'px')
        rootStyle.setProperty('--card-max-height', cardMaxHeight + 'px')
    }
    window.onresize()

    // for (const cardTag of document.getElementsByClassName('playing-card')) {
    //     cardTag.style
    // }
}