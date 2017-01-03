package com.agario.entities;

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Class defining attributes for Player
 * @author jaskaran
 */
public class Player {
    
    private final String alias;
    private final int id;
    private final int color_hue;
    private final int color_saturation;
    private int xPos;
    private int yPos;
    private int score;

    /**
     * Create a single player object.
     * The "Lightness" component of Player's HSL color is pre-set to singular values
     * for player's body color as well as player's border color.
     * @param alias The alias for player. Can be blank string
     * @param xPos x-position of player
     * @param yPos y-position of player
     * @param id id of player
     * @param hue "Hue" component of HSL player color
     * @param saturation "Saturation" component of HSL player color
     */
    public Player(String alias, int xPos, int yPos, int id, int hue, int saturation) {
        this.alias = alias;
        this.xPos = xPos;
        this.yPos = yPos;
        this.id = id;
        this.color_hue = hue;
        this.color_saturation = saturation;
    }

    /**
     * @return Player's alias.
     */
    public String getAlias() {
        return alias;
    }

    /**
     * @return Player's id
     */
    public int getId() {
        return id;
    }
    
    /**
     * Sets Player's x-position
     * @param xPos Player's new x-position
     */
    public void setxPos(int xPos) {
        this.xPos = xPos;
    }

    /**
     * Sets Player's y-position
     * @param yPos Player's new y-position
     */
    public void setyPos(int yPos) {
        this.yPos = yPos;
    }
    
    /**
     * @return Player's x-position
     */
    public int getxPos() {
        return xPos;
    }

    /**
     * @return Player's y-position
     */
    public int getyPos() {
        return yPos;
    }

    /**
     * Sets Player's score
     * @param score Player's new score
     */
    public void setScore(int score) {
        this.score = score;
    }

    /**
     * @return Player's score
     */
    public int getScore() {
        return score;
    }

    /**
     * @return "Hue" component of Player's HSL color
     */
    public int getColor_hue() {
        return color_hue;
    }

    /**
     * @return "Saturation" component of Player's HSL color
     */
    public int getColor_saturation() {
        return color_saturation;
    }
    
}
