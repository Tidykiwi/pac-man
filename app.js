document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    const scoreDisplay = document.getElementById('score')
    const width = 28 // 28 x 28 = 784 squares
    let score = 0
    let count = 0 // To keep track of total dots & pellets eaten - 238 (234 pacdots + 4 power pellets) = board cleared.
    let blinkyIsScared = false

    // Layout of grid and what is in the squares
    const layout = [
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,3,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,4,4,4,4,4,4,4,4,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,2,2,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        4,4,4,4,4,4,0,0,0,4,1,2,2,2,2,2,2,1,4,0,0,0,4,4,4,4,4,4,
        1,1,1,1,1,1,0,1,1,4,1,2,2,2,2,2,2,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,1,1,1,1,1,0,1,1,4,1,1,1,1,1,1,1,1,4,1,1,0,1,1,1,1,1,1,
        1,0,0,0,0,0,0,0,0,4,4,4,4,4,4,4,4,4,4,0,0,0,0,0,0,0,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,0,1,1,1,1,0,1,1,1,1,1,0,1,1,0,1,1,1,1,1,0,1,1,1,1,0,1,
        1,3,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,3,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,1,1,0,1,1,0,1,1,0,1,1,1,1,1,1,1,1,0,1,1,0,1,1,0,1,1,1,
        1,0,0,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,1,1,0,0,0,0,0,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,1,1,1,1,1,1,1,1,1,1,0,1,1,0,1,1,1,1,1,1,1,1,1,1,0,1,
        1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,
        1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1
    ]

    // 0 - pac-dots
    // 1 - wall
    // 2 - ghost-lair
    // 3 - power-pellet
    // 4 - empty

    const squares = []

    //draw the grid and render it
    function createBoard() {
        for (let i = 0; i < layout.length; i++) {
            const square = document.createElement('div')
            grid.appendChild(square)
            squares.push(square)

            // Add layout to the board
            if(layout[i] === 0) {
                squares[i].classList.add('pac-dot')
            } else if (layout[i] === 1) {
                squares[i].classList.add('wall')
            } else if (layout[i] === 2) {
                squares[i].classList.add('ghost-lair')
            } else if (layout[i] === 3) {
                squares[i].classList.add('power-pellet')
            }
        }
    }

    createBoard()

    // Starting position of pac-man
    let pacmanCurrentIndex = 490
    squares[pacmanCurrentIndex].classList.add('pac-man')

    // Move Pac-Man
    function movePacman(e) {
        squares[pacmanCurrentIndex].classList.remove('pac-man')

        switch(e.keyCode) {
            case 37: // left
                if(pacmanCurrentIndex % width !== 0 && !squares[pacmanCurrentIndex -1].classList.contains('wall') && 
                !squares[pacmanCurrentIndex -1].classList.contains('ghost-lair')) pacmanCurrentIndex -=1
                
                // Check if pacman is in the left exit
                if((pacmanCurrentIndex -1) === 363) {
                    pacmanCurrentIndex = 391
                }

                break
            case 38: // up
                if(pacmanCurrentIndex - width >= 0 && !squares[pacmanCurrentIndex -width].classList.contains('wall') &&
                !squares[pacmanCurrentIndex -width].classList.contains('ghost-lair')) pacmanCurrentIndex -=width
                break    
            case 39: // right
                if(pacmanCurrentIndex - width >= 0 && !squares[pacmanCurrentIndex +1].classList.contains('wall') &&
                !squares[pacmanCurrentIndex +1].classList.contains('ghost-lair')) pacmanCurrentIndex +=1
                
                // Check if pacman is in the right exit
                if((pacmanCurrentIndex +1) === 392) {
                    pacmanCurrentIndex = 364
                }
                
                break 
            case 40: // down
                if(pacmanCurrentIndex + width < width * width && !squares[pacmanCurrentIndex +width].classList.contains('wall') &&
                !squares[pacmanCurrentIndex +width].classList.contains('ghost-lair')) pacmanCurrentIndex +=width
                break
        }

        squares[pacmanCurrentIndex].classList.add('pac-man')

        pacDotEaten()
        powerPelletEaten()
        checkForGameOver()
        checkForWin()

    }

    document.addEventListener('keyup', movePacman)

    // What happens when Pac-Man eats a pac-dot
    function pacDotEaten() {
        if(squares[pacmanCurrentIndex].classList.contains('pac-dot')) {
            score++
            count++
            scoreDisplay.innerHTML = score
            squares[pacmanCurrentIndex].classList.remove('pac-dot')
        }
    }

    // What happens when Pac-Man eats a pellet
    function powerPelletEaten() {
        if(squares[pacmanCurrentIndex].classList.contains('power-pellet')) {
            score+=10
            count++
            blinkyIsScared = true
            ghosts.forEach(ghost => ghost.isScared = true)
            setTimeout(unScareGhosts, 10000)
            squares[pacmanCurrentIndex].classList.remove('power-pellet')
        }
    }

    // Unscare the ghosts
    function unScareGhosts() {
        blinkyIsScared = false
        ghosts.forEach(ghost => ghost.isScared = false)
    }

    // Create Ghost template
    class Ghost {
        constructor(className, startIndex, speed) {
            this.className = className
            this.startIndex = startIndex
            this.speed = speed
            this.currentIndex = startIndex
            this.timerId = NaN
            this.isScared = false
        }
    }    

    ghosts = [
        // new Ghost('blinky', 348, 250),
        new Ghost('pinky', 376, 400),
        new Ghost('inky', 351, 300),
        new Ghost('clyde', 379, 500)
    ]

    // Starting position of blinky
    let blinkyCurrentIndex = 30
    squares[blinkyCurrentIndex].classList.add('blinky')

    // Draw ghosts onto the grid
    ghosts.forEach(ghost => {
        squares[ghost.currentIndex].classList.add(ghost.className)
        squares[ghost.currentIndex].classList.add('ghost')
    })

    // Get X/Y coordinates of either Pac Man or Ghost
    function getCoordinates (index) {
        return [index % width, Math.floor(index / width)]
    }

    const intervalIds = []
    
    // Move the ghosts randomly
    ghosts.forEach(ghost => moveGhost(ghost))

    // Function that moves blinky using SMART MOVES
    function moveBlinky() {
        const directions = [-1, +1, width, -width]
        let blinkyTimerId = NaN
        let iAmStuck = 0

        blinkyTimerID = intervalIds.push(setInterval(function() {

            // Start with random direction to lessen LTR bias????
            for (let i = Math.floor(Math.random() * directions.length); i < directions.length; i++) {

                let direction = directions[i]

                // If the next square does not contain a wall or a ghost go there
                if (!squares[blinkyCurrentIndex + direction].classList.contains('wall') && 
                !squares[blinkyCurrentIndex + direction].classList.contains('ghost')) {

                    // Remove all ghost related classes
                    squares[blinkyCurrentIndex].classList.remove('blinky', 'scared-ghost')

                    // Check if the new space is closer
                    const [blinkyX, blinkyY] = getCoordinates(blinkyCurrentIndex)
                    const [pacmanX, pacmanY] = getCoordinates(pacmanCurrentIndex)
                    const [blinkyNewX, blinkyNewY] = getCoordinates(blinkyCurrentIndex + direction)

                    function isXCoordCloser () {
                        if ((blinkyNewX - pacmanX) > (blinkyX - pacmanX)) {
                            return true
                        } else return false
                    }

                    function isYCoordCloser () {
                        if ((blinkyNewY - pacmanY) > (blinkyY - pacmanY)) {
                            return true
                        } else return false
                    } 

                    if (isXCoordCloser() || isYCoordCloser()) {
                        blinkyCurrentIndex += direction
                        squares[blinkyCurrentIndex].classList.add('blinky')
                        console.log('Actual direction taken', direction)
                    } else if (!isXCoordCloser() && !isYCoordCloser()) {
                        squares[blinkyCurrentIndex].classList.add('blinky')
                        iAmStuck++
                        checkForGameOver()                        
                        continue          
                    } 

                // Else find a new direction to try
                } else continue //direction = directions[Math.floor(Math.random() * directions.length)]
            }

            // If Blinky gets stuck in a corner
            if (iAmStuck > 75) {
                iAmStuck = 0
                squares[blinkyCurrentIndex].classList.remove('blinky', 'scared-ghost')
                blinkyCurrentIndex = 30
                squares[blinkyCurrentIndex].classList.add('blinky')
            }

            // Check if blinky is in the left exit
            if((blinkyCurrentIndex -1) === 363) {
                squares[blinkyCurrentIndex].classList.remove('blinky', 'scared-ghost')
                blinkyCurrentIndex = 391
                squares[blinkyCurrentIndex].classList.add('blinky')

            }

            // Check if blinky is in the right exit
            if((blinkyCurrentIndex +1) === 392) {
                squares[blinkyCurrentIndex].classList.remove('blinky', 'scared-ghost')
                blinkyCurrentIndex = 364
                squares[blinkyCurrentIndex].classList.add('blinky')
            }

            // If the ghost is currently scared
            if (blinkyIsScared) {
                squares[blinkyCurrentIndex].classList.add('scared-ghost')
            }

             checkForGameOver()

            // If the ghost is scared and collides with Pac-Man
            if(blinkyIsScared && squares[blinkyCurrentIndex].classList.contains('pac-man')) {
                squares[blinkyCurrentIndex].classList.remove('blinky', 'scared-ghost')
                blinkyCurrentIndex = 348
                score +=100
                squares[blinkyCurrentIndex].classList.add('blinky')
            }

        }, 250))
    }

    moveBlinky()

    // Write the function to move the ghosts
    function moveGhost(ghost) {
        const directions = [-1, +1, width, -width]
        let direction = directions[Math.floor(Math.random() * directions.length)]

        ghost.timerId = intervalIds.push(setInterval(function() {
            // If the next square does not contain a wall or a ghost (or blinky) go there
            if (!squares[ghost.currentIndex + direction].classList.contains('wall') && 
            !squares[ghost.currentIndex + direction].classList.contains('ghost') && 
            !squares[ghost.currentIndex + direction].classList.contains('blinky')) {
                // You can go here
                // Remove all ghost related classes
                squares[ghost.currentIndex].classList.remove(ghost.className)
                squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost')

                // Change the currentIndex to the new safe square
                ghost.currentIndex += direction

                // Redraw the ghost in the new safe space
                squares[ghost.currentIndex].classList.add(ghost.className)
                squares[ghost.currentIndex].classList.add('ghost')         
            
            // Else find a new direction to try
            } else direction = directions[Math.floor(Math.random() * directions.length)]

            // Check if ghost is in the left exit
            if((ghost.currentIndex -1) === 363) {
                squares[ghost.currentIndex].classList.remove('blinky', 'scared-ghost')
                ghost.currentIndex = 391
                squares[ghost.currentIndex].classList.add('blinky')
            }

            // Check if ghost is in the right exit
            if((ghost.currentIndex +1) === 392) {
                squares[ghost.currentIndex].classList.remove('blinky', 'scared-ghost')
                ghost.currentIndex = 364
                squares[ghost.currentIndex].classList.add('blinky')
            }

            // If the ghost is currently scared
            if (ghost.isScared) {
                squares[ghost.currentIndex].classList.add('scared-ghost')
            }

            checkForGameOver()

            // If the ghost is scared and collides with Pac-Man
            if(ghost.isScared && squares[ghost.currentIndex].classList.contains('pac-man')) {
                squares[ghost.currentIndex].classList.remove(ghost.className, 'ghost', 'scared-ghost')
                ghost.currentIndex = ghost.startIndex
                score +=100
                squares[ghost.currentIndex].classList.add(ghost.className, 'ghost')
            }
        }, ghost.speed))
    }

    //Check for game over
    function checkForGameOver() {
        if (squares[pacmanCurrentIndex].classList.contains('ghost') &&  
        !squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
            // ghosts.forEach(ghost => clearInterval(ghost.timerId))
            for (let i = 0; i < intervalIds.length; i++) {
                clearInterval(intervalIds[i]);
            }
            document.removeEventListener('keyup', movePacman)
            scoreDisplay.innerHTML = 'GAME OVER'
        } else if (squares[pacmanCurrentIndex].classList.contains('blinky') &&  
        !squares[pacmanCurrentIndex].classList.contains('scared-ghost')) {
            for (let i = 0; i < intervalIds.length; i++) {
                clearInterval(intervalIds[i]);
            }
            document.removeEventListener('keyup', movePacman)
            scoreDisplay.innerHTML = 'GAME OVER'
        }
    }

    // Check for a win
    function checkForWin() {
        if (count == 238) { // 234 pacdots + 4 power pellets
            ghosts.forEach(ghost => clearInterval(ghost.timerId))
            document.removeEventListener('keyup', movePacman)
            scoreDisplay.innerHTML = 'YOU WON!'
        }
    }

})