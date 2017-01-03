package com.agario.session;

import com.agario.entities.Food;
import com.agario.entities.Player;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Class defining global Lists for game entities and leaderboard
 * @author jaskaran
 */
public class Global {
 
    private static final List<Food> FOODS = Collections.synchronizedList(new ArrayList<Food>());    

    private static final List<Integer>LEADERBOARD = Collections.synchronizedList(new ArrayList<Integer>());
    
    private static final List<Player> PLAYERS = Collections.synchronizedList(new ArrayList<Player>());
    
    /**
     * @return List containing all Food items in game
     */
    protected static List<Food> getFoods() {
        return FOODS;
    }

    /**
     * @return List containing all player IDs in game arranged in Decreasing order of their scores
     */
    protected static List<Integer> getLeaderboard() {
        return LEADERBOARD;
    }
    
    /**
     * @return List containing all players in game
     */
    protected static List<Player> getPlayers() {
        return PLAYERS;
    }

}
