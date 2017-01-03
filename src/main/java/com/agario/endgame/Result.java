package com.agario.endgame;

import com.agario.dao.DAO;
import java.io.IOException;
import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * This class takes player's final scores and alias and inserts into database
 * used to get all-time leaderboard scores.
 * Then it redirects the page to the final score-viewing page.
 * @author jaskaran
 */
@WebServlet(name="Result", urlPatterns={"/Result"})
public class Result extends HttpServlet {

    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
    throws ServletException, IOException {
        String alias = request.getParameter("alias");
        if(alias.isEmpty()) alias = "An unnamed cell";
        
        int score = Integer.parseInt(request.getParameter("finalScore"));
        DAO.addScore(alias, score);
        request.setAttribute("score", score);
        request.getRequestDispatcher("result.jsp").forward(request, response);
    } 

}
