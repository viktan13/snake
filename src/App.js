import './App.css';
import {useEffect, useState} from "react";
import 'bootstrap/dist/css/bootstrap.css'
import useInterval from 'use-interval'


const initialSnake = [
    {
        ri: 17,
        ci: 11
    },
    {
        ri: 18,
        ci: 11
    },
    {
        ri: 19,
        ci: 11
    },
]

const levels = [
    {
        number: '1',
        interval: 500
    },
    {
        number: '2',
        interval: 400
    },
    {
        number: '3',
        interval: 300
    },
    {
        number: '4',
        interval: 250
    },
    {
        number: '5',
        interval: 200
    },

]


function randomNumber(min, max) {
    return Math.round(Math.random() * (max - min) + min);
}

function App() {

    const [fieldSize, setFieldSize] = useState(21)
    const initialFields = Array(fieldSize).fill(Array.from(Array(fieldSize).fill('')));
    const [fields, setFields] = useState(initialFields);
    const [snake, setSnake] = useState(initialSnake);
    const [apple, setApple] = useState({ri: randomNumber(0, fieldSize - 1), ci: randomNumber(0, fieldSize - 1)});
    const [direction, setDirection] = useState('up');
    const [start, setStart] = useState(false);
    const [level, setLevel] = useState('1');
    const [interval, setInterval] = useState(levels.find(el => el.number === level).interval);


    useInterval(() => {
        arrowButtonsHandler(direction);
        changeFrame();
    }, start ? interval : null)

    useEffect(() => {
        document.addEventListener('keydown', detectKeyDown, true);
    }, []);

    const detectKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowUp':
                setDirection('up');
                break;

            case 'ArrowRight':
                setDirection('right');
                break;

            case 'ArrowDown':
                setDirection('down');
                break;

            case 'ArrowLeft':
                setDirection('left');
                break;

            default:
        }
    }
    const startStopGame = () => {
        const newInterval = !start;
        setStart(newInterval);
    }

    let ri;
    let ci;
    const arrowButtonsHandler = (direction) => {
        switch (direction) {
            case 'up':
                ri = snake[0].ri === 0 ? fieldSize - 1 : snake[0].ri - 1;
                ci = snake[0].ci;
                snake.unshift({ri, ci});
                if (ri !== apple.ri || ci !== apple.ci) snake.pop();
                else setApple({ri: randomNumber(0, 9), ci: randomNumber(0, 9)})
                setSnake([...snake]);
                break;

            case 'down':
                ri = snake[0].ri === fieldSize - 1 ? 0 : snake[0].ri + 1;
                ci = snake[0].ci;
                snake.unshift({ri, ci});
                if (snake[0].ri !== apple.ri || snake[0].ci !== apple.ci) snake.pop();
                else setApple({ri: randomNumber(0, 9), ci: randomNumber(0, 9)})
                setSnake([...snake]);
                break;

            case 'right':
                ri = snake[0].ri;
                ci = snake[0].ci === fieldSize - 1 ? 0 : snake[0].ci + 1;
                snake.unshift({ri, ci});
                if (snake[0].ri !== apple.ri || snake[0].ci !== apple.ci) snake.pop();
                else setApple({ri: randomNumber(0, 9), ci: randomNumber(0, 9)})
                setSnake([...snake]);
                break;

            case 'left':
                ri = snake[0].ri;
                ci = snake[0].ci === 0 ? fieldSize - 1 : snake[0].ci - 1;
                snake.unshift({ri, ci});
                if (snake[0].ri !== apple.ri || snake[0].ci !== apple.ci) snake.pop();
                else setApple({ri: randomNumber(0, 9), ci: randomNumber(0, 9)})
                setSnake([...snake]);
                break;

            default:
        }
    }

    function changeFrame() {
        const newFields = fields.map((r, ri) => r.map((c, ci) => {
            for (let i = 0; i < snake.length; i++) {
                if (snake[i].ri === ri && snake[i].ci === ci) return 'X';
            }
        }));
        newFields[apple.ri][apple.ci] = '🍎';
        setFields(newFields);
    }

    function changeLevel(e) {
        setLevel(e.target.value);
        const newInterval = levels.find(el => el.number === e.target.value).interval;
        setInterval(newInterval)
    }

    function changeFieldSize(e) {
        setFieldSize(+e.target.value);
        const newFields = Array(+e.target.value).fill(Array.from(Array(+e.target.value).fill('')));
        setFields(newFields);
    }

    return (
        <div className="App">
            <h1 className="m-4">Snake</h1>
            <div className="row">
                <div className="col">
                    <div className="row">
                        <div className="input-group mb-3 w-25 ms-5 col">
                            <span className="input-group-text" id="basic-addon1">Level</span>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                className="form-control"
                                aria-describedby="basic-addon1"
                                value={level}
                                onChange={changeLevel}
                            />
                        </div>
                        <div className="input-group mb-3 w-25 ms-5 col">
                            <span className="input-group-text" id="basic-addon1">Field Size</span>
                            <input
                                type="number"
                                min="10"
                                max="50"
                                className="form-control"
                                aria-describedby="basic-addon1"
                                value={fieldSize}
                                onChange={changeFieldSize}
                            />
                        </div>
                    </div>
                    {fields.map((row, ri) => (
                        <div className="d-flex justify-content-end ">
                            {row.map((cell, ci) => (
                                <div className={`d-flex justify-content-center align-items-center ${cell === 'X' ? 'bg-success text-success' : 'bg-info-subtle'}`}
                                     style={{width: '25px', height: '25px'}}>
                                    {cell}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
                <div className="col">
                    <button
                        className={start ? `btn btn-outline-danger` : 'btn btn-outline-primary'}
                        onClick={startStopGame}
                    >{start ? 'Stop' : 'Start'}
                    </button>
                    <div className="mt-5">
                        <button
                            className="btn btn-info"
                            onClick={() => setDirection('up')}
                        >↑
                        </button>
                        <div>
                            <button className="btn btn-info" onClick={() => setDirection('left')}>←</button>
                            <button className="btn btn-info" onClick={() => setDirection('down')}>↓</button>
                            <button className="btn btn-info" onClick={() => setDirection('right')}>→</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default App;
