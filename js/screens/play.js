game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function (type) {
        // load a level
        me.levelDirector.loadLevel("level_1")

        game.lever_list = [];

	game.data.goal_string = game.getRandomPassword();
	
        game.spawnEntities(type);
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function () {
        // remove the cipher from the game world
        me.game.world.removeChild(game.cipher_text);
	var lever;
	for (lever of game.lever_list)
	    me.game.world.removeChild(lever);
    },

});
game.spawnEntities = function (level_type) {
    var groundY = 700;

    // Add our cipher to the game world, add it last so that this is on top of the rest.
    // Can also be forced by specifying a "Infinity" z value to the addChild function.
    // Position x and y need to be negative integers relative to bottom right
    game.cipher_text = new game.cipher.Container(750, 650);
    me.game.world.addChild(game.cipher_text);

    var lever;
    if (level_type === "caesar") {
	console.log("caesar level");
	game.data.current_string = caesarCipher(game.data.goal_string, Math.floor(Math.random() * 14));
	game.data.start_string = game.data.current_string;

	lever = me.pool.pull("InteractEntity", 670, groundY, game.getCaesarLever(-1), game.getCaesarLever(1));
	me.game.world.addChild(lever);

	game.signText = new game.Textbox.Container(800, 100, "Can you break a Caesar cipher?");
	me.game.world.addChild(game.signText);
    } else if (level_type === "vigenere") {
	console.log("vigenere level");
	game.data.current_string = vigenereCipher(game.data.goal_string, game.data.key_string);
	game.data.start_string = game.data.current_string;

	for (var i = 0; i < game.data.current_string.length; i++) {
	    lever = me.pool.pull("InteractEntity", 400 + 140 * i, groundY, game.getVigenereLever(i, -1), game.getVigenereLever(i, 1));
	    me.game.world.addChild(lever);
	}

	game.lever_list.push(lever);
	game.signText = new game.Textbox.Container(800, 100, "Vigenere is a little harder...");
	me.game.world.addChild(game.signText);
    }
}

game.getVigenereLever = function (j, n) {
    return function () {
	// game.data.current_string[i] = addToChar(game.data.current_string[i], n);
        var result = '';
        for (var i = 0; i < game.data.current_string.length; i++) {
            if (i == j) {
                result += addToChar(game.data.current_string[i], n);
            } else {
                result += game.data.current_string[i];
            }
        }

        game.data.current_string = result;
    };
};

game.getCaesarLever = function (i) {
    return function () {
        game.data.current_string = caesarCipher(game.data.current_string, i);
    };
};

game.getRandomPassword = function() {
    return passwords[Math.floor(Math.random() * passwords.length)];
};

game.getNextLevel = function () {
    
};
