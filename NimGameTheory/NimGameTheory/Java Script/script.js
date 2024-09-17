let rows=[1,3,5,7];           //array represents number of balls each row
let playerTurn =true;          //flag indicates whether it's human player turn
let depth = 2;                 //the default depth value is 2 if user didn't choose a certain level
let selectedRow = null;           //variable to keep track of the row that the player selects
let PcTurn = true;             //flag controls pc turn

//function for updating the visual presentation of the game board
function updateDisplay(){
    for(let i =0; i < rows.length; i++){                                               //loop through each row in rows array
        const row = document.getElementById(`row${i + 1}`);             //get the html element corresponding to the current row
        row.innerHTML="";                                                                     //remove content of the row
        for(let j = 0 ; j<rows[i]; j++){                                             //loop through each ball in the current row
            const ball=document.createElement("div");                //creat new div for the ball
            ball.className="ball";
            row.appendChild(ball);                                                           //placed new ball into row
        }
    }
}


//This function is called when the player clicks on a row
function playerMove(rowIndex) {
    if (playerTurn && (selectedRow === null || selectedRow === rowIndex) && rows[rowIndex] > 0) {
        rows[rowIndex]--;
        updateDisplay();
        checkWin("Player");
        selectedRow = rowIndex;
        PcTurn = true;
    }
}

//this function is called when its pcTurn which uses alpha beta algorithm to make the move
function AiMove() {

    if (PcTurn) {   //if pcTurn is clicked
        PcTurn = false;

        setTimeout(() => {

            let bestMove;                        //level1 Random move

                bestMove = getBestMove();
                const remainingRows = rows.filter((val) => val > 0);
                if (remainingRows.length === 1 && remainingRows[0] > 1) {
                    const rowIndex = rows.findIndex((val) => val > 1);
                    if (rowIndex !== -1) {
                        bestMove.newRows[rowIndex] = 1;

                        playerTurn = true;
                    }
                }

            rows = bestMove.newRows;
            updateDisplay();
            checkWin("AI");
            selectedRow = null;
            playerTurn = true;

        }, 500);
    }
}

function calculateNimSum(rows){
    let nimSum =0;
    for(const row of rows){
        nimSum ^= row;
    }
    return nimSum;
}


function getBestMove(){
    let maxEval = -Infinity;        // keep track of the maximum evaluation value found so far
    let bestMove = null;               //corresponding best move

    for (let i = 0; i < rows.length; i++){
        for (let ballsToRemove = 1; ballsToRemove <= rows[i]; ballsToRemove++){
            const newRows = [...rows]; // Create a copy of the current game state with the potential move
            newRows[i] -= ballsToRemove;

            const eval = alphaBeta(newRows, depth, -Infinity, Infinity, false); //evaluate the current move
            //console.log(ballsToRemove, eval);                                                                //using alpha beta

            if (eval > maxEval){         //updating best move
                maxEval = eval;
                bestMove = {rowIndex: i, newRows};
            }
        }
    }
    return bestMove;
}

function alphaBeta(rows, depth, alpha, beta,maximizingPlayer){
    const nimSum = calculateNimSum(rows);

    if(nimSum === 0){ //heuristic evaluation
        return maximizingPlayer? -depth : depth;       //if maximizing=true returns -depth otherwise depth closer to the root
    }
    if (depth === 0){                                 //which means we reached the depth limit
        return 0;
    }

    if(maximizingPlayer){
        let maxEval = -Infinity;

        for (let i = 0 ; i < rows.length; i++){
            for(let ballsToRemove = 1; ballsToRemove <= rows[i]; ballsToRemove++){
                const newRows = [...rows];
                newRows[i] -= ballsToRemove;
                const eval = alphaBeta (newRows , depth -1, alpha, beta, false );

                maxEval = Math.max(maxEval, eval); // Update the maximum evaluation and alpha
                alpha = Math.max(alpha, eval);

                if (beta <= alpha){
                    break;
                }
            }
        }
        return maxEval;   //final evaluation
    }else{
        let minEval = Infinity;                    //minimizing

        for (let i = 0; i<rows.length; i++){
            for (let ballsToRemove = 1; ballsToRemove <= rows[i]; ballsToRemove++){
                const newRows = [...rows];
                newRows[i] -= ballsToRemove;

                const eval = alphaBeta(newRows, depth - 1, alpha, beta, true);// Recursively call alphaBeta for the next level

                minEval = Math.min(minEval, eval); // Update the minimum evaluation and beta
                beta = Math.min(beta, eval);

                if (beta <= alpha) {
                    break; // Alpha cut-off
                }
            }
        }
        return minEval;
    }
}


// Function to check for a win
function checkWin(player) {
   // console.log(rows);
    let sum = 0;
    rows.forEach((val) => {   //calculate the sum of all values in rows
        sum += val;
    });

    if (sum === 0) {
        if (player === "AI") {
            alert("You Won!"); // Player wins if AI pulls the last ball
        } else {
            alert("You Lost!"); // Player looses if the player pulls the last ball
        }
        resetGame();

    } else if (sum === 2 && player === "AI") {
        const oneBallRow = rows.findIndex((val) => val === 1);
        const otherRow = rows.findIndex((val) => val >= 1);

        if (rows[oneBallRow] === 1 && rows[otherRow] >= 1) {
            rows[otherRow] = 0;
        }
        updateDisplay();
        playerTurn = true;
    }
}



// Function to reset the game and reset flags
function resetGame() {
    rows = [1,3, 5, 7];
    selectedRow = null;
    playerTurn = true;
    PcTurn = true;
    updateDisplay();
}


function setDepth(selectedDepth){
    depth = selectedDepth;
    alert('New level selected.');
    resetGame();
    if (!playerTurn){
        AiMove();
    }
}

//buttons actions
document.getElementById('br1').addEventListener('click', () => playerMove(0));
document.getElementById('br2').addEventListener('click', () => playerMove(1));
document.getElementById('br3').addEventListener('click', () => playerMove(2));
document.getElementById('br4').addEventListener('click', () => playerMove(3));
document.getElementById('pcTurn').addEventListener('click', AiMove);
document.getElementById('playAgain').addEventListener('click', resetGame);
document.getElementById('level1').addEventListener('click', () => setDepth(1));
document.getElementById('level2').addEventListener('click', () => setDepth(3));
document.getElementById('level3').addEventListener('click', () => setDepth(5));


updateDisplay();