package com.agario.session;

import com.agario.entities.Food;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.concurrent.ExecutorService;
import java.util.concurrent.Executors;
import javax.servlet.ServletContextEvent;
import javax.servlet.ServletContextListener;
import javax.servlet.annotation.WebListener;
import javax.websocket.Session;

/**
 * This class manages Sessions for game. Only this class' methods should be used to adding or removing sessions for easier management.
 * @author jaskaran
 */
@WebListener
public class SessionManager implements ServletContextListener {
    
    private static final ExecutorService EXECUTOR = Executors.newSingleThreadExecutor();
    
    private static final List<Session> SESSIONS = Collections.synchronizedList(new ArrayList<Session>());
    private static final List<Session> SESSIONS_USER_LIST = Collections.unmodifiableList(SESSIONS);;
    
    @Override
    public void contextInitialized(ServletContextEvent sce) {
        // Generate some random foods at game start
        List<Food> foods = Global.getFoods();
        for (int i = 0; i < 5000; i++)
            foods.add(Generator.genFood(foods.size()));
    }

    @Override
    public void contextDestroyed(ServletContextEvent sce) {
        EXECUTOR.shutdown();
    }
    
    /**
     * Queues the task to be performed.
     * It is recommended to use SubmitUpdate class to queue WebSocket message updates.
     * @param runnable The runnable for method to submit the update
     */
    protected static void submitUpdateMessage(Runnable runnable) {
        EXECUTOR.submit(runnable);
    }
    
    /**
     * Adds new Session to list of sessions.
     * @param session The Session to add
     */
    protected static void addSession(Session session) {
        SESSIONS.add(session);
    }
    
    /**
     * Removes the provided Session for list of Sessions.
     * @param session The session to remove
     */
    protected static void removeSession(Session session) {
        SESSIONS.remove(session);
    }
    
    /**
     * Returns the unmodifiable list containing Sessions.
     * The Sessions should be added/removed using the SessionManager class method and
     * not by directly manipulating Session list.
     * @return Unmodifiable List of Sessions
     */
    protected static List<Session> getSessions() {
        return SESSIONS_USER_LIST;
    }
    
}
