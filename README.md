
# IncidenceEditor

This project contains a simple Node.js backend for managing incidences.

## Setup

1. Install **Node.js** (version 18 or later is recommended).
2. Navigate to the `backend` folder:
   ```bash
   cd backend
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Running the server

From the `backend` directory, start the server with:

```bash
npm start
```

The server will run on port `3001` by default. You can override the port by setting the `PORT` variable in a `.env` file. To stop the server press `Ctrl+C` in the terminal where it is running.

## Frontend

A minimal frontend is provided in the `webapp` folder. After starting the backend, open `webapp/index.html` in a web browser to view the list of incidences. The page now includes filters for priority, facility, limit and offset. In addition to the **Load** button there is a **Load All** button that will automatically request all pages from the backend and display the combined results.

The backend endpoint `/incidencias` now accepts the following query parameters:

- `limit` (default `1000`)
- `offset`
- `priority`
- `facility`

These parameters can be combined to paginate and filter the results.

## Notes

The previous Windows batch files (`start-app.bat` and `stop-app.bat`) have been removed. Use the `npm` commands above to run the backend on any operating system.

### Environment variables

Copy `.env.example` to `.env` and adjust the values to match your PostgreSQL configuration. You can also set `PORT` if you want the server to listen on a different port.

