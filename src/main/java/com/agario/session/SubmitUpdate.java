package com.agario.session;

import java.util.List;
import javax.websocket.Session;

/**
 * This class queues the update message sent my MessageHandler for being sent to all players.
 * @author jaskaran
 */
public class SubmitUpdate {

    /**
     * Sends the provided WebSocket message to all players using the Session list obtained from
     * SessionManager class.
     * @param sessions List containing all open game Sessions
     * @param message The Message to be sent to all players
     */
    protected static void submitToAll(final List<Session> sessions, final String message) {
        SessionManager.submitUpdateMessage(new Runnable() {
            @Override
            public void run() {
                for (int i = 0, size = sessions.size(); i < size; i++)
                    try {
                        sessions.get(i).getBasicRemote().sendText(message);
                    } catch (Exception ex) {
                        // Debugging purposes
                        ex.printStackTrace();
                    }
            }
        });
    }
    
    /**
     * Sends the provided WebSocket message to all players using the Session list obtained from
     * SessionManager class.
     * @param session The Session to send the message to
     * @param message The Message to be sent to all players
     */
    protected static void submitToSingle(final Session session, final String message) {
        SessionManager.submitUpdateMessage(new Runnable() {
            @Override
            public void run() {
                try {
                    session.getBasicRemote().sendText(message);
                } catch (Exception ex) {
                    // Debugging purposes
                    ex.printStackTrace();
                }
            }
        });
    }

}
