import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Confetti from 'react-confetti';
import {Button} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.css'



function copyObject(obj) {
  return Object.assign({}, obj);
}
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

class Board extends Component {

  constructor(props) {
    super(props);
    const size = 5;
    const midpoint = (size * size - 1)/ 2;
    const values = [
      "(child noises in the background)",
      "Hello, hello?",
      "i need to jump in another call",
      "can everyone go on mute",
      "could you please get closer to the mic",
      "(Load painful echo/feedback)",
      "Next slide, please.",
      "We can take this offline?",
      "is ______on call?",
      "could you share the slides afterwards?",
      "Can somebody grant presenter rights?",
      "Can you email that to everyone?",
      "sorry, I had problems logging in",
      "(animal noises in the background)",
      "sorry, i didn't find the conference id",
      "I was having connection issues",
      "I'll have to get back to you",
      "Who just joined?",
      "sorry,something ____with my calender",
      "do you see my screen?",
      "lets wait for ____?",
      "You will send the minutes?",
      "sorry i was on mute.",
      "can you repeat, please?",
      "You are not audible"
    ];


    this.state = {
      activeCell: 0,
      activeRow: 0,
      activeCol: 0,
      endTime: 0,
      grid: this.generateRandomGrid(values, size),
      midpoint: midpoint,
      selection: {[midpoint]: true},
      size: size,
      startTime: Date.now(),
      values: values,
      width: null,
      height: null,
      show: false
    };
    //this.handleKeyDown = this.handleKeyDown.bind(this);
    this.refreshBoard = this.refreshBoard.bind(this);
  }

/**
   * Randomize array values and return
   * a grid with dimensions size * size
   */

generateRandomGrid(values, size) {
    const randomizedValues = shuffleArray(values);

    let grid = [];
    for (let row = 0; row < size; row++) {
      grid[row] = [];
      for (let col = 0; col < size; col++) {
        let id = col + (row * size);
        if(col===2 && row===2){
          grid[row][col] = {
            value: "CONF CALL BINGO",
            id: id
          }
        } else {
          grid[row][col] = {
            value: randomizedValues[id],
            id: id
          }
        }
      }
    }
    return grid;
  }

  /**
   * Randomize cell values, reset timer, and clear selection.
   */
  refreshBoard() {
    this.setState({
      activeCell: 0,
      activeRow: 0,
      activeCol: 0,
      bingo: false,
      grid: this.generateRandomGrid(this.state.values, this.state.size),
      leaderboardSubmitted: false,
      selection: {[this.state.midpoint]: true},
      startTime: Date.now(),
      endTime: 0
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.startTime === this.state.startTime) {
      // focus active cell
      if (prevState.activeCell !== this.state.activeCell) {
        document.getElementById(this.props.id + '-cell-' + this.state.activeCell).focus();
      }

      // check for bingo if there is a selection change
      if (prevState.selection !== this.state.selection) {
        console.clear();
        console.log('Checking for bingo...');
        if (
          this.checkRow(this.state.activeRow) ||
          this.checkCol(this.state.activeCol) ||
          this.checkDiagonalA(this.state.activeRow, this.state.activeCol) ||
          this.checkDiagonalB(this.state.activeRow, this.state.activeCol)
        ) {
          if (!this.state.bingo) {
            this.setState({
              bingo: true,
            });
          }
        } else {
          this.setState({bingo: false});
        }
      }
    }
  }

  checkIndices(indices) {
    for (let i = 0; i < indices.length; i++) {
      let index = indices[i];
      if (!this.state.selection[index]) {
        return false;
      }
    }
    return true;
  }

  checkRow(row) {
    const size = this.state.size;
    const rowStart = row * size;
    for (let i = rowStart; i < rowStart + size; i++) {
      if (!this.state.selection[i]) {
        //console.log('- Bingo in row ' + row + '? Fail at cell ' + i);
        return false;
      }
    }
    //console.log('- Bingo in row ' + row + '? Success!');
    return true;
  }

  checkCol(col) {
    const size = this.state.size;
    for (let j = col; j < size * size; j+= size) {
      if (!this.state.selection[j]) {
        //console.log('- Bingo in col ' + col + '? Fail at cell ' + j);
        return false;
      }
    }
    //console.log('- Bingo in col ' + col + '? Success!');
    return true;
  }

  /* top left to bottom right */
  checkDiagonalA(row, col) {
    const size = this.state.size;
    if (row === col) {
      for (let i = 0; i < size; i++) {
        if (!this.state.selection[size * i + i]) {
          //console.log('- Bingo in diagonal A? Fail at cell ' + (size * i + i));
          return false;
        }
      }
      //console.log('- Bingo in diagonal A? Success!');
      return true;
    }
  }

  checkDiagonalB(row, col) {
    const size = this.state.size;
    if (row === (size - col - 1)) {
      for (let i = 0; i < size; i++) {
        if (!this.state.selection[size * i + size - i - 1]) {
          //console.log('- Bingo in diagonal B? Fail at cell ' + (size * i + size - i - 1));
          return false;
        }
      }
      //console.log('- Bingo in diagonal B? Success!')
      return true;
    }
  }

  setActiveCell(row, col) {
    this.setState({activeCell: this.state.grid[row][col].id});
  }

  renderMidpointCell(cellId, row, col) {
    return (
      <td role='gridcell' key={cellId}>
        <div className='cell-contents'>
          <button
            aria-disabled={true}
            aria-pressed={true}
            className='cell-toggle'
            id={this.props.id + '-cell-' + cellId}
            onClick={() => {this.setState({activeCell : cellId});}}
            tabIndex={cellId === this.state.activeCell ? '0' : '-1'}
          >
            CONF CALL BINGO
          </button>
        </div>
      </td>
    );
  }

  renderCell(cell, row, col) {
    const isMidpoint = cell.id === this.state.midpoint;
    const selected = this.state.selection[cell.id] || isMidpoint;

    if (isMidpoint) { return this.renderMidpointCell(cell.id, row, col); }

    return (
      <td role='gridcell' key={cell.id}>
        <div className='cell-contents'>
          <button
            aria-pressed={selected}
            className='cell-toggle'
            id={this.props.id + '-cell-' + cell.id}
            onClick={() => {
              let selection = copyObject(this.state.selection);
              selection[cell.id] = !selected;

              this.setState({
                selection: selection,
                activeCell: cell.id,
                activeRow: row,
                activeCol: col
              });
            }}
            tabIndex={cell.id === this.state.activeCell ? '0' : '-1'}
          >
            {cell.value}
          </button>
        </div>
      </td>
    );
  }

  renderRow(row, y) {
    return (
      <tr role='row' key={y}>
        {row.map((cell, x) => { return this.renderCell(cell, y, x); })}
      </tr>
    );
  }

  renderSuccess() {
    if (this.state.bingo) {
      return (
          <Confetti
              numberOfPieces={800}
              recycle={false}
          />
      )
    }
    return null;
  }

  render() {
    return (
      <div className="container">
        <div>
        <h1> Bingo </h1>
        <Button variant="primary" onClick={this.refreshBoard} color="primary" >Shuffle Tiles</Button>

          </div>
          <table role='grid' className=''>
            <tbody role='rowgroup'>
              {this.state.grid.map((row, y) => { return (this.renderRow(row, y))})}
            </tbody>
          </table>
          {this.renderSuccess()}
      </div>
      
    );
  }
}

Board.propTypes = {
  size: PropTypes.number,
  values: PropTypes.array
}

Board.defaultProps = {
  size: 5,
  values: 'abcdefghijklmnopqrstuv'.split('')
}

export default Board;
