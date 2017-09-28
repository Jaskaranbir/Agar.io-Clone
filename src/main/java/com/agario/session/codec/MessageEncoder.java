package com.agario.session.codec;

import com.agario.entities.Food;
import com.agario.entities.Player;
import java.util.List;

/**
 * This class encodes the WebSocket message into single String to be distributed to Player(s)
 * @author jaskaran
 */
public class MessageEncoder {
    
    /**
     * Encodes regular update message to be sent to different Player(s).
     * @param player The accounted player whose updated info is to be sent
     * @param chatStr The chat string of accounted player (can be blank if player has not sent any chats). This string should escape the "^" character
     * @param leaderboard The final adjusted leaderboard list after leaderboard position updates (can be blank if no position updates occurred)
     * @param remPlayers Comma delimited string of players killed by accounted player within update period
     * @param remFoods Comma delimited string of foods consumed by accounted player within update period
     * @return The encoded string delimited by "^" character
     */
    public static String encodeUpdate(Player player, String chatStr, String leaderboard, String remPlayers, String remFoods) {
        // 0: Player id
        // 1: Player xPos
        // 2: Player yPos
        // 3: Palyer score
        // 4: Player Hue
        // 5: Player Sat
        // 6: player Alias
        // 7: ChatString
        // 8: Leaderboard
        // 9: Rem Players
        // 10: Rem Foods
        return player.getId() + "^" + player.getxPos() + "^" + player.getyPos() + "^" + player.getScore() + "^" + player.getColor_hue() + "^" + player.getColor_saturation() + "^" + player.getAlias() + "^" + chatStr + "^" + leaderboard + "^" + remPlayers + "^" + remFoods;
    }
    
    /**
     * Encodes the login message which provides client with current information of all foods and players for initialization. Later only the changelog messages are sent after initialization.
     * @param player The player being accounted
     * @param players List of all players
     * @param foods List of all foods
     * @return The encoded string delimited by "^" character
     */
    public static String encodeLogin(Player player, List<Player> players, List<Food> foods) {
        // 0: Player id
        // 1: Player xPos
        // 2: Player yPos
        // 3: Player Hue
        // 4: Player Sat
        // 5: Player Alias
        // 6: Players
        // 7: Foods
        String out = player.getId() + "^" + player.getxPos() + "^" + player.getyPos() + "^" + player.getColor_hue() + "^" + player.getColor_saturation() + "^" + player.getAlias() + "^";
        
        for(int i = 0, size = players.size(); i < size; i++) {
            Player p = players.get(i);
            if(p != null)
                out += p.getId() + "," + p.getxPos() + "," + p.getyPos() + "," + p.getScore() + "," + p.getColor_hue() + "," + p.getColor_saturation() + "," + p.getAlias() + "|";
        }
        out = out.substring(0, out.length() - 1) + "^";
        
        for(int i = 0, size = foods.size(); i < size; i++) {
            Food f = foods.get(i);
            out += f.getId() + "," + f.getxPos() + "," + f.getyPos() + "," + f.getColor_red() + "," + f.getColor_green() + "," + f.getColor_blue() + "|";
        }
        out = out.substring(0, out.length() - 1);
        
        return out;
    }
    
}
