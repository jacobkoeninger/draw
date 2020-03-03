const util = require('util');
const setTimeoutPromise = util.promisify(setTimeout);
import { Socket } from "dgram";

var io;

let games: Array<Game> = [];

interface User {
    room: string;
    nickname: string;
    id: string;
    points: number;
};

enum NOTIFICATION {
    WARNING     = 'warning',
    INFO        = 'info',
    ERROR       = 'error',
    SUCCESS     = 'success'
}

function notifySocket(type: NOTIFICATION, message: string, description: string, socketId: string): void {
    io.to(socketId).emit('notification', {
        type: type,
        message: message,
        description: description
    });
}
function notifyRoom(type: NOTIFICATION, message: string, description: string, roomId: string): void {
    io.in(roomId).emit('notification', {
        type: type,
        message: message,
        description: description
    });
}

enum STATUS {
    ACTIVE  = "active",
    LOBBY   = "lobby",
    ENDED   = "ended" 
}

export class Game {
    public room: string;
    public isPrivate: boolean;
    public timer;
    public host: User;
    public status: STATUS;
    public round_length: number; // in ms
    public max_rounds: number;
    public max_players: number;
    public players: Array<User>;
    public words: Array<string>;
    public words_used: Array<string>;
    public correct_players: Array<User>;
    public current_round: number;
    public current_artist: User;
    public current_word: string;
    public player_turns: Array<User>;
    public kicked_players: Array<User>;

    constructor(host: User, room: string, words: Array<string>, max_rounds: number, max_players: number, round_length: number, isPrivate: boolean){
        this.status = STATUS.LOBBY;
        this.isPrivate = isPrivate;
        this.host = host;
        this.room = room;
        this.round_length = round_length * 1000;
        this.max_players = max_players;
        this.players = [];
        this.words = words;
        this.words_used = [];
        this.max_rounds = max_rounds;
        this.current_round = 0;
        this.kicked_players = [];
        this.lobby();
    }   
    
    lobby = () => {
        console.log('Private: ' + this.isPrivate);
    }

    startGame = () => {
        console.log('Starting game: ' + this.room);

        this.players.forEach((player) => player.points = 0);

        if (this.status === STATUS.ACTIVE) {
            
            notifySocket(NOTIFICATION.ERROR, "Game is already active", "", this.host.id);            

            return;
        }
        if (this.players.length < 2) {            

            notifySocket(NOTIFICATION.ERROR, 'Unable to start game', 'Not enough players. At least 2 players needed', this.host.id);

            return;
        }

        this.player_turns = (() => {
            const players = this.players;            
            return players.sort(() => Math.random() - 0.5);
        })();
        
        this.status = STATUS.ACTIVE;
        this.startRound();
    }

    updateCorrectPlayers = (player: User) => {        
        this.correct_players.push(player);
        const guesser_award = Math.floor(100 / this.correct_players.length);
        console.log(guesser_award);
        player.points += guesser_award;
        notifySocket(NOTIFICATION.SUCCESS, `You've received ${guesser_award.toString()} points!`, "", player.id);

        if(this.correct_players.length == this.players.length - 1){
            //this.endRound();
            
            //? FIXME: cancel timer so that the rounds ends immediately when all users guessed correctly before the timer ran out 
            //this.timer.cancel(); 
            
            clearTimeout(this.timer); // doesn't work

        }
        
        this.updateClients();

    }

    endRound() {

        this.correct_players.forEach((player) => {
            io.in(this.room).emit('receive message', {
                message: `${player.nickname} - ${player.points}`,
                nickname: "[Game]"
            });
        });

        console.log('Round has ended');
        
        this.startRound();

    }

    startRound = async () => {

        if(this.status === STATUS.ACTIVE){
            this.clearBoards();
            this.updateCurrentRound();
            this.updateArtist();
            this.updateWord();
            this.correct_players = [];

            this.updateClients();
    
            console.log('Starting round: ' + this.current_round);

            io.in(this.room).emit('round started', this.round_length);

            this.timer = await new Promise(resolve => setTimeout(resolve, this.round_length)); // sleep 

            this.endRound();
        }

    }

    updateCurrentRound() {
       
       if((this.current_round + 1) > this.max_rounds){
           this.endGame();
        } else {
            this.current_round = this.current_round + 1;            
       }
        
    }

    updateWord() {
        
        this.current_word = this.words[Math.floor(Math.random() * this.words.length)]; 
    }

    updateArtist(){
        if(this.current_artist){
            const currentArtistIndex = this.player_turns.indexOf(this.current_artist);
            if(this.player_turns[currentArtistIndex + 1]){
                this.current_artist = this.player_turns[currentArtistIndex + 1];
            } else {
                this.current_artist = this.player_turns[0];
            }
        } else {
            this.current_artist = this.player_turns[0];
        }

        notifySocket(NOTIFICATION.INFO, "It's your turn to draw!", "", this.current_artist.id);
    }

    endGame() {    
        console.log('Game has ended');
        this.status = STATUS.ENDED;
        this.players.forEach((player) => notifySocket(NOTIFICATION.INFO, 'Game over!', 'The game has ended. Returning home.', player.id));
        this.updateClients();

        // Remove game from games array
        games.splice(games.indexOf(this), 1);
        io.emit('active games', games.length);
    }

    clearBoards() {
        io.in(this.room).emit('clear boards');
    }

    updateHost = () => {
        this.host = this.players[Math.floor(Math.random() * this.players.length)];
        notifySocket(NOTIFICATION.INFO, 'You are now the host!', 'You have been made the new host, as the previous host disconnect', this.host.id);
    }

    kickPlayer = (id: string) => {        
        
        const player = this.players.find((p: User) => p.id === id);

        if(!player) {
            console.log('Player being kicked is not found');
            return;
        }

        if(this.host.id === player.id) {
            this.updateHost();
        }

        if(this.current_artist && (this.current_artist.id === id)) {
            notifyRoom(NOTIFICATION.INFO, 'Round ended', 'Artist disconnected', this.room);
            this.endRound();
        }

        this.players = this.players.filter((player) => {
            if(player.id !== id) {
                return true;
            }
            return false;
        });

        io.sockets.connected[id].leave();

        io.to(id).emit('player kicked');

        this.updateClients();
    }


    updateClients() {
        io.in(this.room).emit('game info', {
            current_artist: this.current_artist,
            current_round: this.current_round,
            host: this.host,
            max_players: this.max_players,
            max_rounds: this.max_rounds,
            player_turns: this.player_turns,
            players: this.players,
            room: this.room,
            round_length: this.round_length,
            status: this.status,
            correct_players: this.correct_players
        });
    }

}

export default function SiteLogic(server) {

    io = require('socket.io')(server);

    let onlineUsers = [];

    /**
     * Finds game using room id
     * Joins user to the game room.
     * Updates the game's players with the new player (user)
     * @param user 
     * @param game 
     * @param socket 
     */
    const joinGame = (user: User, room: string, socket) => {
        const game = findGameByRoomId(room);

        if(!game) {
            notifySocket(NOTIFICATION.ERROR, 'Unable to join game', `Game not found with id "${room}".`, socket.id);
            return;
        }
        
        if(game.status !== STATUS.LOBBY){
            notifySocket(NOTIFICATION.ERROR, 'Unable to join game', `Game has already started`, socket.id);
            return;
        }


        // Check if socket is already in the game. If it is, then update that player
        let playerFound: User;
        game.players.forEach((player: User, index: number) => {
            if(player.id == socket.id) {
                playerFound == player;
                game.players[index] = user;
            }
        });
        
        // Add player if they are not already in the game
        if(!playerFound) {
            game.players.push(user);
        }

        socket.join(game.room);
        socket.emit('game joined', game);
        console.log(`${socket.id} has joined room ${game.room}`);

    }

    function getUniqueRoomId(): string {
        // Recursively generate ids until one is created that is not taken
        
        let id: string;
        function getRandomId(){
            const roomId = Math.floor(Math.random() * 50000);
            
            games.forEach((game: Game) => {
                if(game.room === roomId.toString()){
                    getRandomId();
                }
            });

            id = roomId.toString();            
        }
        getRandomId();

        return id;
    }

    /**
     * Creates a new Game (currently with preset settings)
     * Adds Game to the array games[]
     * @param user 
     * @returns game
     */
    const createGameSocket = (socket) => {
        socket.on('create game', (obj: any) => {
            const roomId = getUniqueRoomId();
            const NEW_GAME = new Game(obj.user, roomId.toString(), ["critic","crop","cross","crowd","crown","cruel","crush","cry","cultivate","cultivation","cultivator","cup","cupboard","cure","curious","curl","current","curse","curtain","curve","cushion","custom","customary","customer","cut","daily","damage","damp","dance","danger","dare","dark","darken","date","daughter","day","daylight","dead","deaf","deafen","deal","dear","death","debt","decay","deceit","deceive","decide","decision","decisive","declare","decrease","deed","deep","deepen","deer","defeat","defend","defendant","defense","degree","delay","delicate","delight","deliver","delivery","demand","department","depend","dependence","dependent","depth","descend","descendant","descent","describe","description","desert","deserve","desire","desk","despair","destroy","destruction","destructive","detail","determine","develop","devil","diamond","dictionary","die","difference","different","difficult","difficulty","dig","dine","dinner","dip","direct","direction","director","dirt","disagree","disappear","disappearance","disappoint","disapprove","discipline","discomfort","discontent","discover","discovery","discuss","discussion","disease","disgust","dish","dismiss","disregard","disrespect","dissatisfaction","dissatisfy","distance","distant","distinguish","district","disturb","ditch","dive","divide","division","do","doctor","dog","dollar","donkey","door","dot","double","doubt","down","dozen","drag","draw","drawer","dream","dress","drink","drive","drop","drown","drum","dry","duck","due","dull","during","dust","duty","each","eager","ear","early","earn","earnest","earth","ease","east","eastern","easy","eat","edge","educate","education","educator","effect","effective","efficiency","efficient","effort","egg","either","elastic","elder","elect","election","electric","electrician","elephant","else","elsewhere",] , obj.max_rounds, obj.max_players, obj.round_length, obj.isPrivate);
            games.push(NEW_GAME);
            joinGame(obj.user, NEW_GAME.room, socket);
        });
    }

    const joinGameSocket = (socket) => {
        socket.on('join game', (obj) => {
            joinGame(obj.user, obj.roomId, socket);
        });
    }

    const updateNicknameSocket = (socket) => {
        socket.on('send-nickname', (nickname: string) => {
            socket.nickname = nickname;  
        });
    }

    const updateCanvasSocket = (socket) => {
        socket.on('updateCanvas', (obj) => {
            console.log(`${obj.room} is being painted`);
            if(obj){
                socket.to(obj.room).emit('updateAllCanvases', {
                    data: obj.data
                });
            }
        });
    }

    const getLobbyInfoSocket = (socket) => {
        socket.on('joined lobby', (roomId: string) => {
            
            const GAME_FOUND = findGameByRoomId(roomId);
            if(GAME_FOUND) {

                if ( GAME_FOUND.host.id !== socket.id ) {
                    notifySocket(NOTIFICATION.INFO, `[${socket.nickname}] has joined your lobby`, '', GAME_FOUND.host.id);                    
                }
                io.in(roomId).emit('game info', GAME_FOUND);
                //socket.emit('game info', lobby);
            }
        });
    }

    const startGameSocket = (socket) => {
        socket.on('start game', (clientGameInfo: Game) => {
            
            if(socketInGame(socket, clientGameInfo)){
                const realGame = findGameByRoomId(clientGameInfo.room);
                if(socket.id === realGame.host.id){
                    realGame.startGame();
                } else {
                    console.log(`${socket.id} is not host`)
                }
            } else {
                notifySocket(NOTIFICATION.ERROR, 'Unable to start game.', 'Please refresh and try again.', socket.id);

                //console.error(socket.id + ' is attempting to start a game they are not in (with ID ' + clientGameInfo.room + ')');

            }
            
        });
    }

    function findPlayerBySocketId(arr: Array<User>, socketId: string){
        let playerFound = null;
        arr.forEach((player: User) => {
            if(player.id == socketId){
                playerFound = player;
            }
        });

        return playerFound;
    }

    interface Message {
        message: string;
        room: string;
    }
    interface Command {
        name: string;
        action: Function
    }
    function kickPlayerByNickname(game: Game, socket, nickname: string){
        console.log(game);
    }
    const commands: Array<Command> = [
        {
            name: "kick",
            action: (game: Game, socket, args: Array<string>) => {

            }
        },
        {
            name: "leave",
            action: (game: Game, socket, args: Array<string>) => {
                
            }
        }
    ];


    function chatCommand(socket, message: Message){
        const msg = message.message;
        const args: Array<string> = msg.split(" ");
        const command = args[0].slice(1);
        args.shift();
        const game: Game = findGameByRoomId(message.room);
        const cmd: Command = commands.find(x => x.name === command);
        if(typeof cmd !== "undefined") {            
            const x: Function = cmd.action.bind(
                game,
                socket,
                args
            );
            x();

        } else {
            notifySocket(NOTIFICATION.ERROR, 'Command not found', `Could not command with name ${command}`, socket.id);
        }
    }

    function sendMessage(socket, message: Message){
        if(message.message != ""){

            if(!socket.messages) socket.messages = [];
            
            socket.messages.push({
                message: message.message,
                time: new Date().getTime()
            });
            let isSpam: boolean = false;
            if(socket.messages.length >= 3){
                // If difference between this and last 2 messages is < ~2 seconds, then do not allow message to be sent ( and notify )
                // compare current message time to message time of 3 messages ago

                const thirdLastMessage = socket.messages[socket.messages.length - (3)];
                const currentMessage = socket.messages[socket.messages.length - 1];

                if((currentMessage.time - thirdLastMessage.time) < 1000){
                    isSpam = true;
                }
            }

            if(!isSpam){

                if(message.message.charAt(0) === "/"){
                    chatCommand(socket, message);
                } else {
                    io.in(message.room).emit('receive message', {
                        message: message.message,
                        nickname: socket.nickname
                    });
                }

            } else {
                notifySocket(NOTIFICATION.WARNING, 'SPAM Detected', '', socket.id);
            }
        } else {
            notifySocket(NOTIFICATION.ERROR, 'Action not allowed', 'Message cannot not be blank.', socket.id);
        }
    }

    const chatMessageSocket = (socket) => {
        socket.on('send message', (obj: Message) => {
            
            const realGame: Game = findGameByRoomId(obj.room);
            
            if(realGame){
                
                const playerFound: User = findPlayerBySocketId(realGame.players, socket.id);
                
                if(playerFound){
                    if(!((realGame.current_artist) && realGame.current_artist.id === socket.id && realGame.status === STATUS.ACTIVE)) {
                        
                        if(realGame.status === STATUS.ACTIVE && obj.message.toLowerCase() === realGame.current_word.toLowerCase()){
                            if(realGame.status === STATUS.ACTIVE){
    
                                const correctPlayerFound: User = findPlayerBySocketId(realGame.correct_players, socket.id);
                                if(playerFound){
                                    if(!correctPlayerFound){
                                        io.in(obj.room).emit('receive message', {
                                            message: `${socket.nickname} guessed the word!`,
                                            nickname: "[Game]"
                                        });
                                        //FIXME: emit notification to user telling them how many points they received for guessing the word
                                        realGame.updateCorrectPlayers(playerFound);
                                    }
                                }
                            }
                        } else {
                            sendMessage(socket, obj);
                        }
                    
                    } else {
                        notifySocket(NOTIFICATION.ERROR, 'Action not allowed', 'The artist cannot send messages.',  playerFound.id);
                    }

                } else {
                    notifySocket(NOTIFICATION.ERROR, 'Action not allowed', '',  socket.id);
                }

            }
            
        });
    }

    function kickPlayer(game: Game, socketId: string){
        //TODO: check if this user is host or current artist
        console.log(game);
        game.players = game.players.filter((player) => {
            if(player.id !== socketId){
                return true;
            }
            return false;
        });
        game.updateClients();
    }

    const handleDisconnect = (socketId: string) => {

        games.forEach((game: Game) => {
            game.players.forEach((player: User) => {
                if(player.id === socketId){
                    kickPlayer(game, socketId);
                    io.in(game.room).emit('game info', game);
                    if(game.players.length < 2 && game.status == STATUS.ACTIVE){
                        game.endGame();
                    } else if (game.players.length < 1) {
                        game.endGame();
                    } else {
                        // Give host to random player if host leaves
                        if(socketId === game.host.id){
                            game.updateHost();
                        }

                    }
                }
            });
        });

    };

    function socketInGame(socket: any, game: Game){
        let userFound = null;
        game.players.forEach((player) => {
            if(player.id == socket.id) userFound = player;
        });
        
        return userFound;
    }

    function findGameByRoomId(roomId: string){
        let gameFound = null;
        games.forEach((game) => {
            if(game.room === roomId) gameFound = game;
        });
        return gameFound;
    }

    const searchForGameSocket = (socket) => {
        // join first public game for now
        socket.on('search game', (user: User) => {
            let gameFound: Game;
            games.forEach((game: Game) => {
                if(!game.isPrivate && game.status === STATUS.LOBBY){
                    gameFound = game;
                    joinGame(user, game.room, socket);
                }
            });            

            if(!gameFound) {
                notifySocket(NOTIFICATION.ERROR, "Failed to find game", "We were not able to find a game. Try again or create your own game", socket.id);
            } else {
                notifySocket(NOTIFICATION.SUCCESS, "Game found!", `Joining game with the id: ${gameFound.room}`, socket.id);
            }
            
        });


    }

    const kickPlayerByIdSocket = (socket) => {
        socket.on('kick player', (obj) => {
            const game: Game = findGameByRoomId(obj.gameId);
            if(game){
                if(game.host.id === socket.id) game.kickPlayer(obj.playerId);
            } else {
                console.error("Game not found");
            }
            
        });
    }


    function updateOnlineUsers(user: User): void {
        let userFound = null;
        console.log(onlineUsers);
        onlineUsers.forEach((onlineUser, index) => {
            if(typeof onlineUser != "undefined"){
                if(onlineUser.id === user.id){
                    onlineUsers[index] = user;
                    userFound = true;
                    console.log('Updated user: ' + user.nickname);
                }
            } else {
                console.log('User iterated is undefined');
            }
        });
        if (!userFound) onlineUsers.push(user);
    }

    const requestWordSocket = (socket) => {

        socket.on('request word', (game) => {
            const realGame: Game = findGameByRoomId(game.room);
            if(realGame.current_artist){
                if(realGame.current_artist.id == socket.id){
                    socket.emit('get word', realGame.current_word);
                } else {
                    socket.emit('get word', null);
                }
            }
        });

    };

    io.on('connection', function(socket){
        
        socket.score = 0;

        socket.emit('sendId', socket.id);

        socket.emit('active games', games.length);

        socket.on('disconnect', _ => handleDisconnect(socket.id));

        joinGameSocket(socket);

        createGameSocket(socket);

        updateNicknameSocket(socket);        

        console.log(`${socket.id} has connected`);

        updateCanvasSocket(socket);

        getLobbyInfoSocket(socket);

        startGameSocket(socket);

        chatMessageSocket(socket);

        requestWordSocket(socket);

        searchForGameSocket(socket);

        kickPlayerByIdSocket(socket);

    });
    
}

module.exports.Game = SiteLogic;