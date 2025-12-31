// 多人扫雷游戏扩展功能
// 修改原有的点击处理函数以支持多人游戏模式

// 保存原有的点击处理函数
var originalOt = null;
var originalRt = null;
var originalAt = null;
var originalLt = null;

// 初始化多人游戏扩展
function initMultiplayerExtension() {
    // 等待原函数加载完成
    setTimeout(function() {
        if (typeof ot !== 'undefined') {
            originalOt = ot;
            ot = multiplayerOt;
            console.log('ot函数已替换');
        }
        
        if (typeof rt !== 'undefined') {
            originalRt = rt;
            rt = multiplayerRt;
            console.log('rt函数已替换');
        }
        
        if (typeof at !== 'undefined') {
            originalAt = at;
            at = multiplayerAt;
            console.log('at函数已替换');
        }
        
        if (typeof lt !== 'undefined') {
            originalLt = lt;
            lt = multiplayerLt;
            console.log('lt函数已替换');
        }
    }, 1000);
}

// 多人模式的鼠标按下处理
function multiplayerOt(t) {
    if (gameMode === 2 && gameStarted) {
        // 多人模式下的处理
        if (players[currentPlayerIndex].eliminated) {
            return; // 当前玩家已出局，不能操作
        }
    }
    
    // 调用原有函数
    if (originalOt) {
        originalOt(t);
    }
}

// 多人模式的鼠标抬起处理
function multiplayerRt(t) {
    if (gameMode === 2 && gameStarted) {
        // 多人模式下的处理
        if (players[currentPlayerIndex].eliminated) {
            return; // 当前玩家已出局，不能操作
        }
        
        // 先调用原有函数处理游戏逻辑
        if (originalRt) {
            originalRt(t);
        }
        
        // 检查是否点击到雷
        var result = checkMineHit(t);
        if (result.hitMine) {
            handleMineHit();
        } else if (result.validMove) {
            // 每次有效操作后都切换到下一个玩家
            setTimeout(function() {
                if (gameMode === 2 && gameStarted) {
                    nextPlayer();
                }
            }, 800);
        }
    } else {
        // 单人模式，直接调用原有函数
        if (originalRt) {
            originalRt(t);
        }
    }
}

// 多人模式的触摸开始处理
function multiplayerAt(t) {
    if (gameMode === 2 && gameStarted) {
        // 多人模式下的处理
        if (players[currentPlayerIndex].eliminated) {
            return; // 当前玩家已出局，不能操作
        }
    }
    
    // 调用原有函数
    if (originalAt) {
        originalAt(t);
    }
}

// 多人模式的触摸结束处理
function multiplayerLt(t, e) {
    if (gameMode === 2 && gameStarted) {
        // 多人模式下的处理
        if (players[currentPlayerIndex].eliminated) {
            return; // 当前玩家已出局，不能操作
        }
        
        // 先调用原有函数处理游戏逻辑
        if (originalLt) {
            originalLt(t, e);
        }
        
        // 检查是否点击到雷
        var result = checkMineHitTouch(t, e);
        if (result.hitMine) {
            handleMineHit();
        } else if (result.validMove) {
            // 每次有效操作后都切换到下一个玩家
            setTimeout(function() {
                if (gameMode === 2 && gameStarted) {
                    nextPlayer();
                }
            }, 800);
        }
    } else {
        // 单人模式，直接调用原有函数
        if (originalLt) {
            originalLt(t, e);
        }
    }
}

// 检查鼠标点击是否踩雷
function checkMineHit(t) {
    try {
        var n = D.getBoundingClientRect();
        var e = Math.floor((t.clientX - n.left) / 25);
        var row = Math.floor((t.clientY - n.top) / 25);
        
        if (e < 0 || e == m || row < 0 || row == v) {
            return { hitMine: false, validMove: false };
        }
        
        var cell = d[row][e];
        var isMine = cell[0] === 2; // 是雷
        var isUnflagged = cell[1] === 0; // 未标记
        
        console.log('点击位置：', e, row);
        console.log('格子状态：', cell);
        console.log('是否踩雷：', isMine && isUnflagged);
        
        return { 
            hitMine: isMine && isUnflagged, // 未标记的雷
            validMove: true // 任何有效点击都算操作
        };
    } catch (err) {
        console.error('检查踩雷出错：', err);
        return { hitMine: false, validMove: false };
    }
}

// 检查触摸点击是否踩雷
function checkMineHitTouch(x, y) {
    try {
        if (x < 0 || x == m || y < 0 || y == v) {
            return { hitMine: false, validMove: false };
        }
        
        var cell = d[y][x];
        var isMine = cell[0] === 2; // 是雷
        var isUnflagged = cell[1] === 0; // 未标记
        
        console.log('触摸位置：', x, y);
        console.log('格子状态：', cell);
        console.log('是否踩雷：', isMine && isUnflagged);
        
        return { 
            hitMine: isMine && isUnflagged, // 未标记的雷
            validMove: true // 任何有效点击都算操作
        };
    } catch (err) {
        console.error('检查触摸踩雷出错：', err);
        return { hitMine: false, validMove: false };
    }
}

// 处理踩雷事件
function handleMineHit() {
    if (gameMode === 2 && gameStarted) {
        console.log('处理踩雷事件，当前玩家：', players[currentPlayerIndex].name);
        
        // 显示当前玩家踩雷的提示
        showMineHitNotification();
        
        // 立即标记玩家为出局状态
        var currentPlayer = players[currentPlayerIndex];
        currentPlayer.eliminated = true;
        eliminatedPlayers.push(currentPlayer);
        
        console.log('玩家已标记为出局，剩余玩家数：', players.filter(p => !p.eliminated).length);
        
        // 立即更新显示
        updatePlayerDisplay();
        updateGameStatus();
        
        // 延迟执行后续操作，让玩家看到踩雷效果
        setTimeout(function() {
            // 检查游戏是否结束
            var remainingPlayers = players.filter(p => !p.eliminated);
            if (remainingPlayers.length === 1) {
                // 游戏结束，只剩一个玩家
                alert('游戏结束！' + remainingPlayers[0].name + ' 获胜！');
                resetMultiGame();
            } else if (remainingPlayers.length === 0) {
                // 所有玩家都出局
                alert('游戏结束！没有获胜玩家。');
                resetMultiGame();
            } else {
                // 继续游戏，切换到下一个玩家
                nextPlayer();
            }
        }, 1500);
    }
}

// 显示踩雷提示
function showMineHitNotification() {
    var currentPlayer = players[currentPlayerIndex];
    var notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #f44336;
        color: white;
        padding: 1rem 2rem;
        border-radius: 8px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 9999;
        box-shadow: 0 4px 8px rgba(0,0,0,0.3);
    `;
    notification.innerHTML = '💣 ' + currentPlayer.name + ' 踩到雷了！';
    document.body.appendChild(notification);
    
    // 2秒后移除提示
    setTimeout(function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 2000);
}

// 显示当前玩家提示
function showCurrentPlayerNotification() {
    if (gameMode !== 2 || !gameStarted) return;
    
    var currentPlayer = players[currentPlayerIndex];
    var notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: ${currentPlayer.color};
        color: white;
        padding: 0.8rem 1.5rem;
        border-radius: 25px;
        font-size: 1.3rem;
        font-weight: bold;
        z-index: 9998;
        box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        animation: slideDown 0.5s ease-out;
    `;
    notification.innerHTML = '🎮 ' + currentPlayer.name + ' 请点击一个格子';
    document.body.appendChild(notification);
    
    // 添加动画样式
    if (!document.getElementById('notificationStyles')) {
        var style = document.createElement('style');
        style.id = 'notificationStyles';
        style.innerHTML = `
            @keyframes slideDown {
                from { transform: translateX(-50%) translateY(-100%); opacity: 0; }
                to { transform: translateX(-50%) translateY(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // 3秒后移除提示
    setTimeout(function() {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 3000);
}

// 重写nextPlayer函数，添加提示
var originalNextPlayer = nextPlayer;
nextPlayer = function() {
    if (originalNextPlayer) {
        originalNextPlayer();
        showCurrentPlayerNotification();
    }
};

// 重写_45函数，处理多人游戏的重新开始
var original_45 = null;
if (typeof _45 !== 'undefined') {
    original_45 = _45;
    _45 = multiplayer_45;
}

function multiplayer_45() {
    // 先调用原有的重新开始逻辑
    if (original_45) {
        original_45();
    }
    
    // 如果是多人模式且游戏已开始，减少一个玩家
    if (gameMode === 2 && gameStarted && players.length > 0) {
        console.log('多人游戏重新开始，减少一个玩家');
        
        // 如果还有未出局的玩家，移除当前玩家
        var remainingPlayers = players.filter(p => !p.eliminated);
        if (remainingPlayers.length > 0) {
            // 找到当前未出局的玩家
            var currentPlayer = players[currentPlayerIndex];
            if (!currentPlayer.eliminated) {
                // 标记当前玩家为出局
                currentPlayer.eliminated = true;
                eliminatedPlayers.push(currentPlayer);
                
                console.log('玩家 ' + currentPlayer.name + ' 已出局（点击笑脸）');
                
                // 如果只剩一个玩家，游戏结束
                var newRemainingPlayers = players.filter(p => !p.eliminated);
                if (newRemainingPlayers.length === 1) {
                    setTimeout(function() {
                        alert('游戏结束！' + newRemainingPlayers[0].name + ' 获胜！');
                        resetMultiGame();
                    }, 500);
                } else if (newRemainingPlayers.length === 0) {
                    // 所有玩家都出局
                    setTimeout(function() {
                        alert('游戏结束！没有获胜玩家。');
                        resetMultiGame();
                    }, 500);
                }
            }
        }
        
        // 重置当前玩家索引到第一个未出局的玩家
        var nextRemaining = players.filter(p => !p.eliminated);
        if (nextRemaining.length > 0) {
            for (var i = 0; i < players.length; i++) {
                if (!players[i].eliminated) {
                    currentPlayerIndex = i;
                    break;
                }
            }
        }
        
        // 更新显示
        updatePlayerDisplay();
        updateGameStatus();
        
        console.log('玩家数已减少，剩余玩家数：', players.filter(p => !p.eliminated).length);
    }
}

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(initMultiplayerExtension, 100);
    // 在控制台添加调试函数
    window.debugGameStatus = debugGameStatus;
});