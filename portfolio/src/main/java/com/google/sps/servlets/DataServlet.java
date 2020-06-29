// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;


/** Servlet that returns some example content. TODO: modify this file to handle comments data */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

    public class Comment {
        String body;
        String author;
        Date date;

        public Comment(String body, String author, Date date) {
            this.body = body;
            this.author = author;
            this.date = date;
        }
    }

    static ArrayList<Comment> comments = new ArrayList<Comment>();

    /** GETs all comments stored by the server */
    @Override
    public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

        Gson gson = new Gson();
        String json = gson.toJson(comments);

        response.setContentType("text/json;");
        response.getWriter().println(json);
    }

    /** POST a new comment to the server */
    @Override
    public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {
        // Get the input from the form.
        String body = getParameter(request, "comment", "");
        String author = getParameter(request, "name", "Anonymous");
        Date datetime = new Date();

        // Check for validity
        if (!body.isEmpty()){
            
            // Buld the new comment
            comments.add(new Comment(body, author, datetime));
        }   

        // Redirect back to the Contact page.
        response.sendRedirect("/#/contact");
    }

    /**
    * @return the request parameter, or the default value if the parameter
    *         was not specified by the client
    */
    private String getParameter(HttpServletRequest request, String name, String defaultValue) {
        String value = request.getParameter(name);
        if (value == null || value.isEmpty()) {
            return defaultValue;
        }
        return value;
    }
}
