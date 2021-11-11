import Cell from './cell.js'
import helper from './helper.js'
const arrowWrapper = document.querySelector('.arrow-wrapper')
class Game{
    constructor(opts){
        //options
        this.rowCount = opts.rowCount??12;
        this.colCount = opts.colCount??12;
        this.initialSize = opts.initialSize??3;

        this.grid = [];
        this.snakeIndexes = [];
        this.directions= [];
        this.foodIndex = null;


        //create grid
        this.createGride()

        //create snake
        this.createSnake()
        this.bindEvents()
        this.createFood()
    }
    createGride(){
        const gridSize = this.colCount * this.rowCount;
        const wrapper = document.getElementById('snake');
        const gridElement = wrapper.querySelector('.grid')

        gridElement.style.gridTemplateColumns = "1fr ".repeat(this.colCount);


        for(let i=0;i<gridSize;i++){
            this.grid[i] = new Cell();
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell')
            gridElement.appendChild(cellElement)
            this.grid[i].setIndex(i);
            this.grid[i].setElement(cellElement)
        }
    }
    createSnake(){
        const gridMiddle = parseInt((this.grid.length/2) - this.colCount/2);
        const initialDirection = 'RIGHT';
        for(let i=0;i<this.initialSize;i++){
            if(i===0){
                //this is head
                this.grid[gridMiddle].setSnake('Head',initialDirection);
                this.snakeIndexes.push(gridMiddle)
            }else if(i===this.initialSize-1){
                this.grid[gridMiddle - i].setSnake('Tail',initialDirection);
                this.snakeIndexes.push(gridMiddle-i)
            }else{
                this.grid[gridMiddle - i].setSnake('Body',initialDirection);
                this.snakeIndexes.push(gridMiddle-i)
            }
        }
    }
    bindEvents(){
        let direction = null;
        document.addEventListener('keydown',(e)=>{
            if(e.code==='ArrowUp'){
                direction = 'UP'
            }else if(e.code==='ArrowDown'){
                direction='DOWN'
            }
            else if(e.code==='ArrowRight'){
                direction='RIGHT'
            }
            else if(e.code==='ArrowLeft'){
                direction='LEFT'
            }
            if(direction!==null){
               this.directions[this.snakeIndexes[0]] = direction;
               //console.log(  this.directions)
            }
        })
        arrowWrapper.addEventListener('click',(e)=>{
            console.log(e.target.classList.value)
            if(e.target.classList.value==='arrow-left'){
                direction='LEFT'
            }
            else if(e.target.classList.value==='arrow-right'){
                direction='RIGHT'
            }
            else if(e.target.classList.value==='arrow-up'){
                direction='UP'
            }
            else if(e.target.classList.value==='arrow-down'){
                direction='DOWN'
            }
            if(direction!==null){
                this.directions[this.snakeIndexes[0]] = direction;
                //console.log(  this.directions)
             }
        })
    }
    createFood(){
        if(this.foodIndex !==null){
            this.grid[this.foodIndex].removeFood()
        }
        this.foodIndex = helper.randomInteger(0, this.grid.length, this.snakeIndexes)
        this.grid[this.foodIndex].addFood()
    }
    loop(){
        let foodEaten = false;
        let addTailIndex = -1;
        let addTailDirection = null;
        for(let i=0;i<this.snakeIndexes.length;i++){
            let _direction = null;
            const _snakeIndex = this.snakeIndexes[i]
            
            if(typeof this.directions[_snakeIndex] !=='undefined' && this.directions[_snakeIndex] !==null){
                _direction = this.directions[_snakeIndex]
            }else{
                _direction = this.grid[_snakeIndex].direction
            }

            const toIndex = helper.neighbor(_snakeIndex,_direction,this.colCount,this.rowCount)


            if(toIndex===false){
                alert('Game over!!out of grid')
                return false
            }
            if(this.grid[toIndex].isSnake){
                alert('Game over!! Collided')
                return false;
            }

            //eat food
            //only head can food
            if(i===0 &&this.foodIndex===toIndex){
                foodEaten = true
            }
            this.grid[_snakeIndex].reset()

            if(i===0){
                this.grid[toIndex].setSnake('Head',_direction)
            }else if(i===this.snakeIndexes.length-1 && foodEaten===false){
                this.grid[toIndex].setSnake('Tail',_direction)

                this.directions[_snakeIndex] = null
            }else{
                this.grid[toIndex].setSnake('Body',_direction)
            }

           if(foodEaten){
               addTailIndex = _snakeIndex;
               addTailDirection = _direction
           }
           this.snakeIndexes[i] = toIndex
        }

        //add food as tail
        if(foodEaten){
            this.grid[addTailIndex].setSnake('Tail',addTailDirection)
            this.snakeIndexes.push(addTailIndex)
            //and create new food
            this.createFood()
        }

       
    }
}
export default Game