import React, { useState, useEffect } from 'react';
import { StyleSheet, Image, TouchableOpacity, View, Text, Button, Alert } from 'react-native';

const COLS = 10;
const ROWS = 20;
const BLOCK_SIZE = 25;
const EMPTY = 0;
const COLORS = ['yellow', 'purple', 'red', 'blue', 'orange', 'green', 'skyblue']
const SHAPES = [
    // I
    [
        [1, 1, 1, 1]
    ],
    // J
    [
        [2, 0, 0],
        [2, 2, 2]
    ],
    // L
    [
        [0, 0, 3],
        [3, 3, 3]
    ],
    // O
    [
        [4, 4],
        [4, 4]
    ],
    // S
    [
        [0, 5, 5],
        [5, 5, 0]
    ],
    // T
    [
        [0, 6, 0],
        [6, 6, 6]
    ],
    // Z
    [
        [7, 7, 0],
        [0, 7, 7]
    ]
];

//随机出来方块
const randomShape = () => {
    const shape = SHAPES[Math.floor(Math.random() * SHAPES.length)];
    return shape;
};
//创造空的游戏板
const createBoard = () => {
    let newBoard = [];
    for (let row = 0; row < ROWS; row++) {
        newBoard.push(new Array(COLS).fill(EMPTY));
    }
    return newBoard;
};
//消行
const clearLines = (board) => {
    let newBoard = board.filter(row => row.some(cell => cell === EMPTY));
    const linesClear = ROWS - newBoard.length;
    while (newBoard.length < ROWS) {
        newBoard.unshift(new Array(COLS).fill(EMPTY))
    }
    return { newBoard, linesClear };
};


const TetrisGame = () => {
    const [board, setBoard] = useState(createBoard());
    const [currentShape, setCurrentShape] = useState(randomShape());
    const [nextShape, setNextShape] = useState(randomShape())
    const [position, setPosition] = useState({ row: 0, col: 4 });
    const [gameOver, setGameOver] = useState(false);
    const [pause, setPause] = useState(false);
    const [score, setScore] = useState(0);

    useEffect(() => {
        if (gameOver) {
            Alert.alert('Game Over');
            return;
        }

        const interval = setInterval(() => {
            moveDown();
        }, 1000);

        return () => clearInterval(interval);
    }, [board, currentShape, position, gameOver, nextShape, pause]);

    //重新开始游戏
    const RestartGame = () => {
        setBoard(createBoard());
        setCurrentShape(randomShape());
        setNextShape(randomShape());
        setPosition({ row: 0, col: 4 });
        setGameOver(false);
        setPause(false);
        setScore(0);
    };

    //检测方块的碰撞
    const checkCollision = (shape, offset) => {
        for (let row = 0; row < shape.length; row++) {
            for (let col = 0; col < shape[row].length; col++) {
                if (shape[row][col] !== EMPTY &&
                    (board[row + position.row + offset.row] &&
                        board[row + position.row + offset.row][col + position.col + offset.col]) !== EMPTY) {
                    return true;
                }
            }
        }
        return false;
    };
    //让游戏方块合并
    const merge = () => {
        let newBoard = [...board];
        currentShape.forEach((row, y) => {
            row.forEach((value, x) => {
                if (value !== EMPTY) {
                    newBoard[y + position.row][x + position.col] = value;
                }
            });
        });
        return newBoard;
    };
    //向下移动
    const moveDown = () => {
        if (pause) return;

        if (!checkCollision(currentShape, { row: 1, col: 0 })) {
            setPosition({ ...position, row: position.row + 1 });
        } else {
            if (position.row === 0) {
                setGameOver(true);
            }
            const meragedBoard = merge();
            const { newBoard, linesClear } = clearLines(meragedBoard);
            if (linesClear > 0) {
                setScore(score + linesClear * 100);
            }
            setBoard(newBoard);
            setCurrentShape(nextShape);
            setNextShape(randomShape())
            setPosition({ row: 0, col: 4 });
        }
    };
    //向左移动
    const moveLeft = () => {
        if (pause) return;

        if (!checkCollision(currentShape, { row: 0, col: -1 })) {
            setPosition({ ...position, col: position.col - 1 });
        }
    };
    //向右移动
    const moveRight = () => {
        if (pause) return;

        if (!checkCollision(currentShape, { row: 0, col: 1 })) {
            setPosition({ ...position, col: position.col + 1 });
        }
    };
    //旋转方块
    const rotate = () => {
        if (pause) return;

        const rotatedShape = currentShape[0].map((_, index) =>
            currentShape.map(row => row[index]).reverse()
        );
        if (!checkCollision(rotatedShape, { row: 0, col: 0 })) {
            setCurrentShape(rotatedShape);
        }
    };
    const drop = () => {
        if (pause) return;

        let newRow = position.row;
        while (!checkCollision(currentShape, { row: newRow - position.row + 1, col: 0 })) {
            newRow++;
        }
        setPosition({ ...position, row: newRow });
    };

    return (
        <View style={styles.container}>
            <View style={styles.boardContainer}>
                <View style={styles.board}>
                    {board.map((row, rowIndex) => (
                        <View key={rowIndex} style={styles.row}>
                            {row.map((cell, colIndex) => (
                                <View
                                    key={colIndex}
                                    style={[
                                        styles.cell,
                                        { backgroundColor: cell === EMPTY ? 'white' : COLORS[cell - 1] }
                                    ]}
                                />
                            ))}
                        </View>
                    ))}
                    {currentShape.map((row, y) =>
                        row.map((value, x) =>
                            value !== EMPTY ? (
                                <View
                                    key={`shape-${x}-${y}`}
                                    style={[
                                        styles.cell,
                                        {
                                            position: 'absolute',
                                            top: (y + position.row) * BLOCK_SIZE,
                                            left: (x + position.col) * BLOCK_SIZE,
                                            backgroundColor: COLORS[value - 1]
                                        }
                                    ]}
                                />
                            ) : null
                        )
                    )}
                </View>
                <View style={styles.prviewshape}>
                    <Text style={styles.privewtitle}>NextShape:</Text>
                    <View style={styles.prview}>
                        {nextShape.map((row, y) =>
                            row.map((value, x) =>
                                value !== EMPTY ? (
                                    <View
                                        key={`next-${x}-${y}`}
                                        style={[
                                            styles.cell,
                                            {
                                                position: 'absolute',
                                                top: y * BLOCK_SIZE,
                                                left: x * BLOCK_SIZE,
                                                backgroundColor: COLORS[value - 1]
                                            }
                                        ]}
                                    />
                                ) : null
                            )
                        )}
                    </View>
                </View>
            </View>
            <View style={styles.scorecontainer}>
                <Text style={styles.scoretext}>Score:{score}</Text>
            </View>
            <View style={styles.controls}>
                <TouchableOpacity style={styles.buttonleftposition} onPress={moveLeft}>
                    <Image style={styles.img} source={require('../ran/img/Button.jpg')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonrightposition} onPress={moveRight}>
                    <Image style={styles.img} source={require('../ran/img/Button.jpg')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttondropposition} onPress={drop}>
                    <Image style={styles.img} source={require('../ran/img/Button.jpg')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonrorateposition} onPress={rotate}>
                    <Image style={styles.img} source={require('../ran/img/Button.jpg')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonRstart} onPress={RestartGame}>
                <Image style={styles.img} source={require('../ran/img/Button.jpg')} />
                </TouchableOpacity>
                <TouchableOpacity style={styles.buttonpauseposition} onPress={() => setPause(!pause)}>
                    <Text style={styles.pausetext}>{pause ? "Resume" : "pause"}</Text>
                </TouchableOpacity>
            </View>
        </View> 
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
    },
    boardContainer: {
        flexDirection: 'row',
    },
    board: {
        width: COLS * BLOCK_SIZE,
        height: ROWS * BLOCK_SIZE,
        position: 'relative',
        backgroundColor: 'red',
    },
    row: {
        flexDirection: 'row',
    },
    cell: {
        width: BLOCK_SIZE,
        height: BLOCK_SIZE,
        borderWidth: 1,
        borderColor: 'black',
    },
    prviewshape: {
        marginTop: 20,
        alignItems: 'left',
    },
    privewtitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    prview: {
        width: 4 * BLOCK_SIZE,
        height: 4 * BLOCK_SIZE,
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
    },
    scorecontainer: {
        marginTop: 20,
        alignItems: 'center'
    },
    scoretext: {
        fontSize: 20,
        fontWeight: 'bold'
    },
    controls: {
        marginTop: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '70%'
    },
    buttonleftposition: {
        position: 'absolute',

        left: -50

    },
    buttonrightposition: {

        left: 10
    },
    buttondropposition: {
        position: 'absolute',
        top: 50,
        left: -10
    },
    buttonrorateposition: {
        left: 95
    },
    buttonRstart: {
        right:-80,
    },
    buttonpauseposition: {

        top: 60,
        backgroundColor: 'white'
    },
    pausetext: {
        fontSize: 20,
        top: 20
    },

    img: {
        width: 50,
        height: 50,
        margin: 10,

    },
});

export default TetrisGame;