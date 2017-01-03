package com.agario.session;

import com.agario.entities.Food;
import com.agario.entities.Player;
import java.util.List;
import java.util.Random;

/**
 * This class is used to generate various game items automatically
 * with variations in values such as color.
 * @author jaskaran
 */
public class Generator {

    /* So we don't need to create a new Random instance
       instance everytime it is requested. Since its
       requested very frequently for generating player
       and food spawn positions and colors
    */
    private static final Random RANDOM = new Random();
    
    /**
     * Generates random RGB color which each value in range 2 to 223.
     * @return Array containing RGB values
     */
    protected static int[] genColor_RGB() {
        int r = Math.max(RANDOM.nextInt(255) - 32, 2);
        int g = Math.max(RANDOM.nextInt(255) - 32, 2);
        int b = Math.max(RANDOM.nextInt(255) - 32, 2);

        return new int[] {r, g, b};
    }
    
    /**
     * Generates random Hue and Saturation color values.
     * Hue ranges upto 330 and Saturation ranges upto 80.
     * The "Lightness" value is pre-defined in game script.
     * @return Array containing Hue and Saturation values
     */
    protected static int[] genColor_HueSat() {
        return new int[] {Math.abs(RANDOM.nextInt(330)), Math.abs(RANDOM.nextInt(80))};
    }
    
    /**
     * Generates a Food item with given id and with random color and position.
     * @param id The id for Food. Must correspond to index of Food item in Food Array or ArrayList
     * @return A single Food item with random colors and position within stage bounds
     */
    public static Food genFood(int id) {
        int[] colors = genColor_RGB();  
        return new Food(colors[0], colors[1], colors[2], RANDOM.nextInt(14143), RANDOM.nextInt(14143), id);
    }
    
    /**
     * Generates spawning coordinates for player such that
     * players are spawned close and with adequate distance to each other.
     * If preferred spawning x and y positions are good, they are used.
     * Otherwise new coordinates are generated.
     * @param players List containing all players of game
     * @param xPos The preferred spawning x-position
     * @param yPos The preferred spawning y-position
     * @return Array containing x and y player coordinates
     */
    protected static int[] genPlayerCoords(List<Player> players, int xPos, int yPos) {
        return findIdealPlayerCoords(players, xPos, yPos, 100, 0);
    }
    
    /**
     * Helper method used to generate ideal player spawning coordinates.
     * This method is required to take into account the additional variables
     * as recursion parameters (areaLimit and number of tries) which should
     * not be specified by user of this class.
     * @param players List containing all players of game
     * @param xPos The preferred spawning x-position
     * @param yPos The preferred spawning y-position
     * @param areaLimit The area within which the method should search the coordinates. This should be length of one side, since the game canvas is assumed to be always a square
     * @param tries The number of tries to find coordinates until it increases the search area
     * @return Array containing x and y player coordinates
     */
    private static int[] findIdealPlayerCoords(List<Player> players, int xPos, int yPos, int areaLimit ,int tries) {
        for(int i = 0, size = players.size(); i < size; i++) {
            Player p = players.get(i);
            if(p == null) continue;
            
            int radius = (int) (Math.ceil(p.getScore() * 0.102) + 26);
            
            // Distances between center of centers of
            // both current player and the player being taken into account
            int xDist = Math.abs(p.getxPos() + radius - (xPos + 25));
            int yDist = Math.abs(p.getyPos() + radius - (yPos + 25));
            
            // The additional factor is preferred minimum distance between
            // current player to accounted player
            radius += 100;
            
            // Check if player positions are overlapping
            // Generate and try new coordinates if they are
            if(xDist < radius && yDist < radius) {
                xPos = RANDOM.nextInt(areaLimit);
                yPos = RANDOM.nextInt(areaLimit);
                
                if(tries == 10) {
                    int newArea = areaLimit + 500;
                    if(newArea < 14143) areaLimit = newArea;
                    tries = 0;
                }
                return findIdealPlayerCoords(players, xPos, yPos, areaLimit, ++tries);
            }
        }
        
        return new int[] {xPos, yPos};
    }

}
