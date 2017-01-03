package com.agario.menu;

import com.agario.dao.DAO;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This class gets the all-time leaderboard String for player's
 * by using information stored in database.
 * @author jaskaran
 */
@WebServlet(name="GetLeaderboard", urlPatterns={"/GetLboard"})
public class MenuLeaderboard extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        response.getWriter().write(DAO.getScores());
    } 

}
