package com.agario.session.removeentity;

import com.agario.entities.Player;
import java.util.List;

/**
 * This class is used to remove Players killed by player within update period.
 * @author jaskaran
 */
public class RemovePlayer {
    
    /**
     * This method removes the killed Players.
     * @param players List containing all players
     * @param leaderboard The final adjusted leaderboard list to remove the killed Player(s) from leaderboard.
     * @param list Comma delimited string containing IDs of killed Players
     * @return Comma delimited string with IDs of killed Players. Returns blank String if no Players were killed.
     */
    public static String remove(List<Player> players, List<Integer> leaderboard, String list) {
        String out = "";
        if(list.isEmpty())
            return out;
            
        String[] ids = list.split(",");
        
        for(int i = 0, length = ids.length; i < length; i++) {
            String id = ids[i];
            int pId = Integer.parseInt(id);
            out += pId + ",";
            players.set(pId, null);
            leaderboard.remove(Integer.valueOf(pId));
        }
        
        return out.substring(0, out.length() - 1);
    }
}
