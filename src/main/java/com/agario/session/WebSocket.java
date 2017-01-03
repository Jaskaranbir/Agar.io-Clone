/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package com.agario.session;

import javax.websocket.OnClose;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.PathParam;
import javax.websocket.server.ServerEndpoint;

/**
 * Class for handling WebSocket components. This is <b>entry point</b> for client game.
 * @author jaskaran
 */
@ServerEndpoint(value = "/agariosocket/{alias}")
public class WebSocket {

    @OnOpen
    public void open(@PathParam("alias") String alias, Session session) {
        try {
            LoginPlayer.login(Global.getPlayers(), Global.getLeaderboard(), Global.getFoods(), alias, session);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @OnClose
    public void close(Session session) {
        SessionManager.removeSession(session);
    }

    @OnMessage
    public void message(Session session, String message) {
        try {
            MessageHandler.handleMessage(Global.getPlayers(), Global.getLeaderboard(), Global.getFoods(), SessionManager.getSessions(), session, message);
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
    
}
