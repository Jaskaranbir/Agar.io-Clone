package com.agario.session.removeentity;

import com.agario.entities.Food;
import com.agario.session.Generator;
import java.util.List;

/**
 * This class is used to remove Food items consumed by player within update period.
 * @author jaskaran
 */
public class RemoveFood {

    /**
     * This method removes the consumed Food items and replaces them with newly generated food items in their place; so the overall item count remains consistently 5000.
     * @param foods List containing all food items
     * @param list Comma delimited string containing IDs of food items to be replaced
     * @return String delimited by "|" with information of new foods generated (whose
     * attributes are delimited by "," for each food). Returns blank String if no Foods were consumed.
     */
    public static String remove(List<Food> foods, String list) {
        String out = "";
        if(list.isEmpty())
            return out;
        
        String[] ids = list.split(",");
        
        for(int i = 0, length = ids.length; i < length; i++) {
            String id = ids[i];
            int fId = Integer.parseInt(id);
            Food f = Generator.genFood(fId);
            out += fId + "," + f.getxPos() + "," + f.getyPos() + "," + f.getColor_red() + "," + f.getColor_green() + "," + f.getColor_blue() + "|";
            
            foods.set(fId, f);
        }
        
        return out.substring(0, out.length() - 1);
    }
}
