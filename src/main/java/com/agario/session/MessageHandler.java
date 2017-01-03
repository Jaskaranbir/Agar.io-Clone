package com.agario.session;

import com.agario.entities.Food;
import com.agario.entities.Player;
import com.agario.session.codec.MessageDecoder;
import com.agario.session.codec.MessageEncoder;
import com.agario.session.removeentity.RemoveFood;
import com.agario.session.removeentity.RemovePlayer;
import java.util.List;
import javax.websocket.Session;

/**
 * This class handles the WebSocket messages.
 * @author jaskaran
 */
public class MessageHandler {

    /**
     * Method for handling WebSocket messages.
     * Checks if message is successful login confirmation or general message;
     * then directs it accordingly.
     * @param players List of all Players in game
     * @param leaderboard List containing IDs of players for leaderboard re-arrangement
     * @param foods List of all Food items in game
     * @param sessions List containing all open game Sessions
     * @param session The Session object of current player who sent the message
     * @param message The message received by WebSocket
     */
    protected static void handleMessage(List<Player> players, List<Integer> leaderboard, List<Food> foods, List<Session> sessions, Session session, String message) {
        if (message.equals("L0")) // Check if its a login confirmation
            SessionManager.addSession(session);
        else
            handleGeneralMessage(players, leaderboard, foods, sessions, session, message);
    }
    
    /**
     * Method for handling general WebSocket messages (messages which are not login confirmation).
     * @param players List of all Players in game
     * @param leaderboard List containing IDs of players for leaderboard re-arrangement
     * @param foods List of all Food items in game
     * @param session The Session object of current player who sent the message
     * @param message The message received by WebSocket
     */
    protected static void handleGeneralMessage(List<Player> players, List<Integer> leaderboard,  List<Food> foods, List<Session> sessions, Session session, String message) {
        MessageDecoder md = new MessageDecoder(message);
        int id = md.getId();
        int xPos = md.getxPos();
        int yPos = md.getyPos();
        int score = md.getScore();
        String chatStr = md.getChatString();

        Player p = players.get(id);
        p.setxPos(xPos);
        p.setyPos(yPos);

        String leaderboardBoardPos = "";
        if (p.getScore() < score) {
            p.setScore(score);
            leaderboardBoardPos = adjustLeaderboard(p, players, leaderboard);
        }

        String remPlayers = RemovePlayer.remove(players, leaderboard, md.getRemPlayers());
        String remFoods = RemoveFood.remove(foods, md.getRemFoods());

        SubmitUpdate.submitToAll(sessions, MessageEncoder.encodeUpdate(p, chatStr, leaderboardBoardPos, remPlayers, remFoods));
    }

    /**
     * Method for determining if player has moved up in leaderboard. The adjusts the leaderboard.
     * @param player The player whose leaderboard position is to be adjusted
     * @param players List of all players in game
     * @param leaderboard List containing IDs of players for leaderboard re-arrangement
     * @return Comma delimited string or sorted player IDs for forming leaderboard
     */
    private static String adjustLeaderboard(Player player, List<Player> players, List<Integer> leaderboard) {
        int index = leaderboard.indexOf(player.getId());

        while (index > 0 && player.getScore() > players.get(leaderboard.get(index - 1)).getScore()) {
            leaderboard.set(index, leaderboard.get(index - 1));
            leaderboard.set(--index, player.getId());
        }

        String ids = "";
        for (int i = 0; i < Math.min(leaderboard.size(), 10); i++)
            ids += leaderboard.get(i) + ",";

        return ids;
    }

}
