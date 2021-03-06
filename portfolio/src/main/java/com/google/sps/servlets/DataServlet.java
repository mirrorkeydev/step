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

import com.google.appengine.api.datastore.DatastoreService;
import com.google.appengine.api.datastore.DatastoreServiceFactory;
import com.google.appengine.api.datastore.Entity;
import com.google.appengine.api.datastore.FetchOptions;
import com.google.appengine.api.datastore.Query;
import com.google.appengine.api.datastore.Query.SortDirection;
import com.google.cloud.language.v1.Document;
import com.google.cloud.language.v1.LanguageServiceClient;
import com.google.cloud.language.v1.Sentiment;
import com.google.cloud.translate.Translate;
import com.google.cloud.translate.TranslateOptions;
import com.google.cloud.translate.Translation;
import com.google.gson.Gson;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/** Servlet that allows the client to create and read comments */
@WebServlet("/data")
public class DataServlet extends HttpServlet {

  public static final float SENTIMENT_THRESHOLD = -0.7f;

  public class Comment {
    String body;
    String author;
    Date date;
    Double sentiment;

    public Comment(String body, String author, Date date, Double sentiment) {
      this.body = body;
      this.author = author;
      this.date = date;
      this.sentiment = sentiment;
    }
  }

  /** GETs a user-defined number of comments translated to a user-defined language. */
  @Override
  public void doGet(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // Get the input from the form.
    int numberOfCommentsToShow = 0;
    if (request.getParameter("num-comments") != null
        && !request.getParameter("num-comments").isEmpty()) {
      try {
        numberOfCommentsToShow = Integer.parseInt(request.getParameter("num-comments"));
      } catch (Exception e) {
        // If parsing fails (non-numeric input), we silently fall back on showing 10 comments
        numberOfCommentsToShow = 10;
      }
    }

    Query query = new Query("Comment").addSort("datetime", SortDirection.DESCENDING);
    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    List<Entity> results =
        numberOfCommentsToShow >= 0
            ? datastore
                .prepare(query)
                .asList(FetchOptions.Builder.withLimit(numberOfCommentsToShow))
            : datastore.prepare(query).asList(FetchOptions.Builder.withDefaults());

    ArrayList<Comment> comments = new ArrayList<Comment>();
    for (Entity entity : results) {
      String author = (String) entity.getProperty("author");
      String body = (String) entity.getProperty("body");
      Date datetime = (Date) entity.getProperty("datetime");
      Double sentiment = (Double) entity.getProperty("sentiment");

      Comment comment = new Comment(body, author, datetime, sentiment);
      comments.add(comment);
    }

    // Do the translation.
    String languageToTranslateTo = request.getParameter("lang-comments");
    if (!languageToTranslateTo.equals("original")) {
      Translate translate = TranslateOptions.getDefaultInstance().getService();
      for (Comment comment : comments) {
        Translation translation =
            translate.translate(
                comment.body,
                Translate.TranslateOption.targetLanguage(languageToTranslateTo),
                Translate.TranslateOption.format("text"));
        String translatedText = translation.getTranslatedText();
        comment.body = translatedText;
      }
    }

    Gson gson = new Gson();
    String json = gson.toJson(comments);

    response.setContentType("text/json; charset=UTF-8");
    response.setCharacterEncoding("UTF-8");
    response.getWriter().println(json);
  }

  /** POST a new comment to the server. */
  @Override
  public void doPost(HttpServletRequest request, HttpServletResponse response) throws IOException {

    // Get the input from the form.
    String body = getParameter(request, "body", "");
    String author = getParameter(request, "author", "Anonymous");
    Date datetime = new Date();

    // Check for validity.
    if (body.isEmpty()) {
      response.setStatus(400);
      return;
    }

    // Check the sentiment of the comment entered
    Document doc = Document.newBuilder().setContent(body).setType(Document.Type.PLAIN_TEXT).build();
    LanguageServiceClient languageService = LanguageServiceClient.create();
    Sentiment sentiment = languageService.analyzeSentiment(doc).getDocumentSentiment();
    float score = sentiment.getScore();
    languageService.close();

    response.setStatus(200);
    response.getWriter().println(score);

    if (score < SENTIMENT_THRESHOLD) {
      return;
    }

    // Buld the new comment.
    Entity commentEntity = new Entity("Comment");
    commentEntity.setProperty("author", author);
    commentEntity.setProperty("body", body);
    commentEntity.setProperty("datetime", datetime);
    commentEntity.setProperty("sentiment", score);

    DatastoreService datastore = DatastoreServiceFactory.getDatastoreService();
    datastore.put(commentEntity);
  }

  /**
   * @return the request parameter, or the default value if the parameter was not specified by the
   *     client.
   */
  private String getParameter(HttpServletRequest request, String name, String defaultValue) {
    String value = request.getParameter(name);
    if (value == null || value.isEmpty()) {
      return defaultValue;
    }
    return value;
  }
}
