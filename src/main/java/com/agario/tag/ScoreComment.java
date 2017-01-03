package com.agario.tag;

import java.io.IOException;
import javax.servlet.jsp.JspException;
import javax.servlet.jsp.tagext.SimpleTagSupport;

/**
 * Class defining the JSTL custom "Score Comment" tag that generates a comment based of player's score.
 * @author jaskaran
 */
public class ScoreComment extends SimpleTagSupport {
    private int score;

    public void setScore(int score) {
        this.score = score;
    }
    
    @Override
    public void doTag() throws JspException, IOException {
        String output;
        
        if(score > 50) output = "Damn; well played. Remember to put this on your resume.";
        else if(score > 30) output = "Aight, good enough.";
        else if(score > 20) output = "Try harder guy.";
        else if(score > 10) output = "Poor sweet soul, who doesn't know how to play a simple game.";
        else if(score > 5) output = "This score sucks more than vaccum cleaner.";
        else output = "Your score has offended the Ugly Duckling.";
        
        getJspContext().getOut().println(output);
    }
}
