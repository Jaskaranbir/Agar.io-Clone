package com.agario.entities;

/**
 * Class defining the attributes for in-game food (pickups)
 * @author jaskaran
 */
public class Food {
    
    private final int xPos;
    private final int yPos;
    private final int id;
    private final int color_red;
    private final int color_green;
    private final int color_blue;

    /**
     * Constructs a single Food object.
     * @param red The "red" component of food's RGB color
     * @param green The "green" component of food's RGB color
     * @param blue The "blue" component of food's RGB color
     * @param xPos x-position of food
     * @param yPos y-position of food
     * @param id id of food
     */
    public Food(int red, int green, int blue, int xPos, int yPos, int id) {
        this.xPos = xPos;
        this.yPos = yPos;
        this.id = id;
        this.color_red = red;
        this.color_green = green;
        this.color_blue = blue;
    }
    
    /**
     * The id is used to determine which food has been consumed by player.
     * And which food item should be removed or added.
     * @return The id of food item.
     */
    public int getId() {
        return id;
    }

    /**
     * @return x-position of food item.
     */
    public int getxPos() {
        return xPos;
    }

    /**
     * @return y-position of food item.
     */
    public int getyPos() {
        return yPos;
    }

    /**
     * @return The "Red" component of food's RGB color
     */
    public int getColor_red() {
        return color_red;
    }

    /**
     * @return The "Green" component of food's RGB color
     */
    public int getColor_green() {
        return color_green;
    }

    /**
     * @return The "Blue" component of food's RGB color
     */
    public int getColor_blue() {
        return color_blue;
    }
        
}
