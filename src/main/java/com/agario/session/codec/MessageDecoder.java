package com.agario.session.codec;

/**
 * This class decodes the WebSocket message string using its delimiters to split
 * it to its descrete attributes.
 * @author jaskaran
 */
public class MessageDecoder {
    private final int id;
    private final int xPos;
    private final int yPos;
    private final int score;
    private final String chatString;
    private final String remPlayers;
    private final String remFoods;

    /**
     * Constructs a single Decoder object from provided message String.
     * @param message WebSocket delimited String containing game update info
     */
    public MessageDecoder(String message) {
        String[] decoded = message.split("\\^", -1);
        this.id = Integer.parseInt(decoded[0]);
        this.xPos = Integer.parseInt(decoded[1]);
        this.yPos = Integer.parseInt(decoded[2]);
        this.score = Integer.parseInt(decoded[3]);
        this.chatString = decoded[4];
        this.remPlayers = decoded[5];
        this.remFoods = decoded[6];
    }

    /**
     * @return ID of player who sent the WebSocket message
     */
    public int getId() {
        return id;
    }

    /**
     * @return x-position of player who sent the WebSocket message
     */
    public int getxPos() {
        return xPos;
    }

    /**
     * @return y-position of player who sent the WebSocket message
     */
    public int getyPos() {
        return yPos;
    }

    /**
     * @return Score of player who sent the WebSocket message.
     */
    public int getScore() {
        return score;
    }

    /**
     * @return Chat string (blank if no Chat message) of player who sent the WebSocket message.
     */
    public String getChatString() {
        return chatString;
    }

    /**
     * @return IDs of players killed by accounted player within the update period
     */
    public String getRemPlayers() {
        return remPlayers;
    }

    /**
     * @return IDs of foods consumed by accounted player within the update period
     */
    public String getRemFoods() {
        return remFoods;
    }
    
}
