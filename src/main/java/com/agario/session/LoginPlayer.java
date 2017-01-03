package com.agario.session;

import com.agario.entities.Food;
import com.agario.entities.Player;
import com.agario.session.Generator;
import com.agario.session.SubmitUpdate;
import com.agario.session.codec.MessageEncoder;
import java.util.List;
import javax.websocket.Session;

/**
 * Class for methods used to Login player into game. These methods generate id, spawn position and color for player.
 * @author jaskaran
 */
public class LoginPlayer {

    private static final Object LOCK = new Object();
    
    /**
     * Method for player game login.
     * @param players List of all players in game
     * @param leaderboard The final adjusted leaderboard list after leaderboard position updates (can be blank if no position updates occurred)
     * @param foods List containing all game Food items
     * @param alias preferred Player alias
     * @param session Player's WebSocket session
     */
    public static void login(List<Player> players, List<Integer> leaderboard, List<Food> foods, String alias, Session session) {
            if (alias.length() > 14)
                alias = alias.substring(0, 15);
            if (alias.contains("^"))
                alias = alias.replaceAll("\\^", "");

            Player p = createPlayer(players, leaderboard, alias);

            SubmitUpdate.submitToSingle(session, "|" + MessageEncoder.encodeLogin(p, players, foods));
    }

    /**
     * Login helper method for generating player information including id, spawn position and color
     * @param players
     * @param players List of all players in game
     * @param leaderboard The final adjusted leaderboard list after leaderboard position updates (can be blank if no position updates occurred)
     * @param alias preferred Player alias
     * @return The formed Player Object
     */
    private static Player createPlayer(List<Player> players, List<Integer> leaderboard, String alias) {
        int[] color_HueSat = Generator.genColor_HueSat();
        int[] coords = Generator.genPlayerCoords(players, 0, 0);
        int xPos = coords[0];
        int yPos = coords[1];
        
        boolean added = false;
        int pId = 0;
        
        Player player;
        
        /* Determine player id. This has to correspond to the index in Players list.
           If a "null" index is obtained (that is, a player that was killed and
           has empty slot in list), that index will be used and empty slot will
           be replaced by this new player.
           Otherwise a new index is created in list (player is simply added to end) */
        synchronized(LOCK) {
            while (pId < players.size()) {
                if (players.get(pId) == null) {
                    added = true;
                    break;
                }
                pId++;
            }
        
            player = new Player(alias, xPos, yPos, pId, color_HueSat[0], color_HueSat[1]);
        
            if (!added)
                players.add(player);
            else
                players.set(pId, player);
        }
        
        leaderboard.add(pId);

        return player;
    }

}
