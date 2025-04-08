## Authentication Controller (AuthController.kt)

This controller handles user registration, login, and token refresh.
- Endpoint: /api/auth/register
  - Method: POST
  - Description: Registers a new user.
  - Request Body:
    - `email` (string, required): The user's email address.
    - `password` (string, required): The user's password.
  - **Response Body (Success - 200 OK):**   
    - `accessToken` (string): The JWT access token.
    - `refreshToken` (string): The JWT refresh token.
  - **Response Body (Error - 400 Bad Request):**    
    - `message` (string): Error message.


- Endpoint: /api/auth
  - Method: POST
  - Description: Authenticates a user and returns access and refresh tokens.
  - Request Body:
    - `email` (string, required): The user's email address.
    - `password` (string, required): The user's password.
  - **Response Body (Success - 200 OK):**    
    - `accessToken` (string): The JWT access token.
    - `refreshToken` (string): The JWT refresh token.
  - **Response Body (Error - 401 Unauthorized):**    
    - `message` (string): Error message.


- Endpoint: /api/auth/refresh
  - Method: POST
  - Description: Refreshes an access token using a refresh token.
  - Request Body:    
  - `refreshToken` (string, required): The JWT refresh token.
  - **Response Body (Success - 200 OK):**    
    - `accessToken` (string): The new JWT access token.
  - **Response Body (Error - 401 Unauthorized):**    
    - `message` (string): Error message.


## Notes Controller (NotesController.kt)
This controller handles operations related to notes.
- Endpoint: /api/notes
  - Method: POST
  - Description: Creates a new note.
  - Request Headers:
  - Authorization: Bearer <accessToken> (required)
  - Request Body:    
    - `title` (string, required): The title of the note.
    - `content` (string, required): The content of the note.
  - **Response Body (Success - 200 OK):**    
    - `id` (number): The ID of the created note.
    - `version` (number): The version of the note.
    - `title` (string): The title of the note.
    - `content` (string): The content of the note.
    - `creationDate` (string): The creation date of the note.
    - `expirationDate` (string): The expiration date of the note.
  -  **Response Body (Error - 400 Bad Request):**    
  - `message` (string): Error message.


- Endpoint: /api/notes/{id}
  - Method: GET
  - Description: Retrieves a specific note by ID.
  - Request Headers:
  - Authorization: Bearer <accessToken> (required)
  - Path Parameters:
  - id (number, required): The ID of the note to retrieve.
  - Response Body (Success - 200 OK):    
    - `id` (number): The ID of the note.
    - `version` (number): The version of the note.
    - `title` (string): The title of the note.
    - `content` (string): The content of the note.
    - `creationDate` (string): The creation date of the note.
    - `expirationDate` (string): The expiration date of the note.
  - **Response Body (Error - 400 Bad Request):**    
    - `message` (string): Error message.
    - Endpoint: /api/notes/{id}
    - Method: PUT
    - Description: Updates a specific note by ID.
    - Request Headers:
    - Authorization: Bearer <accessToken> (required)
    - Path Parameters:
    - id (number, required): The ID of the note to update.
  - Request Body:    
    - `title` (string, required): The updated title of the note.
    - `content` (string, required): The updated content of the note.
  -  **Response Body (Success - 200 OK):**    
    - `id` (number): The ID of the updated note.
    - `version` (number): The version of the note.
    - `title` (string): The title of the note.
    - `content` (string): The content of the note.
    - `creationDate` (string): The creation date of the note.
    - `expirationDate` (string): The expiration date of the note.
  - **Response Body (Error - 400 Bad Request):**    
    - `message` (string): Error message.


- Endpoint: /api/notes/{id}
  - Method: DELETE
  - Description: Deletes a specific note by ID.
  - Request Headers:
  - Authorization: Bearer <accessToken> (required)
  - Path Parameters:
  - id (number, required): The ID of the note to delete.
  - Response Body (Success - 200 OK):    
    - `message` (string): Confirmation message.
  - **Response Body (Error - 400 Bad Request):**
    - `message` (string): Error message.


- Endpoint: /api/notes
- Method: GET
- Description: Retrieves a list of notes.
- Request Headers:
- Authorization: Bearer <accessToken> (required)
- Query Parameters:
- cursor (string, optional): The cursor for pagination.
- limit (number, optional): The number of notes to retrieve per page.
- Response Body (Success - 200 OK):    
  -   `id` (number): The ID of the note.
  - `version` (number): The version of the note.
  - `title` (string): The title of the note.
  - `content` (string): The content of the note.
  - `creationDate` (string): The creation date of the note.
  - `expirationDate` (string): The expiration date of the note.


- Endpoint: /api/notes/all
- Method: GET
- Description: Retrieves all notes.
- Request Headers:
- Authorization: Bearer <accessToken> (required)
- Query Parameters:
- cursor (string, optional): The cursor for pagination.
- limit (number, optional): The number of notes to retrieve per page.
- Response Body (Success - 200 OK):   
  - `id` (number): The ID of the note.
  - `version` (number): The version of the note.
  - `title` (string): The title of the note.
  - `content` (string): The content of the note.
  - `creationDate` (string): The creation date of the note.
  - `expirationDate` (string): The expiration date of the note.

 
- Endpoint: /api/notes/{id}/versions
  - Method: GET
  - Description: Retrieves all versions of a specific note by ID.
  - Request Headers:
  - Authorization: Bearer <accessToken> (required)
  - Path Parameters:
  - id (number, required): The ID of the note to retrieve versions.
  - Query Parameters:
  - cursor (string, optional): The cursor for pagination.
  - limit (number, optional): The number of notes to retrieve per page.
  - Response Body (Success - 200 OK):    
    - `id` (number): The ID of the note.
    - `version` (number): The version of the note.
    - `title` (string): The title of the note.
    - `content` (string): The content of the note.
    - `creationDate` (string): The creation date of the note.
    - `expirationDate` (string): The expiration date of the note.
  - **Response Body (Error - 400 Bad Request):**    
    -   `message` (string): Error message.General Notes
- Authentication: All endpoints in the NotesController require a valid JWT access token in the Authorization header.
- Error Handling: The documentation includes common error responses (400 Bad Request, 401 Unauthorized), but there might be other error codes depending on the specific situation.
- Dates: Dates are in ISO 8601 format (e.g., 2023-10-27T10:00:00Z).
- Pagination: The pagination is implemented using a cursor and a limit.